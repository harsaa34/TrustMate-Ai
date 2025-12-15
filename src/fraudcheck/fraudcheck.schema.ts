import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

export enum FraudStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  FLAGGED = 'FLAGGED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  AUTO_VERIFIED = 'AUTO_VERIFIED',
  DISPUTED = 'DISPUTED',
}

export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum FraudCheckType {
  UPI_SCREENSHOT = 'UPI_SCREENSHOT',
  RECEIPT = 'RECEIPT',
  TRANSACTION = 'TRANSACTION',
  SETTLEMENT = 'SETTLEMENT',
  USER_BEHAVIOR = 'USER_BEHAVIOR',
  MANUAL = 'MANUAL',
}

export enum UpiAppType {
  GOOGLE_PAY = 'GOOGLE_PAY',
  PHONE_PE = 'PHONE_PE',
  PAYTM = 'PAYTM',
  BHIM = 'BHIM',
  AMAZON_PAY = 'AMAZON_PAY',
  WHATSAPP_PAY = 'WHATSAPP_PAY',
  OTHER = 'OTHER',
}

export type FraudCheckDocument = FraudCheck & Document;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
      const { _id, __v, ...rest } = ret;
      return { id: _id.toString(), ...rest };
    },
  },
  toObject: { virtuals: true },
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

  @Prop({
    type: String,
    enum: FraudCheckType,
    default: FraudCheckType.TRANSACTION,
    index: true,
  })
  checkType: FraudCheckType;

  @Prop({ type: SchemaTypes.Mixed })
  upiData?: {
    screenshotText?: string;
    extractedAmount?: number;
    extractedUpiId?: string;
    extractedTransactionId?: string;
    extractedBank?: string;
    extractedDate?: Date;
    ocrConfidence?: number;
    expectedAmount?: number;
    expectedUpiId?: string;
    expectedUserId?: string;
    amountMatch?: boolean;
    upiIdMatch?: boolean;
    timestampValid?: boolean;
    upiApp?: UpiAppType;
    appPatternsFound?: string[];
    upiFraudIndicators?: string[];
  };

  @Prop({ type: SchemaTypes.Mixed })
  receiptData?: {
    merchantName?: string;
    totalAmount?: number;
    taxAmount?: number;
    itemsCount?: number;
    ocrConfidence?: number;
    receiptDate?: Date;
    totalMatchesItems?: boolean;
    duplicateReceipt?: boolean;
    unusualItems?: string[];
  };

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Settlement', index: true })
  settlementId: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Group', index: true })
  groupId: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', index: true })
  payerId: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', index: true })
  receiverId: Types.ObjectId;

  @Prop({ type: SchemaTypes.Mixed })
  ocrProcessing?: {
    rawText?: string;
    processedText?: string;
    confidence?: number;
    processingTime?: number;
    language?: string;
    error?: string;
    containsUpiPatterns?: boolean;
    containsReceiptPatterns?: boolean;
    textQualityScore?: number;
  };

  @Prop({ type: Number, default: 0 })
  trustScoreImpact: number;

  @Prop({ type: Number, default: 0 })
  payerTrustScoreBefore: number;

  @Prop({ type: Number, default: 0 })
  payerTrustScoreAfter: number;

  @Prop({ type: Number, default: 0 })
  receiverTrustScoreBefore: number;

  @Prop({ type: Number, default: 0 })
  receiverTrustScoreAfter: number;

  @Prop({ type: Boolean, default: false })
  receiverConfirmed: boolean;

  @Prop({ type: Date })
  receiverConfirmedAt: Date;

  @Prop({ type: String })
  receiverConfirmationMethod?: string;

  @Prop({ type: Boolean, default: false })
  receiverDisputed: boolean;

  @Prop({ type: String })
  receiverDisputeReason?: string;

  @Prop({ type: Date })
  receiverDisputedAt: Date;

  @Prop({ type: SchemaTypes.Mixed })
  analysisResult: Record<string, any>;

  @Prop({ type: String })
  reviewNotes: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  reviewedBy: Types.ObjectId;

  @Prop({ type: Date })
  reviewedAt: Date;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', index: true })
  resolvedBy: Types.ObjectId;

  @Prop({ type: Date })
  resolvedAt: Date;

  @Prop({ type: String })
  resolutionNotes: string;

  @Prop({ type: [String], default: [] })
  evidenceUrls: string[];

  @Prop({ type: SchemaTypes.Mixed })
  additionalProofs?: {
    bankSmsText?: string;
    bankStatementUrl?: string;
    videoProofUrl?: string;
    additionalScreenshots?: string[];
  };

  @Prop({ type: Boolean, default: true, index: true })
  isActive: boolean;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  createdBy: Types.ObjectId;

  @Prop({ type: SchemaTypes.Mixed, default: {} })
  metadata: Record<string, any>;

  @Prop({ type: [SchemaTypes.Mixed], default: [] })
  auditTrail: Array<{
    action: string;
    performedBy: Types.ObjectId | 'SYSTEM';
    timestamp: Date;
    changes?: Record<string, any>;
    notes?: string;
  }>;

  @Prop({ type: Number })
  processingTimeMs: number;

  @Prop({ type: Number })
  decisionTimeMs: number;

  @Prop({ type: Boolean, default: false })
  isFalsePositive: boolean;

  @Prop({ type: Date })
  falsePositiveMarkedAt: Date;

  @Prop({ type: String })
  falsePositiveReason?: string;
}

