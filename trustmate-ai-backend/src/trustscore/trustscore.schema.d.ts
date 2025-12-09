import { Document, Types } from 'mongoose';
import { EntityType } from './trustscore.dto';
export type TrustScoreDocument = TrustScore & Document;
export declare class TrustScore {
    score: number;
    maxScore: number;
    minScore: number;
    confidence: number;
    factors: string[];
    entityType: EntityType;
    entityId: string;
    algorithmVersion: string;
    calculatedAt: Date;
    expiresAt: Date;
    metadata: Record<string, any>;
    isActive: boolean;
    createdBy: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export declare const TrustScoreSchema: import("mongoose").Schema<TrustScore, import("mongoose").Model<TrustScore, any, any, any, Document<unknown, any, TrustScore, any, {}> & TrustScore & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, TrustScore, Document<unknown, {}, import("mongoose").FlatRecord<TrustScore>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<TrustScore> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
