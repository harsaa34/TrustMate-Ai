import {
  IsNumber,
  IsString,
  IsEnum,
  IsOptional,
  IsArray,
  IsBoolean,
  IsDateString,
  IsObject,
  IsNotEmpty,
  Min,
  Max,
  IsNumberString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum FraudStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  FLAGGED = 'FLAGGED',
  UNDER_REVIEW = 'UNDER_REVIEW',
}

export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

// Add FraudCheckType enum
export enum FraudCheckType {
  TRANSACTION = 'TRANSACTION',
  UPI_SCREENSHOT = 'UPI_SCREENSHOT',
  DOCUMENT = 'DOCUMENT',
  IDENTITY = 'IDENTITY',
}

// Add UpiAppType enum
export enum UpiAppType {
  GOOGLE_PAY = 'GOOGLE_PAY',
  PHONE_PE = 'PHONE_PE',
  PAYTM = 'PAYTM',
  BHIM = 'BHIM',
  AMAZON_PAY = 'AMAZON_PAY',
  WHATSAPP_PAY = 'WHATSAPP_PAY',
  OTHER = 'OTHER',
}

export class CreateFraudCheckDto {
  @ApiProperty({ description: 'Transaction ID', example: 'txn_123456789' })
  @IsString()
  @IsNotEmpty()
  transactionId: string;

