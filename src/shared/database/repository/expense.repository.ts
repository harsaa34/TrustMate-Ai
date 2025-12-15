// src/shared/database/repository/expense.repository.ts - COMPLETE FIXED VERSION
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, FilterQuery, PipelineStage } from 'mongoose';
import { Expense, ExpenseDocument } from '../../../expense/expense.schema';
import { ExpenseDomain } from '../../../expense/expense.domain';
import { ExpenseMapper } from '../mapper/expense.mapper';
import { GetExpensesQueryDto } from '../../../expense/expense.dto';
import { 
  ExpenseNotFoundError,
  ExpenseValidationError,
  InvalidSplitError,
  UserNotInSplitError 
} from '../../../expense/expense.error';

export interface IExpenseRepository {
  // CRUD Operations
  create(expense: ExpenseDomain): Promise<ExpenseDomain>;
  findById(id: string, userId?: string): Promise<ExpenseDomain | null>;
  findAll(
    groupId: string,
    userId: string,
    query: GetExpensesQueryDto,
  ): Promise<{ expenses: ExpenseDomain[]; total: number; page: number; limit: number }>;
  update(id: string, expense: ExpenseDomain, userId: string): Promise<ExpenseDomain>;
  delete(id: string, userId: string): Promise<void>;
  
  // Business Operations
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
  
  getSpendingInsights(
    groupId: string,
    period: 'week' | 'month' | 'year'
  ): Promise<{
    totalAmount: number;
    averageAmount: number;
    count: number;
    categoryBreakdown: Record<string, number>;
    dailyBreakdown: Record<string, number>;
  }>;
  
  verifyReceipt(
    expenseId: string,
    verifyDto: any,
    userId: string
  ): Promise<{
    isVerified: boolean;
    confidenceScore: number;
    extractedAmount: number;
    extractedDate?: Date;
  }>;
  
  // Validation
  validateSplits(expense: ExpenseDomain): void;
  
  // Existence checks
  existsById(id: string): Promise<boolean>;
  userHasAccess(expenseId: string, userId: string): Promise<boolean>;
}

@Injectable()
export class ExpenseRepository implements IExpenseRepository {
  constructor(
    @InjectModel(Expense.name) private expenseModel: Model<ExpenseDocument>,
  ) {}

  /**
   * Create a new expense
   */
  async create(expense: ExpenseDomain): Promise<ExpenseDomain> {
    // Validate splits
    this.validateSplits(expense);

    const expenseData = ExpenseMapper.toEntity(expense);
    const createdExpense = await this.expenseModel.create(expenseData);
    
    // Populate references
    const populated = await this.expenseModel
      .findById(createdExpense._id)
      .populate('paidByUserId', 'name email avatar')
      .populate('createdByUserId', 'name email')
      .exec();

    const domain = ExpenseMapper.toDomain(populated!);
    if (!domain) {
      throw new Error('Failed to create expense domain');
    }
    return domain;
  }

  /**
   * Find expense by ID with access control
   */
  async findById(id: string, userId?: string): Promise<ExpenseDomain | null> {
    const expense = await this.expenseModel
      .findById(id)
      .populate('paidByUserId', 'name email avatar')
      .populate('createdByUserId', 'name email')
      .exec();

    if (!expense) {
      throw new ExpenseNotFoundError(id);
    }

    // Check if user has access to this expense
    if (userId) {
      const hasAccess = await this.userHasAccess(id, userId);
      if (!hasAccess) {
        throw new ExpenseValidationError('You do not have access to this expense');
      }
    }

    return ExpenseMapper.toDomain(expense)!;
  }

