// src/expense/expense.domain.ts - FIXED
export class ExpenseDomain {
  constructor(
    public id: string | null,
    public groupId: string,
    public title: string,
    public amount: number,
    public paidByUserId: string,
    public date: Date,
    public splitType: 'equal' | 'percentage' | 'exact' | 'shares' | 'adjustment',
    public splits: Array<{
      userId: string;
      amount?: number;
      percentage?: number;
      shares?: number;
      note?: string;
    }>,
    public createdByUserId: string,
    public description?: string,
    public category?: string,
    public receiptImageUrl?: string,
    public location?: string,
    public tags?: string[],
    public verified?: boolean,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}

  // Factory method to create new expense
  static create(data: {
    groupId: string;
    title: string;
    amount: number;
    paidByUserId: string;
    date: Date;
    splitType: 'equal' | 'percentage' | 'exact' | 'shares' | 'adjustment';
    splits: Array<{
      userId: string;
      amount?: number;
      percentage?: number;
      shares?: number;
      note?: string;
    }>;
    createdByUserId: string;
    description?: string;
    category?: string;
    receiptImageUrl?: string;
    location?: string;
    tags?: string[];
  }): ExpenseDomain {
    return new ExpenseDomain(
      null,
      data.groupId,
      data.title,
      data.amount,
      data.paidByUserId,
      data.date,
      data.splitType,
      data.splits,
      data.createdByUserId,
      data.description,
      data.category,
      data.receiptImageUrl,
      data.location,
      data.tags,
      false,
      new Date(),
      new Date()
    );
  }
}