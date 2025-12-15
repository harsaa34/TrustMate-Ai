import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsBase64,
  Min,
  Max,
} from 'class-validator';

export class ProcessUpiScreenshotDto {
  @ApiProperty({
    description: 'Base64 encoded UPI screenshot image',
  })
  @IsBase64()
  image: string;

  @ApiPropertyOptional({
    description: 'Expected amount for validation',
    example: 500.0,
  })
  @IsNumber()
  @IsOptional()
  expectedAmount?: number;

  @ApiPropertyOptional({
    description: 'Expected UPI ID for validation',
    example: 'user@okaxis',
  })
  @IsString()
  @IsOptional()
  expectedUpiId?: string;
}

export class ProcessReceiptDto {
  @ApiProperty({
    description: 'Base64 encoded receipt image',
  })
  @IsBase64()
  image: string;
}

export class OcrResultDto {
  @ApiProperty({
    description: 'Extracted text',
    example: 'Payment Successful\nAmount: ₹500\nTo: user@okaxis',
  })
  text: string;

  @ApiProperty({
    description: 'Confidence score (0-100)',
    example: 85.5,
  })
  confidence: number;

  @ApiProperty({
    description: 'Language used',
    example: 'eng',
  })
  language: string;

  @ApiProperty({
    description: 'Processing time in milliseconds',
    example: 1250,
  })
  processingTime: number;

  @ApiProperty({
    description: 'Tesseract.js version',
    example: '5.0.0',
  })
  version: string;

  @ApiPropertyOptional({
    description: 'Fraud indicators if any',
    example: ['SUSPICIOUS_TRANSACTION_ID'],
  })
  fraudIndicators?: string[];
}

export class UpiScreenshotDataDto {
  @ApiProperty({
    description: 'Payment amount',
    example: 500.0,
  })
  amount: number;

  @ApiProperty({
    description: 'UPI ID',
    example: 'rahul@okaxis',
  })
  upiId: string;

  @ApiPropertyOptional({
    description: 'Transaction ID',
    example: 'AXIS123456789',
  })
  transactionId?: string;

  @ApiPropertyOptional({
    description: 'Transaction date',
    example: '2024-01-15T19:45:00.000Z',
  })
  date?: Date;

  @ApiProperty({
    description: 'Payment status',
    enum: ['success', 'failed', 'pending'],
    example: 'success',
  })
  status: 'success' | 'failed' | 'pending';

  @ApiPropertyOptional({
    description: 'Bank name',
    example: 'AXIS',
  })
  bank?: string;

  @ApiProperty({
    description: 'Raw extracted text',
  })
  rawText: string;

  @ApiProperty({
    description: 'Confidence score',
    example: 88.0,
  })
  confidence: number;

  @ApiProperty({
    description: 'Fraud score (0-100)',
    example: 15,
  })
  fraudScore: number;

  @ApiProperty({
    description: 'Fraud indicators',
    example: ['MINOR_AMOUNT_MISMATCH'],
    type: [String],
  })
  fraudIndicators: string[];

  @ApiProperty({
    description: 'Whether screenshot is suspicious',
    example: false,
  })
  isSuspicious: boolean;

  @ApiProperty({
    description: 'Risk level',
    enum: ['low', 'medium', 'high', 'critical'],
    example: 'low',
  })
  riskLevel: 'low' | 'medium' | 'high' | 'critical';

  @ApiProperty({
    description: 'Suggested action',
    enum: ['auto_verify', 'manual_review', 'require_additional_proof', 'reject'],
    example: 'auto_verify',
  })
  suggestedAction: 'auto_verify' | 'manual_review' | 'require_additional_proof' | 'reject';

  @ApiPropertyOptional({
    description: 'UPI app used',
    enum: ['google_pay', 'phonepe', 'paytm', 'bhim', 'other'],
    example: 'google_pay',
  })
  upiApp?: 'google_pay' | 'phonepe' | 'paytm' | 'bhim' | 'other';
}

export class ReceiptItemDto {
  @ApiProperty({
    description: 'Item name',
    example: 'Margherita Pizza',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Quantity',
    example: 2,
    default: 1,
  })
  quantity?: number;

  @ApiProperty({
    description: 'Unit price',
    example: 399.0,
  })
  price: number;

  @ApiProperty({
    description: 'Total price (quantity × unit price)',
    example: 798.0,
  })
  total: number;
}

export class ReceiptDataDto {
  @ApiPropertyOptional({
    description: 'Merchant name',
    example: 'DOMINOS PIZZA',
  })
  merchant?: string;

  @ApiPropertyOptional({
    description: 'Transaction date',
    example: '2024-01-15T18:30:00.000Z',
  })
  date?: Date;

  @ApiProperty({
    description: 'Total amount',
    example: 1250.75,
  })
  totalAmount: number;

  @ApiPropertyOptional({
    description: 'Tax amount',
    example: 187.61,
  })
  taxAmount?: number;

  @ApiProperty({
    description: 'Items on receipt',
    type: [ReceiptItemDto],
  })
  items: ReceiptItemDto[];

  @ApiProperty({
    description: 'Currency',
    example: '₹',
    default: '₹',
  })
  currency: string;

  @ApiProperty({
    description: 'Raw extracted text',
  })
  rawText: string;

  @ApiProperty({
    description: 'Confidence score',
    example: 92.5,
  })
  confidence: number;

  @ApiPropertyOptional({
    description: 'Fraud score',
    example: 10,
  })
  fraudScore?: number;

  @ApiPropertyOptional({
    description: 'Fraud indicators',
    example: ['TOTAL_MISMATCH'],
  })
  fraudIndicators?: string[];

  @ApiProperty({
    description: 'Whether receipt is valid',
    example: true,
  })
  isValid: boolean;
}