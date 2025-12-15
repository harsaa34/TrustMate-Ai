// src/user/user.dto.ts - SIMPLIFIED VERSION (BASIC LOGIN ONLY)
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

// Only keep what's needed for basic auth
export class CreateUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'SecurePass123!',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'User phone number',
    example: '+1234567890',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  // ROLE COMPLETELY REMOVED
}

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'User full name',
    example: 'John Smith',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'User phone number',
    example: '+9876543210',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    description: 'User avatar URL',
    example: 'https://example.com/avatar.jpg',
  })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiPropertyOptional({
    description: 'User biography',
    example: 'Software developer with 5 years of experience',
  })
  @IsOptional()
  @IsString()
  bio?: string;
}

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Current password',
    example: 'OldPassword123!',
  })
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty({
    description: 'New password',
    example: 'NewPassword456!',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  newPassword: string;
}

export class UserResponseDto {
  @ApiProperty({
    description: 'User ID',
    example: '507f1f77bcf86cd799439011',
  })
  id: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'Whether the user account is active',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Whether the user email is verified',
    example: true,
  })
  isVerified: boolean;

  @ApiPropertyOptional({
    description: 'User phone number',
    example: '+1234567890',
  })
  phone?: string;

  @ApiPropertyOptional({
    description: 'User avatar URL',
    example: 'https://example.com/avatar.jpg',
  })
  avatar?: string;

  @ApiPropertyOptional({
    description: 'User biography',
    example: 'Software developer with 5 years of experience',
  })
  bio?: string;

  @ApiProperty({
    description: 'Account creation date',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last account update date',
    example: '2024-01-15T10:30:00.000Z',
  })
  updatedAt: Date;

  constructor(data: any) {
    this.id = data.id || data._id?.toString();
    this.email = data.email;
    this.name = data.name;
    // ROLE COMPLETELY REMOVED
    this.isActive = data.isActive;
    this.isVerified = data.isVerified;
    this.phone = data.phone;
    this.avatar = data.avatar;
    this.bio = data.bio;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}

export class LoginResponseDto {
  @ApiProperty({
    description: 'JWT token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjN2YxZjc3YmNmODZjZDc5OTQzOTAxMSIsImlhdCI6MTcwNTIxMDMwMH0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  })
  token: string;

  @ApiProperty({
    type: UserResponseDto,
    description: 'Authenticated user information',
  })
  user: UserResponseDto;

  @ApiPropertyOptional({
    description: 'Refresh token',
    example: 'refresh-token-xyz123',
  })
  refreshToken?: string;

  constructor(token: string, user: UserResponseDto, refreshToken?: string) {
    this.token = token;
    this.user = user;
    this.refreshToken = refreshToken;
  }
}

export class SuccessResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'Operation completed successfully',
  })
  message: string;

  constructor(message: string) {
    this.message = message;
  }
}