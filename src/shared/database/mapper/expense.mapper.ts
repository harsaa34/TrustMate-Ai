// src/shared/database/mapper/expense.mapper.ts - FIXED
import { Types } from 'mongoose';
import { Expense, ExpenseDocument, ExpenseSplitType, ExpenseCategory, ExpenseSplit } from '../../../expense/expense.schema';
import { ExpenseDomain } from '../../../expense/expense.domain';

export class ExpenseMapper {
  static toDomain(expense: ExpenseDocument): ExpenseDomain | null {
    if (!expense) return null;

    return new ExpenseDomain(
      expense._id.toString(),
      expense.groupId.toString(),
      expense.title,
      expense.amount,
      expense.paidByUserId.toString(),
      expense.date,
      expense.splitType as any,
      expense.splits.map(split => ({
        userId: split.userId.toString(),
        amount: split.amount,
        percentage: split.percentage,
        shares: split.shares,
        note: split.note
      })),
      expense.createdByUserId.toString(),
      expense.description,
      expense.category as any,
      expense.receiptImageUrl,
      expense.location,
      expense.tags || [],
      expense.verified,
      expense.createdAt,
      expense.updatedAt
    );
  }

  static toEntity(domain: ExpenseDomain): Partial<Expense> {
    const splits: ExpenseSplit[] = domain.splits.map(split => {
      const expenseSplit: ExpenseSplit = {
        userId: new Types.ObjectId(split.userId),
        amount: split.amount || 0, // Ensure amount is not undefined
        ...(split.percentage !== undefined && { percentage: split.percentage }),
        ...(split.shares !== undefined && { shares: split.shares }),
        ...(split.note && { note: split.note }),
      };
      return expenseSplit;
    });

    return {
      groupId: new Types.ObjectId(domain.groupId),
      title: domain.title,
      description: domain.description,
      amount: domain.amount,
      paidByUserId: new Types.ObjectId(domain.paidByUserId),
      date: domain.date,
      category: domain.category as ExpenseCategory,
      splitType: domain.splitType as ExpenseSplitType,
      splits,
      receiptImageUrl: domain.receiptImageUrl,
      location: domain.location,
      tags: domain.tags,
      verified: domain.verified,
      createdByUserId: new Types.ObjectId(domain.createdByUserId),
      isActive: true
    };
  }
}