import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { FraudCheck, FraudStatus, RiskLevel } from './fraudcheck.schema';
import {
  CreateFraudCheckDto,
  UpdateFraudCheckDto,
  FraudCheckResponseDto,
  AnalyzeTransactionDto,
  FraudAnalysisResponseDto,
   UpiScreenshotAnalysisDto,  // Add this
  ReceiverConfirmationDto, 
} from './fraudcheck.dto';
// Add these imports
import {
  FraudCheckType,
  UpiAppType,
} from './fraudcheck.schema'; // Or from './fraudcheck.dto' depending on where they're defined

@Injectable()
export class FraudCheckService {
  constructor(
    @InjectModel(FraudCheck.name)
    private readonly fraudCheckModel: Model<FraudCheck>,
  ) {}

  async create(
    createFraudCheckDto: CreateFraudCheckDto,
    userId: string,
  ): Promise<FraudCheckResponseDto> {
    try {
      if (!Types.ObjectId.isValid(userId)) {
        throw new BadRequestException('Invalid user ID');
      }

      const fraudCheck = new this.fraudCheckModel({
        ...createFraudCheckDto,
        createdBy: new Types.ObjectId(userId),
        isActive: true,
        status: FraudStatus.PENDING,
        riskLevel: createFraudCheckDto.riskScore >= 80 ? RiskLevel.CRITICAL : 
                  createFraudCheckDto.riskScore >= 60 ? RiskLevel.HIGH :
                  createFraudCheckDto.riskScore >= 40 ? RiskLevel.MEDIUM : RiskLevel.LOW,
      });

      const savedFraudCheck = await fraudCheck.save();
      return this.mapToResponseDto(savedFraudCheck);
    } catch (error) {
      throw new BadRequestException('Failed to create fraud check');
    }
  }

  async getUserItems(
    userId: string,
    page: number,
    limit: number,
    filters?: { status?: string; riskLevel?: string },
  ): Promise<FraudCheckResponseDto[]> {
    try {
      if (!Types.ObjectId.isValid(userId)) {
        throw new BadRequestException('Invalid user ID');
      }

      const skip = (page - 1) * limit;
      const query: any = { 
        createdBy: new Types.ObjectId(userId), 
        isActive: true 
      };

      if (filters?.status) {
        query.status = filters.status;
      }
      if (filters?.riskLevel) {
        query.riskLevel = filters.riskLevel;
      }
      
      const fraudChecks = await this.fraudCheckModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec();

      return fraudChecks.map((check) => this.mapToResponseDto(check));
    } catch (error) {
      throw new BadRequestException('Failed to fetch fraud checks');
    }
  }

