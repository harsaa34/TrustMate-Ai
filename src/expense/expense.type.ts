// src/expense/expense.type.ts - COMPLETELY FIXED
export interface ExpenseSplitResponse {
  userId: string;
  amount: number;
  percentage?: number;
  shares?: number;
  note?: string;
  userName?: string; // Make optional since DTO doesn't have it
}

export interface ExpenseResponse {
  id: string;
  groupId: string;
  title: string;
  description?: string;
  amount: number;
  paidByUserId: string;
  paidByUserName?: string; // Make optional
  date: Date;
  category: string;
  splitType: string;
  splits: ExpenseSplitResponse[];
  receiptImageUrl?: string;
  location?: string;
  tags?: string[]; // Make optional
  verified: boolean;
  createdByUserId: string; // ADD THIS - Required by DTO
  createdByUserName?: string; // ADD THIS - Optional in DTO
  createdAt: Date;
  updatedAt: Date;
}

export interface ExpenseSummary {
  totalSpent: number; // Match DTO field name
  totalExpenses: number;
  averageExpense: number;
  topCategory: string; // Required by DTO
  lastExpenseDate: Date; // Required by DTO
  byCategory?: Record<string, { count: number; amount: number }>; // Keep as extra
  byUser?: Array<{
    userId: string;
    userName: string;
    totalPaid: number;
    totalOwed: number;
    netBalance: number;
  }>; // Keep as extra
  recentExpenses?: ExpenseResponse[]; // Keep as extra
}

export interface Balance {
  userId: string;
  userName: string;
  amount: number;
  paidAmount: number;
  owedAmount: number;
  currency?: string; // Match DTO
}

export interface ReceiptVerificationResponse {
  verified: boolean; // Match DTO
  confidence: number; // Match DTO (was confidenceScore)
  extractedAmount?: number;
  enteredAmount?: number;
  mismatchReason?: string;
  suggestions?: string[];
  metadata?: Record<string, any>;
}

export interface ExpenseInsights {
  totalSpent: number;
  averagePerExpense: number; // Required by DTO
  expenseCount: number; // Required by DTO
  categories: Record<string, number>; // Required by DTO
  dailyBreakdown: Record<string, number>; // Required by DTO
  topCategories?: Array<{ category: string; amount: number; percentage: number }>;
  spendingTrend?: Array<{ period: string; amount: number }>;
  biggestExpense?: ExpenseResponse | null;
  mostFrequentCategory?: string;
  averagePerDay?: number;
  comparisonWithLastPeriod?: {
    changePercentage: number;
    increased: boolean;
  };
}