  /**
   * Find all expenses with filters and pagination
   */
  async findAll(
    groupId: string,
    userId: string,
    query: GetExpensesQueryDto,
  ): Promise<{ expenses: ExpenseDomain[]; total: number; page: number; limit: number }> {
    const {
      category,
      fromDate,
      toDate,
      paidByUserId,
      verified,
      search,
      sortBy = 'date',
      sortOrder = 'desc',
      page = 1,
      limit = 20
    } = query;

    const skip = (page - 1) * limit;

    // Build filter
    const filter: FilterQuery<ExpenseDocument> = {
      groupId: new Types.ObjectId(groupId),
      isActive: true
    };

    // Add user-specific filter (only show expenses where user is involved)
    const userObjectId = new Types.ObjectId(userId);
    filter.$or = [
      { 'splits.userId': userObjectId },
      { paidByUserId: userObjectId },
      { createdByUserId: userObjectId }
    ];

    if (category) filter.category = category;
    if (paidByUserId) filter.paidByUserId = new Types.ObjectId(paidByUserId);
    if (verified !== undefined) filter.verified = verified;
    
    if (fromDate || toDate) {
      filter.date = {};
      if (fromDate) filter.date.$gte = fromDate;
      if (toDate) filter.date.$lte = toDate;
    }

    // Handle search separately to avoid TypeScript errors
    let finalFilter = filter;
    if (search) {
      finalFilter = {
        $and: [
          filter,
          {
            $or: [
              { title: { $regex: search, $options: 'i' } },
              { description: { $regex: search, $options: 'i' } }
            ]
          }
        ]
      } as FilterQuery<ExpenseDocument>;
    }

    // Build sort
    const sort: any = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const [expenses, total] = await Promise.all([
      this.expenseModel
        .find(finalFilter)
        .populate('paidByUserId', 'name email avatar')
        .populate('createdByUserId', 'name email')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.expenseModel.countDocuments(finalFilter)
    ]);

    const expenseDomains = expenses
      .map(expense => ExpenseMapper.toDomain(expense))
      .filter(Boolean) as ExpenseDomain[];

    return {
      expenses: expenseDomains,
      total,
      page,
      limit
    };
  }

  /**
   * Update an expense
   */
  async update(
    id: string,
    expense: ExpenseDomain,
    userId: string,
  ): Promise<ExpenseDomain> {
    // Check if user is the creator
    const existing = await this.findById(id, userId);
    if (!existing || existing.createdByUserId !== userId) {
      throw new ExpenseValidationError('Only the expense creator can update it');
    }

    // Validate splits
    this.validateSplits(expense);

    const updateData = ExpenseMapper.toEntity(expense);
    const updatedExpense = await this.expenseModel
      .findByIdAndUpdate(id, { ...updateData, isActive: true }, { new: true })
      .populate('paidByUserId', 'name email avatar')
      .populate('createdByUserId', 'name email')
      .exec();

    if (!updatedExpense) {
      throw new ExpenseNotFoundError(id);
    }

    const domain = ExpenseMapper.toDomain(updatedExpense);
    if (!domain) {
      throw new Error('Failed to update expense domain');
    }
    return domain;
  }

  /**
   * Delete an expense (soft delete)
   */
  async delete(id: string, userId: string): Promise<void> {
    // Check if user is the creator
    const expense = await this.findById(id, userId);
    if (!expense || expense.createdByUserId !== userId) {
      throw new ExpenseValidationError('Only the expense creator can delete it');
    }

    const result = await this.expenseModel.updateOne(
      { _id: id }, 
      { isActive: false }
    );
    
    if (result.modifiedCount === 0) {
      throw new ExpenseNotFoundError(id);
    }
  }

