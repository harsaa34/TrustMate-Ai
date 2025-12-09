export declare enum ReceiptStatus {
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    PROCESSED = "PROCESSED",
    ERROR = "ERROR",
    ARCHIVED = "ARCHIVED"
}
export declare enum ExpenseCategory {
    FOOD_DINING = "FOOD_DINING",
    SHOPPING = "SHOPPING",
    TRANSPORTATION = "TRANSPORTATION",
    ENTERTAINMENT = "ENTERTAINMENT",
    UTILITIES = "UTILITIES",
    HEALTHCARE = "HEALTHCARE",
    TRAVEL = "TRAVEL",
    EDUCATION = "EDUCATION",
    OTHER = "OTHER"
}
export declare class CreateReceiptDto {
    merchantName: string;
    amount: number;
    currency?: string;
    transactionDate?: string;
    imageUrl?: string;
    paymentMethod?: string;
    notes?: string;
    tags?: string[];
    metadata?: Record<string, any>;
}
export declare class UpdateReceiptDto {
    merchantName?: string;
    amount?: number;
    currency?: string;
    transactionDate?: string;
    status?: ReceiptStatus;
    notes?: string;
    tags?: string[];
    isActive?: boolean;
    analysisResult?: Record<string, any>;
}
export declare class ProcessReceiptDto {
    merchantName: string;
    amount: number;
}
export declare class ReceiptResponseDto {
    id: string;
    merchantName: string;
    amount: number;
    currency: string;
    transactionDate?: Date;
    imageUrl?: string;
    fileName?: string;
    fileSize?: number;
    mimeType?: string;
    ocrData?: Record<string, any>;
    analysisResult?: Record<string, any>;
    status: ReceiptStatus;
    confidenceScore?: number;
    processedAt?: Date;
    paymentMethod?: string;
    notes?: string;
    tags?: string[];
    isActive: boolean;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class ReceiptAnalysisResultDto {
    receiptId: string;
    merchantName: string;
    totalAmount: number;
    currency: string;
    transactionDate: Date;
    category: string;
    subcategory: string;
    items: Array<{
        name: string;
        quantity: number;
        price: number;
        total: number;
    }>;
    confidence: number;
    expenseType: string;
    taxAmount: number;
    tipAmount: number;
    isBusinessExpense: boolean;
    insights: string[];
}
export declare class ReceiptListResponseDto {
    receipts: ReceiptResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
