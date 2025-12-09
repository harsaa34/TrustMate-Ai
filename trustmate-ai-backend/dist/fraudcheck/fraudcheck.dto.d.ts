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
export declare class CreateFraudCheckDto {
    transactionId: string;
    amount: number;
    currency: string;
    merchantId: string;
    customerId: string;
    deviceId?: string;
    ipAddress?: string;
    location?: Record<string, any>;
    riskScore: number;
    flags?: string[];
    metadata?: Record<string, any>;
}
export declare class UpdateFraudCheckDto {
    riskScore?: number;
    status?: FraudStatus;
    flags?: string[];
    analysisResult?: Record<string, any>;
    reviewNotes?: string;
    reviewedBy?: string;
    reviewedAt?: string;
    isActive?: boolean;
}
export declare class AnalyzeTransactionDto {
    transactionId: string;
    amount: number;
    currency: string;
    merchantId: string;
    customerId: string;
    deviceId?: string;
    ipAddress?: string;
    location?: Record<string, any>;
    transactionTime?: string;
}
export declare class FraudCheckResponseDto {
    id: string;
    transactionId: string;
    amount: number;
    currency: string;
    merchantId: string;
    customerId: string;
    deviceId?: string;
    ipAddress?: string;
    location?: Record<string, any>;
    riskScore: number;
    riskLevel: RiskLevel;
    flags: string[];
    status: FraudStatus;
    analysisResult?: Record<string, any>;
    reviewNotes?: string;
    reviewedBy?: string;
    reviewedAt?: Date;
    isActive: boolean;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class FraudAnalysisResponseDto {
    id: string;
    transactionId: string;
    riskScore: number;
    riskLevel: RiskLevel;
    isFraudulent: boolean;
    flags: string[];
    confidence: number;
    recommendations: string[];
    createdAt: Date;
}
