// src/user/schemas/user.schema.ts - MODIFIED
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc: UserDocument, ret: Record<string, unknown>) {
      return {
        id: ret._id?.toString(),
        email: ret.email,
        name: ret.name,
        isActive: ret.isActive,
        isVerified: ret.isVerified,
        phone: ret.phone,
        avatar: ret.avatar,
        bio: ret.bio,
        emailVerifiedAt: ret.emailVerifiedAt,
        lastLogin: ret.lastLogin,
        lastPasswordChange: ret.lastPasswordChange,
        createdAt: ret.createdAt,
        updatedAt: ret.updatedAt,
      };
    },
  },
})
export class User {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop()
  phone?: string;

  @Prop()
  avatar?: string;

  @Prop()
  bio?: string;

  @Prop()
  refreshToken?: string;

  @Prop()
  resetPasswordToken?: string;

  @Prop()
  resetPasswordExpires?: Date;

  @Prop()
  verificationToken?: string;

  @Prop()
  verificationTokenExpires?: Date;

  @Prop()
  emailVerifiedAt?: Date;

  @Prop()
  lastLogin?: Date;

  @Prop()
  lastPasswordChange?: Date;

  @Prop()
  deletedAt?: Date;

  createdAt?: Date;
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Add virtual id field
UserSchema.virtual('id').get(function(this: UserDocument) {
  return this._id.toString();
});

// Ensure virtuals are included
UserSchema.set('toJSON', { virtuals: true });
UserSchema.set('toObject', { virtuals: true });