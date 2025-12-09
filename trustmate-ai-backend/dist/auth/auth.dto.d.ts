import { UserResponseDto } from 'src/user/user.dto';
export declare class SignUpDto {
    email: string;
    password: string;
    name: string;
    phone?: string;
}
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
}
export declare class ForgotPasswordDto {
    email: string;
}
export declare class ResetPasswordDto {
    token: string;
    newPassword: string;
}
export declare class VerifyEmailDto {
    token: string;
}
export declare class RefreshTokenDto {
    refreshToken: string;
}
export declare class UpdateProfileDto {
    name?: string;
    phone?: string;
    bio?: string;
    avatar?: string;
}
export declare class AuthResponseDto {
    token: string;
    refreshToken?: string;
    user: UserResponseDto;
    sessionId?: string;
    security?: {
        lastLogin?: Date;
        failedAttempts?: number;
        requires2FA?: boolean;
    };
}
export declare class SimpleSuccessResponseDto {
    message: string;
    data?: Record<string, any>;
}
export declare class VerifyEmailResponseDto extends SimpleSuccessResponseDto {
    verified: boolean;
}
export declare class CheckEmailResponseDto {
    available: boolean;
    message: string;
}
export declare class ValidateTokenResponseDto {
    valid: boolean;
    user: UserResponseDto;
}
export declare class RefreshTokenResponseDto {
    token: string;
    refreshToken: string;
}
export declare class UploadReceiptResponseDto {
    url: string;
    filename: string;
}
export declare class ExpenseSummaryResponseDto {
    totalSpent: number;
    totalExpenses: number;
    averageExpense: number;
    topCategory: string;
    lastExpenseDate: Date;
}
export declare class VerifyReceiptResponseDto {
    verified: boolean;
    confidence: number;
}
export declare class ResetPasswordLinkResponseDto {
    message: string;
    token?: string;
    valid: boolean;
    instructions?: string;
    constructor(data: Partial<ResetPasswordLinkResponseDto>);
}
