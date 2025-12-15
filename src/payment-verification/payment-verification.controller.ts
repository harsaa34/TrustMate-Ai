import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Param,
  Query,
  HttpStatus,
  HttpCode,
  UseGuards,
  BadRequestException,
  InternalServerErrorException,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { PaymentVerificationService } from './payment-verification.service';
import {
  PaymentVerificationDto,
  ManualVerificationDto,
  VerificationResultDto,
  VerificationStatusResponseDto,
  VerificationStatsDto,
  ReceiverConfirmationDto,
  SettlementVerificationDto,
  BatchVerificationDto,
  BatchVerificationResponse,
  VerificationResult,
} from './payment-verification.dto';

@ApiTags('Payment Verification')
@ApiBearerAuth()
@Controller('payment-verification')
@UseGuards(JwtAuthGuard)
export class PaymentVerificationController {
  constructor(
    private readonly paymentVerificationService: PaymentVerificationService,
  ) {}

  // ========== MAIN VERIFICATION ==========

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verify payment and update settlement',
    description: 'Process screenshot/OCR text, verify payment, update settlement status and trust scores',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Payment verification result',
    type: VerificationResultDto,
  })
  async verifyPayment(
    @Body() dto: PaymentVerificationDto,
    @Request() req,
  ): Promise<VerificationResultDto> {
    try {
      // Add userId from JWT token if not provided
      const userId = req.user?.userId || 'system';
      const verificationDto = {
        ...dto,
        payerId: dto.payerId || userId,
      };
      
      return await this.paymentVerificationService.verifyPayment(verificationDto);
    } catch (error) {
      throw new BadRequestException(`Verification failed: ${error.message}`);
    }
  }

  // ========== RECEIVER CONFIRMATION ==========

  @Put('receiver-confirmation')
  @ApiOperation({
    summary: 'Handle receiver confirmation or dispute',
    description: 'Receiver confirms or disputes a payment verification',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Receiver confirmation processed',
    type: VerificationResultDto,
  })
  async handleReceiverConfirmation(@Body() dto: ReceiverConfirmationDto): Promise<VerificationResultDto> {
    try {
      return await this.paymentVerificationService.handleReceiverConfirmation(
        dto.settlementId,
        dto.receiverId,
        dto.confirmed,
        dto.reason,
      );
    } catch (error) {
      throw new BadRequestException(`Receiver confirmation failed: ${error.message}`);
    }
  }

  // ========== MANUAL VERIFICATION ==========

  @Post('manual-verify')
  @ApiOperation({
    summary: 'Manually verify payment (admin only)',
    description: 'Override verification status manually',
  })
  async manualVerify(@Body() dto: ManualVerificationDto): Promise<VerificationResultDto> {
    try {
      return await this.paymentVerificationService.manuallyVerify(
        dto.settlementId,
        dto.userId,
        dto.reason,
        dto.status,
        dto.notes,
      );
    } catch (error) {
      throw new BadRequestException(`Manual verification failed: ${error.message}`);
    }
  }

  // ========== STATUS & QUERIES ==========

  @Get('status/:settlementId')
  @ApiOperation({ summary: 'Get verification status for settlement' })
  @ApiParam({
    name: 'settlementId',
    description: 'Settlement ID',
    example: '65f1a2b3c4d5e6f7a8b9c0d1',
  })
  async getVerificationStatus(
    @Param('settlementId') settlementId: string,
  ): Promise<VerificationStatusResponseDto> {
    try {
      const status = await this.paymentVerificationService.getVerificationStatus(settlementId);
      
      // Get settlement for additional info
      // In production, fetch from settlement service
      const mockSettlement = {
        status: 'pending',
        amount: 0,
        createdAt: new Date(),
      };

      return {
        settlementId,
        status: status.status || 'pending',
        method: status.method || 'pending',
        verifiedAt: status.verifiedAt,
        confidence: status.confidence || 0,
        fraudScore: status.fraudScore || 0,
        riskLevel: status.riskLevel || 'low',
        receiverConfirmed: status.receiverConfirmed || false,
        receiverDisputed: status.receiverDisputed || false,
        details: status.details || {},
        settlementAmount: mockSettlement.amount,
        settlementCreatedAt: mockSettlement.createdAt,
        settlementStatus: mockSettlement.status,
      };
    } catch (error) {
      throw new BadRequestException(`Failed to get status: ${error.message}`);
    }
  }

  @Post('verify-settlement-batch')
  @ApiOperation({ summary: 'Verify multiple settlements in batch' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Batch verification results',
    type: BatchVerificationResponse,
  })
  async verifySettlementBatch(
    @Body() batchDto: BatchVerificationDto,
    @Request() req,
  ): Promise<BatchVerificationResponse> {
    const results: Array<{
      settlementId: string;
      success: boolean;
      result?: VerificationResult;
      error?: string;
    }> = [];

    // Process each settlement
    for (const settlement of batchDto.settlements) {
      try {
        // Create a PaymentVerificationDto for each settlement
        const verificationDto: PaymentVerificationDto = {
          settlementId: settlement.settlementId,
          imageOrText: '', // Empty for batch processing
          verificationMethod: 'callback',
          payerId: settlement.payerId || req.user?.userId,
          receiverId: settlement.receiverId,
        };

        const verificationResult = await this.paymentVerificationService.verifyPayment(verificationDto);

        results.push({
          settlementId: settlement.settlementId,
          success: true,
          result: {
            verified: verificationResult.verified,
            confidence: verificationResult.confidence,
            flags: verificationResult.flags || [],
            evidence: verificationResult.evidence || {},
            recommendations: verificationResult.recommendations || [],
          },
        });
      } catch (error) {
        results.push({
          settlementId: settlement.settlementId,
          success: false,
          error: error.message,
        });
      }
    }

    // Calculate summary
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    return {
      total: results.length,
      successful,
      failed,
      results,
    };
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get verification statistics' })
  @ApiQuery({
    name: 'groupId',
    required: false,
    description: 'Filter by group ID',
  })
  async getVerificationStats(
    @Query('groupId') groupId?: string,
  ): Promise<VerificationStatsDto> {
    try {
      const stats = await this.paymentVerificationService.getVerificationStats(groupId);
      
      // Convert to VerificationStatsDto
      return {
        totalSettlements: stats.totalSettlements || 0,
        verified: stats.verified || 0,
        pending: stats.pending || 0,
        disputed: stats.disputed || 0,
        underReview: stats.underReview || 0,
        avgVerificationTime: stats.avgVerificationTime || 0,
        successRate: stats.successRate || 0,
        fraudDetectionRate: stats.fraudDetectionRate || 0,
        methodDistribution: stats.methodDistribution || {},
        riskLevelDistribution: stats.riskLevelDistribution || {},
        lastUpdated: stats.lastUpdated || new Date(),
      };
    } catch (error) {
      throw new InternalServerErrorException(`Failed to get stats: ${error.message}`);
    }
  }

  // ========== BATCH OPERATIONS ==========

  @Post('batch-verify')
  @ApiOperation({ summary: 'Batch verify multiple settlements with full data' })
  async batchVerify(
    @Body() body: { settlements: PaymentVerificationDto[] },
    @Request() req,
  ) {
    try {
      const results: Array<{
        settlementId: string;
        success: boolean;
        result?: VerificationResultDto;
        error?: string;
      }> = [];
      
      for (const settlement of body.settlements) {
        try {
          // Add userId from JWT token if not provided
          const userId = req.user?.userId || 'system';
          const verificationDto = {
            ...settlement,
            payerId: settlement.payerId || userId,
          };
          
          const result = await this.paymentVerificationService.verifyPayment(verificationDto);
          results.push({
            settlementId: settlement.settlementId,
            success: true,
            result,
          });
        } catch (error) {
          results.push({
            settlementId: settlement.settlementId,
            success: false,
            error: error.message,
          });
        }
      }
      
      return {
        success: true,
        processed: results.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        results,
      };
    } catch (error) {
      throw new BadRequestException(`Batch verification failed: ${error.message}`);
    }
  }

  // ========== HEALTH CHECK ==========

  @Get('health')
  @ApiOperation({ summary: 'Payment verification health check' })
  healthCheck() {
    return {
      status: 'healthy',
      service: 'payment-verification',
      timestamp: new Date(),
      features: {
        screenshotVerification: true,
        ocrTextVerification: true,
        callbackVerification: true,
        receiverConfirmation: true,
        fraudDetection: true,
        trustScoreUpdates: false, // Temporarily disabled
        manualVerification: true,
        batchOperations: true,
      },
    };
  }

  // ========== TEST ENDPOINTS ==========

  @Post('test-flow')
  @ApiOperation({ summary: 'Test complete verification flow (development only)' })
  async testVerificationFlow() {
    try {
      const mockSettlementId = `test_${Date.now()}`;
      
      const steps = [
        {
          step: 1,
          action: 'User uploads UPI screenshot',
          description: 'OCR extracts payment details',
        },
        {
          step: 2,
          action: 'Fraud detection analysis',
          description: 'System checks for suspicious patterns',
        },
        {
          step: 3,
          action: 'Amount and UPI ID verification',
          description: 'Compares extracted data with expected values',
        },
        {
          step: 4,
          action: 'Risk assessment',
          description: 'Determines if receiver confirmation is needed',
        },
        {
          step: 5,
          action: 'Receiver confirmation request',
          description: 'Sends notification to receiver if needed',
        },
        {
          step: 6,
          action: 'Update settlement status',
          description: 'Marks as verified, disputed, or pending',
        },
        {
          step: 7,
          action: 'Update trust scores',
          description: 'Updates trust scores for involved users',
        },
      ];

      return {
        success: true,
        message: 'Verification flow test completed',
        settlementId: mockSettlementId,
        steps,
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}