  async getById(
    id: string,
    userId: string,
  ): Promise<FraudCheckResponseDto> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid fraud check ID');
      }

      if (!Types.ObjectId.isValid(userId)) {
        throw new BadRequestException('Invalid user ID');
      }

      const fraudCheck = await this.fraudCheckModel
        .findOne({ _id: new Types.ObjectId(id), isActive: true })
        .exec();

      if (!fraudCheck) {
        throw new NotFoundException('Fraud check not found');
      }

      if (!fraudCheck.createdBy.equals(new Types.ObjectId(userId))) {
        throw new ForbiddenException('Access denied');
      }

      return this.mapToResponseDto(fraudCheck);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      throw new BadRequestException('Failed to fetch fraud check');
    }
  }

  async update(
    id: string,
    updateFraudCheckDto: UpdateFraudCheckDto,
    userId: string,
  ): Promise<FraudCheckResponseDto> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid fraud check ID');
      }

      if (!Types.ObjectId.isValid(userId)) {
        throw new BadRequestException('Invalid user ID');
      }

      const fraudCheck = await this.fraudCheckModel
        .findOne({ _id: new Types.ObjectId(id), isActive: true })
        .exec();

      if (!fraudCheck) {
        throw new NotFoundException('Fraud check not found');
      }

      if (!fraudCheck.createdBy.equals(new Types.ObjectId(userId))) {
        throw new ForbiddenException('Access denied');
      }

      Object.assign(fraudCheck, updateFraudCheckDto);
      
      // Update risk level based on risk score if provided
      if (updateFraudCheckDto.riskScore !== undefined) {
        fraudCheck.riskLevel = updateFraudCheckDto.riskScore >= 80 ? RiskLevel.CRITICAL : 
                              updateFraudCheckDto.riskScore >= 60 ? RiskLevel.HIGH :
                              updateFraudCheckDto.riskScore >= 40 ? RiskLevel.MEDIUM : RiskLevel.LOW;
      }

      const updatedFraudCheck = await fraudCheck.save();
      return this.mapToResponseDto(updatedFraudCheck);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      throw new BadRequestException('Failed to update fraud check');
    }
  }

  async delete(id: string, userId: string): Promise<void> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid fraud check ID');
      }

      if (!Types.ObjectId.isValid(userId)) {
        throw new BadRequestException('Invalid user ID');
      }

      const fraudCheck = await this.fraudCheckModel
        .findOne({ _id: new Types.ObjectId(id), isActive: true })
        .exec();

      if (!fraudCheck) {
        throw new NotFoundException('Fraud check not found');
      }

      if (!fraudCheck.createdBy.equals(new Types.ObjectId(userId))) {
        throw new ForbiddenException('Access denied');
      }

      fraudCheck.isActive = false;
      await fraudCheck.save();
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete fraud check');
    }
  }

  async analyzeTransaction(
    analyzeDto: AnalyzeTransactionDto,
    userId: string,
  ): Promise<FraudAnalysisResponseDto> {
    try {
      if (!Types.ObjectId.isValid(userId)) {
        throw new BadRequestException('Invalid user ID');
      }

      // Mock fraud analysis logic
      const riskScore = this.calculateRiskScore(analyzeDto);
      const riskLevel = riskScore >= 80 ? RiskLevel.CRITICAL : 
                       riskScore >= 60 ? RiskLevel.HIGH :
                       riskScore >= 40 ? RiskLevel.MEDIUM : RiskLevel.LOW;
      
      const flags = this.detectFraudFlags(analyzeDto);
      const isFraudulent = riskLevel === RiskLevel.CRITICAL || riskLevel === RiskLevel.HIGH;

      // Create fraud check record
      const fraudCheck = new this.fraudCheckModel({
        transactionId: analyzeDto.transactionId,
        amount: analyzeDto.amount,
        currency: analyzeDto.currency,
        merchantId: analyzeDto.merchantId,
        customerId: analyzeDto.customerId,
        deviceId: analyzeDto.deviceId,
        ipAddress: analyzeDto.ipAddress,
        location: analyzeDto.location,
        riskScore,
        riskLevel,
        flags,
        status: isFraudulent ? FraudStatus.FLAGGED : FraudStatus.APPROVED,
        isActive: true,
        createdBy: new Types.ObjectId(userId),
        analysisResult: {
          isFraudulent,
          confidence: 100 - riskScore,
          recommendations: isFraudulent ? ['Review manually', 'Contact customer'] : ['Approve automatically'],
        },
      });

      await fraudCheck.save();

      return {
        id: fraudCheck._id.toString(),
        transactionId: analyzeDto.transactionId,
        riskScore,
        riskLevel,
        isFraudulent,
        flags,
        confidence: 100 - riskScore,
        recommendations: isFraudulent ? ['Review manually', 'Contact customer'] : ['Approve automatically'],
        // In fraudcheck.service.ts, fix lines 258 and 494:
createdAt: fraudCheck['createdAt'] || new Date(),
      };
    } catch (error) {
      throw new BadRequestException('Failed to analyze transaction');
    }
  }

  async getStatistics(userId: string): Promise<any> {
    try {
      if (!Types.ObjectId.isValid(userId)) {
        throw new BadRequestException('Invalid user ID');
      }

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const stats = await this.fraudCheckModel.aggregate([
        {
          $match: {
            createdBy: new Types.ObjectId(userId),
            isActive: true,
            createdAt: { $gte: thirtyDaysAgo },
          },
        },
        {
          $group: {
            _id: null,
            totalChecks: { $sum: 1 },
            totalFraudulent: {
              $sum: {
                $cond: [{ $eq: ['$status', FraudStatus.FLAGGED] }, 1, 0],
              },
            },
            avgRiskScore: { $avg: '$riskScore' },
            highRiskCount: {
              $sum: {
                $cond: [{ $in: ['$riskLevel', [RiskLevel.HIGH, RiskLevel.CRITICAL]] }, 1, 0],
              },
            },
            byStatus: {
              $push: {
                status: '$status',
                count: 1,
              },
            },
            byRiskLevel: {
              $push: {
                riskLevel: '$riskLevel',
                count: 1,
              },
            },
          },
        },
        {
          $project: {
            totalChecks: 1,
            totalFraudulent: 1,
            fraudRate: {
              $multiply: [
                { $divide: ['$totalFraudulent', '$totalChecks'] },
                100,
              ],
            },
            avgRiskScore: 1,
            highRiskCount: 1,
            highRiskPercentage: {
              $multiply: [
                { $divide: ['$highRiskCount', '$totalChecks'] },
                100,
              ],
            },
            statusDistribution: {
              $arrayToObject: {
                $map: {
                  input: '$byStatus',
                  as: 'item',
                  in: {
                    k: '$$item.status',
                    v: { $sum: '$$item.count' },
                  },
                },
              },
            },
            riskLevelDistribution: {
              $arrayToObject: {
                $map: {
                  input: '$byRiskLevel',
                  as: 'item',
                  in: {
                    k: '$$item.riskLevel',
                    v: { $sum: '$$item.count' },
                  },
                },
              },
            },
          },
        },
      ]);

      return stats[0] || {
        totalChecks: 0,
        totalFraudulent: 0,
        fraudRate: 0,
        avgRiskScore: 0,
        highRiskCount: 0,
        highRiskPercentage: 0,
        statusDistribution: {},
        riskLevelDistribution: {},
      };
    } catch (error) {
      throw new BadRequestException('Failed to fetch statistics');
    }
  }

  private calculateRiskScore(analyzeDto: AnalyzeTransactionDto): number {
    // Mock risk calculation logic
    let score = 0;
    
    if (analyzeDto.amount > 10000) score += 30; // Large amount
    if (analyzeDto.currency !== 'INR') score += 20; // Foreign currency
    if (analyzeDto.location?.country !== 'IN') score += 25; // Foreign transaction
    if (analyzeDto.deviceId?.includes('emulator')) score += 40; // Emulator detected
    
    // Time-based scoring (late night transactions)
    const hour = new Date().getHours();
    if (hour >= 0 && hour <= 5) score += 15;
    
    return Math.min(100, score);
  }

  private detectFraudFlags(analyzeDto: AnalyzeTransactionDto): string[] {
    const flags: string[] = [];
    
    if (analyzeDto.amount > 10000) flags.push('LARGE_AMOUNT');
    if (analyzeDto.currency !== 'INR') flags.push('FOREIGN_CURRENCY');
    if (analyzeDto.location?.country !== 'IN') flags.push('FOREIGN_LOCATION');
    if (analyzeDto.deviceId?.includes('emulator')) flags.push('EMULATOR_DETECTED');
    
    // Check for velocity (multiple transactions in short time)
    const hour = new Date().getHours();
    if (hour >= 0 && hour <= 5) flags.push('UNUSUAL_TIME');
    
    return flags;
  }
