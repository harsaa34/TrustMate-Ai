// src/auth/repositories/auth.repository.ts - UPDATED (ROLE REMOVED)
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../../user/schemas/user.schema';
import { UserDomain } from '../../../user/user.domain';
import { UserMapper } from '../../database/mapper/user.mapper';

export interface IAuthRepository {
  create(user: UserDomain): Promise<UserDomain>;
  findByEmail(email: string): Promise<UserDomain | null>;
  findById(id: string): Promise<UserDomain | null>;
  findByResetToken(token: string): Promise<UserDomain | null>;
  findByVerificationToken(token: string): Promise<UserDomain | null>;
  findByRefreshToken(token: string): Promise<UserDomain | null>;
  save(user: UserDomain): Promise<UserDomain>;
  updatePassword(userId: string, hashedPassword: string): Promise<void>;
  updateLoginInfo(userId: string, lastLogin: Date): Promise<void>;
  updateVerificationStatus(userId: string, isVerified: boolean): Promise<void>;
  updateResetToken(
    userId: string,
    token: string | null,
    expiresAt?: Date,
  ): Promise<void>;
  updateRefreshToken(userId: string, token: string | null): Promise<void>;
  existsByEmail(email: string): Promise<boolean>;
}

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  /**
   * Create a new user - NO ROLE
   */
  async create(user: UserDomain): Promise<UserDomain> {
    const userData = UserMapper.toEntity(user);
    const createdUser = await this.userModel.create(userData);
    const domain = UserMapper.toDomain(createdUser);

    if (!domain) {
      throw new Error('Failed to create user domain');
    }
    return domain;
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<UserDomain | null> {
    const user = await this.userModel
      .findOne({ email: email.toLowerCase().trim() })
      .select('+password +refreshToken +resetPasswordToken +verificationToken')
      .exec();

    return user ? UserMapper.toDomain(user) : null;
  }

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<UserDomain | null> {
    const user = await this.userModel
      .findById(id)
      .select('+refreshToken +resetPasswordToken +verificationToken')
      .exec();

    return user ? UserMapper.toDomain(user) : null;
  }

  /**
   * Find user by reset password token
   */
  async findByResetToken(token: string): Promise<UserDomain | null> {
    const user = await this.userModel
      .findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: new Date() },
      })
      .select('+password +resetPasswordToken +resetPasswordExpires')
      .exec();

    return user ? UserMapper.toDomain(user) : null;
  }

  /**
   * Find user by verification token
   */
  async findByVerificationToken(token: string): Promise<UserDomain | null> {
    const user = await this.userModel
      .findOne({
        verificationToken: token,
        verificationTokenExpires: { $gt: new Date() },
      })
      .select('+verificationToken +verificationTokenExpires')
      .exec();

    return user ? UserMapper.toDomain(user) : null;
  }

  /**
   * Find user by refresh token
   */
  async findByRefreshToken(token: string): Promise<UserDomain | null> {
    const user = await this.userModel
      .findOne({ refreshToken: token })
      .select('+refreshToken')
      .exec();

    return user ? UserMapper.toDomain(user) : null;
  }

  /**
   * Save/update user - NO ROLE
   */
  async save(user: UserDomain): Promise<UserDomain> {
    const userData = UserMapper.toEntity(user);
    const updatedUser = await this.userModel
      .findByIdAndUpdate(user.id, userData, { new: true })
      .select('+password +refreshToken +resetPasswordToken +verificationToken')
      .exec();

    if (!updatedUser) {
      throw new Error(`User with ID ${user.id} not found`);
    }
    
    const domain = UserMapper.toDomain(updatedUser);
    if (!domain) {
      throw new Error('Failed to convert updated user to domain');
    }
    return domain;
  }

  /**
   * Update user password
   */
  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    await this.userModel
      .findByIdAndUpdate(userId, {
        password: hashedPassword,
        lastPasswordChange: new Date(),
        resetPasswordToken: null,
        resetPasswordExpires: null,
      })
      .exec();
  }

  /**
   * Update user login information
   */
  async updateLoginInfo(userId: string, lastLogin: Date): Promise<void> {
    await this.userModel
      .findByIdAndUpdate(userId, {
        lastLogin,
      })
      .exec();
  }

  /**
   * Update user verification status
   */
  async updateVerificationStatus(
    userId: string,
    isVerified: boolean,
  ): Promise<void> {
    await this.userModel
      .findByIdAndUpdate(userId, {
        isVerified,
        verificationToken: null,
        verificationTokenExpires: null,
        emailVerifiedAt: isVerified ? new Date() : null,
      })
      .exec();
  }

  /**
   * Update reset password token
   */
  async updateResetToken(
    userId: string,
    token: string | null,
    expiresAt?: Date,
  ): Promise<void> {
    await this.userModel
      .findByIdAndUpdate(userId, {
        resetPasswordToken: token,
        resetPasswordExpires:
          expiresAt || (token ? new Date(Date.now() + 3600000) : null),
      })
      .exec();
  }

  /**
   * Update refresh token
   */
  async updateRefreshToken(
    userId: string,
    token: string | null,
  ): Promise<void> {
    await this.userModel
      .findByIdAndUpdate(userId, {
        refreshToken: token,
        lastLogout: token ? null : new Date(),
      })
      .exec();
  }

  /**
   * Check if email exists
   */
  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.userModel
      .countDocuments({ email: email.toLowerCase().trim() })
      .exec();
    return count > 0;
  }

  /**
   * Find all users (optional - remove if not needed)
   */
  async findAll(): Promise<UserDomain[]> {
    const users = await this.userModel.find().exec();
    const domains = users
      .map((user) => UserMapper.toDomain(user))
      .filter(Boolean) as UserDomain[];
    return domains;
  }

  /**
   * Delete user (soft delete) - NO ROLE CHECK
   */
  async softDelete(userId: string): Promise<void> {
    await this.userModel
      .findByIdAndUpdate(userId, {
        isActive: false,
        email: `deleted_${Date.now()}_${userId}@deleted.com`,
        deletedAt: new Date(),
      })
      .exec();
  }
}