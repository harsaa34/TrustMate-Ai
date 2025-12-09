import { Request } from 'express';
import { AuthService } from './auth.service';
import { SignUpDto, LoginDto, ForgotPasswordDto, ResetPasswordDto, ChangePasswordDto, UpdateProfileDto, RefreshTokenDto, AuthResponseDto, ResetPasswordLinkResponseDto } from './auth.dto';
import { UserResponseDto } from 'src/user/user.dto';
interface AuthenticatedRequest extends Request {
    user: {
        id: string;
        email: string;
    };
}
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signup(signupDto: SignUpDto): Promise<AuthResponseDto>;
    login(loginDto: LoginDto): Promise<AuthResponseDto>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    verifyEmail(token: string): Promise<{
        message: string;
    }>;
    resendVerificationEmail(email: string): Promise<{
        message: string;
    }>;
    refreshToken(refreshTokenDto: RefreshTokenDto): Promise<{
        token: string;
        refreshToken: string;
    }>;
    handleResetPasswordLink(token: string): Promise<ResetPasswordLinkResponseDto>;
    getProfile(req: AuthenticatedRequest): Promise<UserResponseDto>;
    updateProfile(req: AuthenticatedRequest, updateProfileDto: UpdateProfileDto): Promise<UserResponseDto>;
    changePassword(req: AuthenticatedRequest, changePasswordDto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    logout(req: AuthenticatedRequest): Promise<{
        message: string;
    }>;
    logoutFromAllDevices(req: AuthenticatedRequest): Promise<{
        message: string;
    }>;
    deleteAccount(req: AuthenticatedRequest): Promise<{
        message: string;
    }>;
    checkEmailAvailability(email: string): Promise<{
        available: boolean;
        message: string;
    }>;
    validateToken(req: AuthenticatedRequest): Promise<{
        valid: boolean;
        user: UserResponseDto;
    }>;
}
export {};
