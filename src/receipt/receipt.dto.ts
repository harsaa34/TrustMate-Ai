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
  IsUrl,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ReceiptStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  PROCESSED = 'PROCESSED',
  ERROR = 'ERROR',
  ARCHIVED = 'ARCHIVED',
}

export enum ExpenseCategory {
  FOOD_DINING = 'FOOD_DINING',
  SHOPPING = 'SHOPPING',
  TRANSPORTATION = 'TRANSPORTATION',
  ENTERTAINMENT = 'ENTERTAINMENT',
  UTILITIES = 'UTILITIES',
  HEALTHCARE = 'HEALTHCARE',
  TRAVEL = 'TRAVEL',
  EDUCATION = 'EDUCATION',
  OTHER = 'OTHER',
}

export class CreateReceiptDto {
  @ApiProperty({ description: 'Merchant name', example: 'Amazon India' })
  @IsString()
  @IsNotEmpty()
  merchantName: string;

  @ApiProperty({ description: 'Total amount', example: 1999.99 })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiPropertyOptional({ description: 'Currency code', example: 'INR' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({ description: 'Transaction date' })
  @IsOptional()
  @IsDateString()
  transactionDate?: string;

  @ApiPropertyOptional({ description: 'Receipt image URL' })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @ApiPropertyOptional({ description: 'Payment method', example: 'Credit Card' })
  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @ApiPropertyOptional({ description: 'Additional notes' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ description: 'Tags for categorization', example: ['business', 'travel'], type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ description: 'Additional metadata', type: Object })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class UpdateReceiptDto {
  @ApiPropertyOptional({ description: 'Updated merchant name' })
  @IsOptional()
  @IsString()
  merchantName?: string;

  @ApiPropertyOptional({ description: 'Updated amount' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number;

  @ApiPropertyOptional({ description: 'Updated currency' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({ description: 'Updated transaction date' })
  @IsOptional()
  @IsDateString()
  transactionDate?: string;

  @ApiPropertyOptional({ description: 'Updated status', enum: ReceiptStatus })
  @IsOptional()
  @IsEnum(ReceiptStatus)
  status?: ReceiptStatus;

  @ApiPropertyOptional({ description: 'Updated notes' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ description: 'Updated tags', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ description: 'Whether the receipt is active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Analysis result', type: Object })
  @IsOptional()
  @IsObject()
  analysisResult?: Record<string, any>;
}

export class ProcessReceiptDto {
  @ApiProperty({ description: 'Merchant name', example: 'Amazon' })
  @IsString()
  @IsNotEmpty()
  merchantName: string;

  @ApiProperty({ description: 'Total amount', example: 99.99 })
  @IsNumber()
  @Min(0)
  amount: number;
}

export class ReceiptResponseDto {
  @ApiProperty({ description: 'Receipt ID' })
  id: string;

  @ApiProperty({ description: 'Merchant name' })
  merchantName: string;

  @ApiProperty({ description: 'Total amount' })
  amount: number;

  @ApiProperty({ description: 'Currency code' })
  currency: string;

  @ApiPropertyOptional({ description: 'Transaction date' })
  transactionDate?: Date;

  @ApiPropertyOptional({ description: 'Receipt image URL' })
  imageUrl?: string;

  @ApiPropertyOptional({ description: 'File name' })
  fileName?: string;

  @ApiPropertyOptional({ description: 'File size in bytes' })
  fileSize?: number;

  @ApiPropertyOptional({ description: 'MIME type' })
  mimeType?: string;

  @ApiPropertyOptional({ description: 'OCR extracted data', type: Object })
  ocrData?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Analysis result', type: Object })
  analysisResult?: Record<string, any>;

  @ApiProperty({ description: 'Processing status', enum: ReceiptStatus })
  status: ReceiptStatus;

  @ApiPropertyOptional({ description: 'Confidence score (0-100)' })
  confidenceScore?: number;

  @ApiPropertyOptional({ description: 'Processing completion timestamp' })
  processedAt?: Date;

  @ApiPropertyOptional({ description: 'Payment method' })
  paymentMethod?: string;

  @ApiPropertyOptional({ description: 'Notes' })
  notes?: string;

  @ApiPropertyOptional({ description: 'Tags', type: [String] })
  tags?: string[];

  @ApiProperty({ description: 'Whether the receipt is active' })
  isActive: boolean;

  @ApiProperty({ description: 'User who created the receipt' })
  createdBy: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}

export class ReceiptAnalysisResultDto {
  @ApiProperty({ description: 'Receipt ID' })
  receiptId: string;

  @ApiProperty({ description: 'Merchant name' })
  merchantName: string;

  @ApiProperty({ description: 'Total amount' })
  totalAmount: number;

  @ApiProperty({ description: 'Currency code' })
  currency: string;

  @ApiProperty({ description: 'Transaction date' })
  transactionDate: Date;

  @ApiProperty({ description: 'Expense category' })
  category: string;

  @ApiProperty({ description: 'Expense subcategory' })
  subcategory: string;

  @ApiProperty({ description: 'List of items', type: [Object] })
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    total: number;
  }>;

  @ApiProperty({ description: 'Analysis confidence (0-100)' })
  confidence: number;

  @ApiProperty({ description: 'Expense type (Business/Personal)' })
  expenseType: string;

  @ApiProperty({ description: 'Tax amount' })
  taxAmount: number;

  @ApiProperty({ description: 'Tip amount' })
  tipAmount: number;

  @ApiProperty({ description: 'Whether it is a business expense' })
  isBusinessExpense: boolean;

  @ApiProperty({ description: 'Insights', type: [String] })
  insights: string[];
}

export class ReceiptListResponseDto {
  @ApiProperty({ description: 'List of receipts', type: [ReceiptResponseDto] })
  receipts: ReceiptResponseDto[];

  @ApiProperty({ description: 'Total number of receipts' })
  total: number;

  @ApiProperty({ description: 'Current page' })
  page: number;

  @ApiProperty({ description: 'Items per page' })
  limit: number;

  @ApiProperty({ description: 'Total number of pages' })
  totalPages: number;
}