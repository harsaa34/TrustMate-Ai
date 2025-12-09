import { Document, Types } from 'mongoose';
export type ExpenseDocument = Expense & Document;
export declare class Expense {
    _id: Types.ObjectId;
    groupId: Types.ObjectId;
    title: string;
    description?: string;
    amount: number;
    paidByUserId: Types.ObjectId;
    date: Date;
    category?: string;
    splitType: string;
    splits: Array<{
        userId: Types.ObjectId;
        amount?: number;
        percentage?: number;
        shares?: number;
        note?: string;
    }>;
    receiptImageUrl?: string;
    location?: string;
    tags?: string[];
    verified: boolean;
    createdByUserId: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export declare const ExpenseSchema: import("mongoose").Schema<Expense, import("mongoose").Model<Expense, any, any, any, Document<unknown, any, Expense, any, {}> & Expense & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Expense, Document<unknown, {}, import("mongoose").FlatRecord<Expense>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Expense> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