  /**
   * Calculate balances for all group members
   */
  async calculateBalances(groupId: string): Promise<Array<{
    userId: string;
    balance: number;
    currency: string;
  }>> {
    const pipeline: PipelineStage[] = [
      {
        $match: {
          groupId: new Types.ObjectId(groupId),
          verified: true,
          isActive: true
        }
      },
      {
        $unwind: '$splits'
      },
      {
        $group: {
          _id: '$splits.userId',
          totalOwed: { $sum: '$splits.amount' }
        }
      },
      {
        $lookup: {
          from: 'expenses',
          let: { userId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$groupId', new Types.ObjectId(groupId)] },
                    { $eq: ['$paidByUserId', '$$userId'] },
                    { $eq: ['$verified', true] },
                    { $eq: ['$isActive', true] }
                  ]
                }
              }
            },
            {
              $group: {
                _id: null,
                totalPaid: { $sum: '$amount' }
              }
            }
          ],
          as: 'paidExpenses'
        }
      },
      {
        $addFields: {
          totalPaid: { $ifNull: [{ $arrayElemAt: ['$paidExpenses.totalPaid', 0] }, 0] }
        }
      },
      {
        $project: {
          userId: { $toString: '$_id' },
          balance: { $subtract: ['$totalPaid', '$totalOwed'] },
          _id: 0
        }
      },
      { $sort: { balance: -1 } }
    ];

    const balances = await this.expenseModel.aggregate(pipeline);
    
    return balances.map(balance => ({
      ...balance,
      currency: 'USD'
    }));
  }

  /**
   * Get expense summary for a group
   */
  async getExpenseSummary(groupId: string, userId: string): Promise<{
    totalSpent: number;
    totalExpenses: number;
    averageExpense: number;
    topCategory: string;
    lastExpenseDate: Date;
  }> {
    const userObjectId = new Types.ObjectId(userId);
    const groupObjectId = new Types.ObjectId(groupId);

    const pipeline: PipelineStage[] = [
      {
        $match: {
          groupId: groupObjectId,
          isActive: true,
          $or: [
            { 'splits.userId': userObjectId },
            { paidByUserId: userObjectId }
          ]
        }
      },
      {
        $facet: {
          totalStats: [
            {
              $group: {
                _id: null,
                totalSpent: { $sum: '$amount' },
                totalExpenses: { $sum: 1 },
                averageExpense: { $avg: '$amount' }
              }
            }
          ],
          categoryStats: [
            {
              $group: {
                _id: '$category',
                total: { $sum: '$amount' }
              }
            },
            { $sort: { total: -1 } },
            { $limit: 1 }
          ],
          latestExpense: [
            { $sort: { date: -1 } },
            { $limit: 1 },
            { $project: { date: 1 } }
          ]
        }
      }
    ];

    const [result] = await this.expenseModel.aggregate(pipeline);

    return {
      totalSpent: result.totalStats[0]?.totalSpent || 0,
      totalExpenses: result.totalStats[0]?.totalExpenses || 0,
      averageExpense: result.totalStats[0]?.averageExpense || 0,
      topCategory: result.categoryStats[0]?._id || 'No expenses',
      lastExpenseDate: result.latestExpense[0]?.date || new Date()
    };
  }

  /**
   * Get spending insights for a group
   */
  async getSpendingInsights(
    groupId: string,
    period: 'week' | 'month' | 'year'
  ): Promise<{
    totalAmount: number;
    averageAmount: number;
    count: number;
    categoryBreakdown: Record<string, number>;
    dailyBreakdown: Record<string, number>;
  }> {
    const dateFilter = this.getDateFilter(period);
    const groupObjectId = new Types.ObjectId(groupId);

    const pipeline: PipelineStage[] = [
      {
        $match: {
          groupId: groupObjectId,
          isActive: true,
          date: dateFilter
        }
      },
      {
        $facet: {
          overallStats: [
            {
              $group: {
                _id: null,
                totalAmount: { $sum: '$amount' },
                averageAmount: { $avg: '$amount' },
                count: { $sum: 1 }
              }
            }
          ],
          categoryBreakdown: [
            {
              $group: {
                _id: '$category',
                total: { $sum: '$amount' }
              }
            }
          ],
          dailyBreakdown: [
            {
              $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
                total: { $sum: '$amount' }
              }
            },
            { $sort: { _id: 1 } }
          ]
        }
      }
    ];

    const [result] = await this.expenseModel.aggregate(pipeline);

    const categoryBreakdown: Record<string, number> = {};
    result.categoryBreakdown?.forEach(item => {
      categoryBreakdown[item._id || 'uncategorized'] = item.total;
    });

    const dailyBreakdown: Record<string, number> = {};
    result.dailyBreakdown?.forEach(item => {
      dailyBreakdown[item._id] = item.total;
    });

    return {
      totalAmount: result.overallStats[0]?.totalAmount || 0,
      averageAmount: result.overallStats[0]?.averageAmount || 0,
      count: result.overallStats[0]?.count || 0,
      categoryBreakdown,
      dailyBreakdown
    };
  }

  /**
   * Verify receipt for an expense
   */
  async verifyReceipt(
    expenseId: string,
    verifyDto: any,
    userId: string
  ): Promise<{
    isVerified: boolean;
    confidenceScore: number;
    extractedAmount: number;
    extractedDate?: Date;
  }> {
    const expense = await this.findById(expenseId, userId);

    if (!expense || expense.createdByUserId !== userId) {
      throw new ExpenseValidationError('Only the expense creator can verify it');
    }

    const amountDifference = Math.abs(expense.amount - verifyDto.extractedAmount);
    const amountTolerance = expense.amount * 0.05;
    
    const isVerified = amountDifference <= amountTolerance;
    const confidenceScore = isVerified ? 
      Math.max(0.8, 1 - (amountDifference / expense.amount)) : 
      Math.min(0.3, 1 - (amountDifference / expense.amount));

    // Use optional chaining for receiptImageUrl
    const receiptImageUrl = verifyDto.receiptImageUrl || expense.receiptImageUrl;

    await this.expenseModel.updateOne(
      { _id: expenseId },
      { 
        verified: isVerified,
        receiptImageUrl
      }
    );

    return {
      isVerified,
      confidenceScore,
      extractedAmount: verifyDto.extractedAmount,
      extractedDate: verifyDto.extractedDate
    };
  }

  /**
   * Validate expense splits
   */
 // In src/shared/database/repository/expense.repository.ts
