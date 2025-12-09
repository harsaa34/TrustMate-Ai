import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserDomain } from '../user/user.domain';
import { EmailService } from '../shared/services/email.service';
import { SignUpDto, LoginDto, ForgotPasswordDto, ResetPasswordDto, ChangePasswordDto, UpdateProfileDto, VerifyEmailDto, RefreshTokenDto, AuthResponseDto } from './auth.dto';
import { UserResponseDto } from 'src/user/user.dto';
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
export declare class AuthService {
    private authRepository;
    private jwtService;
    private configService;
    private emailService;
    constructor(authRepository: IAuthRepository, jwtService: JwtService, configService: ConfigService, emailService: EmailService);
    signup(signupDto: SignUpDto): Promise<AuthResponseDto>;
    login(loginDto: LoginDto): Promise<AuthResponseDto>;
    private checkRateLimit;
    private incrementFailedAttempt;
    private clearRateLimit;
    private getClientIp;
    private getUserAgent;
    private getDeviceInfo;
    private createSession;
    private generateSessionId;
    private sendSecurityAlertEmail;
    private sendLoginNotificationEmail;
    private getLocationFromIp;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<{
        message: string;
    }>;
    resendVerificationEmail(email: string): Promise<{
        message: string;
    }>;
    refreshToken(refreshTokenDto: RefreshTokenDto): Promise<{
        token: string;
        refreshToken: string;
    }>;
    validateResetToken(token: string): Promise<{
        valid: boolean;
        email?: string;
        message: string;
    }>;
    requestPasswordReset(email: string): Promise<{
        success: boolean;
        message: string;
    }>;
    logout(userId: string): Promise<{
        message: string;
    }>;
    updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<UserResponseDto>;
    getProfile(userId: string): Promise<UserResponseDto>;
    deleteAccount(userId: string): Promise<{
        message: string;
    }>;
    validateUser(userId: string): Promise<UserDomain | null>;
    checkEmailAvailability(email: string): Promise<{
        available: boolean;
        message: string;
    }>;
    private generateAccessToken;
    getActiveSessions(userId: string): Promise<Array<{
        device: string;
        ip: string;
        location: string;
        lastActive: Date;
        current: boolean;
    }>>;
    logoutFromDevice(userId: string, sessionId: string): Promise<void>;
    logoutFromAllDevices(userId: string): Promise<void>;
    private generateRefreshToken;
    requestEmailChange(userId: string, newEmail: string): Promise<{
        message: string;
    }>;
    confirmEmailChange(token: string): Promise<{
        message: string;
    }>;
    private generateEmailChangeToken;
    private verifyEmailChangeToken;
    private sendEmailChangeVerification;
    private parseTimeStringToSeconds;
    private sendVerificationEmail;
    private sendPasswordResetEmail;
}
