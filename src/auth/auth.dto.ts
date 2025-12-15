// src/auth/auth.dto.ts - MODIFIED VERSION
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserResponseDto } from 'src/user/user.dto';

// Sign Up DTO - REMOVED ROLE
export class SignUpDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    maxLength: 100,
  })
  @IsEmail()
  @MaxLength(100)
  email: string;

  @ApiProperty({
    description:
      'User password (must contain uppercase, lowercase, and number)',
    example: 'Password123',
    minLength: 6,
    maxLength: 100,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  password: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
    minLength: 2,
    maxLength: 50,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @ApiPropertyOptional({
    description: 'User phone number',
    example: '+1234567890',
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  // ROLE REMOVED COMPLETELY
}

// Login DTO - NO CHANGES
export class LoginDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'Password123',
  })
  @IsString()
  password: string;
}

// Change Password DTO - NO CHANGES
export class ChangePasswordDto {
  @ApiProperty({
    description: 'Current password',
    example: 'OldPassword123',
  })
  @IsString()
  currentPassword: string;

  @ApiProperty({
    description: 'New password (must contain uppercase, lowercase, and number)',
    example: 'NewPassword456',
    minLength: 6,
    maxLength: 100,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message:
      'New password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  newPassword: string;
}

// Forgot Password DTO - NO CHANGES
export class ForgotPasswordDto {
  @ApiProperty({
    description: 'Email address for password reset',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;
}

// Reset Password DTO - NO CHANGES
export class ResetPasswordDto {
  @ApiProperty({
    description: 'Reset token received via email',
    example: 'abc123-def456-ghi789',
  })
  @IsString()
  token: string;

  @ApiProperty({
    description: 'New password (must contain uppercase, lowercase, and number)',
    example: 'NewPassword456',
    minLength: 6,
    maxLength: 100,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message:
      'New password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  newPassword: string;
}

// Verify Email DTO - NO CHANGES
export class VerifyEmailDto {
  @ApiProperty({
    description: 'Verification token received via email',
    example: 'verification-token-abc123',
  })
  @IsString()
  token: string;
}

// Refresh Token DTO - NO CHANGES
export class RefreshTokenDto {
  @ApiProperty({
    description: 'Refresh token',
    example: 'refresh-token-xyz789',
  })
  @IsString()
  refreshToken: string;
}

// Update Profile DTO - NO CHANGES
export class UpdateProfileDto {
  @ApiPropertyOptional({
    description: 'User full name',
    example: 'John Smith',
    minLength: 2,
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name?: string;

  @ApiPropertyOptional({
    description: 'User phone number',
    example: '+9876543210',
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiPropertyOptional({
    description: 'User biography',
    example: 'Software developer with 5 years of experience',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;

  @ApiPropertyOptional({
    description: 'Profile avatar URL',
    example: 'https://example.com/avatar.jpg',
  })
  @IsOptional()
  @IsString()
  avatar?: string;
}

// Auth Response DTO - NO CHANGES
// Update your AuthResponseDto in auth.dto.ts to include security property
export class AuthResponseDto {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  token: string;

  @ApiPropertyOptional({
    description: 'Refresh token',
    example: 'refresh-token-xyz789',
  })
  refreshToken?: string;

  @ApiProperty({
    description: 'User information',
    type: UserResponseDto,
  })
  user: UserResponseDto;

  // ADD THESE NEW PROPERTIES:
  @ApiPropertyOptional({
    description: 'Session ID',
    example: 'session-abc123-def456',
  })
  sessionId?: string;

  @ApiPropertyOptional({
    description: 'Security information',
    example: {
      lastLogin: '2024-01-15T10:30:00.000Z',
      failedAttempts: 0,
      requires2FA: false,
    },
  })
  security?: {
    lastLogin?: Date;
    failedAttempts?: number;
    requires2FA?: boolean;
  };
}
// Add these to your auth.dto.ts file:

// Simple success response for operations like logout, forgot-password, etc.
export class SimpleSuccessResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'Operation completed successfully',
  })
  message: string;

  @ApiPropertyOptional({
    description: 'Additional data',
    example: { timestamp: '2024-01-15T10:30:00.000Z' },
  })
  data?: Record<string, any>;
}

// Response for verify email endpoint
export class VerifyEmailResponseDto extends SimpleSuccessResponseDto {
  @ApiProperty({
    description: 'Whether email was verified',
    example: true,
  })
  verified: boolean;
}

// Response for check email availability
export class CheckEmailResponseDto {
  @ApiProperty({
    description: 'Whether email is available',
    example: true,
  })
  available: boolean;

  @ApiProperty({
    description: 'Message',
    example: 'Email is available for registration',
  })
  message: string;
}

// Response for token validation
export class ValidateTokenResponseDto {
  @ApiProperty({
    description: 'Whether token is valid',
    example: true,
  })
  valid: boolean;

  @ApiProperty({
    description: 'User information',
    type: UserResponseDto,
  })
  user: UserResponseDto;
}

// Response for refresh token
export class RefreshTokenResponseDto {
  @ApiProperty({
    description: 'New JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  token: string;

  @ApiProperty({
    description: 'New refresh token',
    example: 'refresh-token-xyz789',
  })
  refreshToken: string;
}

// Response for receipt upload
export class UploadReceiptResponseDto {
  @ApiProperty({
    description: 'Uploaded file URL',
    example: 'https://storage.example.com/receipts/receipt.jpg',
  })
  url: string;

  @ApiProperty({
    description: 'File name',
    example: 'receipt.jpg',
  })
  filename: string;
}

// Response for expense summary
export class ExpenseSummaryResponseDto {
  @ApiProperty({
    description: 'Total amount spent',
    example: 15000.75,
  })
  totalSpent: number;

  @ApiProperty({
    description: 'Total number of expenses',
    example: 25,
  })
  totalExpenses: number;

  @ApiProperty({
    description: 'Average expense amount',
    example: 600.03,
  })
  averageExpense: number;

  @ApiProperty({
    description: 'Top expense category',
    example: 'food',
  })
  topCategory: string;

  @ApiProperty({
    description: 'Last expense date',
    example: '2024-01-15T10:30:00.000Z',
  })
  lastExpenseDate: Date;
}

// Response for receipt verification
export class VerifyReceiptResponseDto {
  @ApiProperty({
    description: 'Whether receipt was verified',
    example: true,
  })
  verified: boolean;

  @ApiProperty({
    description: 'Confidence score',
    example: 0.95,
  })
  confidence: number;
}
// Reset Password Link Response DTO - NO CHANGES
export class ResetPasswordLinkResponseDto {
  @ApiProperty({
    description: 'Response message',
    example:
      'Token is valid. Use POST /api/auth/reset-password with this token.',
  })
  message: string;

  @ApiPropertyOptional({
    description: 'Reset token (if valid)',
    example: 'abc123-def456-ghi789',
  })
  token?: string;

  @ApiProperty({
    description: 'Whether token is valid',
    example: true,
  })
  valid: boolean;

  @ApiPropertyOptional({
    description: 'Instructions for resetting password',
    example:
      'Send POST request to /api/auth/reset-password with {"token": "abc123", "newPassword": "your-new-password"}',
  })
  instructions?: string;

  constructor(data: Partial<ResetPasswordLinkResponseDto>) {
    Object.assign(this, data);
  }
}
