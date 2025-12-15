import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsArray,
  IsObject,
  IsEnum,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

// ========== MAIN DTOs ==========

export class PaymentVerificationDto {
  @ApiProperty({
    description: 'Settlement ID',
    example: '65f1a2b3c4d5e6f7a8b9c0d1',
  })
  @IsString()
  @IsNotEmpty()
  settlementId: string;

  @ApiProperty({
    description: 'Base64 encoded image or screenshot text',
    example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
  })
  @IsString()
  @IsNotEmpty()
  imageOrText: string;

  @ApiProperty({
    description: 'Verification method',
    enum: ['screenshot', 'ocr_text', 'callback', 'manual'],
    example: 'screenshot',
  })
  @IsString()
  verificationMethod: string;

  @ApiPropertyOptional({
    description: 'User ID of the payer',
    example: '65f1a2b3c4d5e6f7a8b9c0d2',
  })
  @IsOptional()
  @IsString()
  payerId?: string;

  @ApiPropertyOptional({
    description: 'User ID of the receiver',
    example: '65f1a2b3c4d5e6f7a8b9c0d3',
  })
  @IsOptional()
  @IsString()
  receiverId?: string;

  @ApiPropertyOptional({
    description: 'Expected payment amount',
    example: 500.0,
  })
  @IsOptional()
  @IsNumber()
  expectedAmount?: number;

  @ApiPropertyOptional({
    description: 'Expected UPI ID',
    example: 'user@okaxis',
  })
  @IsOptional()
  @IsString()
  expectedUpiId?: string;

