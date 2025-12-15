// src/expense/entities/expense.entity.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type ExpenseDocument = Expense & Document;

@Schema({ timestamps: true })
export class Expense {
  @ApiProperty({ description: 'Expense ID' })
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Group', required: true, index: true })
  @ApiProperty({ description: 'Group ID' })
  groupId: Types.ObjectId;

  @Prop({ type: String, required: true, trim: true, maxlength: 200 })
  @ApiProperty({ description: 'Expense title' })
  title: string;

  @Prop({ type: String, trim: true, maxlength: 500 })
  @ApiProperty({ description: 'Expense description', required: false })
  description?: string;

  @Prop({ type: Number, required: true, min: 0.01 })
  @ApiProperty({ description: 'Total expense amount' })
  amount: number;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  @ApiProperty({ description: 'User who paid for the expense' })
  paidByUserId: Types.ObjectId;

  @Prop({ type: Date, required: true, default: Date.now })
  @ApiProperty({ description: 'Expense date' })
  date: Date;

  @Prop({
    type: String,
    enum: ['food', 'transport', 'accommodation', 'shopping', 'entertainment', 'bills', 'health', 'education', 'other']
  })
  @ApiProperty({ description: 'Expense category', required: false })
  category?: string;

  @Prop({
    type: String,
    required: true,
    enum: ['equal', 'percentage', 'exact', 'shares', 'adjustment']
  })
  @ApiProperty({ description: 'Split type' })
  splitType: string;

  @Prop({
    type: [{
      userId: { type: Types.ObjectId, ref: 'User', required: true },
      amount: { type: Number, required: false },
      percentage: { type: Number, required: false, min: 0, max: 100 },
      shares: { type: Number, required: false },
      note: { type: String, maxlength: 200 }
    }],
    required: true,
    validate: {
      validator: function(splits: any[]) {
        return splits && splits.length >= 2;
      },
      message: 'At least 2 members must be included in expense splits'
    }
  })
  @ApiProperty({ description: 'Expense splits' })
  splits: Array<{
    userId: Types.ObjectId;
    amount?: number;
    percentage?: number;
    shares?: number;
    note?: string;
  }>;

  @Prop({ type: String })
  @ApiProperty({ description: 'Receipt image URL', required: false })
  receiptImageUrl?: string;

  @Prop({ type: String, maxlength: 200 })
  @ApiProperty({ description: 'Expense location', required: false })
  location?: string;

  @Prop({ type: [String] })
  @ApiProperty({ description: 'Tags for categorization', required: false })
  tags?: string[];

  @Prop({ type: Boolean, default: false })
  @ApiProperty({ description: 'Whether expense is verified' })
  verified: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  @ApiProperty({ description: 'Created by user ID' })
  createdByUserId: Types.ObjectId;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Update timestamp' })
  updatedAt: Date;
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);

// Add indexes for better query performance
ExpenseSchema.index({ groupId: 1, date: -1 });
ExpenseSchema.index({ groupId: 1, paidByUserId: 1 });
ExpenseSchema.index({ groupId: 1, category: 1 });
ExpenseSchema.index({ 'splits.userId': 1 });