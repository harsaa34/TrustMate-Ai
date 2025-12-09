import { ExpenseService } from './expense.service';
import { CreateExpenseDto, UpdateExpenseDto, GetExpensesQueryDto, VerifyReceiptDto } from './expense.dto';
import { ExpenseResponseDto, ExpenseListResponseDto, InsightResponseDto } from './expense.dto';
import { BalanceResponseDto } from 'src/settlement/settlement.dto';
export declare class ExpenseController {
    private readonly expenseService;
    constructor(expenseService: ExpenseService);
    createExpense(groupId: string, createDto: CreateExpenseDto, createdByUserId: string): Promise<ExpenseResponseDto>;
    getGroupExpenses(groupId: string, userId: string, query: GetExpensesQueryDto): Promise<ExpenseListResponseDto>;
    getExpenseSummary(groupId: string, userId: string): Promise<{
        totalSpent: number;
        totalExpenses: number;
        averageExpense: number;
        topCategory: string;
        lastExpenseDate: Date;
    }>;
    getBalances(groupId: string): Promise<BalanceResponseDto[]>;
    getSpendingInsights(groupId: string, query: {
        period?: 'week' | 'month' | 'year';
    }): Promise<InsightResponseDto>;
    getExpenseById(groupId: string, expenseId: string, userId: string): Promise<ExpenseResponseDto>;
    updateExpense(groupId: string, expenseId: string, updateDto: UpdateExpenseDto, userId: string): Promise<ExpenseResponseDto>;
    deleteExpense(groupId: string, expenseId: string, userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    verifyReceipt(groupId: string, expenseId: string, verifyDto: VerifyReceiptDto, userId: string): Promise<{
        verified: boolean;
        confidence: number;
    }>;
    uploadReceipt(body: {
        file: any;
    }): Promise<{
        url: string;
        filename: string;
    }>;
}
