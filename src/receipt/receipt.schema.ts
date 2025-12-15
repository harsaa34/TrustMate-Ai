import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

export enum ReceiptStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  PROCESSED = 'PROCESSED',
  ERROR = 'ERROR',
  ARCHIVED = 'ARCHIVED',
}

export type ReceiptDocument = Receipt & Document;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
      const { _id, ...rest } = ret;
      return { id: _id.toString(), ...rest };
    },
  },
})
export class Receipt {
  @Prop({ type: String, required: true, index: true })
  merchantName: string;

  @Prop({ type: Number, required: true, min: 0 })
  amount: number;

  @Prop({ type: String, default: 'INR' })
  currency: string;

  @Prop({ type: Date, index: true })
  transactionDate: Date;

  @Prop({ type: String })
  imageUrl: string;

  @Prop({ type: String })
  fileName: string;

  @Prop({ type: Number })
  fileSize: number;

  @Prop({ type: String })
  mimeType: string;

  @Prop({ type: SchemaTypes.Mixed })
  ocrData: Record<string, any>;

  @Prop({ type: SchemaTypes.Mixed })
  analysisResult: Record<string, any>;

  @Prop({ type: String, enum: ReceiptStatus, default: ReceiptStatus.PENDING })
  status: ReceiptStatus;

  @Prop({ type: Number, min: 0, max: 100 })
  confidenceScore: number;

  @Prop({ type: Date })
  processedAt: Date;

  @Prop({ type: String })
  paymentMethod: string;

  @Prop({ type: String })
  notes: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: Boolean, default: true, index: true })
  isActive: boolean;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true, index: true })
  createdBy: Types.ObjectId;

  @Prop({ type: SchemaTypes.Mixed, default: {} })
  metadata: Record<string, any>;

  // Virtual properties for timestamps
  createdAt: Date;
  updatedAt: Date;
}

export const ReceiptSchema = SchemaFactory.createForClass(Receipt);

// Compound indexes for better query performance
ReceiptSchema.index({ merchantName: 1, createdBy: 1 });
ReceiptSchema.index({ status: 1, createdBy: 1 });
ReceiptSchema.index({ transactionDate: -1 });
ReceiptSchema.index({ amount: 1 });
ReceiptSchema.index({ createdBy: 1, isActive: 1, createdAt: -1 });
ReceiptSchema.index({ tags: 1 });
ReceiptSchema.index({ 'analysisResult.category': 1 });
ReceiptSchema.index({ createdAt: -1, status: 1 });