// ========== NEW METHODS FOR UPI VERIFICATION ==========

/**
 * Analyze UPI screenshot for fraud
 */
async analyzeUpiScreenshot(
  dto: UpiScreenshotAnalysisDto,
  userId: string,
): Promise<FraudAnalysisResponseDto> {
  try {
    // Calculate UPI-specific risk score
    const riskScore = this.calculateUpiRiskScore(dto);
    const riskLevel = this.getRiskLevel(riskScore);
    const flags = this.detectUpiFraudFlags(dto);
    
    const isFraudulent = riskLevel === RiskLevel.CRITICAL || 
                        riskLevel === RiskLevel.HIGH ||
                        !dto.screenshotText.includes('success');

    // Create enhanced fraud check
    const fraudCheck = new this.fraudCheckModel({
      checkType: FraudCheckType.UPI_SCREENSHOT,
      transactionId: dto.extractedTransactionId || `UPI_${Date.now()}`,
      amount: dto.extractedAmount,
      currency: 'INR',
      merchantId: 'UPI_PAYMENT',
      customerId: dto.payerId,
      riskScore,
      riskLevel,
      flags,
      status: isFraudulent ? FraudStatus.FLAGGED : FraudStatus.PENDING,
      
      // UPI data
      upiData: {
        screenshotText: dto.screenshotText,
        extractedAmount: dto.extractedAmount,
        extractedUpiId: dto.extractedUpiId,
        extractedTransactionId: dto.extractedTransactionId,
        expectedAmount: dto.expectedAmount,
        expectedUpiId: dto.expectedUpiId,
        amountMatch: Math.abs(dto.extractedAmount - dto.expectedAmount) <= 0.01,
        upiIdMatch: dto.extractedUpiId.toLowerCase() === dto.expectedUpiId.toLowerCase(),
        upiApp: this.detectUpiApp(dto.screenshotText),
      },
      
      // Settlement data
      settlementId: dto.settlementId ? new Types.ObjectId(dto.settlementId) : undefined,
      groupId: dto.groupId ? new Types.ObjectId(dto.groupId) : undefined,
      payerId: new Types.ObjectId(dto.payerId),
      receiverId: new Types.ObjectId(dto.receiverId),
      
      // OCR data
      ocrProcessing: {
        rawText: dto.screenshotText,
        confidence: 85, // Mock - would come from OCR service
        processingTime: 1200, // Mock
        containsUpiPatterns: this.containsUpiPatterns(dto.screenshotText),
      },
      
      // System fields
      isActive: true,
      createdBy: new Types.ObjectId(userId),
      
      // Analysis result
      analysisResult: {
        isFraudulent,
        confidence: 100 - riskScore,
        requiresReceiverConfirmation: riskScore < 60, // Medium risk and below need confirmation
        recommendations: this.getUpiRecommendations(riskLevel, dto),
        canAutoVerify: riskScore < 30 && 
                      Math.abs(dto.extractedAmount - dto.expectedAmount) <= 0.01 &&
                      dto.extractedUpiId.toLowerCase() === dto.expectedUpiId.toLowerCase(),
      },
    });

    await fraudCheck.save();

    // If low risk and matches expected, auto-set receiver confirmation pending
if (riskScore < 30 && fraudCheck.upiData?.amountMatch && fraudCheck.upiData?.upiIdMatch) {
      fraudCheck.status = FraudStatus.PENDING;
      await this.requestReceiverConfirmation(fraudCheck._id.toString());
    }

    return {
      id: fraudCheck._id.toString(),
      transactionId: fraudCheck.transactionId,
      riskScore,
      riskLevel: riskLevel as any,
      isFraudulent,
      flags,
      confidence: 100 - riskScore,
      recommendations: this.getUpiRecommendations(riskLevel, dto),
      createdAt: fraudCheck['createdAt'] || new Date(),
      requiresReceiverConfirmation: riskScore < 60,
      canAutoVerify: riskScore < 30,
    };
  } catch (error) {
    throw new BadRequestException('Failed to analyze UPI screenshot');
  }
}

