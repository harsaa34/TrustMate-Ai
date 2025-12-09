export declare class ExpenseDomain {
    id: string | null;
    groupId: string;
    title: string;
    amount: number;
    paidByUserId: string;
    date: Date;
    splitType: 'equal' | 'percentage' | 'exact' | 'shares' | 'adjustment';
    splits: Array<{
        userId: string;
        amount?: number;
        percentage?: number;
        shares?: number;
        note?: string;
    }>;
    createdByUserId: string;
    description?: string | undefined;
    category?: string | undefined;
    receiptImageUrl?: string | undefined;
    location?: string | undefined;
    tags?: string[] | undefined;
    verified?: boolean | undefined;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
    constructor(id: string | null, groupId: string, title: string, amount: number, paidByUserId: string, date: Date, splitType: 'equal' | 'percentage' | 'exact' | 'shares' | 'adjustment', splits: Array<{
        userId: string;
        amount?: number;
        percentage?: number;
        shares?: number;
        note?: string;
    }>, createdByUserId: string, description?: string | undefined, category?: string | undefined, receiptImageUrl?: string | undefined, location?: string | undefined, tags?: string[] | undefined, verified?: boolean | undefined, createdAt?: Date | undefined, updatedAt?: Date | undefined);
    static create(data: {
        groupId: string;
        title: string;
        amount: number;
        paidByUserId: string;
        date: Date;
        splitType: 'equal' | 'percentage' | 'exact' | 'shares' | 'adjustment';
        splits: Array<{
            userId: string;
            amount?: number;
            percentage?: number;
            shares?: number;
            note?: string;
        }>;
        createdByUserId: string;
        description?: string;
        category?: string;
        receiptImageUrl?: string;
        location?: string;
        tags?: string[];
    }): ExpenseDomain;
}