// Line 551 and the validateSplits method:

/**
 * Validate expense splits
 */
validateSplits(expense: ExpenseDomain): void {
  if (!expense.splits || expense.splits.length < 2) {
    throw new InvalidSplitError('At least 2 members must be included in expense splits');
  }

  // Check if paidByUserId is in splits
  const paidByInSplits = expense.splits.some(split => split.userId === expense.paidByUserId);
  if (!paidByInSplits) {
    // Pass both userId and expenseId as required
    throw new UserNotInSplitError(
      expense.paidByUserId, 
      expense.id || 'unknown-expense-id'
    );
  }

  // Validate split type specific rules
  if (expense.splitType === 'exact') {
    const totalSplitAmount = expense.splits.reduce((sum, split) => sum + (split.amount || 0), 0);
    if (Math.abs(totalSplitAmount - expense.amount) > 0.01) {
      throw new InvalidSplitError('Total split amounts must equal expense amount for exact splits');
    }
  }

  if (expense.splitType === 'percentage') {
    const totalPercentage = expense.splits.reduce((sum, split) => sum + (split.percentage || 0), 0);
    if (Math.abs(totalPercentage - 100) > 0.01) {
      throw new InvalidSplitError('Total percentages must equal 100% for percentage splits');
    }
  }
}

  /**
   * Check if expense exists
   */
  async existsById(id: string): Promise<boolean> {
    const count = await this.expenseModel.countDocuments({ _id: id, isActive: true });
    return count > 0;
  }

  /**
   * Check if user has access to expense
   */
  async userHasAccess(expenseId: string, userId: string): Promise<boolean> {
    const expense = await this.expenseModel.findById(expenseId);
    if (!expense) return false;

    const userObjectId = new Types.ObjectId(userId);
    const isMember = expense.splits.some(split => 
      split.userId.equals(userObjectId)
    );
    const isCreator = expense.createdByUserId?.equals(userObjectId) || false;
    
    return isMember || isCreator;
  }

  /**
   * Get date filter for period
   */
  private getDateFilter(period: 'week' | 'month' | 'year'): any {
    const now = new Date();
    const startDate = new Date();

    switch (period) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(now.getMonth() - 1);
    }

    return { $gte: startDate, $lte: now };
  }
}