/**
 * Request receiver confirmation
 */
async requestReceiverConfirmation(fraudCheckId: string): Promise<void> {
  const fraudCheck = await this.fraudCheckModel.findById(fraudCheckId);
  if (!fraudCheck) {
    throw new NotFoundException('Fraud check not found');
  }

  // In production, send notification to receiver
  // For now, just update status
  fraudCheck.status = FraudStatus.PENDING;
  fraudCheck.auditTrail.push({
    action: 'RECEIVER_CONFIRMATION_REQUESTED',
    performedBy: 'SYSTEM',
    timestamp: new Date(),
    notes: 'Receiver confirmation requested',
  });

  await fraudCheck.save();
}

/**
 * Handle receiver confirmation
 */
async handleReceiverConfirmation(
  dto: ReceiverConfirmationDto,
  userId: string,
): Promise<FraudCheckResponseDto> {
  const fraudCheck = await this.fraudCheckModel.findOne({
    _id: new Types.ObjectId(dto.fraudCheckId),
    receiverId: new Types.ObjectId(userId),
    isActive: true,
  });

  if (!fraudCheck) {
    throw new NotFoundException('Fraud check not found or access denied');
  }

  if (dto.status === 'CONFIRMED') {
    fraudCheck.receiverConfirmed = true;
    fraudCheck.receiverConfirmedAt = new Date();
    fraudCheck.receiverConfirmationMethod = 'manual';
    
    // If low risk and receiver confirms, auto-verify
    if (fraudCheck.riskScore < 40 && 
        fraudCheck.upiData?.amountMatch && 
        fraudCheck.upiData?.upiIdMatch) {
      fraudCheck.status = FraudStatus.AUTO_VERIFIED;
      fraudCheck.trustScoreImpact = 10; // Positive impact for honest payment
    }
  } else {
    fraudCheck.receiverDisputed = true;
    fraudCheck.receiverDisputedAt = new Date();
    fraudCheck.receiverDisputeReason = dto.reason;
    fraudCheck.status = FraudStatus.DISPUTED;
    fraudCheck.trustScoreImpact = -30; // Negative impact for disputed payment
  }

  fraudCheck.auditTrail.push({
    action: `RECEIVER_${dto.status}`,
    performedBy: new Types.ObjectId(userId),
    timestamp: new Date(),
    notes: dto.reason || 'Receiver responded',
  });

  const updated = await fraudCheck.save();
  return this.mapToResponseDto(updated);
}

