import { ValidationArguments, ValidatorConstraintInterface } from 'class-validator';
export declare class PaidByInSplitsConstraint implements ValidatorConstraintInterface {
    validate(splits: any[], args: ValidationArguments): boolean;
    defaultMessage(args: ValidationArguments): string;
}
export declare class MinTwoMembersConstraint implements ValidatorConstraintInterface {
    validate(splits: any[]): boolean;
    defaultMessage(): string;
}
export declare class ExpenseSplitDto {
    userId: string;
    amount?: number;
    percentage?: number;
    shares?: number;
    note?: string;
}
export declare class ExpenseSplitResponseDto {
    userId: string;
    amount: number;
    percentage?: number;
    shares?: number;
    note?: string;
}
export declare class CreateExpenseDto {
    title: string;
    description?: string;
    amount: number;
    paidByUserId: string;
    date: Date;
    category?: string;
    splitType: string;
    splits: ExpenseSplitDto[];
    receiptImageUrl?: string;
    location?: string;
    tags?: string[];
}
export declare class UpdateExpenseDto {
    title?: string;
    description?: string;
    amount?: number;
    paidByUserId?: string;
    date?: Date;
    category?: string;
    splitType?: string;
    splits?: ExpenseSplitDto[];
    receiptImageUrl?: string;
    verified?: boolean;
    location?: string;
    tags?: string[];
}
export declare class GetExpensesQueryDto {
    category?: string;
    fromDate?: Date;
    toDate?: Date;
    paidByUserId?: string;
    verified?: boolean;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}
export declare class VerifyReceiptDto {
    extractedAmount: number;
    extractedDate?: Date;
    confidenceScore?: number;
    metadata?: Record<string, any>;
}
export declare class ExpenseResponseDto {
    id: string;
    groupId: string;
    title: string;
    description?: string;
    amount: number;
    paidByUserId: string;
    paidByUserName?: string;
    date: Date;
    category?: string;
    splitType: string;
    splits: ExpenseSplitResponseDto[];
    receiptImageUrl?: string;
    location?: string;
    tags?: string[];
    verified: boolean;
    createdByUserId: string;
    createdByUserName?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class ExpenseListResponseDto {
    expenses: ExpenseResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export declare class ExpenseSummaryResponseDto {
    totalSpent: number;
    totalExpenses: number;
    averageExpense: number;
    topCategory: string;
    lastExpenseDate: Date;
}
export declare class VerifyReceiptResponseDto {
    verified: boolean;
    confidence: number;
}
export declare class InsightResponseDto {
    totalSpent: number;
    averagePerExpense: number;
    expenseCount: number;
    categories: Record<string, number>;
    dailyBreakdown: Record<string, number>;
}
