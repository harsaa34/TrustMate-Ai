// src/expense/expense.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Expense, ExpenseDocument } from './expense.schema';
import { Group, GroupDocument } from '../group/group.schema';
import { User, UserDocument } from '../user/schemas/user.schema';
import {
  CreateExpenseDto,
  UpdateExpenseDto,
  VerifyReceiptDto,
} from './expense.dto';
import {
  ExpenseResponse,
  ExpenseSummary,
  Balance,
  ReceiptVerificationResponse,
  ExpenseInsights,
} from './expense.type';
import {
  ExpenseNotFoundError,
  ExpenseValidationError,
  InvalidSplitError,
} from './expense.error';
import { GroupNotFoundError, UserNotMemberError } from '../group/group.error';

@Injectable()
export class ExpenseService {
  private readonly _logger = new Logger(ExpenseService.name);

  constructor(
    @InjectModel(Expense.name) private readonly expenseModel: Model<ExpenseDocument>,
    @InjectModel(Group.name) private readonly groupModel: Model<GroupDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  // CREATE EXPENSE
  async createExpense(
    groupId: string,
    createDto: CreateExpenseDto,
    createdByUserId: string,
  ): Promise<ExpenseResponse> {
    const group = await this.groupModel.findOne({
      _id: groupId,
      isActive: true,
    }).populate('members.userId', 'name email avatar');

    if (!group) {
      throw new GroupNotFoundError(groupId);
    }

    const isMember = group.members.some(member => 
      member.userId['_id'].toString() === createdByUserId
    );

    if (!isMember) {
      throw new UserNotMemberError(createdByUserId, groupId);
    }

    const isPaidByMember = group.members.some(member => 
      member.userId['_id'].toString() === createDto.paidByUserId
    );

    if (!isPaidByMember) {
      throw new ExpenseValidationError('Payer must be a group member');
    }

    await this.validateExpenseSplits(group, createDto);
    const calculatedSplits = this.calculateSplits(createDto);

    const expense = await this.expenseModel.create({
      groupId: new Types.ObjectId(groupId),
      title: createDto.title,
      description: createDto.description,
      amount: createDto.amount,
      paidByUserId: new Types.ObjectId(createDto.paidByUserId),
      date: createDto.date || new Date(),
      category: createDto.category || 'other',
      splitType: createDto.splitType,
      splits: calculatedSplits,
      receiptImageUrl: createDto.receiptImageUrl,
      location: createDto.location,
      tags: createDto.tags || [],
      verified: false,
      createdByUserId: new Types.ObjectId(createdByUserId),
      isActive: true,
    });

    this._logger.log(`Expense created: ${expense._id}`);
    return this.mapToResponse(expense, group);
  }

  // GET EXPENSE BY ID
  async getExpenseById(expenseId: string, userId: string): Promise<ExpenseResponse> {
    const expense = await this.expenseModel
      .findOne({ _id: expenseId, isActive: true })
      .populate('paidByUserId', 'name email avatar')
      .populate('createdByUserId', 'name email');

    if (!expense) {
      throw new ExpenseNotFoundError(expenseId);
    }

    const group = await this.groupModel
      .findOne({ _id: expense.groupId, isActive: true })
      .populate('members.userId', 'name email avatar');

    if (!group) {
      throw new GroupNotFoundError(expense.groupId.toString());
    }

    const isMember = group.members.some(member => 
      member.userId['_id'].toString() === userId
    );

    if (!isMember) {
      throw new UserNotMemberError(userId, expense.groupId.toString());
    }

    return this.mapToResponse(expense, group);
  }

  // GET GROUP EXPENSES
  async getGroupExpenses(
    groupId: string,
    userId: string,
    filters?: any,
  ): Promise<{ expenses: ExpenseResponse[]; total: number; page: number; limit: number }> {
    const group = await this.groupModel.findOne({ _id: groupId, isActive: true });

    if (!group) {
      throw new GroupNotFoundError(groupId);
    }

    const isMember = group.members.some(member => 
      member.userId.toString() === userId
    );

    if (!isMember) {
      throw new UserNotMemberError(userId, groupId);
    }

    const query: any = { groupId: new Types.ObjectId(groupId), isActive: true };

    if (filters?.category) query.category = filters.category;
    if (filters?.fromDate || filters?.toDate) {
      query.date = {};
      if (filters.fromDate) query.date.$gte = filters.fromDate;
      if (filters.toDate) query.date.$lte = filters.toDate;
    }
    if (filters?.paidByUserId) query.paidByUserId = new Types.ObjectId(filters.paidByUserId);
    if (filters?.verified !== undefined) query.verified = filters.verified;
    if (filters?.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
      ];
    }

    const sort: any = {};
    const sortField = filters?.sortBy || 'date';
    const sortDirection = filters?.sortOrder === 'asc' ? 1 : -1;
    sort[sortField] = sortDirection;

    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const skip = (page - 1) * limit;

    const [expenses, total] = await Promise.all([
      this.expenseModel
        .find(query)
        .populate('paidByUserId', 'name email avatar')
        .populate('createdByUserId', 'name email')
        .sort(sort)
        .skip(skip)
        .limit(limit),
      this.expenseModel.countDocuments(query),
    ]);

    const expenseResponses = await Promise.all(
      expenses.map(expense => this.mapToResponse(expense, group))
    );

    return { expenses: expenseResponses, total, page, limit };
  }