// ========== HELPER METHODS ==========

private calculateUpiRiskScore(dto: UpiScreenshotAnalysisDto): number {
  let score = 0;

  // 1. Amount mismatch (most important)
  const amountDiff = Math.abs(dto.extractedAmount - dto.expectedAmount);
  const amountPercentDiff = (amountDiff / dto.expectedAmount) * 100;
  
  if (amountPercentDiff > 10) score += 50; // Critical
  else if (amountPercentDiff > 5) score += 30;
  else if (amountPercentDiff > 1) score += 15;
  else if (amountPercentDiff > 0.1) score += 5;

  // 2. UPI ID mismatch (critical)
  if (dto.extractedUpiId.toLowerCase() !== dto.expectedUpiId.toLowerCase()) {
    score += 60; // Wrong recipient = high fraud risk
  }

  // 3. Missing success indicators
  const successIndicators = ['success', 'completed', 'paid', 'credited'];
  const hasSuccess = successIndicators.some(indicator => 
    dto.screenshotText.toLowerCase().includes(indicator)
  );
  if (!hasSuccess) score += 20;

  // 4. Suspicious transaction ID
  if (this.isSuspiciousTransactionId(dto.screenshotText)) {
    score += 25;
  }

  // 5. Missing UPI patterns
  if (!this.containsUpiPatterns(dto.screenshotText)) {
    score += 20;
  }

  // 6. Unusual time (late night)
  const hour = new Date().getHours();
  if (hour >= 0 && hour <= 5) score += 10;

  return Math.min(100, score);
}

private detectUpiFraudFlags(dto: UpiScreenshotAnalysisDto): string[] {
  const flags: string[] = [];

  const amountDiff = Math.abs(dto.extractedAmount - dto.expectedAmount);
  const amountPercentDiff = (amountDiff / dto.expectedAmount) * 100;

  if (amountPercentDiff > 10) flags.push('SIGNIFICANT_AMOUNT_MISMATCH');
  else if (amountPercentDiff > 5) flags.push('AMOUNT_MISMATCH');
  else if (amountPercentDiff > 1) flags.push('MINOR_AMOUNT_MISMATCH');

  if (dto.extractedUpiId.toLowerCase() !== dto.expectedUpiId.toLowerCase()) {
    flags.push('UPI_ID_MISMATCH');
  }

  if (this.isSuspiciousTransactionId(dto.screenshotText)) {
    flags.push('SUSPICIOUS_TRANSACTION_ID');
  }

  if (!this.containsUpiPatterns(dto.screenshotText)) {
    flags.push('MISSING_UPI_PATTERNS');
  }

  const successIndicators = ['success', 'completed', 'paid', 'credited'];
  const hasSuccess = successIndicators.some(indicator => 
    dto.screenshotText.toLowerCase().includes(indicator)
  );
  if (!hasSuccess) flags.push('MISSING_SUCCESS_INDICATOR');

  return flags;
}

private containsUpiPatterns(text: string): boolean {
  const upiPatterns = [
    /payment/i,
    /amount.*₹?\s*\d+/i,
    /to:?\s*[\w.@]+/i,
    /(?:ref|id|transaction|txn)/i,
    /\d{1,2}[\/\-]\d{1,2}/,
    /(?:upi|bank)/i,
  ];

  const matches = upiPatterns.filter(pattern => pattern.test(text.toLowerCase()));
  return matches.length >= 4; // Need at least 4 patterns to be valid
}