  @ApiPropertyOptional({
    description: 'Additional metadata',
    type: Object,
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class ManualVerificationDto {
  @ApiProperty({
    description: 'Settlement ID',
    example: '65f1a2b3c4d5e6f7a8b9c0d1',
  })
  @IsString()
  @IsNotEmpty()
  settlementId: string;

  @ApiProperty({
    description: 'User ID performing the manual verification',
    example: '65f1a2b3c4d5e6f7a8b9c0d2',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'Reason for manual verification',
    example: 'OCR extraction failed, manual review required',
  })
  @IsString()
  @IsNotEmpty()
  reason: string;

  @ApiProperty({
    description: 'Manual verification result',
    enum: ['verified', 'rejected', 'disputed'],
    example: 'verified',
  })
  @IsString()
  @IsNotEmpty()
  status: 'verified' | 'rejected' | 'disputed';

  @ApiPropertyOptional({
    description: 'Additional notes',
    example: 'Payment confirmed via bank statement',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class ReceiverConfirmationDto {
  @ApiProperty({
    description: 'Settlement ID',
    example: '65f1a2b3c4d5e6f7a8b9c0d1',
  })
  @IsString()
  @IsNotEmpty()
  settlementId: string;

  @ApiProperty({
    description: 'User ID of the receiver',
    example: '65f1a2b3c4d5e6f7a8b9c0d2',
  })
  @IsString()
  @IsNotEmpty()
  receiverId: string;

  @ApiProperty({
    description: 'Whether receiver confirms the payment',
    example: true,
  })
  @IsBoolean()
  confirmed: boolean;

  @ApiPropertyOptional({
    description: 'Reason if disputed',
    example: 'Payment amount is incorrect',
  })
  @IsOptional()
  @IsString()
  reason?: string;
}

// ========== RESULT DTOs ==========

export class VerificationResult {
  @ApiProperty()
  verified: boolean;

  @ApiProperty()
  confidence: number;

  @ApiProperty({ type: [String] })
  flags: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  evidence?: Record<string, any>;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  recommendations?: string[];
}

export class VerificationResultDto extends VerificationResult {
  @ApiProperty()
  settlementId: string;

  @ApiProperty()
  method: string;

  @ApiProperty()
  timestamp: Date;

  @ApiProperty()
  fraudScore: number;

  @ApiProperty({ enum: ['low', 'medium', 'high', 'critical'] })
  riskLevel: string;

  @ApiProperty()
  requiresManualReview: boolean;

  @ApiProperty()
  receiverConfirmationRequired: boolean;

  @ApiProperty()
  trustScoreImpact: number;

  @ApiProperty()
  nextSteps: string[];
}

export class VerificationStatusResponseDto {
  @ApiProperty()
  settlementId: string;

  @ApiProperty({ enum: ['pending', 'verified', 'rejected', 'disputed', 'under_review'] })
  status: string;

  @ApiProperty()
  method: string;

  @ApiPropertyOptional()
  verifiedAt?: Date;

  @ApiProperty()
  confidence: number;

  @ApiProperty()
  fraudScore: number;

  @ApiProperty({ enum: ['low', 'medium', 'high', 'critical'] })
  riskLevel: string;

  @ApiProperty()
  receiverConfirmed: boolean;

  @ApiProperty()
  receiverDisputed: boolean;

  @ApiPropertyOptional()
  details?: Record<string, any>;

  @ApiProperty()
  settlementAmount: number;

  @ApiProperty()
  settlementCreatedAt: Date;

  @ApiProperty({ enum: ['pending', 'completed', 'failed', 'disputed'] })
  settlementStatus: string;
}

export class VerificationStatsDto {
  @ApiProperty()
  totalSettlements: number;

  @ApiProperty()
  verified: number;

  @ApiProperty()
  pending: number;

  @ApiProperty()
  disputed: number;

  @ApiProperty()
  underReview: number;

  @ApiProperty()
  avgVerificationTime: number; // in seconds

  @ApiProperty()
  successRate: number; // percentage

  @ApiProperty()
  fraudDetectionRate: number; // percentage

  @ApiProperty({ type: Object })
  methodDistribution: Record<string, number>;

  @ApiProperty({ type: Object })
  riskLevelDistribution: Record<string, number>;

  @ApiProperty()
  lastUpdated: Date;
}

// ========== BATCH VERIFICATION DTOs ==========

export class SettlementVerificationDto {
  @ApiProperty()
  @IsString()
  settlementId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  payerId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  receiverId?: string;
}

export class BatchVerificationDto {
  @ApiProperty({ type: [SettlementVerificationDto] })
  @ValidateNested({ each: true })
  @Type(() => SettlementVerificationDto)
  @IsArray()
  settlements: SettlementVerificationDto[];
}

export class BatchVerificationResponse {
  @ApiProperty()
  total: number;

  @ApiProperty()
  successful: number;

  @ApiProperty()
  failed: number;

  @ApiProperty({ type: [Object] })
  results: Array<{
    settlementId: string;
    success: boolean;
    result?: VerificationResult;
    error?: string;
  }>;
}

// ========== RISK ANALYSIS DTOs ==========

export class RiskAnalysisDto {
  @ApiProperty()
  amount: number;

  @ApiProperty()
  upiId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  transactionId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bank?: string;

  @ApiProperty()
  screenshotText: string;

  @ApiProperty()
  expectedAmount: number;

  @ApiProperty()
  expectedUpiId: string;
}

export class RiskAnalysisResponseDto {
  @ApiProperty()
  riskScore: number;

  @ApiProperty({ enum: ['low', 'medium', 'high', 'critical'] })
  riskLevel: string;

  @ApiProperty({ type: [String] })
  flags: string[];

  @ApiProperty()
  isSuspicious: boolean;

  @ApiProperty({ enum: ['auto_verify', 'manual_review', 'receiver_confirmation', 'reject'] })
  recommendedAction: string;

  @ApiProperty()
  confidence: number;
}

// ========== TRUST SCORE DTOs ==========

export class TrustScoreUpdateDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  scoreChange: number;

  @ApiProperty()
  reason: string;

  @ApiProperty()
  settlementId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  referenceType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class TrustScoreResponseDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  currentScore: number;

  @ApiProperty()
  previousScore: number;

  @ApiProperty()
  change: number;

  @ApiProperty()
  timestamp: Date;

  @ApiProperty()
  reason: string;
}