  // UPDATE EXPENSE
  async updateExpense(
    expenseId: string,
    updateDto: UpdateExpenseDto,
    userId: string,
  ): Promise<ExpenseResponse> {
    const expense = await this.expenseModel.findOne({ _id: expenseId, isActive: true });

    if (!expense) {
      throw new ExpenseNotFoundError(expenseId);
    }

    const group = await this.groupModel
      .findOne({ _id: expense.groupId, isActive: true })
      .populate('members.userId', 'name email avatar');

    if (!group) {
      throw new GroupNotFoundError(expense.groupId.toString());
    }

    const isCreator = expense.createdByUserId.toString() === userId;
    const isAdmin = group.members.some(member => 
      member.userId['_id'].toString() === userId && member.role === 'admin'
    );

    if (!isCreator && !isAdmin) {
      throw new UserNotMemberError(userId, expense.groupId.toString());
    }

    const updateData: any = { ...updateDto };

    if (updateDto.splits) {
      const validateDto: CreateExpenseDto = {
        title: updateDto.title || expense.title,
        description: updateDto.description || expense.description,
        amount: updateDto.amount || expense.amount,
        paidByUserId: expense.paidByUserId.toString(),
        date: updateDto.date || expense.date,
        category: updateDto.category || expense.category,
        splitType: updateDto.splitType || expense.splitType,
        splits: updateDto.splits,
      };
      
      await this.validateExpenseSplits(group, validateDto);
      updateData.splits = this.calculateSplits(validateDto);
    }

    const updatedExpense = await this.expenseModel
      .findByIdAndUpdate(expenseId, updateData, { new: true })
      .populate('paidByUserId', 'name email avatar')
      .populate('createdByUserId', 'name email');

    if (!updatedExpense) {
      throw new ExpenseNotFoundError(expenseId);
    }

    return this.mapToResponse(updatedExpense, group);
  }

  // DELETE EXPENSE
  async deleteExpense(expenseId: string, userId: string): Promise<void> {
    const expense = await this.expenseModel.findOne({ _id: expenseId, isActive: true });

    if (!expense) {
      throw new ExpenseNotFoundError(expenseId);
    }

    const group = await this.groupModel.findOne({ _id: expense.groupId, isActive: true });

    if (!group) {
      throw new GroupNotFoundError(expense.groupId.toString());
    }

    const isCreator = expense.createdByUserId.toString() === userId;
    const isAdmin = group.members.some(member => 
      member.userId.toString() === userId && member.role === 'admin'
    );

    if (!isCreator && !isAdmin) {
      throw new UserNotMemberError(userId, expense.groupId.toString());
    }

    await this.expenseModel.findByIdAndUpdate(expenseId, { isActive: false });
  }

  // VERIFY RECEIPT
  async verifyReceipt(
    expenseId: string,
    verifyDto: VerifyReceiptDto,
    userId: string,
  ): Promise<{ verified: boolean; confidence: number }> {
    const expense = await this.expenseModel.findOne({ _id: expenseId, isActive: true });

    if (!expense) {
      throw new ExpenseNotFoundError(expenseId);
    }

    const group = await this.groupModel.findOne({ _id: expense.groupId, isActive: true });

    if (!group) {
      throw new GroupNotFoundError(expense.groupId.toString());
    }

    const isAdmin = group.members.some(member => 
      member.userId.toString() === userId && member.role === 'admin'
    );

    if (!isAdmin) {
      throw new UserNotMemberError(userId, expense.groupId.toString());
    }

    const amountDifference = Math.abs(expense.amount - verifyDto.extractedAmount);
    const isMatch = amountDifference < 0.01;

    await this.expenseModel.findByIdAndUpdate(expenseId, { verified: isMatch });

    return {
      verified: isMatch,
      confidence: verifyDto.confidenceScore || 0.9,
    };
  }

