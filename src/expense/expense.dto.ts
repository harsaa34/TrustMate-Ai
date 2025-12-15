// src/expense/expense.dto.ts (COMPLETE VERSION WITH ALL DTOS)
import { 
  IsString, IsOptional, IsEnum, IsMongoId, IsNumber, IsDate, 
  IsArray, ValidateNested, ArrayMinSize, IsBoolean, Min, MaxLength,
  Validate, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface, 
  Max
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// Custom validator for paidByUserId in splits
@ValidatorConstraint({ name: 'paidByInSplits', async: false })
export class PaidByInSplitsConstraint implements ValidatorConstraintInterface {
  validate(splits: any[], args: ValidationArguments) {
    const object = args.object as any;
    const paidByUserId = object.paidByUserId;
    
    if (!paidByUserId || !splits || splits.length === 0) {
      return false;
    }
    
    return splits.some(split => split.userId === paidByUserId);
  }

  defaultMessage(args: ValidationArguments) {
    return 'The user who paid (paidByUserId) must be included in the splits';
  }
}

// Custom validator for minimum 2 members
@ValidatorConstraint({ name: 'minTwoMembers', async: false })
export class MinTwoMembersConstraint implements ValidatorConstraintInterface {
  validate(splits: any[]) {
    return splits && splits.length >= 2;
  }

  defaultMessage() {
    return 'At least 2 members must be included in expense splits';
  }
}

// Split DTOs
export class ExpenseSplitDto {
  @ApiProperty({ description: 'User ID for this split' })
  @IsMongoId()
  userId: string;

  @ApiPropertyOptional({ description: 'Amount for this user (required for exact splits)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number;

  @ApiPropertyOptional({ description: 'Percentage for this user (required for percentage splits)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @MaxLength(100)
  percentage?: number;

  @ApiPropertyOptional({ description: 'Shares for this user (required for share splits)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  shares?: number;

  @ApiPropertyOptional({ description: 'Note for this split' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  note?: string;
}

export class ExpenseSplitResponseDto {
  @ApiProperty({ description: 'User ID for this split' })
  userId: string;

  @ApiProperty({ description: 'Amount for this user' })
  amount: number;

  @ApiProperty({ description: 'Percentage for this user', required: false })
  percentage?: number;

  @ApiProperty({ description: 'Shares for this user', required: false })
  shares?: number;

  @ApiProperty({ description: 'Note for this split', required: false })
  note?: string;
}

// Request DTOs
export class CreateExpenseDto {
  @ApiProperty({ description: 'Expense title' })
  @IsString()
  @MaxLength(200)
  title: string;

  @ApiPropertyOptional({ description: 'Expense description' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({ description: 'Total expense amount' })
  @IsNumber()
  @Min(0.01, { message: 'Amount must be greater than 0' })
  amount: number;

  @ApiProperty({ description: 'User who paid for the expense' })
  @IsMongoId()
  paidByUserId: string;

  @ApiProperty({ description: 'Expense date' })
  @IsDate()
  @Type(() => Date)
  date: Date;

  @ApiPropertyOptional({ 
    description: 'Expense category', 
    enum: ['food', 'transport', 'accommodation', 'shopping', 'entertainment', 'bills', 'health', 'education', 'other'] 
  })
  @IsOptional()
  @IsEnum(['food', 'transport', 'accommodation', 'shopping', 'entertainment', 'bills', 'health', 'education', 'other'])
  category?: string;

  @ApiProperty({ 
    description: 'Split type', 
    enum: ['equal', 'percentage', 'exact', 'shares', 'adjustment'] 
  })
  @IsEnum(['equal', 'percentage', 'exact', 'shares', 'adjustment'])
  splitType: string;

  @ApiProperty({ 
    type: [ExpenseSplitDto], 
    description: 'Expense splits for each user (minimum 2 users)' 
  })
  @IsArray()
  @ArrayMinSize(2, { message: 'At least 2 members must be included in expense splits' })
  @ValidateNested({ each: true })
  @Validate(MinTwoMembersConstraint)
  @Validate(PaidByInSplitsConstraint)
  @Type(() => ExpenseSplitDto)
  splits: ExpenseSplitDto[];

  @ApiPropertyOptional({ description: 'Receipt image URL' })
  @IsOptional()
  @IsString()
  receiptImageUrl?: string;

  @ApiPropertyOptional({ description: 'Expense location' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  location?: string;

  @ApiPropertyOptional({ description: 'Tags for categorization' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class UpdateExpenseDto {
  @ApiPropertyOptional({ description: 'Expense title' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @ApiPropertyOptional({ description: 'Expense description' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ description: 'Total expense amount' })
  @IsOptional()
  @IsNumber()
  @Min(0.01)
  amount?: number;

  @ApiPropertyOptional({ description: 'User who paid for the expense' })
  @IsOptional()
  @IsMongoId()
  paidByUserId?: string;

  @ApiPropertyOptional({ description: 'Expense date' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date?: Date;

  @ApiPropertyOptional({ 
    description: 'Expense category', 
    enum: ['food', 'transport', 'accommodation', 'shopping', 'entertainment', 'bills', 'health', 'education', 'other'] 
  })
  @IsOptional()
  @IsEnum(['food', 'transport', 'accommodation', 'shopping', 'entertainment', 'bills', 'health', 'education', 'other'])
  category?: string;

  @ApiPropertyOptional({ 
    description: 'Split type', 
    enum: ['equal', 'percentage', 'exact', 'shares', 'adjustment'] 
  })
  @IsOptional()
  @IsEnum(['equal', 'percentage', 'exact', 'shares', 'adjustment'])
  splitType?: string;

  @ApiPropertyOptional({ 
    type: [ExpenseSplitDto], 
    description: 'Updated expense splits (minimum 2 users)' 
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExpenseSplitDto)
  splits?: ExpenseSplitDto[];

  @ApiPropertyOptional({ description: 'Receipt image URL' })
  @IsOptional()
  @IsString()
  receiptImageUrl?: string;

  @ApiPropertyOptional({ description: 'Mark expense as verified' })
  @IsOptional()
  @IsBoolean()
  verified?: boolean;

  @ApiPropertyOptional({ description: 'Expense location' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  location?: string;

  @ApiPropertyOptional({ description: 'Tags for categorization' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class GetExpensesQueryDto {
  @ApiPropertyOptional({ 
    description: 'Filter by category', 
    enum: ['food', 'transport', 'accommodation', 'shopping', 'entertainment', 'bills', 'health', 'education', 'other'] 
  })
  @IsOptional()
  @IsEnum(['food', 'transport', 'accommodation', 'shopping', 'entertainment', 'bills', 'health', 'education', 'other'])
  category?: string;

  @ApiPropertyOptional({ description: 'Filter from date' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  fromDate?: Date;

  @ApiPropertyOptional({ description: 'Filter to date' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  toDate?: Date;

  @ApiPropertyOptional({ description: 'Filter by paid by user ID' })
  @IsOptional()
  @IsMongoId()
  paidByUserId?: string;

  @ApiPropertyOptional({ description: 'Filter by verified status' })
  @IsOptional()
  @IsBoolean()
  verified?: boolean;

  @ApiPropertyOptional({ description: 'Search in title and description' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ 
    description: 'Sort field', 
    enum: ['date', 'amount', 'createdAt'] 
  })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({ 
    description: 'Sort direction', 
    enum: ['asc', 'desc'] 
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';

  @ApiPropertyOptional({ description: 'Page number' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ description: 'Items per page' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number;
}

export class VerifyReceiptDto {
  @ApiProperty({ description: 'Actual amount from receipt' })
  @IsNumber()
  @Min(0.01)
  extractedAmount: number;

  @ApiPropertyOptional({ description: 'Extracted date from receipt' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  extractedDate?: Date;

  @ApiPropertyOptional({ description: 'Confidence score of OCR extraction' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  confidenceScore?: number;

  @ApiPropertyOptional({ description: 'Additional verification metadata' })
  @IsOptional()
  metadata?: Record<string, any>;
}

// Response DTOs
export class ExpenseResponseDto {
  @ApiProperty({ description: 'Expense ID' })
  id: string;

  @ApiProperty({ description: 'Group ID' })
  groupId: string;

  @ApiProperty({ description: 'Expense title' })
  title: string;

  @ApiProperty({ description: 'Expense description', required: false })
  description?: string;

  @ApiProperty({ description: 'Total expense amount' })
  amount: number;

  @ApiProperty({ description: 'User who paid for the expense' })
  paidByUserId: string;

  @ApiProperty({ description: 'Paid by user name', required: false })
  paidByUserName?: string;

  @ApiProperty({ description: 'Expense date' })
  date: Date;

  @ApiProperty({ description: 'Expense category', required: false })
  category?: string;

  @ApiProperty({ description: 'Split type' })
  splitType: string;

  @ApiProperty({ 
    type: [ExpenseSplitResponseDto], 
    description: 'Expense splits' 
  })
  splits: ExpenseSplitResponseDto[];

  @ApiProperty({ description: 'Receipt image URL', required: false })
  receiptImageUrl?: string;

  @ApiProperty({ description: 'Expense location', required: false })
  location?: string;

  @ApiProperty({ description: 'Tags for categorization', required: false })
  tags?: string[];

  @ApiProperty({ description: 'Whether expense is verified' })
  verified: boolean;

  @ApiProperty({ description: 'Created by user ID' })
  createdByUserId: string;

  @ApiProperty({ description: 'Created by user name', required: false })
  createdByUserName?: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Update timestamp' })
  updatedAt: Date;
}

export class ExpenseListResponseDto {
  @ApiProperty({ type: [ExpenseResponseDto], description: 'List of expenses' })
  expenses: ExpenseResponseDto[];

  @ApiProperty({ description: 'Total count' })
  total: number;

  @ApiProperty({ description: 'Page number' })
  page: number;

  @ApiProperty({ description: 'Items per page' })
  limit: number;

  @ApiProperty({ description: 'Total pages' })
  totalPages: number;
}

// In expense.dto.ts - Add these if not already present

export class ExpenseSummaryResponseDto {
  @ApiProperty({
    description: 'Total amount spent',
    example: 15000.75,
  })
  totalSpent: number;

  @ApiProperty({
    description: 'Total number of expenses',
    example: 25,
  })
  totalExpenses: number;

  @ApiProperty({
    description: 'Average expense amount',
    example: 600.03,
  })
  averageExpense: number;

  @ApiProperty({
    description: 'Top expense category',
    example: 'food',
  })
  topCategory: string;

  @ApiProperty({
    description: 'Last expense date',
    example: '2024-01-15T10:30:00.000Z',
  })
  lastExpenseDate: Date;
}

export class VerifyReceiptResponseDto {
  @ApiProperty({
    description: 'Whether receipt was verified',
    example: true,
  })
  verified: boolean;

  @ApiProperty({
    description: 'Confidence score',
    example: 0.95,
  })
  confidence: number;
}

export class InsightResponseDto {
  @ApiProperty({ description: 'Total spent in period' })
  totalSpent: number;

  @ApiProperty({ description: 'Average per expense' })
  averagePerExpense: number;

  @ApiProperty({ description: 'Number of expenses' })
  expenseCount: number;

  @ApiProperty({ description: 'Top categories with amounts' })
  categories: Record<string, number>;

  @ApiProperty({ description: 'Daily spending breakdown' })
  dailyBreakdown: Record<string, number>;
}