// src/shared/database/repository/user.repository.ts - UPDATED (ROLE REMOVED)
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { User, UserDocument } from '../../../user/schemas/user.schema';
import { UserDomain } from '../../../user/user.domain';
import { UserMapper } from '../mapper/user.mapper';

// Define error classes locally
class UserNotFoundError extends Error {
  constructor(message = 'User not found') {
    super(message);
    this.name = 'UserNotFoundError';
  }
}

class UserAlreadyExistsError extends Error {
  constructor(message = 'User already exists') {
    super(message);
    this.name = 'UserAlreadyExistsError';
  }
}

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async findByEmail(email: string): Promise<UserDomain | null> {
    try {
      const user = await this.userModel
        .findOne({ email: email.toLowerCase().trim() })
        .exec();
      return UserMapper.toDomain(user);
    } catch (error: unknown) {
      throw error;
    }
  }

  async findById(id: string): Promise<UserDomain> {
    try {
      const user = await this.userModel.findById(id).exec();
      if (!user) {
        throw new UserNotFoundError(id);
      }
      const domain = UserMapper.toDomain(user);
      if (!domain) {
        throw new UserNotFoundError(id);
      }
      return domain;
    } catch (error: unknown) {
      throw error;
    }
  }

  async save(user: UserDomain): Promise<UserDomain> {
    try {
      const entity = UserMapper.toEntity(user);
      
      const saved = await this.userModel
        .findByIdAndUpdate(user.id, entity, { new: true })
        .exec();
      
      const domain = UserMapper.toDomain(saved);
      if (!domain) {
        throw new Error('Failed to convert saved user to domain');
      }
      return domain;
    } catch (error: unknown) {
      throw error;
    }
  }

  async existsByEmail(email: string): Promise<boolean> {
    try {
      const count = await this.userModel
        .countDocuments({ email: email.toLowerCase().trim() })
        .exec();
      return count > 0;
    } catch {
      return false;
    }
  }

  async create(user: UserDomain): Promise<UserDomain> {
    try {
      const exists = await this.existsByEmail(user.email);
      if (exists) {
        throw new UserAlreadyExistsError(user.email);
      }
      
      const entity = UserMapper.toEntity(user);
      
      const created = await this.userModel.create(entity);
      const domain = UserMapper.toDomain(created);
      
      if (!domain) {
        throw new Error('Failed to convert created user to domain');
      }
      return domain;
    } catch (error: unknown) {
      throw error;
    }
  }

  async findOne(conditions: FilterQuery<UserDocument>): Promise<UserDocument | null> {
    try {
      return await this.userModel.findOne(conditions).exec();
    } catch (error: unknown) {
      throw error;
    }
  }

  async findAll(): Promise<UserDomain[]> {
    try {
      const users = await this.userModel
        .find()
        .sort({ createdAt: -1 })
        .exec();
      
      return UserMapper.toDomains(users);
    } catch (error: unknown) {
      throw error;
    }
  }

  // REMOVED: updateRole method completely since we don't have roles anymore
  
  async deactivate(id: string): Promise<UserDomain> {
    try {
      const user = await this.userModel.findById(id).exec();
      if (!user) {
        throw new UserNotFoundError(id);
      }

      user.isActive = false;
      user.updatedAt = new Date();

      const updated = await user.save();
      const domain = UserMapper.toDomain(updated);

      if (!domain) {
        throw new Error('Failed to convert deactivated user to domain');
      }

      return domain;
    } catch (error: unknown) {
      throw error;
    }
  }
  
  // Optional: Add a simple update method if needed
  async update(id: string, updateData: Partial<UserDomain>): Promise<UserDomain> {
    try {
      const updated = await this.userModel
        .findByIdAndUpdate(id, updateData, { new: true })
        .exec();
      
      if (!updated) {
        throw new UserNotFoundError(id);
      }
      
      const domain = UserMapper.toDomain(updated);
      if (!domain) {
        throw new Error('Failed to convert updated user to domain');
      }
      
      return domain;
    } catch (error: unknown) {
      throw error;
    }
  }
}