export const FraudCheckSchema = SchemaFactory.createForClass(FraudCheck);

// ========== INDEXES ==========
FraudCheckSchema.index({ transactionId: 1, createdBy: 1 });
FraudCheckSchema.index({ merchantId: 1, status: 1 });
FraudCheckSchema.index({ customerId: 1, createdAt: -1 });
FraudCheckSchema.index({ riskLevel: 1, status: 1 });
FraudCheckSchema.index({ createdAt: -1 });
FraudCheckSchema.index({ riskScore: -1 });
FraudCheckSchema.index({ status: 1, isActive: 1 });
FraudCheckSchema.index({ createdBy: 1, isActive: 1, createdAt: -1 });
FraudCheckSchema.index({ checkType: 1, status: 1 });
FraudCheckSchema.index({ settlementId: 1, checkType: 1 });
FraudCheckSchema.index({ payerId: 1, receiverId: 1 });
FraudCheckSchema.index({ groupId: 1, createdAt: -1 });
FraudCheckSchema.index({ receiverConfirmed: 1, status: 1 });
FraudCheckSchema.index({ receiverDisputed: 1, status: 1 });
FraudCheckSchema.index({ 'upiData.extractedUpiId': 1 });
FraudCheckSchema.index({ 'upiData.extractedTransactionId': 1 });
FraudCheckSchema.index({ trustScoreImpact: -1 });
FraudCheckSchema.index({ isFalsePositive: 1, status: 1 });
FraudCheckSchema.index({ resolvedAt: 1, status: 1 });

// Text index
FraudCheckSchema.index(
  {
    'upiData.screenshotText': 'text',
    'ocrProcessing.rawText': 'text',
    'additionalProofs.bankSmsText': 'text',
  },
  {
    name: 'text_search_index',
    weights: {
      'upiData.screenshotText': 10,
      'ocrProcessing.rawText': 5,
      'additionalProofs.bankSmsText': 8,
    },
    default_language: 'english',
  },
);

// TTL index
FraudCheckSchema.index(
  { resolvedAt: 1 },
  {
    expireAfterSeconds: 90 * 24 * 60 * 60,
    partialFilterExpression: {
      status: { $in: ['APPROVED', 'REJECTED', 'AUTO_VERIFIED'] },
      isFalsePositive: false,
    },
  },
);

// ========== VIRTUAL PROPERTIES ==========
FraudCheckSchema.virtual('isResolved').get(function (this: any) {
  return (
    this.status === FraudStatus.APPROVED ||
    this.status === FraudStatus.REJECTED ||
    this.status === FraudStatus.AUTO_VERIFIED
  );
});

FraudCheckSchema.virtual('canAutoVerify').get(function (this: any) {
  return (
    this.riskScore < 30 &&
    this.upiData?.amountMatch &&
    this.upiData?.upiIdMatch
  );
});

FraudCheckSchema.virtual('requiresManualReview').get(function (this: any) {
  return (
    this.riskScore >= 60 ||
    (this.flags && this.flags.length >= 3) ||
    this.receiverDisputed ||
    !this.upiData?.amountMatch ||
    !this.upiData?.upiIdMatch
  );
});

