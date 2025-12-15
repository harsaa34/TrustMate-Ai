import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsString,
  IsOptional,
  Min,
  Max,
  IsUrl,
  IsEnum,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export class GenerateUpiLinkDto {
  @ApiProperty({
    description: 'Amount to be paid',
    example: 500.0,
    minimum: 1,
    maximum: 100000,
  })
  @IsNumber()
  @Min(1)
  @Max(100000)
  amount: number;

  @ApiProperty({
    description: 'Receiver UPI ID (e.g., user@okaxis)',
    example: 'rahul@okaxis',
  })
  @IsString()
  receiverUpiId: string;

  @ApiProperty({
    description: 'Receiver name',
    example: 'Rahul Sharma',
  })
  @IsString()
  receiverName: string;

  @ApiPropertyOptional({
    description: 'Payment note (max 50 chars)',
    example: 'Dinner bill settlement - Group "Foodies"',
    maxLength: 50,
  })
  @IsString()
  @IsOptional()
  note?: string;

  @ApiPropertyOptional({
    description: 'Custom transaction ID',
    example: 'SETTLEMENT_123',
  })
  @IsString()
  @IsOptional()
  transactionId?: string;

  @ApiPropertyOptional({
    description: 'Settlement ID for reference',
    example: '65f1a2b3c4d5e6f7a8b9c0d1',
  })
  @IsString()
  @IsOptional()
  settlementId?: string;
}

export class VerifyPaymentDto {
  @ApiProperty({
    description: 'Base64 encoded screenshot image',
    example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...',
  })
  @IsString()
  screenshot?: string;

  @ApiPropertyOptional({
    description: 'OCR extracted text (if already processed)',
    example: 'Payment Successful\nAmount: ₹500\nTo: rahul@okaxis',
  })
  @IsString()
  @IsOptional()
  ocrText?: string;

  @ApiProperty({
    description: 'Expected amount',
    example: 500.0,
  })
  @IsNumber()
  expectedAmount: number;

  @ApiProperty({
    description: 'Expected receiver UPI ID',
    example: 'rahul@okaxis',
  })
  @IsString()
  expectedUpiId: string;

  @ApiPropertyOptional({
    description: 'Settlement ID',
    example: '65f1a2b3c4d5e6f7a8b9c0d1',
  })
  @IsString()
  @IsOptional()
  settlementId?: string;

  @ApiPropertyOptional({
    description: 'Transaction ID to verify',
    example: 'TXN123456789',
  })
  @IsString()
  @IsOptional()
  transactionId?: string;
}

export class ValidateUpiIdDto {
  @ApiProperty({
    description: 'UPI ID to validate',
    example: 'user@okaxis',
  })
  @IsString()
  upiId: string;
}

export class UpiCallbackDto {
  @ApiProperty({
    description: 'Callback URL from UPI app',
    example: 'trustmate://upi/callback?status=success&txnId=ABC123',
  })
  @IsUrl()
  callbackUrl: string;

  @ApiPropertyOptional({
    description: 'Signature for verification',
  })
  @IsString()
  @IsOptional()
  signature?: string;

  @ApiPropertyOptional({
    description: 'Timestamp of callback',
    example: '2024-01-15T10:30:00Z',
  })
  @IsDateString()
  @IsOptional()
  timestamp?: string;
}

export class UpiLinkResponseDto {
  @ApiProperty({
    description: 'UPI deep link',
    example: 'upi://pay?pa=rahul@okaxis&pn=Rahul&am=500&cu=INR&tn=Dinner%20bill',
  })
  upiLink: string;

  @ApiPropertyOptional({
    description: 'QR code image data URL',
    example: 'data:image/svg+xml,<svg>...</svg>',
  })
  qrCode?: string;

  @ApiProperty({
    description: 'Transaction ID for reference',
    example: 'TRUST_ABC123',
  })
  transactionId: string;

  @ApiPropertyOptional({
    description: 'Link expiry time',
    example: '2024-01-16T10:30:00Z',
  })
  expiryTime?: Date;

  @ApiPropertyOptional({
    description: 'Alternative app-specific links',
    example: {
      googlePay: 'tez://upi/pay?...',
      phonePe: 'phonepe://pay?...',
      paytm: 'paytmmp://pay?...',
    },
  })
  appLinks?: Record<string, string>;
}

