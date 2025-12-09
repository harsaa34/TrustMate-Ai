import { Document, Types } from 'mongoose';
export declare enum FraudStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    FLAGGED = "FLAGGED",
    UNDER_REVIEW = "UNDER_REVIEW"
}
export declare enum RiskLevel {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    CRITICAL = "CRITICAL"
}
export type FraudCheckDocument = FraudCheck & Document;
export declare class FraudCheck {
    transactionId: string;
    amount: number;
    currency: string;
    merchantId: string;
    customerId: string;
    deviceId: string;
    ipAddress: string;
    location: Record<string, any>;
    riskScore: number;
    riskLevel: RiskLevel;
    flags: string[];
    status: FraudStatus;
    analysisResult: Record<string, any>;
    reviewNotes: string;
    reviewedBy: Types.ObjectId;
    reviewedAt: Date;
    isActive: boolean;
    createdBy: Types.ObjectId;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
export declare const FraudCheckSchema: import("mongoose").Schema<FraudCheck, import("mongoose").Model<FraudCheck, any, any, any, Document<unknown, any, FraudCheck, any, {}> & FraudCheck & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, FraudCheck, Document<unknown, {}, import("mongoose").FlatRecord<FraudCheck>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<FraudCheck> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
