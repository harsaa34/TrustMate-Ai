import { Model } from 'mongoose';
import { ExpenseDocument } from '../../../expense/expense.schema';
import { ExpenseDomain } from '../../../expense/expense.domain';
import { GetExpensesQueryDto } from '../../../expense/expense.dto';
export interface IExpenseRepository {
    create(expense: ExpenseDomain): Promise<ExpenseDomain>;
    findById(id: string, userId?: string): Promise<ExpenseDomain | null>;
    findAll(groupId: string, userId: string, query: GetExpensesQueryDto): Promise<{
        expenses: ExpenseDomain[];
        total: number;
        page: number;
        limit: number;
    }>;
    update(id: string, expense: ExpenseDomain, userId: string): Promise<ExpenseDomain>;
    delete(id: string, userId: string): Promise<void>;
    calculateBalances(groupId: string): Promise<Array<{
        userId: string;
        balance: number;
        currency: string;
    }>>;
    getExpenseSummary(groupId: string, userId: string): Promise<{
        totalSpent: number;
        totalExpenses: number;
        averageExpense: number;
        topCategory: string;
        lastExpenseDate: Date;
    }>;
    getSpendingInsights(groupId: string, period: 'week' | 'month' | 'year'): Promise<{
        totalAmount: number;
        averageAmount: number;
        count: number;
        categoryBreakdown: Record<string, number>;
        dailyBreakdown: Record<string, number>;
    }>;
    verifyReceipt(expenseId: string, verifyDto: any, userId: string): Promise<{
        isVerified: boolean;
        confidenceScore: number;
        extractedAmount: number;
        extractedDate?: Date;
    }>;
    validateSplits(expense: ExpenseDomain): void;
    existsById(id: string): Promise<boolean>;
    userHasAccess(expenseId: string, userId: string): Promise<boolean>;
}
export declare class ExpenseRepository implements IExpenseRepository {
    private expenseModel;
    constructor(expenseModel: Model<ExpenseDocument>);
    create(expense: ExpenseDomain): Promise<ExpenseDomain>;
    findById(id: string, userId?: string): Promise<ExpenseDomain | null>;
    findAll(groupId: string, userId: string, query: GetExpensesQueryDto): Promise<{
        expenses: ExpenseDomain[];
        total: number;
        page: number;
        limit: number;
    }>;
    update(id: string, expense: ExpenseDomain, userId: string): Promise<ExpenseDomain>;
    delete(id: string, userId: string): Promise<void>;
    calculateBalances(groupId: string): Promise<Array<{
        userId: string;
        balance: number;
        currency: string;
    }>>;
    getExpenseSummary(groupId: string, userId: string): Promise<{
        totalSpent: number;
        totalExpenses: number;
        averageExpense: number;
        topCategory: string;
        lastExpenseDate: Date;
    }>;
    getSpendingInsights(groupId: string, period: 'week' | 'month' | 'year'): Promise<{
        totalAmount: number;
        averageAmount: number;
        count: number;
        categoryBreakdown: Record<string, number>;
        dailyBreakdown: Record<string, number>;
    }>;
    verifyReceipt(expenseId: string, verifyDto: any, userId: string): Promise<{
        isVerified: boolean;
        confidenceScore: number;
        extractedAmount: number;
        extractedDate?: Date;
    }>;
    validateSplits(expense: ExpenseDomain): void;
    existsById(id: string): Promise<boolean>;
    userHasAccess(expenseId: string, userId: string): Promise<boolean>;
    private getDateFilter;
}
