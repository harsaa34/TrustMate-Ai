import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UpiTransactionDocument = UpiTransaction & Document;

export enum UpiTransactionStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
  VERIFIED = 'verified',
  DISPUTED = 'disputed',
}

export enum UpiAppType {
  GOOGLE_PAY = 'google_pay',
  PHONE_PE = 'phone_pe',
  PAYTM = 'paytm',
  BHIM = 'bhim',
  OTHER = 'other',
}

@Schema({ timestamps: true })
export class UpiTransaction {
  @Prop({ required: true })
  transactionId: string;

  @Prop({ required: true })
  settlementId: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  senderUserId: string;

  @Prop({ required: true })
  receiverUserId: string;

  @Prop({ required: true })
  receiverUpiId: string;

  @Prop({ required: true })
  receiverName: string;

  @Prop()
  upiLink: string;

  @Prop()
  qrCodeData?: string;

  @Prop({
    type: String,
    enum: UpiTransactionStatus,
    default: UpiTransactionStatus.PENDING,
  })
  status: UpiTransactionStatus;

  @Prop({
    type: String,
    enum: UpiAppType,
  })
  upiAppUsed?: UpiAppType;

  @Prop()
  verificationProof?: {
    screenshotUrl?: string;
    ocrText?: string;
    extractedAmount?: number;
    extractedUpiId?: string;
    transactionId?: string;
    confidenceScore?: number;
    processedAt?: Date;
  };

  @Prop()
  callbackData?: {
    rawCallback?: string;
    parsedStatus?: string;
    callbackReceivedAt?: Date;
  };

  @Prop()
  verificationAttempts: {
    attempt: number;
    timestamp: Date;
    method: 'ocr' | 'manual' | 'callback';
    result: 'success' | 'failure';
    confidence?: number;
    notes?: string;
  }[];

  @Prop()
  trustScoreImpact: number;

  @Prop()
  notes?: string;

  @Prop()
  expiryTime?: Date;

  @Prop()
  verifiedAt?: Date;

  @Prop()
  failedAt?: Date;

  @Prop({ default: false })
  isAutoVerified: boolean;

  @Prop()
  metadata?: Record<string, any>;
}

export const UpiTransactionSchema = SchemaFactory.createForClass(UpiTransaction);

// Create indexes
UpiTransactionSchema.index({ transactionId: 1 }, { unique: true });
UpiTransactionSchema.index({ settlementId: 1 });
UpiTransactionSchema.index({ senderUserId: 1 });
UpiTransactionSchema.index({ receiverUserId: 1 });
UpiTransactionSchema.index({ status: 1 });
UpiTransactionSchema.index({ createdAt: 1 });
UpiTransactionSchema.index({ expiryTime: 1 }, { expireAfterSeconds: 0 }); // Auto-delete expired