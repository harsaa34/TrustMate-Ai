export declare enum EntityType {
    USER = "user",
    MERCHANT = "merchant",
    TRANSACTION = "transaction",
    DEVICE = "device",
    IP_ADDRESS = "ip_address"
}
export declare class CreateTrustScoreDto {
    score: number;
    maxScore?: number;
    minScore?: number;
    confidence?: number;
    factors: string[];
    entityType: EntityType;
    entityId: string;
    algorithmVersion?: string;
    calculatedAt?: string;
    expiresAt?: string;
    metadata?: Record<string, any>;
}
export declare class UpdateTrustScoreDto {
    score?: number;
    confidence?: number;
    factors?: string[];
    algorithmVersion?: string;
    expiresAt?: string;
    metadata?: Record<string, any>;
    isActive?: boolean;
}
export declare class TrustScoreResponseDto {
    id: string;
    score: number;
    maxScore: number;
    minScore: number;
    confidence: number;
    factors: string[];
    entityType: EntityType;
    entityId: string;
    algorithmVersion?: string;
    calculatedAt?: Date;
    expiresAt?: Date;
    metadata?: Record<string, any>;
    isActive: boolean;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}
