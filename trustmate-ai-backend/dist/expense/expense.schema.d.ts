import { Document, Types } from 'mongoose';
export type ExpenseDocument = Expense & Document;
export declare enum ExpenseSplitType {
    EQUAL = "equal",
    PERCENTAGE = "percentage",
    EXACT = "exact",
    SHARES = "shares",
    ADJUSTMENT = "adjustment"
}
export declare enum ExpenseCategory {
    FOOD = "food",
    TRANSPORT = "transport",
    ACCOMMODATION = "accommodation",
    SHOPPING = "shopping",
    ENTERTAINMENT = "entertainment",
    BILLS = "bills",
    HEALTH = "health",
    EDUCATION = "education",
    OTHER = "other"
}
export declare class ExpenseSplit {
    userId: Types.ObjectId;
    amount: number;
    percentage?: number;
    shares?: number;
    note?: string;
}
export declare const ExpenseSplitSchema: import("mongoose").Schema<ExpenseSplit, import("mongoose").Model<ExpenseSplit, any, any, any, Document<unknown, any, ExpenseSplit, any, {}> & ExpenseSplit & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ExpenseSplit, Document<unknown, {}, import("mongoose").FlatRecord<ExpenseSplit>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<ExpenseSplit> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export declare class Expense {
    groupId: Types.ObjectId;
    title: string;
    description?: string;
    amount: number;
    paidByUserId: Types.ObjectId;
    date: Date;
    category: ExpenseCategory;
    splitType: ExpenseSplitType;
    splits: ExpenseSplit[];
    verified: boolean;
    receiptImageUrl?: string;
    verificationId?: Types.ObjectId;
    isActive: boolean;
    location?: string;
    tags: string[];
    createdByUserId: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export declare const ExpenseSchema: import("mongoose").Schema<Expense, import("mongoose").Model<Expense, any, any, any, Document<unknown, any, Expense, any, {}> & Expense & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Expense, Document<unknown, {}, import("mongoose").FlatRecord<Expense>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Expense> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
