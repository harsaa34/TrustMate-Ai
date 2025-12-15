import { Injectable, Logger, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Settlement,
  SettlementDocument,
} from '../settlement/settlement.schema';
import { OcrService } from '../ocr/ocr.service';
import { FraudCheckService } from '../fraudcheck/fraudcheck.service';


// Import DTOs
import {
  PaymentVerificationDto,
  VerificationResultDto,
  VerificationResult,
} from './payment-verification.dto';

export enum VerificationStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  FAILED = 'failed',
  DISPUTED = 'disputed',
  SUSPICIOUS = 'suspicious',
  PENDING_RECEIVER_CONFIRMATION = 'pending_receiver_confirmation',
}

export enum VerificationMethod {
  MANUAL = 'manual',
  OCR = 'ocr',
  CALLBACK = 'callback',
  AUTO = 'auto',
  RECEIVER_CONFIRMED = 'receiver_confirmed',
}

@Injectable()
export class PaymentVerificationService {
  private readonly logger = new Logger(PaymentVerificationService.name);

  constructor(
    @InjectModel(Settlement.name) private settlementModel: Model<SettlementDocument>,
    @Inject(OcrService) private ocrService: OcrService,
    @Inject(FraudCheckService) private fraudCheckService: FraudCheckService,
  ) {}

  /**
   * Main verification endpoint - Updated to match DTO
   */
  async verifyPayment(
    dto: PaymentVerificationDto,
  ): Promise<VerificationResultDto> {
    try {
      this.logger.log(`Starting payment verification for settlement: ${dto.settlementId}`);

      // 1. Get settlement
      const settlement = await this.settlementModel.findById(dto.settlementId);
      if (!settlement) {
        throw new Error(`Settlement not found: ${dto.settlementId}`);
      }

      // 2. Perform verification based on input type
      let verification: VerificationResultDto;
      
      if (dto.imageOrText.includes('base64,')) {
        verification = await this.verifyWithScreenshot(dto, settlement);
      } else {
        verification = await this.verifyWithOcrText(dto, settlement);
      }

      // 3. Run fraud check
      const fraudAnalysis = await this.performFraudCheck(settlement, verification, dto.payerId || 'system');

      // 4. Update verification based on fraud check
      if (fraudAnalysis.isSuspicious) {
        verification.fraudScore = fraudAnalysis.fraudScore;
        verification.riskLevel = fraudAnalysis.riskLevel;
      }

      // 5. Determine if receiver confirmation is needed
      const needsReceiverConfirmation = this.needsReceiverConfirmation(verification);
      verification.receiverConfirmationRequired = needsReceiverConfirmation;
      verification.requiresManualReview = fraudAnalysis.isSuspicious || !verification.verified;

      // 6. Calculate next steps
      verification.nextSteps = this.calculateNextSteps(verification);

      // 7. Update settlement
      await this.updateSettlementVerification(settlement, verification);

      this.logger.log(
        `Payment verification completed for settlement ${dto.settlementId}: ${verification.verified ? 'VERIFIED' : 'FAILED'}`,
      );

      return verification;
    } catch (error) {
      this.logger.error(`Payment verification failed: ${error.message}`, error.stack);
      
      // Return failed verification DTO
      return {
        settlementId: dto.settlementId,
        method: dto.verificationMethod,
        timestamp: new Date(),
        verified: false,
        confidence: 0,
        flags: [`Verification failed: ${error.message}`],
        evidence: {},
        recommendations: ['Please try again or contact support'],
        fraudScore: 100,
        riskLevel: 'critical',
        requiresManualReview: true,
        receiverConfirmationRequired: false,
        trustScoreImpact: -20,
        nextSteps: ['retry_verification', 'contact_support'],
      };
    }
  }

