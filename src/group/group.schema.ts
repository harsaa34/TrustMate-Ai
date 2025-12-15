// src/group/group.schema.ts - FIXED VERSION
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';

export type GroupDocument = Group & Document;

export enum GroupMemberRole {
  ADMIN = 'admin',
  MEMBER = 'member'
}

// ADD @Schema() decorator here
@Schema({ _id: false, timestamps: false }) // Add this line
export class GroupMember {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ 
    type: String, 
    enum: ['admin', 'member'], // Use string literals instead of enum
    default: 'member' 
  })
  role: string; // Change from GroupMemberRole to string

  @Prop({ type: Date, default: Date.now })
  joinedAt: Date;
}

// Create the schema for GroupMember
export const GroupMemberSchema = SchemaFactory.createForClass(GroupMember);

@Schema({ timestamps: true })
export class Group {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: [GroupMemberSchema], default: [] }) // Use GroupMemberSchema here
  members: GroupMember[];

  @Prop({
    type: {
      currency: { type: String, default: 'INR' },
      defaultSplitType: { type: String, enum: ['equal', 'percentage', 'custom'], default: 'equal' },
    },
    default: {}
  })
  settings: Record<string, any>;

  @Prop({ default: true })
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export const GroupSchema = SchemaFactory.createForClass(Group);