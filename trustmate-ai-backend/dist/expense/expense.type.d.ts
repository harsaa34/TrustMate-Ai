export interface ExpenseSplitResponse {
    userId: string;
    amount: number;
    percentage?: number;
    shares?: number;
    note?: string;
    userName?: string;
}
export interface ExpenseResponse {
    id: string;
    groupId: string;
    title: string;
    description?: string;
    amount: number;
    paidByUserId: string;
    paidByUserName?: string;
    date: Date;
    category: string;
    splitType: string;
    splits: ExpenseSplitResponse[];
    receiptImageUrl?: string;
    location?: string;
    tags?: string[];
    verified: boolean;
    createdByUserId: string;
    createdByUserName?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface ExpenseSummary {
    totalSpent: number;
    totalExpenses: number;
    averageExpense: number;
    topCategory: string;
    lastExpenseDate: Date;
    byCategory?: Record<string, {
        count: number;
        amount: number;
    }>;
    byUser?: Array<{
        userId: string;
        userName: string;
        totalPaid: number;
        totalOwed: number;
        netBalance: number;
    }>;
    recentExpenses?: ExpenseResponse[];
}
export interface Balance {
    userId: string;
    userName: string;
    amount: number;
    paidAmount: number;
    owedAmount: number;
    currency?: string;
}
export interface ReceiptVerificationResponse {
    verified: boolean;
    confidence: number;
    extractedAmount?: number;
    enteredAmount?: number;
    mismatchReason?: string;
    suggestions?: string[];
    metadata?: Record<string, any>;
}
export interface ExpenseInsights {
    totalSpent: number;
    averagePerExpense: number;
    expenseCount: number;
    categories: Record<string, number>;
    dailyBreakdown: Record<string, number>;
    topCategories?: Array<{
        category: string;
        amount: number;
        percentage: number;
    }>;
    spendingTrend?: Array<{
        period: string;
        amount: number;
    }>;
    biggestExpense?: ExpenseResponse | null;
    mostFrequentCategory?: string;
    averagePerDay?: number;
    comparisonWithLastPeriod?: {
        changePercentage: number;
        increased: boolean;
    };
}
