"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const user_domain_1 = require("../user/user.domain");
const user_mapper_1 = require("../shared/database/mapper/user.mapper");
const app_error_1 = require("../shared/types/app-error");
const email_service_1 = require("../shared/services/email.service");
const crypto = __importStar(require("crypto"));
const user_error_1 = require("../user/user.error");
let AuthService = class AuthService {
    authRepository;
    jwtService;
    configService;
    emailService;
    constructor(authRepository, jwtService, configService, emailService) {
        this.authRepository = authRepository;
        this.jwtService = jwtService;
        this.configService = configService;
        this.emailService = emailService;
    }
    async signup(signupDto) {
        try {
            const existingUser = await this.authRepository.findByEmail(signupDto.email);
            if (existingUser) {
                throw new user_error_1.UserAlreadyExistsError(signupDto.email);
            }
            const userDomain = await user_domain_1.UserDomain.create({
                email: signupDto.email,
                password: signupDto.password,
                name: signupDto.name,
                phone: signupDto.phone,
            });
            const savedUser = await this.authRepository.create(userDomain);
            const token = this.generateAccessToken(savedUser.getId());
            const refreshToken = this.generateRefreshToken(savedUser.getId());
            savedUser.setRefreshToken(refreshToken);
            await this.authRepository.save(savedUser);
            const verificationToken = savedUser.getVerificationToken();
            if (verificationToken) {
                await this.sendVerificationEmail(savedUser.getEmail(), verificationToken);
            }
            return {
                token,
                refreshToken,
                user: user_mapper_1.UserMapper.toResponseDto(savedUser),
            };
        }
        catch (error) {
            if (error instanceof app_error_1.AppError) {
                throw error;
            }
            throw new app_error_1.AppError('Signup failed', 500);
        }
    }
    async login(loginDto) {
        try {
            if (!loginDto.email || !loginDto.password) {
                throw new app_error_1.AppError('Email and password are required', 400);
            }
            const ip = this.getClientIp();
            const rateLimitKey = `login_rate:${ip}:${loginDto.email}`;
            const isRateLimited = await this.checkRateLimit(rateLimitKey);
            if (isRateLimited) {
                throw new app_error_1.AppError('Too many login attempts. Please try again in 15 minutes.', 429);
            }
            const user = await this.authRepository.findByEmail(loginDto.email);
            if (!user) {
                await this.incrementFailedAttempt(rateLimitKey, loginDto.email);
                throw new user_error_1.InvalidCredentialsError();
            }
            if (user.isAccountLocked()) {
                const remainingTime = user.getRemainingLockTime();
                const minutes = Math.ceil(remainingTime / (60 * 1000));
                if (minutes > 0) {
                    throw new app_error_1.AppError(`Account locked due to multiple failed attempts. Please try again in ${minutes} minute${minutes > 1 ? 's' : ''}.`, 423);
                }
                else {
                    user.resetFailedAttempts();
                }
            }
            if (!user.getIsActive()) {
                throw new user_error_1.AccountDeactivatedError();
            }
            const isValidPassword = await user.validatePassword(loginDto.password);
            if (!isValidPassword) {
                user.incrementFailedAttempts();
                await this.authRepository.save(user);
                await this.incrementFailedAttempt(rateLimitKey, loginDto.email);
                if (user.shouldLockAccount()) {
                    user.lockAccount();
                    await this.authRepository.save(user);
                    await this.sendSecurityAlertEmail(user.getEmail(), 'Multiple failed login attempts', 'Your account has been locked due to multiple failed login attempts.');
                    throw new app_error_1.AppError('Account locked due to multiple failed attempts. Please check your email for instructions.', 423);
                }
                const attemptsLeft = user.getRemainingAttempts();
                const message = attemptsLeft > 0
                    ? `Invalid password. ${attemptsLeft} attempt${attemptsLeft > 1 ? 's' : ''} remaining.`
                    : 'Invalid password.';
                throw new app_error_1.AppError(message, 401);
            }
            if (!user.getIsVerified() && user.requiresEmailVerification()) {
                if (user.shouldResendVerification()) {
                    user.generateVerificationToken();
                    await this.authRepository.save(user);
                    const verificationToken = user.getVerificationToken();
                    if (verificationToken) {
                        await this.sendVerificationEmail(user.getEmail(), verificationToken);
                    }
                }
                throw new user_error_1.AccountNotVerifiedError();
            }
            user.resetFailedAttempts();
            const token = this.generateAccessToken(user.getId());
            const refreshToken = this.generateRefreshToken(user.getId());
            user.setRefreshToken(refreshToken);
            user.setLoginInfo({
                ip: ip,
                userAgent: this.getUserAgent(),
                timestamp: new Date()
            });
            const sessionId = await this.createSession(user.getId(), {
                ip,
                userAgent: this.getUserAgent(),
                deviceInfo: this.getDeviceInfo()
            });
            await this.authRepository.save(user);
            await this.clearRateLimit(rateLimitKey);
            if (user.shouldSendLoginNotification()) {
                await this.sendLoginNotificationEmail(user.getEmail(), {
                    ip,
                    location: await this.getLocationFromIp(ip),
                    device: this.getDeviceInfo(),
                    timestamp: new Date()
                });
            }
            return {
                token,
                refreshToken,
                user: user_mapper_1.UserMapper.toResponseDto(user),
                sessionId,
                security: {
                    lastLogin: user.getLastLogin(),
                    failedAttempts: 0,
                    requires2FA: user.has2FAEnabled()
                }
            };
        }
        catch (error) {
            console.error('Login error:', {
                email: loginDto.email,
                error: error,
                timestamp: new Date().toISOString()
            });
            if (error instanceof app_error_1.AppError) {
                throw error;
            }
            if (this.configService.get('NODE_ENV') === 'production') {
                throw new app_error_1.AppError('Login failed. Please try again.', 500);
            }
            else {
                throw new app_error_1.AppError(`Login failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 500);
            }
        }
    }
    async checkRateLimit(key) {
        return false;
    }
    async incrementFailedAttempt(key, email) {
        console.log(`Failed login attempt for email: ${email}`);
    }
    async clearRateLimit(key) {
    }
    getClientIp() {
        return 'unknown';
    }
    getUserAgent() {
        return 'unknown';
    }
    getDeviceInfo() {
        return 'Unknown Device';
    }
    async createSession(userId, sessionData) {
        const sessionId = this.generateSessionId();
        return sessionId;
    }
    generateSessionId() {
        return crypto.randomBytes(32).toString('hex');
    }
    async sendSecurityAlertEmail(email, subject, message) {
        try {
            const html = `
      <h2>Security Alert: ${subject}</h2>
      <p>${message}</p>
      <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
      <p><strong>Action Required:</strong> If this was not you, please secure your account immediately.</p>
    `;
            await this.emailService.sendCustomEmail(email, `Security Alert: ${subject}`, html, `${message}\n\nTimestamp: ${new Date().toLocaleString()}\n\nIf this was not you, please secure your account immediately.`);
        }
        catch (error) {
            console.error('Failed to send security alert email:', error);
        }
    }
    async sendLoginNotificationEmail(email, loginInfo) {
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
            await this.emailService.sendCustomEmail(email, 'New Login Detected', html, text);
        }
        catch (error) {
            console.error('Failed to send login notification email:', error);
        }
    }
    async getLocationFromIp(ip) {
        return 'Unknown location';
    }
    async forgotPassword(forgotPasswordDto) {
        try {
            const user = await this.authRepository.findByEmail(forgotPasswordDto.email);
            if (!user) {
                return {
                    message: 'If an account exists with this email, you will receive a password reset link',
                };
            }
            user.generateResetToken();
            await this.authRepository.save(user);
            const resetToken = user.getResetPasswordToken();
            if (resetToken) {
                await this.sendPasswordResetEmail(user.getEmail(), resetToken);
            }
            return { message: 'Password reset email sent' };
        }
        catch (error) {
            throw new app_error_1.AppError('Forgot password failed', 500);
        }
    }
    async resetPassword(resetPasswordDto) {
        try {
            const user = await this.authRepository.findByResetToken(resetPasswordDto.token);
            if (!user || !user.isResetTokenValid()) {
                throw new user_error_1.InvalidTokenError('reset');
            }
            const passwordValidation = user.validatePasswordStrength(resetPasswordDto.newPassword);
            if (!passwordValidation.valid) {
                throw new user_error_1.PasswordValidationError(passwordValidation.message || 'Invalid password');
            }
            await user.changePassword(resetPasswordDto.newPassword);
            user.clearResetToken();
            await this.authRepository.save(user);
            return { message: 'Password reset successfully' };
        }
        catch (error) {
            if (error instanceof app_error_1.AppError) {
                throw error;
            }
            throw new app_error_1.AppError('Reset password failed', 500);
        }
    }
    async changePassword(userId, changePasswordDto) {
        try {
            const user = await this.authRepository.findById(userId);
            if (!user) {
                throw new user_error_1.UserNotFoundError();
            }
            const isPasswordValid = await user.validatePassword(changePasswordDto.currentPassword);
            if (!isPasswordValid) {
                throw new user_error_1.InvalidCredentialsError();
            }
            if (changePasswordDto.currentPassword === changePasswordDto.newPassword) {
                throw new app_error_1.AppError('New password cannot be the same as current password', 400);
            }
            const passwordValidation = user.validatePasswordStrength(changePasswordDto.newPassword);
            if (!passwordValidation.valid) {
                throw new user_error_1.PasswordValidationError(passwordValidation.message || 'Invalid password');
            }
            await user.changePassword(changePasswordDto.newPassword);
            await this.authRepository.save(user);
            return { message: 'Password changed successfully' };
        }
        catch (error) {
            if (error instanceof app_error_1.AppError) {
                throw error;
            }
            throw new app_error_1.AppError('Change password failed', 500);
        }
    }
    async verifyEmail(verifyEmailDto) {
        try {
            const user = await this.authRepository.findByVerificationToken(verifyEmailDto.token);
            if (!user || !user.isVerificationTokenValid()) {
                throw new user_error_1.InvalidTokenError('verification');
            }
            user.verifyEmail();
            await this.authRepository.save(user);
            return { message: 'Email verified successfully' };
        }
        catch (error) {
            if (error instanceof app_error_1.AppError) {
                throw error;
            }
            throw new app_error_1.AppError('Email verification failed', 500);
        }
    }
    async resendVerificationEmail(email) {
        try {
            console.log('Resend verification called for email:', email);
            const user = await this.authRepository.findByEmail(email);
            if (!user) {
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
                }
                catch (emailError) {
                    console.error('Failed to send verification email:', emailError);
                    return { message: 'Verification requested. Please try again later if you don\'t receive an email.' };
                }
            }
            return { message: 'Verification email sent' };
        }
        catch (error) {
            console.error('Resend verification error:', error);
            throw new app_error_1.AppError('Resend verification failed', 500);
        }
    }
    async refreshToken(refreshTokenDto) {
        try {
            const user = await this.authRepository.findByRefreshToken(refreshTokenDto.refreshToken);
            if (!user) {
                throw new user_error_1.InvalidTokenError('refresh');
            }
            try {
                this.jwtService.verify(refreshTokenDto.refreshToken, {
                    secret: this.configService.get('JWT_REFRESH_SECRET') ||
                        'refresh-secret',
                });
            }
            catch (error) {
                user.clearRefreshToken();
                await this.authRepository.save(user);
                throw new user_error_1.TokenExpiredError();
            }
            const token = this.generateAccessToken(user.getId());
            const newRefreshToken = this.generateRefreshToken(user.getId());
            user.setRefreshToken(newRefreshToken);
            await this.authRepository.save(user);
            return {
                token,
                refreshToken: newRefreshToken,
            };
        }
        catch (error) {
            if (error instanceof app_error_1.AppError) {
                throw error;
            }
            throw new app_error_1.AppError('Token refresh failed', 500);
        }
    }
    async validateResetToken(token) {
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
        }
        catch (error) {
            return {
                valid: false,
                message: 'Error validating token',
            };
        }
    }
    async requestPasswordReset(email) {
        try {
            const user = await this.authRepository.findByEmail(email);
            if (!user) {
                return {
                    success: true,
                    message: 'If an account exists, reset instructions will be sent',
                };
            }
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
        }
        catch (error) {
            throw new app_error_1.AppError('Password reset request failed', 500);
        }
    }
    async logout(userId) {
        try {
            const user = await this.authRepository.findById(userId);
            if (!user) {
                throw new user_error_1.UserNotFoundError();
            }
            user.clearRefreshToken();
            await this.authRepository.save(user);
            return { message: 'Logged out successfully' };
        }
        catch (error) {
            if (error instanceof app_error_1.AppError) {
                throw error;
            }
            throw new app_error_1.AppError('Logout failed', 500);
        }
    }
    async updateProfile(userId, updateProfileDto) {
        try {
            const user = await this.authRepository.findById(userId);
            if (!user) {
                throw new user_error_1.UserNotFoundError();
            }
            user.updateProfile(updateProfileDto);
            const updatedUser = await this.authRepository.save(user);
            return user_mapper_1.UserMapper.toResponseDto(updatedUser);
        }
        catch (error) {
            if (error instanceof app_error_1.AppError) {
                throw error;
            }
            throw new app_error_1.AppError('Profile update failed', 500);
        }
    }
    async getProfile(userId) {
        try {
            const user = await this.authRepository.findById(userId);
            if (!user) {
                throw new user_error_1.UserNotFoundError();
            }
            return user_mapper_1.UserMapper.toResponseDto(user);
        }
        catch (error) {
            if (error instanceof app_error_1.AppError) {
                throw error;
            }
            throw new app_error_1.AppError('Get profile failed', 500);
        }
    }
    async deleteAccount(userId) {
        try {
            const user = await this.authRepository.findById(userId);
            if (!user) {
                throw new user_error_1.UserNotFoundError();
            }
            user.deactivate();
            await this.authRepository.save(user);
            return { message: 'Account deleted successfully' };
        }
        catch (error) {
            if (error instanceof app_error_1.AppError) {
                throw error;
            }
            throw new app_error_1.AppError('Delete account failed', 500);
        }
    }
    async validateUser(userId) {
        try {
            const user = await this.authRepository.findById(userId);
            if (!user || !user.getIsActive()) {
                return null;
            }
            return user;
        }
        catch (error) {
            return null;
        }
    }
    async checkEmailAvailability(email) {
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
        }
        catch (error) {
            throw new app_error_1.AppError('Check email availability failed', 500);
        }
    }
    generateAccessToken(userId) {
        const expiresIn = this.configService.get('JWT_ACCESS_EXPIRES_IN') || '15m';
        const secret = this.configService.get('JWT_SECRET') || 'default-secret';
        if (!secret) {
            throw new Error('JWT_SECRET is not configured');
        }
        const payload = {
            id: userId,
            type: 'access',
        };
        const expiresInSeconds = this.parseTimeStringToSeconds(expiresIn);
        const options = {
            secret: secret,
            expiresIn: expiresInSeconds,
        };
        return this.jwtService.sign(payload, options);
    }
    async getActiveSessions(userId) {
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
    async logoutFromDevice(userId, sessionId) {
    }
    async logoutFromAllDevices(userId) {
        const user = await this.authRepository.findById(userId);
        if (user) {
            user.clearRefreshToken();
            await this.authRepository.save(user);
        }
    }
    generateRefreshToken(userId) {
        const expiresIn = this.configService.get('JWT_REFRESH_EXPIRES_IN') || '7d';
        const secret = this.configService.get('JWT_REFRESH_SECRET') || 'refresh-secret';
        if (!secret) {
            throw new Error('JWT_REFRESH_SECRET is not configured');
        }
        const payload = {
            id: userId,
            type: 'refresh',
        };
        const expiresInSeconds = this.parseTimeStringToSeconds(expiresIn);
        const options = {
            secret: secret,
            expiresIn: expiresInSeconds,
        };
        return this.jwtService.sign(payload, options);
    }
    async requestEmailChange(userId, newEmail) {
        try {
            const user = await this.authRepository.findById(userId);
            if (!user) {
                throw new user_error_1.UserNotFoundError();
            }
            const existingUser = await this.authRepository.findByEmail(newEmail);
            if (existingUser) {
                throw new app_error_1.AppError('Email already in use', 409);
            }
            const changeToken = this.generateEmailChangeToken(userId, newEmail);
            await this.sendEmailChangeVerification(newEmail, changeToken);
            return {
                message: 'Verification email sent to new address',
            };
        }
        catch (error) {
            if (error instanceof app_error_1.AppError) {
                throw error;
            }
            throw new app_error_1.AppError('Email change request failed', 500);
        }
    }
    async confirmEmailChange(token) {
        try {
            const payload = this.verifyEmailChangeToken(token);
            const user = await this.authRepository.findById(payload.userId);
            if (!user) {
                throw new app_error_1.AppError('User not found', 404);
            }
            user.updateEmail(payload.newEmail);
            await this.authRepository.save(user);
            return {
                message: 'Email updated successfully',
            };
        }
        catch (error) {
            if (error instanceof app_error_1.AppError) {
                throw error;
            }
            throw new app_error_1.AppError('Email change confirmation failed', 500);
        }
    }
    generateEmailChangeToken(userId, newEmail) {
        return `${userId}-${newEmail}-${Date.now()}-${Math.random().toString(36).substring(2)}`;
    }
    verifyEmailChangeToken(token) {
        const parts = token.split('-');
        if (parts.length < 3) {
            throw new app_error_1.AppError('Invalid email change token', 400);
        }
        return {
            userId: parts[0],
            newEmail: parts[1],
        };
    }
    async sendEmailChangeVerification(newEmail, token) {
        await this.emailService.sendVerificationEmail(newEmail, token);
    }
    parseTimeStringToSeconds(timeString) {
        const DEFAULT_SECONDS = 15 * 60;
        if (!timeString || typeof timeString !== 'string') {
            return DEFAULT_SECONDS;
        }
        const normalized = timeString.trim().toLowerCase();
        const match = normalized.match(/^(\d+)([smhd])?$/);
        if (!match) {
            console.warn(`Unrecognized JWT time format: "${timeString}". Using default ${DEFAULT_SECONDS} seconds.`);
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
    async sendVerificationEmail(email, token) {
        await this.emailService.sendVerificationEmail(email, token);
    }
    async sendPasswordResetEmail(email, token) {
        await this.emailService.sendPasswordResetEmail(email, token);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('IAuthRepository')),
    __metadata("design:paramtypes", [Object, jwt_1.JwtService,
        config_1.ConfigService,
        email_service_1.EmailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map