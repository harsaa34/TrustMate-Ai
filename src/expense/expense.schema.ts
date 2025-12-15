// src/expense/expense.schema.ts - CLEANED AND CORRECTED VERSION
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ExpenseDocument = Expense & Document;

export enum ExpenseSplitType {
  EQUAL = 'equal',
  PERCENTAGE = 'percentage',
  EXACT = 'exact',
  SHARES = 'shares',
  ADJUSTMENT = 'adjustment'
}

export enum ExpenseCategory {
  FOOD = 'food',
  TRANSPORT = 'transport',
  ACCOMMODATION = 'accommodation',
  SHOPPING = 'shopping',
  ENTERTAINMENT = 'entertainment',
  BILLS = 'bills',
  HEALTH = 'health',
  EDUCATION = 'education',
  OTHER = 'other'
}

@Schema({ _id: false })
export class ExpenseSplit {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Number, required: true, min: 0 })
  amount: number;

  @Prop({ type: Number, min: 0 })
  percentage?: number;

  @Prop({ type: Number, min: 0 })
  shares?: number;

  @Prop({ type: String, maxlength: 200 })
  note?: string;
}

export const ExpenseSplitSchema = SchemaFactory.createForClass(ExpenseSplit);

@Schema({ timestamps: true })
export class Expense {
  @Prop({ type: Types.ObjectId, ref: 'Group', required: true, index: true })
  groupId: Types.ObjectId;

  @Prop({ type: String, required: true, trim: true, maxlength: 200 })
  title: string;

  @Prop({ type: String, trim: true, maxlength: 500 })
  description?: string;

  @Prop({ type: Number, required: true, min: 0.01 })
  amount: number;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  paidByUserId: Types.ObjectId;

  @Prop({ type: Date, required: true, default: Date.now })
  date: Date;

  @Prop({ 
    type: String, 
    enum: Object.values(ExpenseCategory), 
    default: ExpenseCategory.OTHER 
  })
  category: ExpenseCategory;

  @Prop({ 
    type: String, 
    enum: Object.values(ExpenseSplitType), 
    default: ExpenseSplitType.EQUAL,
    required: true 
  })
  splitType: ExpenseSplitType;

  @Prop({ type: [ExpenseSplitSchema], required: true })
  splits: ExpenseSplit[];

  // Receipt verification
  @Prop({ type: Boolean, default: false })
  verified: boolean;

  @Prop({ type: String })
  receiptImageUrl?: string;

  @Prop({ type: Types.ObjectId, ref: 'ReceiptVerification' })
  verificationId?: Types.ObjectId;

  // Metadata
  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({ type: String, maxlength: 200 })
  location?: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  // ADD THIS - Created by user
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdByUserId: Types.ObjectId;

  // Timestamps (already included via timestamps: true)
  createdAt: Date;
  updatedAt: Date;
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);

// Create indexes
ExpenseSchema.index({ groupId: 1, date: -1 });
ExpenseSchema.index({ groupId: 1, paidByUserId: 1 });
ExpenseSchema.index({ groupId: 1, category: 1 });
ExpenseSchema.index({ verified: 1 });
ExpenseSchema.index({ createdByUserId: 1 });