  @ApiProperty({ description: 'Transaction amount', example: 1000.50 })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ description: 'Currency code', example: 'INR' })
  @IsString()
  currency: string;

  @ApiProperty({ description: 'Merchant ID', example: 'merch_12345' })
  @IsString()
  merchantId: string;

  @ApiProperty({ description: 'Customer ID', example: 'cust_12345' })
  @IsString()
  customerId: string;

  @ApiPropertyOptional({ description: 'Device ID', example: 'device_fingerprint_123' })
  @IsOptional()
  @IsString()
  deviceId?: string;

  @ApiPropertyOptional({ description: 'IP Address', example: '192.168.1.1' })
  @IsOptional()
  @IsString()
  ipAddress?: string;

  @ApiPropertyOptional({ description: 'Transaction location', example: { city: 'Mumbai', country: 'IN' } })
  @IsOptional()
  @IsObject()
  location?: Record<string, any>;

  @ApiProperty({ description: 'Risk score (0-100)', example: 65, minimum: 0, maximum: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  riskScore: number;

  @ApiPropertyOptional({ description: 'Fraud flags', example: ['LARGE_AMOUNT', 'UNUSUAL_TIME'], type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  flags?: string[];

  @ApiPropertyOptional({ description: 'Additional metadata', type: Object })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class UpdateFraudCheckDto {
  @ApiPropertyOptional({ description: 'Updated risk score', example: 70, minimum: 0, maximum: 100 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  riskScore?: number;

  @ApiPropertyOptional({ description: 'Updated fraud status', enum: FraudStatus })
  @IsOptional()
  @IsEnum(FraudStatus)
  status?: FraudStatus;

  @ApiPropertyOptional({ description: 'Updated fraud flags', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  flags?: string[];

  @ApiPropertyOptional({ description: 'Analysis result', type: Object })
  @IsOptional()
  @IsObject()
  analysisResult?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Review notes', example: 'Manually reviewed and approved' })
  @IsOptional()
  @IsString()
  reviewNotes?: string;

  @ApiPropertyOptional({ description: 'Reviewed by user ID' })
  @IsOptional()
  @IsString()
  reviewedBy?: string;

  @ApiPropertyOptional({ description: 'Review timestamp' })
  @IsOptional()
  @IsDateString()
  reviewedAt?: string;

  @ApiPropertyOptional({ description: 'Whether the check is active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class AnalyzeTransactionDto {
  @ApiProperty({ description: 'Transaction ID', example: 'txn_987654321' })
  @IsString()
  @IsNotEmpty()
  transactionId: string;

  @ApiProperty({ description: 'Transaction amount', example: 15000.75 })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ description: 'Currency code', example: 'INR' })
  @IsString()
  currency: string;

  @ApiProperty({ description: 'Merchant ID', example: 'merch_54321' })
  @IsString()
  merchantId: string;

  @ApiProperty({ description: 'Customer ID', example: 'cust_54321' })
  @IsString()
  customerId: string;

  @ApiPropertyOptional({ description: 'Device ID', example: 'android_emulator_001' })
  @IsOptional()
  @IsString()
  deviceId?: string;

  @ApiPropertyOptional({ description: 'IP Address', example: '103.21.244.0' })
  @IsOptional()
  @IsString()
  ipAddress?: string;

  @ApiPropertyOptional({ description: 'Transaction location', example: { city: 'Singapore', country: 'SG' } })
  @IsOptional()
  @IsObject()
  location?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Transaction timestamp' })
  @IsOptional()
  @IsDateString()
  transactionTime?: string;
}

export class FraudCheckResponseDto {
  @ApiProperty({ description: 'Fraud check ID' })
  id: string;

  @ApiProperty({ description: 'Transaction ID' })
  transactionId: string;

  @ApiProperty({ description: 'Transaction amount' })
  amount: number;

  @ApiProperty({ description: 'Currency code' })
  currency: string;

  @ApiProperty({ description: 'Merchant ID' })
  merchantId: string;

  @ApiProperty({ description: 'Customer ID' })
  customerId: string;

  @ApiPropertyOptional({ description: 'Device ID' })
  deviceId?: string;

  @ApiPropertyOptional({ description: 'IP Address' })
  ipAddress?: string;

  @ApiPropertyOptional({ description: 'Transaction location', type: Object })
  location?: Record<string, any>;

  @ApiProperty({ description: 'Risk score (0-100)' })
  riskScore: number;

  @ApiProperty({ description: 'Risk level', enum: RiskLevel })
  riskLevel: RiskLevel;

  @ApiProperty({ description: 'Fraud flags', type: [String] })
  flags: string[];

  @ApiProperty({ description: 'Fraud status', enum: FraudStatus })
  status: FraudStatus;

  @ApiPropertyOptional({ description: 'Analysis result', type: Object })
  analysisResult?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Review notes' })
  reviewNotes?: string;

  @ApiPropertyOptional({ description: 'Reviewed by user ID' })
  reviewedBy?: string;

  @ApiPropertyOptional({ description: 'Review timestamp' })
  reviewedAt?: Date;

  @ApiProperty({ description: 'Whether the check is active' })
  isActive: boolean;

  @ApiProperty({ description: 'User who created the check' })
  createdBy: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}

export class FraudAnalysisResponseDto {
  @ApiProperty({ description: 'Fraud check ID' })
  id: string;

  @ApiProperty({ description: 'Transaction ID' })
  transactionId: string;

  @ApiProperty({ description: 'Risk score (0-100)' })
  riskScore: number;

  @ApiProperty({ description: 'Risk level', enum: RiskLevel })
  riskLevel: RiskLevel;

  @ApiProperty({ description: 'Whether transaction is fraudulent' })
  isFraudulent: boolean;

  @ApiProperty({ description: 'Fraud flags', type: [String] })
  flags: string[];

  @ApiProperty({ description: 'Confidence level (0-100)' })
  confidence: number;

  @ApiProperty({ description: 'Recommendations', type: [String] })
  recommendations: string[];

  @ApiProperty({ description: 'Analysis timestamp' })
  createdAt: Date;

  // Add these optional properties to support UPI screenshot analysis
  @ApiPropertyOptional({ description: 'Whether receiver confirmation is required' })
  @IsOptional()
  @IsBoolean()
  requiresReceiverConfirmation?: boolean;

  @ApiPropertyOptional({ description: 'Whether transaction can be auto-verified' })
  @IsOptional()
  @IsBoolean()
  canAutoVerify?: boolean;
}

// ========== ENHANCED DTOS ==========

export class UpiScreenshotAnalysisDto {
  @ApiProperty({ description: 'OCR extracted text from screenshot' })
  @IsString()
  screenshotText: string;

  @ApiProperty({ description: 'Extracted amount from OCR' })
  @IsNumber()
  extractedAmount: number;

  @ApiProperty({ description: 'Extracted UPI ID from OCR' })
  @IsString()
  extractedUpiId: string;

  @ApiPropertyOptional({ description: 'Extracted transaction ID' })
  @IsString()
  @IsOptional()
  extractedTransactionId?: string;

  @ApiProperty({ description: 'Expected payment amount' })
  @IsNumber()
  expectedAmount: number;

  @ApiProperty({ description: 'Expected UPI ID' })
  @IsString()
  expectedUpiId: string;

  @ApiPropertyOptional({ description: 'Settlement ID if applicable' })
  @IsString()
  @IsOptional()
  settlementId?: string;

  @ApiPropertyOptional({ description: 'Group ID if applicable' })
  @IsString()
  @IsOptional()
  groupId?: string;

  @ApiProperty({ description: 'User ID of payer' })
  @IsString()
  payerId: string;

  @ApiProperty({ description: 'User ID of receiver' })
  @IsString()
  receiverId: string;
}

export class ReceiverConfirmationDto {
  @ApiProperty({ description: 'Fraud check ID' })
  @IsString()
  fraudCheckId: string;

  @ApiProperty({ 
    description: 'Confirmation status',
    enum: ['CONFIRMED', 'DENIED']
  })
  @IsString()
  status: 'CONFIRMED' | 'DENIED';

  @ApiPropertyOptional({ description: 'Reason if denied' })
  @IsString()
  @IsOptional()
  reason?: string;

  @ApiPropertyOptional({ description: 'Additional evidence if any' })
  @IsString()
  @IsOptional()
  additionalEvidence?: string;
}

export class UpdateFraudCheckResolutionDto {
  @ApiProperty({ 
    description: 'Resolution status',
    enum: ['APPROVED', 'REJECTED', 'MARK_AS_FALSE_POSITIVE']
  })
  @IsString()
  resolution: 'APPROVED' | 'REJECTED' | 'MARK_AS_FALSE_POSITIVE';

  @ApiPropertyOptional({ description: 'Resolution notes' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ description: 'Trust score impact' })
  @IsNumber()
  @IsOptional()
  trustScoreImpact?: number;
}

export class FraudCheckStatsDto {
  @ApiProperty({ description: 'Total fraud checks' })
  total: number;

  @ApiProperty({ description: 'High risk checks' })
  highRisk: number;

  @ApiProperty({ description: 'Disputed checks' })
  disputed: number;

  @ApiProperty({ description: 'False positives' })
  falsePositives: number;

  @ApiProperty({ description: 'Average risk score' })
  avgRiskScore: number;

  @ApiProperty({ description: 'Average processing time in ms' })
  avgProcessingTime: number;

  @ApiProperty({ description: 'Success rate' })
  successRate: number;
}

export class SuspiciousTransactionDto {
  @ApiProperty({ description: 'Fraud check ID' })
  id: string;

  @ApiProperty({ description: 'Transaction ID' })
  transactionId: string;

  @ApiProperty({ description: 'Amount' })
  amount: number;

  @ApiProperty({ description: 'Risk score' })
  riskScore: number;

  @ApiProperty({ description: 'Risk level', enum: RiskLevel })
  riskLevel: RiskLevel;  // Changed from RiskLevelDto to RiskLevel

  @ApiProperty({ description: 'Check type' })
  checkType: string;

  @ApiProperty({ description: 'Created at' })
  createdAt: Date;

  @ApiProperty({ description: 'Flags' })
  flags: string[];

  @ApiProperty({ description: 'Requires review' })
  requiresReview: boolean;
}