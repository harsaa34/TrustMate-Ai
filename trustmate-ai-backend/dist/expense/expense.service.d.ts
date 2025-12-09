import { Model } from 'mongoose';
import { ExpenseDocument } from './expense.schema';
import { GroupDocument } from '../group/group.schema';
import { UserDocument } from '../user/schemas/user.schema';
import { CreateExpenseDto, UpdateExpenseDto, VerifyReceiptDto } from './expense.dto';
import { ExpenseResponse, Balance } from './expense.type';
export declare class ExpenseService {
    private readonly expenseModel;
    private readonly groupModel;
    private readonly userModel;
    private readonly _logger;
    constructor(expenseModel: Model<ExpenseDocument>, groupModel: Model<GroupDocument>, userModel: Model<UserDocument>);
    createExpense(groupId: string, createDto: CreateExpenseDto, createdByUserId: string): Promise<ExpenseResponse>;
    getExpenseById(expenseId: string, userId: string): Promise<ExpenseResponse>;
    getGroupExpenses(groupId: string, userId: string, filters?: any): Promise<{
        expenses: ExpenseResponse[];
        total: number;
        page: number;
        limit: number;
    }>;
    updateExpense(expenseId: string, updateDto: UpdateExpenseDto, userId: string): Promise<ExpenseResponse>;
    deleteExpense(expenseId: string, userId: string): Promise<void>;
    verifyReceipt(expenseId: string, verifyDto: VerifyReceiptDto, userId: string): Promise<{
        verified: boolean;
        confidence: number;
    }>;
    calculateBalances(groupId: string): Promise<Balance[]>;
    getExpenseSummary(groupId: string, userId: string): Promise<{
        totalSpent: number;
        totalExpenses: number;
        averageExpense: number;
        topCategory: string;
        lastExpenseDate: Date;
    }>;
    getSpendingInsights(groupId: string, period?: 'week' | 'month' | 'year'): Promise<{
        totalSpent: number;
        averagePerExpense: number;
        expenseCount: number;
        categories: Record<string, number>;
        dailyBreakdown: Record<string, number>;
    }>;
    private validateExpenseSplits;
    private calculateSplits;
    private mapToResponse;
}
