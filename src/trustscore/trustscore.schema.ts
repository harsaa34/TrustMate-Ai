import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { EntityType } from './trustscore.dto';

export type TrustScoreDocument = TrustScore & Document;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
      const { _id, ...rest } = ret;
      return { id: _id.toString(), ...rest };
    },
  },
})
export class TrustScore {
  @Prop({ required: true, type: Number, min: 0, max: 100 })
  score: number;

  @Prop({ type: Number, min: 0, default: 100 })
  maxScore: number;

  @Prop({ type: Number, min: 0, default: 0 })
  minScore: number;

  @Prop({ type: Number, min: 0, max: 1, default: 1 })
  confidence: number;

  @Prop({ type: [String], required: true })
  factors: string[];

  @Prop({ type: String, enum: Object.values(EntityType), required: true })
  entityType: EntityType;

  @Prop({ type: String, required: true, index: true })
  entityId: string;

  @Prop({ type: String })
  algorithmVersion: string;

  @Prop({ type: Date, default: Date.now })
  calculatedAt: Date;

  @Prop({ type: Date })
  expiresAt: Date;

  @Prop({ type: SchemaTypes.Mixed, default: {} })
  metadata: Record<string, any>;

  @Prop({ type: Boolean, default: true, index: true })
  isActive: boolean;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true, index: true })
  createdBy: Types.ObjectId;

  // Virtual properties for timestamps (added by timestamps: true)
  createdAt: Date;
  updatedAt: Date;
}

export const TrustScoreSchema = SchemaFactory.createForClass(TrustScore);

// Compound indexes for better query performance
TrustScoreSchema.index({ entityType: 1, entityId: 1 });
TrustScoreSchema.index({ createdBy: 1, isActive: 1 });
TrustScoreSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
TrustScoreSchema.index({ score: 1 });
TrustScoreSchema.index({ calculatedAt: -1 });