export class VerificationResponseDto {
  @ApiProperty({
    description: 'Whether payment is valid',
    example: true,
  })
  isValid: boolean;

  @ApiProperty({
    description: 'Whether amount matches',
    example: true,
  })
  amountMatch: boolean;

  @ApiProperty({
    description: 'Whether UPI ID matches',
    example: true,
  })
  upiIdMatch: boolean;

  @ApiProperty({
    description: 'Confidence score (0-100)',
    example: 95,
    minimum: 0,
    maximum: 100,
  })
  confidence: number;

  @ApiPropertyOptional({
    description: 'Extracted amount from screenshot',
    example: 500.0,
  })
  extractedAmount?: number;

  @ApiPropertyOptional({
    description: 'Extracted UPI ID from screenshot',
    example: 'rahul@okaxis',
  })
  extractedUpiId?: string;

  @ApiPropertyOptional({
    description: 'Transaction ID from screenshot',
    example: 'AXIS123456789',
  })
  transactionId?: string;

  @ApiPropertyOptional({
    description: 'Payment timestamp from screenshot',
    example: '2024-01-15T10:25:30Z',
  })
  timestamp?: Date;

  @ApiPropertyOptional({
    description: 'Discrepancies if any',
    example: ['Amount mismatch by ₹5'],
  })
  discrepancies?: string[];

  @ApiPropertyOptional({
    description: 'Trust score impact',
    example: 10,
  })
  trustScoreImpact?: number;

  @ApiPropertyOptional({
    description: 'Settlement ID if provided',
    example: '65f1a2b3c4d5e6f7a8b9c0d1',
  })
  settlementId?: string;

  @ApiPropertyOptional({
    description: 'Verification timestamp',
    example: '2024-01-15T10:30:00Z',
  })
  verifiedAt?: Date;
}

export class ValidateUpiIdResponseDto {
  @ApiProperty({
    description: 'The UPI ID that was validated',
    example: 'user@okaxis',
  })
  upiId: string;

  @ApiProperty({
    description: 'Whether UPI ID is valid',
    example: true,
  })
  isValid: boolean;

  @ApiPropertyOptional({
    description: 'Bank/Provider name',
    example: 'Axis Bank',
  })
  provider?: string;

  @ApiPropertyOptional({
    description: 'Validation issues if any',
    example: ['Unrecognized provider'],
  })
  issues?: string[];
}

export class PaymentStatusResponseDto {
  @ApiProperty({
    description: 'Transaction ID',
    example: 'TRUST_ABC123',
  })
  transactionId: string;

  @ApiProperty({
    description: 'Payment status',
    enum: ['pending', 'verified', 'failed', 'disputed'],
    example: 'verified',
  })
  status: 'pending' | 'verified' | 'failed' | 'disputed';

  @ApiProperty({
    description: 'Payment amount',
    example: 500.0,
  })
  amount: number;

  @ApiProperty({
    description: 'Receiver UPI ID',
    example: 'rahul@okaxis',
  })
  upiId: string;

  @ApiPropertyOptional({
    description: 'Verification timestamp',
    example: '2024-01-15T10:30:00Z',
  })
  verifiedAt?: Date | null;

  @ApiProperty({
    description: 'Verification method',
    enum: ['manual', 'ocr', 'callback', 'auto'],
    example: 'ocr',
  })
  verificationMethod: 'manual' | 'ocr' | 'callback' | 'auto';
}

export class BatchUpiVerificationDto {
  @ApiProperty({
    description: 'Array of payments to verify',
    type: [VerifyPaymentDto],
  })
  payments: VerifyPaymentDto[];

  @ApiPropertyOptional({
    description: 'Batch processing options',
    example: { notifyOnCompletion: true },
  })
  @IsOptional()
  options?: {
    notifyOnCompletion?: boolean;
    priority?: 'high' | 'normal' | 'low';
  };
}

export class BatchVerificationResponseDto {
  @ApiProperty({
    description: 'Batch processing results',
    type: [VerificationResponseDto],
  })
  results: VerificationResponseDto[];

  @ApiProperty({
    description: 'Batch summary',
    example: {
      total: 5,
      valid: 4,
      invalid: 1,
      confidenceAvg: 92.5,
    },
  })
  summary: {
    total: number;
    valid: number;
    invalid: number;
    confidenceAvg: number;
  };
}