  /**
   * Verify with screenshot image
   */
  private async verifyWithScreenshot(
    dto: PaymentVerificationDto,
    settlement: SettlementDocument,
  ): Promise<VerificationResultDto> {
    try {
      // Process OCR on screenshot
      const base64Data = dto.imageOrText.includes('base64,')
        ? dto.imageOrText.split('base64,')[1]
        : dto.imageOrText;

      const imageBuffer = Buffer.from(base64Data, 'base64');

      const ocrResult = await this.ocrService.processUpiScreenshot(
        imageBuffer,
        {
          amount: dto.expectedAmount,
          upiId: dto.expectedUpiId,
        },
        dto.payerId,
      );

      // Create verification result DTO
      const verificationResult: VerificationResultDto = {
        settlementId: dto.settlementId,
        method: VerificationMethod.OCR,
        timestamp: new Date(),
        verified: ocrResult.status === 'success' && !ocrResult.isSuspicious,
        confidence: ocrResult.confidence,
        flags: ocrResult.fraudIndicators,
        evidence: {
          amount: ocrResult.amount,
          upiId: ocrResult.upiId,
          transactionId: ocrResult.transactionId,
          bank: ocrResult.bank,
          status: ocrResult.status,
          rawText: ocrResult.rawText,
        },
        recommendations: this.getRecommendationsFromRiskLevel(ocrResult.riskLevel),
        fraudScore: ocrResult.fraudScore,
        riskLevel: ocrResult.riskLevel,
        requiresManualReview: ocrResult.isSuspicious || ocrResult.riskLevel === 'high' || ocrResult.riskLevel === 'critical',
        receiverConfirmationRequired: ocrResult.riskLevel === 'medium' || !ocrResult.isSuspicious,
        trustScoreImpact: this.calculateTrustScoreImpact(ocrResult),
        nextSteps: [],
      };

      return verificationResult;
    } catch (error) {
      this.logger.error(`Screenshot verification failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Verify with pre-extracted OCR text
   */
  private async verifyWithOcrText(
    dto: PaymentVerificationDto,
    settlement: SettlementDocument,
  ): Promise<VerificationResultDto> {
    try {
      // Create a mock OCR result from text
      const mockOcrResult = {
        amount: dto.expectedAmount || 0,
        upiId: dto.expectedUpiId || '',
        status: 'success' as const,
        rawText: dto.imageOrText,
        confidence: 85,
        fraudScore: 20,
        fraudIndicators: [] as string[],
        isSuspicious: false,
        riskLevel: 'low' as const,
      };

      // Check for basic patterns in text
      const text = dto.imageOrText.toLowerCase();
      const hasAmount = text.includes('₹') || text.includes('rs') || /\d+\.?\d*/.test(text);
      const hasUpiId = /[\w.]+@[\w.]+/.test(text);
      const hasSuccess = text.includes('success') || text.includes('paid') || text.includes('completed');

      const verificationResult: VerificationResultDto = {
        settlementId: dto.settlementId,
        method: VerificationMethod.OCR,
        timestamp: new Date(),
        verified: hasAmount && hasUpiId && hasSuccess,
        confidence: hasAmount && hasUpiId && hasSuccess ? 75 : 40,
        flags: [],
        evidence: {
          text: dto.imageOrText,
          hasAmount,
          hasUpiId,
          hasSuccess,
        },
        recommendations: hasAmount && hasUpiId && hasSuccess 
          ? ['Payment appears valid'] 
          : ['Missing payment details in text'],
        fraudScore: 30,
        riskLevel: 'medium',
        requiresManualReview: !hasAmount || !hasUpiId || !hasSuccess,
        receiverConfirmationRequired: true,
        trustScoreImpact: hasAmount && hasUpiId && hasSuccess ? 10 : -10,
        nextSteps: [],
      };

      return verificationResult;
    } catch (error) {
      this.logger.error(`OCR text verification failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Perform fraud detection check
   */
  private async performFraudCheck(
    settlement: SettlementDocument,
    verification: VerificationResultDto,
    userId: string,
  ): Promise<{
    isSuspicious: boolean;
    fraudScore: number;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    reasons: string[];
  }> {
    try {
      // Use FraudCheckService to analyze
      const screenshotText = (verification.evidence as any)?.rawText || 
                           (verification.evidence as any)?.text || 
                           '';

      const fraudAnalysis = await this.fraudCheckService.analyzeUpiScreenshot({
        screenshotText,
        extractedAmount: (verification.evidence as any)?.amount || 0,
        extractedUpiId: (verification.evidence as any)?.upiId || '',
        expectedAmount: settlement.amount,
        expectedUpiId: (settlement as any).receiverUpiId || '',
        payerId: (settlement as any).fromUser?.toString() || userId,
        receiverId: (settlement as any).toUser?.toString(),
        settlementId: settlement._id.toString(),
      }, userId);

      return {
        isSuspicious: fraudAnalysis.isFraudulent,
        fraudScore: fraudAnalysis.riskScore,
        riskLevel: fraudAnalysis.riskLevel.toLowerCase() as any,
        reasons: fraudAnalysis.flags || [],
      };
    } catch (error) {
      this.logger.warn(`Fraud check failed: ${error.message}`);
      return {
        isSuspicious: false,
        fraudScore: 0,
        riskLevel: 'low',
        reasons: [],
      };
    }
  }

  /**
   * Determine if receiver confirmation is needed
   */
  private needsReceiverConfirmation(
    verification: VerificationResultDto,
  ): boolean {
    return (
      verification.receiverConfirmationRequired ||
      (verification.fraudScore || 0) >= 30 ||
      verification.riskLevel === 'medium' ||
      !verification.verified
    );
  }

  /**
   * Handle receiver confirmation response
   */
  async handleReceiverConfirmation(
    settlementId: string,
    receiverId: string,
    confirmed: boolean,
    reason?: string,
  ): Promise<VerificationResultDto> {
    try {
      const settlement = await this.settlementModel.findById(settlementId);
      if (!settlement) {
        throw new Error(`Settlement not found: ${settlementId}`);
      }

      // Verify receiver
      if ((settlement as any).toUser?.toString() !== receiverId) {
        throw new Error('Receiver mismatch');
      }

      if (confirmed) {
        // Receiver confirmed - mark as verified
        const verification: VerificationResultDto = {
          settlementId,
          method: VerificationMethod.RECEIVER_CONFIRMED,
          timestamp: new Date(),
          verified: true,
          confidence: 100,
          flags: [],
          evidence: { receiverConfirmed: true, reason },
          recommendations: ['Payment confirmed by receiver'],
          fraudScore: 0,
          riskLevel: 'low',
          requiresManualReview: false,
          receiverConfirmationRequired: false,
          trustScoreImpact: 15,
          nextSteps: ['update_settlement_completed'],
        };

        await this.updateSettlementVerification(settlement, verification);

        this.logger.log(`Receiver confirmed settlement ${settlementId}`);
        return verification;
      } else {
        // Receiver disputed - mark as disputed
        const verification: VerificationResultDto = {
          settlementId,
          method: VerificationMethod.RECEIVER_CONFIRMED,
          timestamp: new Date(),
          verified: false,
          confidence: 100,
          flags: ['RECEIVER_DISPUTED'],
          evidence: { receiverDisputed: true, reason },
          recommendations: ['Investigate disputed payment'],
          fraudScore: 70,
          riskLevel: 'high',
          requiresManualReview: true,
          receiverConfirmationRequired: false,
          trustScoreImpact: -30,
          nextSteps: ['investigate_dispute', 'contact_admin'],
        };

        await this.updateSettlementVerification(settlement, verification);

        this.logger.log(`Receiver disputed settlement ${settlementId}: ${reason}`);
        return verification;
      }
    } catch (error) {
      this.logger.error(`Receiver confirmation handling failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Manually verify payment
   */
  async manuallyVerify(
    settlementId: string,
    userId: string,
    reason: string,
    status: 'verified' | 'rejected' | 'disputed',
    notes?: string,
  ): Promise<VerificationResultDto> {
    const settlement = await this.settlementModel.findById(settlementId);
    
    if (!settlement) {
      throw new Error(`Settlement not found: ${settlementId}`);
    }

    const isVerified = status === 'verified';
    
    const verification: VerificationResultDto = {
      settlementId,
      method: VerificationMethod.MANUAL,
      timestamp: new Date(),
      verified: isVerified,
      confidence: isVerified ? 100 : 0,
      flags: status === 'disputed' ? ['MANUALLY_DISPUTED'] : [],
      evidence: {
        manualVerification: true,
        verifiedBy: userId,
        reason,
        notes,
        status,
      },
      recommendations: isVerified 
        ? ['Payment manually verified'] 
        : ['Payment manually rejected'],
      fraudScore: isVerified ? 0 : 50,
      riskLevel: isVerified ? 'low' : 'high',
      requiresManualReview: false,
      receiverConfirmationRequired: false,
      trustScoreImpact: isVerified ? 5 : -20,
      nextSteps: isVerified 
        ? ['update_settlement_completed'] 
        : ['investigate_manual_rejection'],
    };

    await this.updateSettlementVerification(settlement, verification);

    this.logger.log(`Settlement ${settlementId} manually ${status} by ${userId}: ${reason}`);

    return verification;
  }

  /**
   * Update settlement with verification result
   */
  private async updateSettlementVerification(
    settlement: SettlementDocument,
    verification: VerificationResultDto,
  ): Promise<void> {
    // Update settlement fields
    (settlement as any).verificationStatus = verification.verified ? 'verified' : 'failed';
    (settlement as any).verificationProof = {
      ...verification.evidence,
      verifiedAt: verification.timestamp,
      verifiedBy: verification.method,
      confidence: verification.confidence,
      fraudScore: verification.fraudScore,
      riskLevel: verification.riskLevel,
    };

    // Update settlement status
    if (verification.verified) {
      settlement.status = 'completed' as any;
    } else if (verification.flags?.includes('RECEIVER_DISPUTED') || 
               verification.flags?.includes('MANUALLY_DISPUTED')) {
      settlement.status = 'disputed' as any;
    }

    await settlement.save();
    this.logger.debug(`Updated settlement ${settlement._id} verification`);
  }

  /**
   * Calculate trust score impact
   */
  private calculateTrustScoreImpact(ocrResult: any): number {
    let impact = 0;

    if (ocrResult.status === 'success' && !ocrResult.isSuspicious) {
      impact += 10;
      if (ocrResult.confidence >= 90) impact += 5;
      if (ocrResult.riskLevel === 'low') impact += 5;
    } else if (ocrResult.isSuspicious) {
      impact -= 20;
    }

    return impact;
  }

  /**
   * Get recommendations from risk level
   */
  private getRecommendationsFromRiskLevel(riskLevel: string): string[] {
    switch (riskLevel) {
      case 'critical':
        return ['REJECT_TRANSACTION', 'REQUIRE_BANK_STATEMENT', 'MANUAL_REVIEW_REQUIRED'];
      case 'high':
        return ['MANUAL_REVIEW_REQUIRED', 'REQUEST_ADDITIONAL_PROOF', 'NOTIFY_ADMIN'];
      case 'medium':
        return ['REQUIRE_RECEIVER_CONFIRMATION', 'FLAG_FOR_REVIEW'];
      case 'low':
        return ['AUTO_VERIFY_WITH_RECEIVER_CONFIRMATION'];
      default:
        return ['PROCEED_WITH_CAUTION'];
    }
  }

  /**
   * Calculate next steps
   */
  private calculateNextSteps(verification: VerificationResultDto): string[] {
    const steps: string[] = [];

    if (verification.requiresManualReview) {
      steps.push('manual_review_required');
    }

    if (verification.receiverConfirmationRequired) {
      steps.push('receiver_confirmation_request');
    }

    if (verification.verified) {
      steps.push('update_settlement_completed');
      steps.push('notify_users');
    } else {
      steps.push('investigate_failure');
    }

    return steps;
  }

  /**
   * Get verification status
   */
  async getVerificationStatus(settlementId: string): Promise<any> {
    const settlement = await this.settlementModel.findById(settlementId);
    
    if (!settlement) {
      throw new Error(`Settlement not found: ${settlementId}`);
    }

    const verificationProof = (settlement as any).verificationProof;

    return {
      status: (settlement as any).verificationStatus || 'pending',
      method: verificationProof?.verifiedBy,
      verifiedAt: verificationProof?.verifiedAt,
      confidence: verificationProof?.confidence,
      fraudScore: verificationProof?.fraudScore,
      riskLevel: verificationProof?.riskLevel,
      receiverConfirmed: verificationProof?.receiverConfirmed,
      receiverDisputed: verificationProof?.receiverDisputed,
      details: verificationProof,
    };
  }

  /**
   * Get verification statistics
   */
  async getVerificationStats(groupId?: string): Promise<any> {
    const filter = groupId ? { groupId: new Types.ObjectId(groupId) } : {};
    
    const settlements = await this.settlementModel.find(filter);
    
    const stats = {
      totalSettlements: settlements.length,
      verified: 0,
      pending: 0,
      failed: 0,
      disputed: 0,
      underReview: 0,
      totalVerificationTime: 0,
      totalConfidence: 0,
    };

    const methodDistribution: Record<string, number> = {};
    const riskLevelDistribution: Record<string, number> = {};

    for (const settlement of settlements) {
      const verificationStatus = (settlement as any).verificationStatus;
      const verificationProof = (settlement as any).verificationProof;
      
      // Count by status
      switch (verificationStatus) {
        case 'verified':
          stats.verified++;
          break;
        case 'pending':
          stats.pending++;
          stats.underReview++;
          break;
        case 'failed':
          stats.failed++;
          break;
        case 'disputed':
          stats.disputed++;
          break;
        default:
          stats.pending++;
          if (verificationProof) stats.underReview++;
      }

      // Count by method
      const method = verificationProof?.verifiedBy;
      if (method) {
        methodDistribution[method] = (methodDistribution[method] || 0) + 1;
      }

      // Count by risk level
      const riskLevel = verificationProof?.riskLevel;
      if (riskLevel) {
        riskLevelDistribution[riskLevel] = (riskLevelDistribution[riskLevel] || 0) + 1;
      }

      // Calculate verification time
      const verifiedAt = verificationProof?.verifiedAt;
      if (verifiedAt && settlement.createdAt) {
        const verificationTime = verifiedAt.getTime() - settlement.createdAt.getTime();
        stats.totalVerificationTime += verificationTime;
      }

      // Sum confidence
      if (verificationProof?.confidence) {
        stats.totalConfidence += verificationProof.confidence;
      }
    }

    return {
      totalSettlements: stats.totalSettlements,
      verified: stats.verified,
      pending: stats.pending,
      disputed: stats.disputed,
      underReview: stats.underReview,
      avgVerificationTime: stats.verified > 0 
        ? stats.totalVerificationTime / stats.verified 
        : 0,
      successRate: stats.totalSettlements > 0 
        ? (stats.verified / stats.totalSettlements) * 100 
        : 0,
      fraudDetectionRate: stats.totalSettlements > 0 
        ? ((stats.disputed + stats.failed) / stats.totalSettlements) * 100 
        : 0,
      avgConfidence: stats.verified > 0 
        ? stats.totalConfidence / stats.verified 
        : 0,
      methodDistribution,
      riskLevelDistribution,
      lastUpdated: new Date(),
    };
  }
}