  // CALCULATE BALANCES
  async calculateBalances(groupId: string): Promise<Balance[]> {
    const group = await this.groupModel
      .findById(groupId)
      .populate('members.userId', 'name email avatar');

    if (!group) {
      throw new GroupNotFoundError(groupId);
    }

    const balances = new Map<string, Balance>();

    group.members.forEach(member => {
      const userId = member.userId['_id'].toString();
      balances.set(userId, {
        userId,
        userName: member.userId['name'],
        amount: 0,
        paidAmount: 0,
        owedAmount: 0,
      });
    });

    const expenses = await this.expenseModel.find({
      groupId: new Types.ObjectId(groupId),
      isActive: true,
    });

    expenses.forEach(expense => {
      const paidByUserId = expense.paidByUserId.toString();
      if (balances.has(paidByUserId)) {
        const balance = balances.get(paidByUserId)!;
        balance.paidAmount += expense.amount;
        balance.amount += expense.amount;
      }

      expense.splits.forEach(split => {
        const splitUserId = split.userId.toString();
        if (balances.has(splitUserId)) {
          const balance = balances.get(splitUserId)!;
          balance.owedAmount += split.amount;
          balance.amount -= split.amount;
        }
      });
    });

    return Array.from(balances.values()).sort((a, b) => b.amount - a.amount);
  }

  // GET EXPENSE SUMMARY
  async getExpenseSummary(
    groupId: string,
    userId: string
  ): Promise<{
    totalSpent: number;
    totalExpenses: number;
    averageExpense: number;
    topCategory: string;
    lastExpenseDate: Date;
  }> {
    const group = await this.groupModel
      .findOne({ _id: groupId, isActive: true })
      .populate('members.userId', 'name email avatar');

    if (!group) {
      throw new GroupNotFoundError(groupId);
    }

    const isMember = group.members.some(member => 
      member.userId['_id'].toString() === userId
    );

    if (!isMember) {
      throw new UserNotMemberError(userId, groupId);
    }

    const expenses = await this.expenseModel
      .find({ groupId: new Types.ObjectId(groupId), isActive: true })
      .sort({ date: -1 });

    const totalExpenses = expenses.length;
    const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const averageExpense = totalExpenses > 0 ? totalSpent / totalExpenses : 0;

    const categoryMap = new Map<string, number>();
    expenses.forEach(expense => {
      const current = categoryMap.get(expense.category) || 0;
      categoryMap.set(expense.category, current + expense.amount);
    });

    let topCategory = 'No expenses';
    let maxAmount = 0;
    categoryMap.forEach((amount, category) => {
      if (amount > maxAmount) {
        maxAmount = amount;
        topCategory = category;
      }
    });

    const lastExpenseDate = expenses.length > 0 ? expenses[0].date : new Date();

    return {
      totalSpent,
      totalExpenses,
      averageExpense,
      topCategory,
      lastExpenseDate,
    };
  }

  // GET SPENDING INSIGHTS
  async getSpendingInsights(
    groupId: string,
    period: 'week' | 'month' | 'year' = 'month'
  ): Promise<{
    totalSpent: number;
    averagePerExpense: number;
    expenseCount: number;
    categories: Record<string, number>;
    dailyBreakdown: Record<string, number>;
  }> {
    const group = await this.groupModel.findById(groupId);
    if (!group) {
      throw new GroupNotFoundError(groupId);
    }

    const now = new Date();
    let startDate = new Date();
    
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
    }

    const expenses = await this.expenseModel.find({
      groupId: new Types.ObjectId(groupId),
      isActive: true,
      date: { $gte: startDate, $lte: now },
    });

    const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const expenseCount = expenses.length;
    const averagePerExpense = expenseCount > 0 ? totalSpent / expenseCount : 0;

    const categories: Record<string, number> = {};
    expenses.forEach(expense => {
      const current = categories[expense.category] || 0;
      categories[expense.category] = current + expense.amount;
    });

    const dailyBreakdown: Record<string, number> = {};
    expenses.forEach(expense => {
      const dateKey = expense.date.toISOString().split('T')[0];
      const current = dailyBreakdown[dateKey] || 0;
      dailyBreakdown[dateKey] = current + expense.amount;
    });

