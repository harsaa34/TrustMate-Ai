// src/auth/controllers/auth.controller.ts - UPDATED (REMOVED ROLE)
import { 
  Controller, 
  Body, 
  Req, 
  UseGuards, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Param,
  Query,
  Redirect 
} from '@nestjs/common';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  SignUpDto,
  LoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ChangePasswordDto,
  UpdateProfileDto,
  VerifyEmailDto,
  RefreshTokenDto,
  AuthResponseDto,
  ResetPasswordLinkResponseDto,
} from './auth.dto';
import { UserResponseDto } from 'src/user/user.dto';
import { Api } from '../shared/Decorator/api.decorator';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import {
  UserAlreadyExistsError,
  InvalidCredentialsError,
  AccountNotVerifiedError,
  AccountDeactivatedError,
  InvalidTokenError,
  TokenExpiredError,
  UserNotFoundError,
  PasswordValidationError,
  UserUpdateError,
} from '../user/user.error';

// Extend Express Request to include user property - REMOVED ROLE
interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    // ROLE REMOVED
  };
}

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Register new user
   */
  @Api({
    isPublic: true,
    verb: 'POST',
    path: 'signup',
    description: 'Register a new user account',
    swaggerSuccessResponse: AuthResponseDto,
    swaggerRequestErrors: [
      UserAlreadyExistsError,
      PasswordValidationError,
      UserUpdateError,
    ],
    httpCode: 201,
  })
  @Post('signup')
  async signup(@Body() signupDto: SignUpDto): Promise<AuthResponseDto> {
    return this.authService.signup(signupDto);
  }

  /**
   * Login user
   */
  @Api({
    isPublic: true,
    verb: 'POST',
    path: 'login',
    description: 'Authenticate user and return JWT tokens',
    swaggerSuccessResponse: AuthResponseDto,
    swaggerRequestErrors: [
      InvalidCredentialsError,
      AccountNotVerifiedError,
      AccountDeactivatedError,
    ],
  })
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  /**
   * Request password reset
   */
  @Api({
    isPublic: true,
    verb: 'POST',
    path: 'forgot-password',
    description: 'Request password reset email',
    swaggerSuccessResponse: { message: String },
    swaggerRequestErrors: [],
  })
  @Post('forgot-password')
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  /**
   * Reset password with token
   */
  @Api({
    isPublic: true,
    verb: 'POST',
    path: 'reset-password',
    description: 'Reset password using reset token',
    swaggerSuccessResponse: { message: String },
    swaggerRequestErrors: [
      InvalidTokenError,
      TokenExpiredError,
      PasswordValidationError,
    ],
  })
  @Post('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    return this.authService.resetPassword(resetPasswordDto);
  }

  /**
   * Verify email - FIXED VERSION
   */
  @Api({
    isPublic: true,
    verb: 'GET',
    path: 'verify-email',
    description: 'Verify email address using verification token',
    swaggerSuccessResponse: { message: String },
    swaggerRequestErrors: [InvalidTokenError, TokenExpiredError],
  })
  @Get('verify-email')
  async verifyEmail(
    @Query('token') token: string,
  ): Promise<{ message: string }> {
    // Create VerifyEmailDto object from token
    const verifyEmailDto: VerifyEmailDto = { token };
    return this.authService.verifyEmail(verifyEmailDto);
  }

  /**
   * Resend verification email
   */
  @Api({
    isPublic: true,
    verb: 'POST',
    path: 'resend-verification',
    description: 'Resend verification email',
    swaggerSuccessResponse: { message: String },
    swaggerRequestErrors: [],
  })
  @Post('resend-verification')
  async resendVerificationEmail(
    @Body('email') email: string,
  ): Promise<{ message: string }> {
    return this.authService.resendVerificationEmail(email);
  }

  /**
   * Refresh access token
   */
  @Api({
    isPublic: true,
    verb: 'POST',
    path: 'refresh-token',
    description: 'Refresh access token using refresh token',
    swaggerSuccessResponse: { token: String, refreshToken: String },
    swaggerRequestErrors: [InvalidTokenError, TokenExpiredError],
  })
  @Post('refresh-token')
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<{ token: string; refreshToken: string }> {
    return this.authService.refreshToken(refreshTokenDto);
  }

  /**
   * Handle reset password link from email (GET endpoint)
   */
  @Get('reset-password')
  @Api({
    isPublic: true,
    verb: 'GET',
    path: 'reset-password',
    description: 'Handle reset password link from email',
    swaggerSuccessResponse: ResetPasswordLinkResponseDto,
  })
  // @Redirect()
  async handleResetPasswordLink(@Query('token') token: string): Promise<ResetPasswordLinkResponseDto> {
    const user = await this.authService.validateResetToken(token);
    
    if (!user) {
      return new ResetPasswordLinkResponseDto({ 
        message: 'Invalid or expired token',
        valid: false 
      });
    }
    
    return new ResetPasswordLinkResponseDto({ 
      message: 'Token is valid. Use POST /api/auth/reset-password with this token.',
      token: token,
      valid: true,
      instructions: 'Send POST request to /api/auth/reset-password with {"token": "' + token + '", "newPassword": "your-new-password"}'
    });
  }

  /**
   * Get current user profile
   */
  @Api({
    isPublic: false,
    verb: 'GET',
    path: 'profile',
    description: 'Get authenticated user profile',
    swaggerSuccessResponse: UserResponseDto,
    swaggerRequestErrors: [UserNotFoundError],
  })
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req: AuthenticatedRequest): Promise<UserResponseDto> {
    const userId = req.user.id;
    return this.authService.getProfile(userId);
  }

  /**
   * Update user profile
   */
  @Api({
    isPublic: false,
    verb: 'PUT',
    path: 'profile',
    description: 'Update authenticated user profile',
    swaggerSuccessResponse: UserResponseDto,
    swaggerRequestErrors: [UserNotFoundError, UserUpdateError],
  })
  @UseGuards(JwtAuthGuard)
  @Put('profile')
  async updateProfile(
    @Req() req: AuthenticatedRequest,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<UserResponseDto> {
    const userId = req.user.id;
    return this.authService.updateProfile(userId, updateProfileDto);
  }

  /**
   * Change password
   */
  @Api({
    isPublic: false,
    verb: 'POST',
    path: 'change-password',
    description: 'Change user password',
    swaggerSuccessResponse: { message: String },
    swaggerRequestErrors: [
      UserNotFoundError,
      InvalidCredentialsError,
      PasswordValidationError,
    ],
  })
  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(
    @Req() req: AuthenticatedRequest,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const userId = req.user.id;
    return this.authService.changePassword(userId, changePasswordDto);
  }

  /**
   * Logout user
   */
  @Api({
    isPublic: false,
    verb: 'POST',
    path: 'logout',
    description: 'Logout user and invalidate refresh token',
    swaggerSuccessResponse: { message: String },
    swaggerRequestErrors: [UserNotFoundError],
  })
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: AuthenticatedRequest): Promise<{ message: string }> {
    const userId = req.user.id;
    return this.authService.logout(userId);
  }

  /**
   * Logout from all devices
   */
  @Api({
    isPublic: false,
    verb: 'POST',
    path: 'logout-all',
    description: 'Logout user from all devices',
    swaggerSuccessResponse: { message: String },
    swaggerRequestErrors: [UserNotFoundError],
  })
  @UseGuards(JwtAuthGuard)
  @Post('logout-all')
  async logoutFromAllDevices(
    @Req() req: AuthenticatedRequest,
  ): Promise<{ message: string }> {
    const userId = req.user.id;
    return this.authService.logout(userId);
  }

  /**
   * Delete account
   */
  @Api({
    isPublic: false,
    verb: 'DELETE',
    path: 'account',
    description: 'Delete user account (soft delete)',
    swaggerSuccessResponse: { message: String },
    swaggerRequestErrors: [UserNotFoundError],
  })
  @UseGuards(JwtAuthGuard)
  @Delete('account')
  async deleteAccount(@Req() req: AuthenticatedRequest): Promise<{ message: string }> {
    const userId = req.user.id;
    return this.authService.deleteAccount(userId);
  }

  /**
   * Check email availability
   */
  @Api({
    isPublic: true,
    verb: 'GET',
    path: 'check-email/:email',
    description: 'Check if email is available for registration',
    swaggerSuccessResponse: { available: Boolean, message: String },
    swaggerRequestErrors: [],
  })
  @Get('check-email/:email')
  async checkEmailAvailability(
    @Param('email') email: string,
  ): Promise<{ available: boolean; message: string }> {
    return this.authService.checkEmailAvailability(email);
  }

  /**
   * Validate token (for frontend to check if token is still valid)
   */
  @Api({
    isPublic: false,
    verb: 'GET',
    path: 'validate',
    description: 'Validate JWT token',
    swaggerSuccessResponse: { valid: Boolean, user: UserResponseDto },
    swaggerRequestErrors: [],
  })
  @UseGuards(JwtAuthGuard)
  @Get('validate')
  async validateToken(@Req() req: AuthenticatedRequest): Promise<{
    valid: boolean;
    user: UserResponseDto;
  }> {
    const userId = req.user.id;
    const user = await this.authService.getProfile(userId);
    return {
      valid: true,
      user,
    };
  }
}