FraudCheckSchema.virtual('requiresReceiverConfirmation').get(function (this: any) {
  return (
    this.checkType === FraudCheckType.UPI_SCREENSHOT &&
    !this.receiverConfirmed &&
    !this.receiverDisputed &&
    this.riskScore < 60
  );
});

FraudCheckSchema.virtual('verificationStatus').get(function (this: any) {
  if (this.status === FraudStatus.AUTO_VERIFIED) return 'VERIFIED';
  if (this.status === FraudStatus.APPROVED) return 'APPROVED';
  if (this.status === FraudStatus.REJECTED) return 'REJECTED';
  if (this.status === FraudStatus.DISPUTED) return 'DISPUTED';
  if (this.receiverDisputed) return 'RECEIVER_DISPUTED';
  
  const requiresManualReview = this.requiresManualReview;
  const requiresReceiverConfirmation = this.requiresReceiverConfirmation;
  
  if (requiresManualReview) return 'UNDER_REVIEW';
  if (requiresReceiverConfirmation) return 'PENDING_RECEIVER_CONFIRMATION';
  
  return 'PENDING';
});

// ========== INSTANCE METHODS ==========
FraudCheckSchema.methods.addFlag = function (flag: string) {
  if (!this.flags.includes(flag)) {
    this.flags.push(flag);
  }
};

FraudCheckSchema.methods.removeFlag = function (flag: string) {
  this.flags = this.flags.filter((f: string) => f !== flag);
};

FraudCheckSchema.methods.addEvidence = function (url: string) {
  if (!this.evidenceUrls.includes(url)) {
    this.evidenceUrls.push(url);
  }
};

FraudCheckSchema.methods.markAsFalsePositive = function (
  reason: string,
  userId: Types.ObjectId,
) {
  this.isFalsePositive = true;
  this.falsePositiveReason = reason;
  this.falsePositiveMarkedAt = new Date();
  this.auditTrail.push({
    action: 'MARKED_AS_FALSE_POSITIVE',
    performedBy: userId,
    timestamp: new Date(),
    notes: reason,
  });
};

FraudCheckSchema.methods.resolve = function (
  status: FraudStatus,
  notes: string,
  userId: Types.ObjectId,
) {
  this.status = status;
  this.resolvedAt = new Date();
  this.resolvedBy = userId;
  this.resolutionNotes = notes;

  this.auditTrail.push({
    action: `RESOLVED_AS_${status}`,
    performedBy: userId,
    timestamp: new Date(),
    notes,
  });
};

// ========== STATIC METHODS ==========
FraudCheckSchema.statics.findBySettlement = function (settlementId: string) {
  return this.find({ settlementId }).sort({ createdAt: -1 });
};

FraudCheckSchema.statics.getUserFraudStats = function (userId: string) {
  return this.aggregate([
    { $match: { createdBy: new Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        highRisk: {
          $sum: {
            $cond: [{ $in: ['$riskLevel', ['HIGH', 'CRITICAL']] }, 1, 0],
          },
        },
        disputed: {
          $sum: {
            $cond: [{ $eq: ['$receiverDisputed', true] }, 1, 0],
          },
        },
        falsePositives: {
          $sum: {
            $cond: [{ $eq: ['$isFalsePositive', true] }, 1, 0],
          },
        },
        avgRiskScore: { $avg: '$riskScore' },
        avgProcessingTime: { $avg: '$processingTimeMs' },
      },
    },
  ]);
};

FraudCheckSchema.statics.findSuspiciousUpiTransactions = function (
  days: number = 7,
) {
  const date = new Date();
  date.setDate(date.getDate() - days);

  return this.find({
    checkType: FraudCheckType.UPI_SCREENSHOT,
    createdAt: { $gte: date },
    $or: [
      { riskScore: { $gte: 60 } },
      { receiverDisputed: true },
      { 'upiData.amountMatch': false },
      { 'upiData.upiIdMatch': false },
      { flags: { $size: { $gt: 2 } } },
    ],
  }).sort({ riskScore: -1 });
};

// ========== INTERFACES ==========
import { Model } from 'mongoose';

export interface FraudCheckModel extends Model<FraudCheckDocument> {
  findBySettlement(settlementId: string): Promise<FraudCheckDocument[]>;
  getUserFraudStats(userId: string): Promise<any[]>;
  findSuspiciousUpiTransactions(days?: number): Promise<FraudCheckDocument[]>;
}