    return {
      totalSpent,
      averagePerExpense,
      expenseCount,
      categories,
      dailyBreakdown,
    };
  }

  // HELPER: Validate splits
  private async validateExpenseSplits(group: GroupDocument, createDto: CreateExpenseDto): Promise<void> {
    const { splits, splitType, amount, paidByUserId } = createDto;

    if (splits.length < 2) {
      throw new InvalidSplitError('At least 2 members must be included in expense splits');
    }

    const paidByInSplits = splits.some(split => split.userId === paidByUserId);
    if (!paidByInSplits) {
      throw new InvalidSplitError('The user who paid must be included in the splits');
    }

    for (const split of splits) {
      const isMember = group.members.some(member => 
        member.userId['_id'].toString() === split.userId
      );

      if (!isMember) {
        throw new InvalidSplitError(`User ${split.userId} is not a group member`);
      }
    }

    switch (splitType) {
      case 'equal':
        break;
      case 'exact':
        const exactTotal = splits.reduce((sum, split) => sum + (split.amount || 0), 0);
        if (Math.abs(exactTotal - amount) > 0.01) {
          throw new InvalidSplitError(`Sum of exact amounts (${exactTotal}) does not match total amount (${amount})`);
        }
        break;
      case 'percentage':
        const percentageTotal = splits.reduce((sum, split) => sum + (split.percentage || 0), 0);
        if (Math.abs(percentageTotal - 100) > 0.01) {
          throw new InvalidSplitError(`Sum of percentages (${percentageTotal}) does not equal 100%`);
        }
        break;
      case 'shares':
        const hasShares = splits.every(split => split.shares !== undefined);
        if (!hasShares) {
          throw new InvalidSplitError('All splits must have shares for shares split type');
        }
        break;
    }
  }

  // HELPER: Calculate splits
  private calculateSplits(createDto: CreateExpenseDto): any[] {
    const { splits, splitType, amount } = createDto;

    switch (splitType) {
      case 'equal':
        const equalAmount = amount / splits.length;
        return splits.map(split => ({
          userId: new Types.ObjectId(split.userId),
          amount: parseFloat(equalAmount.toFixed(2)),
          note: split.note,
        }));

      case 'exact':
        return splits.map(split => ({
          userId: new Types.ObjectId(split.userId),
          amount: split.amount!,
          note: split.note,
        }));

      case 'percentage':
        return splits.map(split => ({
          userId: new Types.ObjectId(split.userId),
          amount: parseFloat(((split.percentage! / 100) * amount).toFixed(2)),
          percentage: split.percentage,
          note: split.note,
        }));

      case 'shares':
        const totalShares = splits.reduce((sum, split) => sum + (split.shares || 0), 0);
        return splits.map(split => ({
          userId: new Types.ObjectId(split.userId),
          amount: parseFloat(((split.shares! / totalShares) * amount).toFixed(2)),
          shares: split.shares,
          note: split.note,
        }));

      default:
        return splits.map(split => ({
          userId: new Types.ObjectId(split.userId),
          amount: split.amount!,
          note: split.note,
        }));
    }
  }

  // HELPER: Map to response
  private async mapToResponse(expense: ExpenseDocument, group?: GroupDocument): Promise<ExpenseResponse> {
    if (!group) {
      const foundGroup = await this.groupModel.findById(expense.groupId).populate('members.userId', 'name email avatar');
      if (!foundGroup) {
        throw new GroupNotFoundError(expense.groupId.toString());
      }
      group = foundGroup;
    }

    const paidByUser = group.members.find(m => 
      m.userId['_id'].toString() === expense.paidByUserId.toString()
    )?.userId;

    const createdByUser = group.members.find(m => 
      m.userId['_id'].toString() === expense.createdByUserId.toString()
    )?.userId;

    const splits = expense.splits.map(split => {
      const user = group!.members.find(m => 
        m.userId['_id'].toString() === split.userId.toString()
      )?.userId;

      return {
        userId: split.userId.toString(),
        amount: split.amount,
        ...(split.percentage !== undefined && { percentage: split.percentage }),
        ...(split.shares !== undefined && { shares: split.shares }),
        ...(split.note && { note: split.note }),
      };
    });

    return {
      id: expense._id.toString(),
      groupId: expense.groupId.toString(),
      title: expense.title,
      description: expense.description,
      amount: expense.amount,
      paidByUserId: expense.paidByUserId.toString(),
      paidByUserName: paidByUser?.['name'] || 'Unknown',
      date: expense.date,
      category: expense.category,
      splitType: expense.splitType,
      splits,
      verified: expense.verified,
      receiptImageUrl: expense.receiptImageUrl,
      location: expense.location,
      tags: expense.tags || [],
      createdByUserId: expense.createdByUserId.toString(),
      createdByUserName: createdByUser?.['name'] || 'Unknown',
      createdAt: expense.createdAt!,
      updatedAt: expense.updatedAt!,
    };
  }
}