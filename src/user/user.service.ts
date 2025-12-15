// src/user/user.service.ts - SIMPLIFIED (NO ROLES)
import { Injectable, NotFoundException, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import {
  CreateUserDto,
  UpdateUserDto,
  ChangePasswordDto,
  UserResponseDto,
  LoginResponseDto,
  SuccessResponseDto,
} from './user.dto';
import { LoginDto } from 'src/auth/auth.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  /**
   * Register a new user - SIMPLIFIED (NO ROLE)
   */
  async register(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    // Check if user already exists
    const existingUser = await this.userModel.findOne({ 
      email: createUserDto.email.toLowerCase() 
    });
    
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Create user - NO ROLE
    const user = await this.userModel.create({
      email: createUserDto.email.toLowerCase(),
      password: hashedPassword,
      name: createUserDto.name,
      phone: createUserDto.phone,
      isActive: true,
      isVerified: false,
    });

    // Convert to response DTO
    return this.toUserResponse(user);
  }

  /**
   * Authenticate user login - SIMPLIFIED (NO ROLE CHECKS)
   */
  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    // Find user by email
    const user = await this.userModel.findOne({ 
      email: loginDto.email.toLowerCase() 
    }).select('+password');
    
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Update last login
    (user as any).lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = this.generateToken(user.id);

    return new LoginResponseDto(token, this.toUserResponse(user));
  }

  /**
   * Update user profile - SIMPLIFIED (NO PERMISSION CHECKS)
   */
  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Simple update - no permission checks
    if (updateUserDto.name !== undefined) {
      user.name = updateUserDto.name;
    }
    if (updateUserDto.phone !== undefined) {
      user.phone = updateUserDto.phone;
    }
    if (updateUserDto.avatar !== undefined) {
      user.avatar = updateUserDto.avatar;
    }
    if (updateUserDto.bio !== undefined) {
      user.bio = updateUserDto.bio;
    }

    await user.save();
    return this.toUserResponse(user);
  }

  /**
   * Get user profile by ID - SIMPLIFIED
   */
  async getProfile(userId: string): Promise<UserResponseDto> {
    const user = await this.userModel.findById(userId);
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.toUserResponse(user);
  }

  /**
   * REMOVED: GetAllUsers - Not needed for basic login
   */
  
  /**
   * REMOVED: getUserById with admin check - Not needed
   */

  /**
   * Get user by email - SIMPLIFIED
   */
  async getUserByEmail(email: string): Promise<UserResponseDto> {
    const user = await this.userModel.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.toUserResponse(user);
  }

  /**
   * REMOVED: updateUserRole - No roles in system
   */

  /**
   * Change user password - SIMPLIFIED
   */
  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<SuccessResponseDto> {
    const user = await this.userModel.findById(userId).select('+password');
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Validate current password
    const isCurrentPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password
    );
    
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Check if new password is same as current
    if (changePasswordDto.currentPassword === changePasswordDto.newPassword) {
      throw new BadRequestException('New password cannot be the same as current password');
    }

    // Validate new password strength
    if (changePasswordDto.newPassword.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
    
    // Update password
    user.password = hashedPassword;
    (user as any).lastPasswordChange = new Date();
    await user.save();

    return new SuccessResponseDto('Password changed successfully');
  }

  /**
   * Deactivate user - SIMPLIFIED (SELF ONLY)
   */
  async deactivateUser(userId: string): Promise<UserResponseDto> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // User can only deactivate themselves
    user.isActive = false;
    await user.save();

    return this.toUserResponse(user);
  }

  /**
   * REMOVED: reactivateUser - No admin features
   */

  /**
   * Check if email exists
   */
  async checkEmailExists(email: string): Promise<{ exists: boolean }> {
    const user = await this.userModel.findOne({ email: email.toLowerCase() });
    return { exists: !!user };
  }

  /**
   * Delete account - SIMPLIFIED (SELF ONLY)
   */
  async deleteAccount(userId: string): Promise<SuccessResponseDto> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Soft delete - user can only delete themselves
    user.isActive = false;
    await user.save();

    return new SuccessResponseDto('Account deleted successfully');
  }

  /**
   * Validate user for JWT - SIMPLIFIED
   */
  async validateUser(userId: string): Promise<any> {
    const user = await this.userModel.findById(userId);
    if (!user || !user.isActive) {
      return null;
    }
    return user;
  }

  /**
   * Find user by ID (helper method)
   */
  async findById(userId: string): Promise<UserResponseDto> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.toUserResponse(user);
  }

  /**
   * Helper Methods - UPDATED (NO ROLE)
   */
  private toUserResponse(user: UserDocument): UserResponseDto {
    const userObj = user.toObject();
    
    return new UserResponseDto({
      id: userObj._id.toString(),
      email: userObj.email,
      name: userObj.name,
      // NO ROLE FIELD
      isActive: userObj.isActive,
      isVerified: userObj.isVerified,
      phone: userObj.phone,
      avatar: userObj.avatar,
      bio: userObj.bio,
      createdAt: (userObj as any).createdAt,
      updatedAt: (userObj as any).updatedAt,
    });
  }

  private generateToken(userId: string): string {
    return this.jwtService.sign(
      { id: userId },
      {
        secret: process.env.JWT_SECRET || 'default-secret',
        expiresIn: '15m' as any,
      }
    );
  }
}