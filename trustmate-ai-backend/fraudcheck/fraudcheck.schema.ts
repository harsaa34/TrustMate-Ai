import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

export enum FraudStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  FLAGGED = 'FLAGGED',
  UNDER_REVIEW = 'UNDER_REVIEW',
}

export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export type FraudCheckDocument = FraudCheck & Document;

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
export class FraudCheck {
  @Prop({ type: String, required: true, index: true })
  transactionId: string;

  @Prop({ type: Number, required: true, min: 0 })
  amount: number;

  @Prop({ type: String, required: true, default: 'INR' })
  currency: string;

  @Prop({ type: String, required: true, index: true })
  merchantId: string;

  @Prop({ type: String, required: true, index: true })
  customerId: string;

  @Prop({ type: String, index: true })
  deviceId: string;

  @Prop({ type: String })
  ipAddress: string;

  @Prop({ type: SchemaTypes.Mixed })
  location: Record<string, any>;

  @Prop({ type: Number, required: true, min: 0, max: 100 })
  riskScore: number;

  @Prop({ type: String, enum: RiskLevel, required: true })
  riskLevel: RiskLevel;

  @Prop({ type: [String], default: [] })
  flags: string[];

  @Prop({ type: String, enum: FraudStatus, default: FraudStatus.PENDING })
  status: FraudStatus;

  @Prop({ type: SchemaTypes.Mixed })
  analysisResult: Record<string, any>;

  @Prop({ type: String })
  reviewNotes: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  reviewedBy: Types.ObjectId;

  @Prop({ type: Date })
  reviewedAt: Date;

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

export const FraudCheckSchema = SchemaFactory.createForClass(FraudCheck);

// Compound indexes for better query performance
FraudCheckSchema.index({ transactionId: 1, createdBy: 1 });
FraudCheckSchema.index({ merchantId: 1, status: 1 });
FraudCheckSchema.index({ customerId: 1, createdAt: -1 });
FraudCheckSchema.index({ riskLevel: 1, status: 1 });
FraudCheckSchema.index({ createdAt: -1 });
FraudCheckSchema.index({ riskScore: -1 });
FraudCheckSchema.index({ status: 1, isActive: 1 });
FraudCheckSchema.index({ createdBy: 1, isActive: 1, createdAt: -1 });