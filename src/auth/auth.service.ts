// src/auth/auth.service.ts - COMPLETE FIXED VERSION
import { Injectable, Inject } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserDomain } from '../user/user.domain';
import { UserMapper } from '../shared/database/mapper/user.mapper';
import { AppError } from '../shared/types/app-error';
import { EmailService } from '../shared/services/email.service';
import * as crypto from 'crypto';
import {
  UserAlreadyExistsError,
  InvalidCredentialsError,
  UserNotFoundError,
  AccountNotVerifiedError,
  AccountDeactivatedError,
  InvalidTokenError,
  TokenExpiredError,
  PasswordValidationError,
} from '../user/user.error';
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
} from './auth.dto';
import { UserResponseDto } from 'src/user/user.dto';

// Token Types
export type TokenType = 'verification' | 'reset' | 'refresh' | 'access';

export interface TokenPayload {
  id: string;
  type: TokenType;
  iat?: number;
  exp?: number;
}

export interface IAuthRepository {
  create(user: UserDomain): Promise<UserDomain>;
  findByEmail(email: string): Promise<UserDomain | null>;
  findById(id: string): Promise<UserDomain | null>;
  findByResetToken(token: string): Promise<UserDomain | null>;
  findByVerificationToken(token: string): Promise<UserDomain | null>;
  findByRefreshToken(token: string): Promise<UserDomain | null>;
  save(user: UserDomain): Promise<UserDomain>;
  existsByEmail(email: string): Promise<boolean>;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject('IAuthRepository') private authRepository: IAuthRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
    private emailService: EmailService,
  ) {}

  /**
   * REGISTER / SIGNUP USER - REMOVED ROLE
   */
  async signup(signupDto: SignUpDto): Promise<AuthResponseDto> {
    try {
      const existingUser = await this.authRepository.findByEmail(
        signupDto.email,
      );
      if (existingUser) {
        throw new UserAlreadyExistsError(signupDto.email);
      }

      const userDomain = await UserDomain.create({
        email: signupDto.email,
        password: signupDto.password,
        name: signupDto.name,
        phone: signupDto.phone,
        // ROLE REMOVED
      });

      const savedUser = await this.authRepository.create(userDomain);
      const token = this.generateAccessToken(savedUser.getId());
      const refreshToken = this.generateRefreshToken(savedUser.getId());

      savedUser.setRefreshToken(refreshToken);
      await this.authRepository.save(savedUser);

      const verificationToken = savedUser.getVerificationToken();
      if (verificationToken) {
        await this.sendVerificationEmail(
          savedUser.getEmail(),
          verificationToken,
        );
      }

      return {
        token,
        refreshToken,
        user: UserMapper.toResponseDto(savedUser),
      };
    } catch (error: unknown) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Signup failed', 500);
    }
  }

  /**
   * LOGIN USER - FIXED VERSION
   */
  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    try {
      // 1. Validate input
      if (!loginDto.email || !loginDto.password) {
        throw new AppError('Email and password are required', 400);
      }

      // 2. Rate limiting check (by IP and email)
      const ip = this.getClientIp(); // You need to implement this
      const rateLimitKey = `login_rate:${ip}:${loginDto.email}`;
      
      // Check if rate limited (Redis or in-memory store)
      const isRateLimited = await this.checkRateLimit(rateLimitKey);
      if (isRateLimited) {
        throw new AppError(
          'Too many login attempts. Please try again in 15 minutes.',
          429
        );
      }

      // 3. Find user
      const user = await this.authRepository.findByEmail(loginDto.email);
      
      // 4. Check if user exists (same response for security)
      if (!user) {
        await this.incrementFailedAttempt(rateLimitKey, loginDto.email);
        throw new InvalidCredentialsError();
      }

      // 5. Check if account is locked
      if (user.isAccountLocked()) {
        const remainingTime = user.getRemainingLockTime();
        const minutes = Math.ceil(remainingTime / (60 * 1000));
        
        if (minutes > 0) {
          throw new AppError(
            `Account locked due to multiple failed attempts. Please try again in ${minutes} minute${minutes > 1 ? 's' : ''}.`,
            423 // Locked status
          );
        } else {
          // Lock expired, reset
          user.resetFailedAttempts();
        }
      }

      // 6. Check if account is deactivated
      if (!user.getIsActive()) {
        throw new AccountDeactivatedError();
      }

      // 7. Validate password
      const isValidPassword = await user.validatePassword(loginDto.password);
      
      if (!isValidPassword) {
        // Increment failed attempts
        user.incrementFailedAttempts();
        await this.authRepository.save(user);
        
        // Increment rate limit counter
        await this.incrementFailedAttempt(rateLimitKey, loginDto.email);
        
        // Check if account should be locked now
        if (user.shouldLockAccount()) {
          user.lockAccount();
          await this.authRepository.save(user);
          
          // Send security alert email
          await this.sendSecurityAlertEmail(
            user.getEmail(),
            'Multiple failed login attempts',
            'Your account has been locked due to multiple failed login attempts.'
          );
          
          throw new AppError(
            'Account locked due to multiple failed attempts. Please check your email for instructions.',
            423
          );
        }
        
        // Calculate remaining attempts
        const attemptsLeft = user.getRemainingAttempts();
        const message = attemptsLeft > 0 
          ? `Invalid password. ${attemptsLeft} attempt${attemptsLeft > 1 ? 's' : ''} remaining.`
          : 'Invalid password.';
        
        throw new AppError(message, 401);
      }

      // 8. Check email verification
      if (!user.getIsVerified() && user.requiresEmailVerification()) {
        // User has correct password but email not verified
        // Optionally resend verification email
        if (user.shouldResendVerification()) {
          user.generateVerificationToken();
          await this.authRepository.save(user);
          
          const verificationToken = user.getVerificationToken();
          if (verificationToken) {
            await this.sendVerificationEmail(user.getEmail(), verificationToken);
          }
        }
        
        throw new AccountNotVerifiedError();
      }

      // 9. SUCCESS - Reset failed attempts
      user.resetFailedAttempts();
      
      // 10. Generate tokens
      const token = this.generateAccessToken(user.getId());
      const refreshToken = this.generateRefreshToken(user.getId());

      // 11. Update user with new refresh token and login info
      user.setRefreshToken(refreshToken);
      user.setLoginInfo({
        ip: ip,
        userAgent: this.getUserAgent(), // You need to implement this
        timestamp: new Date()
      });
      
      // 12. Create session record
      const sessionId = await this.createSession(user.getId(), {
        ip,
        userAgent: this.getUserAgent(),
        deviceInfo: this.getDeviceInfo() // You need to implement this
      });
      
      // 13. Save user updates
      await this.authRepository.save(user);

      // 14. Clear rate limit on successful login
      await this.clearRateLimit(rateLimitKey);

      // 15. Send login notification (optional)
      if (user.shouldSendLoginNotification()) {
        await this.sendLoginNotificationEmail(
          user.getEmail(),
          {
            ip,
            location: await this.getLocationFromIp(ip), // Optional
            device: this.getDeviceInfo(),
            timestamp: new Date()
          }
        );
      }

      // 16. Return response
      return {
        token,
        refreshToken,
        user: UserMapper.toResponseDto(user),
        sessionId, // Include session ID if needed
        security: {
          lastLogin: user.getLastLogin(),
          failedAttempts: 0,
          requires2FA: user.has2FAEnabled() // For future 2FA implementation
        }
      };
      
    } catch (error: unknown) {
      console.error('Login error:', {
        email: loginDto.email,
        error: error,
        timestamp: new Date().toISOString()
      });
      
      if (error instanceof AppError) {
        throw error;
      }
      
      // Don't reveal specific errors in production
      if (this.configService.get('NODE_ENV') === 'production') {
        throw new AppError('Login failed. Please try again.', 500);
      } else {
        throw new AppError(`Login failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 500);
      }
    }
  }

  // Helper methods you need to add to the class:

  private async checkRateLimit(key: string): Promise<boolean> {
    // Implement Redis or in-memory rate limiting
    // Example with Redis:
    // const attempts = await this.redis.get(key);
    // return attempts && parseInt(attempts) >= 5;
    
    // For now, return false (no rate limiting)
    return false;
  }

  private async incrementFailedAttempt(key: string, email: string): Promise<void> {
    // Implement rate limiting increment
    // Example:
    // const attempts = await this.redis.incr(key);
    // if (attempts === 1) {
    //   await this.redis.expire(key, 900); // 15 minutes
    // }
    
    // Log failed attempt for security monitoring
    console.log(`Failed login attempt for email: ${email}`);
  }

  private async clearRateLimit(key: string): Promise<void> {
    // Clear rate limit on successful login
    // await this.redis.del(key);
  }

  private getClientIp(): string {
    // Extract client IP from request
    // This should be passed from the controller
    return 'unknown';
  }

  private getUserAgent(): string {
    // Extract user agent from request
    return 'unknown';
  }

  private getDeviceInfo(): string {
    // Parse user agent to get device info
    return 'Unknown Device';
  }

  private async createSession(userId: string, sessionData: any): Promise<string> {
    // Create session record in database or Redis
    const sessionId = this.generateSessionId();
    
    // Store session data
    // await this.sessionRepository.create({
    //   sessionId,
    //   userId,
    //   ...sessionData,
    //   createdAt: new Date(),
    //   expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    // });
    
    return sessionId;
  }

  private generateSessionId(): string {
    return crypto.randomBytes(32).toString('hex');
  }
private async sendSecurityAlertEmail(email: string, subject: string, message: string): Promise<void> {
  try {
    const html = `
      <h2>Security Alert: ${subject}</h2>
      <p>${message}</p>
      <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
      <p><strong>Action Required:</strong> If this was not you, please secure your account immediately.</p>
    `;
    
    await this.emailService.sendCustomEmail(
      email,
      `Security Alert: ${subject}`,
      html,
      `${message}\n\nTimestamp: ${new Date().toLocaleString()}\n\nIf this was not you, please secure your account immediately.`
    );
  } catch (error) {
    console.error('Failed to send security alert email:', error);
  }
}


 private async sendLoginNotificationEmail(email: string, loginInfo: any): Promise<void> {
  try {
    const html = `
      <h2>New Login Detected</h2>
      <p>A new login was detected on your account:</p>
      <ul>
        <li><strong>IP Address:</strong> ${loginInfo.ip}</li>
        <li><strong>Location:</strong> ${loginInfo.location || 'Unknown location'}</li>
        <li><strong>Device:</strong> ${loginInfo.device}</li>
        <li><strong>Timestamp:</strong> ${loginInfo.timestamp.toLocaleString()}</li>
      </ul>
      <p><strong>Action Required:</strong> If this was not you, please change your password immediately.</p>
    `;
    
    const text = `New login detected on your account:\n\nIP: ${loginInfo.ip}\nLocation: ${loginInfo.location || 'Unknown location'}\nDevice: ${loginInfo.device}\nTimestamp: ${loginInfo.timestamp.toLocaleString()}\n\nIf this was not you, please change your password immediately.`;
    
    await this.emailService.sendCustomEmail(
      email,
      'New Login Detected',
      html,
      text
    );
  } catch (error) {
    console.error('Failed to send login notification email:', error);
  }
}

  private async getLocationFromIp(ip: string): Promise<string> {
    // Use IP geolocation service
    // For example: ipapi.co, ipinfo.io, etc.
    return 'Unknown location';
  }

  /**
   * FORGOT PASSWORD - NO CHANGES
   */
  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    try {
      const user = await this.authRepository.findByEmail(
        forgotPasswordDto.email,
      );

      if (!user) {
        return {
          message:
            'If an account exists with this email, you will receive a password reset link',
        };
      }

      user.generateResetToken();
      await this.authRepository.save(user);

      const resetToken = user.getResetPasswordToken();
      if (resetToken) {
        await this.sendPasswordResetEmail(user.getEmail(), resetToken);
      }

      return { message: 'Password reset email sent' };
    } catch (error: unknown) {
      throw new AppError('Forgot password failed', 500);
    }
  }

  /**
   * RESET PASSWORD - NO CHANGES
   */
  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    try {
      const user = await this.authRepository.findByResetToken(
        resetPasswordDto.token,
      );
      if (!user || !user.isResetTokenValid()) {
        throw new InvalidTokenError('reset');
      }

      const passwordValidation = user.validatePasswordStrength(
        resetPasswordDto.newPassword,
      );
      if (!passwordValidation.valid) {
        throw new PasswordValidationError(
          passwordValidation.message || 'Invalid password',
        );
      }

      await user.changePassword(resetPasswordDto.newPassword);
      user.clearResetToken();
      await this.authRepository.save(user);

      return { message: 'Password reset successfully' };
    } catch (error: unknown) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Reset password failed', 500);
    }
  }

  /**
   * CHANGE PASSWORD - NO CHANGES
   */
  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    try {
      const user = await this.authRepository.findById(userId);
      if (!user) {
        throw new UserNotFoundError();
      }

      const isPasswordValid = await user.validatePassword(
        changePasswordDto.currentPassword,
      );
      if (!isPasswordValid) {
        throw new InvalidCredentialsError();
      }

      if (changePasswordDto.currentPassword === changePasswordDto.newPassword) {
        throw new AppError(
          'New password cannot be the same as current password',
          400,
        );
      }

      const passwordValidation = user.validatePasswordStrength(
        changePasswordDto.newPassword,
      );
      if (!passwordValidation.valid) {
        throw new PasswordValidationError(
          passwordValidation.message || 'Invalid password',
        );
      }

      await user.changePassword(changePasswordDto.newPassword);
      await this.authRepository.save(user);

      return { message: 'Password changed successfully' };
    } catch (error: unknown) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Change password failed', 500);
    }
  }

  /**
   * VERIFY EMAIL - NO CHANGES
   */
  async verifyEmail(
    verifyEmailDto: VerifyEmailDto,
  ): Promise<{ message: string }> {
    try {
      const user = await this.authRepository.findByVerificationToken(
        verifyEmailDto.token,
      );
      if (!user || !user.isVerificationTokenValid()) {
        throw new InvalidTokenError('verification');
      }

      user.verifyEmail();
      await this.authRepository.save(user);

      return { message: 'Email verified successfully' };
    } catch (error: unknown) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Email verification failed', 500);
    }
  }

  /**
   * RESEND VERIFICATION EMAIL - NO CHANGES
   */
  async resendVerificationEmail(email: string): Promise<{ message: string }> {
    try {
      console.log('Resend verification called for email:', email);
      
      const user = await this.authRepository.findByEmail(email);
      if (!user) {
        // Don't reveal if user exists or not for security
        return {
          message: 'If an account exists with this email, a verification link will be sent',
        };
      }

      if (user.getIsVerified()) {
        return { message: 'Email is already verified' };
      }

      user.generateVerificationToken();
      await this.authRepository.save(user);

      const verificationToken = user.getVerificationToken();
      if (verificationToken) {
        try {
          await this.sendVerificationEmail(user.getEmail(), verificationToken);
          return { message: 'Verification email sent successfully' };
        } catch (emailError) {
          console.error('Failed to send verification email:', emailError);
          // Still return success to user but log the error
          return { message: 'Verification requested. Please try again later if you don\'t receive an email.' };
        }
      }

      return { message: 'Verification email sent' };
    } catch (error: unknown) {
      console.error('Resend verification error:', error);
      throw new AppError('Resend verification failed', 500);
    }
  }

  /**
   * REFRESH TOKEN - NO CHANGES
   */
  async refreshToken(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<{ token: string; refreshToken: string }> {
    try {
      const user = await this.authRepository.findByRefreshToken(
        refreshTokenDto.refreshToken,
      );
      if (!user) {
        throw new InvalidTokenError('refresh');
      }

      try {
        this.jwtService.verify(refreshTokenDto.refreshToken, {
          secret:
            this.configService.get<string>('JWT_REFRESH_SECRET') ||
            'refresh-secret',
        });
      } catch (error) {
        user.clearRefreshToken();
        await this.authRepository.save(user);
        throw new TokenExpiredError();
      }

      const token = this.generateAccessToken(user.getId());
      const newRefreshToken = this.generateRefreshToken(user.getId());

      user.setRefreshToken(newRefreshToken);
      await this.authRepository.save(user);

      return {
        token,
        refreshToken: newRefreshToken,
      };
    } catch (error: unknown) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Token refresh failed', 500);
    }
  }

  /**
   * VALIDATE RESET TOKEN - SINGLE IMPLEMENTATION
   */
  async validateResetToken(token: string): Promise<{
    valid: boolean;
    email?: string;
    message: string;
  }> {
    try {
      const user = await this.authRepository.findByResetToken(token);
      if (!user || !user.isResetTokenValid()) {
        return {
          valid: false,
          message: 'Invalid or expired reset token',
        };
      }

      return {
        valid: true,
        email: user.getEmail(),
        message: 'Token is valid',
      };
    } catch (error) {
      return {
        valid: false,
        message: 'Error validating token',
      };
    }
  }

  /**
   * REQUEST PASSWORD RESET
   */
  async requestPasswordReset(email: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const user = await this.authRepository.findByEmail(email);
      if (!user) {
        // Don't reveal user existence
        return {
          success: true,
          message: 'If an account exists, reset instructions will be sent',
        };
      }

      // Check if too many reset requests (limit to 5 per hour)
      const resetAttempts = user.getResetAttempts();
      if (resetAttempts >= 5) {
        return {
          success: false,
          message: 'Too many reset attempts. Please try again later.',
        };
      }

      user.generateResetToken();
      user.incrementResetAttempts();
      await this.authRepository.save(user);

      const resetToken = user.getResetPasswordToken();
      if (resetToken) {
        await this.sendPasswordResetEmail(user.getEmail(), resetToken);
      }

      return {
        success: true,
        message: 'Password reset email sent',
      };
    } catch (error) {
      throw new AppError('Password reset request failed', 500);
    }
  }

  /**
   * LOGOUT - NO CHANGES
   */
  async logout(userId: string): Promise<{ message: string }> {
    try {
      const user = await this.authRepository.findById(userId);
      if (!user) {
        throw new UserNotFoundError();
      }

      user.clearRefreshToken();
      await this.authRepository.save(user);

      return { message: 'Logged out successfully' };
    } catch (error: unknown) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Logout failed', 500);
    }
  }

  /**
   * UPDATE PROFILE - NO CHANGES
   */
  async updateProfile(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<UserResponseDto> {
    try {
      const user = await this.authRepository.findById(userId);
      if (!user) {
        throw new UserNotFoundError();
      }

      user.updateProfile(updateProfileDto);
      const updatedUser = await this.authRepository.save(user);

      return UserMapper.toResponseDto(updatedUser);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Profile update failed', 500);
    }
  }

  /**
   * GET PROFILE - NO CHANGES
   */
  async getProfile(userId: string): Promise<UserResponseDto> {
    try {
      const user = await this.authRepository.findById(userId);
      if (!user) {
        throw new UserNotFoundError();
      }

      return UserMapper.toResponseDto(user);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Get profile failed', 500);
    }
  }

  /**
   * DELETE ACCOUNT - NO CHANGES
   */
  async deleteAccount(userId: string): Promise<{ message: string }> {
    try {
      const user = await this.authRepository.findById(userId);
      if (!user) {
        throw new UserNotFoundError();
      }

      user.deactivate();
      await this.authRepository.save(user);

      return { message: 'Account deleted successfully' };
    } catch (error: unknown) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Delete account failed', 500);
    }
  }

  /**
   * VALIDATE USER (for JWT strategy) - NO CHANGES
   */
  async validateUser(userId: string): Promise<UserDomain | null> {
    try {
      const user = await this.authRepository.findById(userId);
      if (!user || !user.getIsActive()) {
        return null;
      }
      return user;
    } catch (error) {
      return null;
    }
  }

  /**
   * CHECK EMAIL AVAILABILITY - NO CHANGES
   */
  async checkEmailAvailability(
    email: string,
  ): Promise<{ available: boolean; message: string }> {
    try {
      const exists = await this.authRepository.existsByEmail(email);
      if (exists) {
        return {
          available: false,
          message: 'Email is already registered',
        };
      }
      return {
        available: true,
        message: 'Email is available',
      };
    } catch (error: unknown) {
      throw new AppError('Check email availability failed', 500);
    }
  }

  /**
   * PRIVATE HELPER METHODS - NO CHANGES
   */
  private generateAccessToken(userId: string): string {
    const expiresIn =
      this.configService.get<string>('JWT_ACCESS_EXPIRES_IN') || '15m';
    const secret =
      this.configService.get<string>('JWT_SECRET') || 'default-secret';

    if (!secret) {
      throw new Error('JWT_SECRET is not configured');
    }

    const payload: TokenPayload = {
      id: userId,
      type: 'access',
    };

    const expiresInSeconds = this.parseTimeStringToSeconds(expiresIn);

    const options: JwtSignOptions = {
      secret: secret,
      expiresIn: expiresInSeconds,
    };

    return this.jwtService.sign(payload, options);
  }

  // Add session tracking methods
  async getActiveSessions(userId: string): Promise<Array<{
    device: string;
    ip: string;
    location: string;
    lastActive: Date;
    current: boolean;
  }>> {
    // In production, store sessions in Redis or database
    // For now, return mock data
    return [
      {
        device: 'Chrome on Windows',
        ip: '192.168.1.100',
        location: 'New York, US',
        lastActive: new Date(),
        current: true,
      },
    ];
  }

  async logoutFromDevice(userId: string, sessionId: string): Promise<void> {
    // Implement session invalidation
    // This would remove specific session from storage
  }

  async logoutFromAllDevices(userId: string): Promise<void> {
    const user = await this.authRepository.findById(userId);
    if (user) {
      user.clearRefreshToken(); // Clear all refresh tokens
      await this.authRepository.save(user);
    }

    // Also clear any session storage
  }

  private generateRefreshToken(userId: string): string {
    const expiresIn =
      this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d';
    const secret =
      this.configService.get<string>('JWT_REFRESH_SECRET') || 'refresh-secret';

    if (!secret) {
      throw new Error('JWT_REFRESH_SECRET is not configured');
    }

    const payload: TokenPayload = {
      id: userId,
      type: 'refresh',
    };

    const expiresInSeconds = this.parseTimeStringToSeconds(expiresIn);

    const options: JwtSignOptions = {
      secret: secret,
      expiresIn: expiresInSeconds,
    };

    return this.jwtService.sign(payload, options);
  }

  /**
   * EMAIL CHANGE METHODS
   */
  async requestEmailChange(
    userId: string,
    newEmail: string,
  ): Promise<{ message: string }> {
    try {
      const user = await this.authRepository.findById(userId);
      if (!user) {
        throw new UserNotFoundError();
      }

      // Check if new email already exists
      const existingUser = await this.authRepository.findByEmail(newEmail);
      if (existingUser) {
        throw new AppError('Email already in use', 409);
      }

      // Generate email change token
      const changeToken = this.generateEmailChangeToken(userId, newEmail);

      // Send verification email to new address
      await this.sendEmailChangeVerification(newEmail, changeToken);

      return {
        message: 'Verification email sent to new address',
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Email change request failed', 500);
    }
  }

  async confirmEmailChange(token: string): Promise<{ message: string }> {
    try {
      // Verify token and extract userId and newEmail
      const payload = this.verifyEmailChangeToken(token);

      const user = await this.authRepository.findById(payload.userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Update email
      user.updateEmail(payload.newEmail);
      await this.authRepository.save(user);

      // Send confirmation to old email (optional)

      return {
        message: 'Email updated successfully',
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Email change confirmation failed', 500);
    }
  }

  private generateEmailChangeToken(userId: string, newEmail: string): string {
    // Simple token generation
    return `${userId}-${newEmail}-${Date.now()}-${Math.random().toString(36).substring(2)}`;
  }

  private verifyEmailChangeToken(token: string): { userId: string; newEmail: string } {
    const parts = token.split('-');
    if (parts.length < 3) {
      throw new AppError('Invalid email change token', 400);
    }
    return {
      userId: parts[0],
      newEmail: parts[1],
    };
  }

  private async sendEmailChangeVerification(newEmail: string, token: string): Promise<void> {
    // Send verification email
    await this.emailService.sendVerificationEmail(newEmail, token);
  }

  private parseTimeStringToSeconds(timeString: string): number {
    const DEFAULT_SECONDS = 15 * 60;

    if (!timeString || typeof timeString !== 'string') {
      return DEFAULT_SECONDS;
    }

    const normalized = timeString.trim().toLowerCase();
    const match = normalized.match(/^(\d+)([smhd])?$/);

    if (!match) {
      console.warn(
        `Unrecognized JWT time format: "${timeString}". Using default ${DEFAULT_SECONDS} seconds.`,
      );
      return DEFAULT_SECONDS;
    }

    const value = parseInt(match[1], 10);
    const unit = match[2] || 'm';

    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 60 * 60;
      case 'd':
        return value * 24 * 60 * 60;
      default:
        return value * 60;
    }
  }

  private async sendVerificationEmail(
    email: string,
    token: string,
  ): Promise<void> {
    await this.emailService.sendVerificationEmail(email, token);
  }

  private async sendPasswordResetEmail(
    email: string,
    token: string,
  ): Promise<void> {
    await this.emailService.sendPasswordResetEmail(email, token);
  }
}