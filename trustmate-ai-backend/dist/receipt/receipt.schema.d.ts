import { Document, Types } from 'mongoose';
export declare enum ReceiptStatus {
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    PROCESSED = "PROCESSED",
    ERROR = "ERROR",
    ARCHIVED = "ARCHIVED"
}
export type ReceiptDocument = Receipt & Document;
export declare class Receipt {
    merchantName: string;
    amount: number;
    currency: string;
    transactionDate: Date;
    imageUrl: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    ocrData: Record<string, any>;
    analysisResult: Record<string, any>;
    status: ReceiptStatus;
    confidenceScore: number;
    processedAt: Date;
    paymentMethod: string;
    notes: string;
    tags: string[];
    isActive: boolean;
    createdBy: Types.ObjectId;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
export declare const ReceiptSchema: import("mongoose").Schema<Receipt, import("mongoose").Model<Receipt, any, any, any, Document<unknown, any, Receipt, any, {}> & Receipt & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Receipt, Document<unknown, {}, import("mongoose").FlatRecord<Receipt>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Receipt> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