private isSuspiciousTransactionId(text: string): boolean {
  const txnIdMatch = text.match(/(?:ref|id|transaction|txn)[\s#:]*([A-Z0-9]{6,})/i);
  if (!txnIdMatch) return false;

  const txnId = txnIdMatch[1];
  const suspiciousPatterns = [
    /^TEST/i,
    /^SAMPLE/i,
    /^FAKE/i,
    /^DEMO/i,
    /^[0-9]{6}$/,
    /^[A-Z]{6}$/,
    /123456/,
    /abcdef/i,
  ];

  return suspiciousPatterns.some(pattern => pattern.test(txnId));
}

private detectUpiApp(text: string): UpiAppType {
  const appPatterns = {
    [UpiAppType.GOOGLE_PAY]: /google\s*pay/i,
    [UpiAppType.PHONE_PE]: /phone\s*pe/i,
    [UpiAppType.PAYTM]: /paytm/i,
    [UpiAppType.BHIM]: /bhim/i,
    [UpiAppType.AMAZON_PAY]: /amazon\s*pay/i,
    [UpiAppType.WHATSAPP_PAY]: /whatsapp\s*pay/i,
  };

  for (const [app, pattern] of Object.entries(appPatterns)) {
    if (pattern.test(text)) {
      return app as UpiAppType;
    }
  }

  return UpiAppType.OTHER;
}

private getUpiRecommendations(riskLevel: RiskLevel, dto: UpiScreenshotAnalysisDto): string[] {
  switch (riskLevel) {
    case RiskLevel.CRITICAL:
      return [
        'REJECT_TRANSACTION',
        'REQUIRE_BANK_STATEMENT',
        'MANUAL_REVIEW_REQUIRED',
        'FLAG_USER_FOR_REVIEW',
      ];
    case RiskLevel.HIGH:
      return [
        'MANUAL_REVIEW_REQUIRED',
        'REQUEST_ADDITIONAL_PROOF',
        'NOTIFY_ADMIN',
        'DELAY_SETTLEMENT',
      ];
    case RiskLevel.MEDIUM:
      return [
        'REQUIRE_RECEIVER_CONFIRMATION',
        'FLAG_FOR_REVIEW',
        'REQUEST_SMS_CONFIRMATION',
      ];
    case RiskLevel.LOW:
      if (Math.abs(dto.extractedAmount - dto.expectedAmount) <= 0.01 &&
          dto.extractedUpiId.toLowerCase() === dto.expectedUpiId.toLowerCase()) {
        return ['AUTO_VERIFY_WITH_RECEIVER_CONFIRMATION'];
      }
      return ['REQUIRE_RECEIVER_CONFIRMATION'];
    default:
      return ['PROCEED_WITH_CAUTION'];
  }
}
  async findSuspiciousUpiTransactions(days: number = 7): Promise<any[]> {
    try {
      const date = new Date();
      date.setDate(date.getDate() - days);

      const suspiciousChecks = await this.fraudCheckModel.find({
        checkType: 'UPI_SCREENSHOT',
        createdAt: { $gte: date },
        $or: [
          { riskScore: { $gte: 60 } },
          { receiverDisputed: true },
          { 'upiData.amountMatch': false },
          { 'upiData.upiIdMatch': false },
          { flags: { $size: { $gt: 2 } } },
        ],
      }).sort({ riskScore: -1 }).exec();

      return suspiciousChecks;
    } catch (error) {
      throw new BadRequestException('Failed to fetch suspicious UPI transactions');
    }
  }
private getRiskLevel(riskScore: number): RiskLevel {
  if (riskScore >= 80) return RiskLevel.CRITICAL;
  if (riskScore >= 60) return RiskLevel.HIGH;
  if (riskScore >= 40) return RiskLevel.MEDIUM;
  return RiskLevel.LOW;
}
  private mapToResponseDto(fraudCheck: any): FraudCheckResponseDto {
    return {
      id: fraudCheck._id ? fraudCheck._id.toString() : fraudCheck.id,
      transactionId: fraudCheck.transactionId,
      amount: fraudCheck.amount,
      currency: fraudCheck.currency,
      merchantId: fraudCheck.merchantId,
      customerId: fraudCheck.customerId,
      deviceId: fraudCheck.deviceId,
      ipAddress: fraudCheck.ipAddress,
      location: fraudCheck.location,
      riskScore: fraudCheck.riskScore,
      riskLevel: fraudCheck.riskLevel,
      flags: fraudCheck.flags || [],
      status: fraudCheck.status,
      analysisResult: fraudCheck.analysisResult,
      isActive: fraudCheck.isActive,
      createdBy: fraudCheck.createdBy.toString(),
      createdAt: fraudCheck.createdAt,
      updatedAt: fraudCheck.updatedAt,
    };
  }
}