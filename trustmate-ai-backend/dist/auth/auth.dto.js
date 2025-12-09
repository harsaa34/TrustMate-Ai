"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPasswordLinkResponseDto = exports.VerifyReceiptResponseDto = exports.ExpenseSummaryResponseDto = exports.UploadReceiptResponseDto = exports.RefreshTokenResponseDto = exports.ValidateTokenResponseDto = exports.CheckEmailResponseDto = exports.VerifyEmailResponseDto = exports.SimpleSuccessResponseDto = exports.AuthResponseDto = exports.UpdateProfileDto = exports.RefreshTokenDto = exports.VerifyEmailDto = exports.ResetPasswordDto = exports.ForgotPasswordDto = exports.ChangePasswordDto = exports.LoginDto = exports.SignUpDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const user_dto_1 = require("../user/user.dto");
class SignUpDto {
    email;
    password;
    name;
    phone;
}
exports.SignUpDto = SignUpDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User email address',
        example: 'user@example.com',
        maxLength: 100,
    }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], SignUpDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User password (must contain uppercase, lowercase, and number)',
        example: 'Password123',
        minLength: 6,
        maxLength: 100,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    (0, class_validator_1.MaxLength)(100),
    (0, class_validator_1.Matches)(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    }),
    __metadata("design:type", String)
], SignUpDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User full name',
        example: 'John Doe',
        minLength: 2,
        maxLength: 50,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], SignUpDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'User phone number',
        example: '+1234567890',
        maxLength: 20,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], SignUpDto.prototype, "phone", void 0);
class LoginDto {
    email;
    password;
}
exports.LoginDto = LoginDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User email address',
        example: 'user@example.com',
    }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], LoginDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User password',
        example: 'Password123',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LoginDto.prototype, "password", void 0);
class ChangePasswordDto {
    currentPassword;
    newPassword;
}
exports.ChangePasswordDto = ChangePasswordDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Current password',
        example: 'OldPassword123',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "currentPassword", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'New password (must contain uppercase, lowercase, and number)',
        example: 'NewPassword456',
        minLength: 6,
        maxLength: 100,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    (0, class_validator_1.MaxLength)(100),
    (0, class_validator_1.Matches)(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message: 'New password must contain at least one uppercase letter, one lowercase letter, and one number',
    }),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "newPassword", void 0);
class ForgotPasswordDto {
    email;
}
exports.ForgotPasswordDto = ForgotPasswordDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email address for password reset',
        example: 'user@example.com',
    }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], ForgotPasswordDto.prototype, "email", void 0);
class ResetPasswordDto {
    token;
    newPassword;
}
exports.ResetPasswordDto = ResetPasswordDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Reset token received via email',
        example: 'abc123-def456-ghi789',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'New password (must contain uppercase, lowercase, and number)',
        example: 'NewPassword456',
        minLength: 6,
        maxLength: 100,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    (0, class_validator_1.MaxLength)(100),
    (0, class_validator_1.Matches)(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message: 'New password must contain at least one uppercase letter, one lowercase letter, and one number',
    }),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "newPassword", void 0);
class VerifyEmailDto {
    token;
}
exports.VerifyEmailDto = VerifyEmailDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Verification token received via email',
        example: 'verification-token-abc123',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VerifyEmailDto.prototype, "token", void 0);
class RefreshTokenDto {
    refreshToken;
}
exports.RefreshTokenDto = RefreshTokenDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Refresh token',
        example: 'refresh-token-xyz789',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RefreshTokenDto.prototype, "refreshToken", void 0);
class UpdateProfileDto {
    name;
    phone;
    bio;
    avatar;
}
exports.UpdateProfileDto = UpdateProfileDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'User full name',
        example: 'John Smith',
        minLength: 2,
        maxLength: 50,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'User phone number',
        example: '+9876543210',
        maxLength: 20,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'User biography',
        example: 'Software developer with 5 years of experience',
        maxLength: 500,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "bio", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Profile avatar URL',
        example: 'https://example.com/avatar.jpg',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "avatar", void 0);
class AuthResponseDto {
    token;
    refreshToken;
    user;
    sessionId;
    security;
}
exports.AuthResponseDto = AuthResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'JWT access token',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    }),
    __metadata("design:type", String)
], AuthResponseDto.prototype, "token", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Refresh token',
        example: 'refresh-token-xyz789',
    }),
    __metadata("design:type", String)
], AuthResponseDto.prototype, "refreshToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User information',
        type: user_dto_1.UserResponseDto,
    }),
    __metadata("design:type", user_dto_1.UserResponseDto)
], AuthResponseDto.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Session ID',
        example: 'session-abc123-def456',
    }),
    __metadata("design:type", String)
], AuthResponseDto.prototype, "sessionId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Security information',
        example: {
            lastLogin: '2024-01-15T10:30:00.000Z',
            failedAttempts: 0,
            requires2FA: false,
        },
    }),
    __metadata("design:type", Object)
], AuthResponseDto.prototype, "security", void 0);
class SimpleSuccessResponseDto {
    message;
    data;
}
exports.SimpleSuccessResponseDto = SimpleSuccessResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Success message',
        example: 'Operation completed successfully',
    }),
    __metadata("design:type", String)
], SimpleSuccessResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional data',
        example: { timestamp: '2024-01-15T10:30:00.000Z' },
    }),
    __metadata("design:type", Object)
], SimpleSuccessResponseDto.prototype, "data", void 0);
class VerifyEmailResponseDto extends SimpleSuccessResponseDto {
    verified;
}
exports.VerifyEmailResponseDto = VerifyEmailResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether email was verified',
        example: true,
    }),
    __metadata("design:type", Boolean)
], VerifyEmailResponseDto.prototype, "verified", void 0);
class CheckEmailResponseDto {
    available;
    message;
}
exports.CheckEmailResponseDto = CheckEmailResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether email is available',
        example: true,
    }),
    __metadata("design:type", Boolean)
], CheckEmailResponseDto.prototype, "available", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Message',
        example: 'Email is available for registration',
    }),
    __metadata("design:type", String)
], CheckEmailResponseDto.prototype, "message", void 0);
class ValidateTokenResponseDto {
    valid;
    user;
}
exports.ValidateTokenResponseDto = ValidateTokenResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether token is valid',
        example: true,
    }),
    __metadata("design:type", Boolean)
], ValidateTokenResponseDto.prototype, "valid", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User information',
        type: user_dto_1.UserResponseDto,
    }),
    __metadata("design:type", user_dto_1.UserResponseDto)
], ValidateTokenResponseDto.prototype, "user", void 0);
class RefreshTokenResponseDto {
    token;
    refreshToken;
}
exports.RefreshTokenResponseDto = RefreshTokenResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'New JWT access token',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    }),
    __metadata("design:type", String)
], RefreshTokenResponseDto.prototype, "token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'New refresh token',
        example: 'refresh-token-xyz789',
    }),
    __metadata("design:type", String)
], RefreshTokenResponseDto.prototype, "refreshToken", void 0);
class UploadReceiptResponseDto {
    url;
    filename;
}
exports.UploadReceiptResponseDto = UploadReceiptResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Uploaded file URL',
        example: 'https://storage.example.com/receipts/receipt.jpg',
    }),
    __metadata("design:type", String)
], UploadReceiptResponseDto.prototype, "url", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'File name',
        example: 'receipt.jpg',
    }),
    __metadata("design:type", String)
], UploadReceiptResponseDto.prototype, "filename", void 0);
class ExpenseSummaryResponseDto {
    totalSpent;
    totalExpenses;
    averageExpense;
    topCategory;
    lastExpenseDate;
}
exports.ExpenseSummaryResponseDto = ExpenseSummaryResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total amount spent',
        example: 15000.75,
    }),
    __metadata("design:type", Number)
], ExpenseSummaryResponseDto.prototype, "totalSpent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of expenses',
        example: 25,
    }),
    __metadata("design:type", Number)
], ExpenseSummaryResponseDto.prototype, "totalExpenses", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Average expense amount',
        example: 600.03,
    }),
    __metadata("design:type", Number)
], ExpenseSummaryResponseDto.prototype, "averageExpense", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Top expense category',
        example: 'food',
    }),
    __metadata("design:type", String)
], ExpenseSummaryResponseDto.prototype, "topCategory", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Last expense date',
        example: '2024-01-15T10:30:00.000Z',
    }),
    __metadata("design:type", Date)
], ExpenseSummaryResponseDto.prototype, "lastExpenseDate", void 0);
class VerifyReceiptResponseDto {
    verified;
    confidence;
}
exports.VerifyReceiptResponseDto = VerifyReceiptResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether receipt was verified',
        example: true,
    }),
    __metadata("design:type", Boolean)
], VerifyReceiptResponseDto.prototype, "verified", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Confidence score',
        example: 0.95,
    }),
    __metadata("design:type", Number)
], VerifyReceiptResponseDto.prototype, "confidence", void 0);
class ResetPasswordLinkResponseDto {
    message;
    token;
    valid;
    instructions;
    constructor(data) {
        Object.assign(this, data);
    }
}
exports.ResetPasswordLinkResponseDto = ResetPasswordLinkResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Response message',
        example: 'Token is valid. Use POST /api/auth/reset-password with this token.',
    }),
    __metadata("design:type", String)
], ResetPasswordLinkResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Reset token (if valid)',
        example: 'abc123-def456-ghi789',
    }),
    __metadata("design:type", String)
], ResetPasswordLinkResponseDto.prototype, "token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether token is valid',
        example: true,
    }),
    __metadata("design:type", Boolean)
], ResetPasswordLinkResponseDto.prototype, "valid", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Instructions for resetting password',
        example: 'Send POST request to /api/auth/reset-password with {"token": "abc123", "newPassword": "your-new-password"}',
    }),
    __metadata("design:type", String)
], ResetPasswordLinkResponseDto.prototype, "instructions", void 0);
//# sourceMappingURL=auth.dto.js.map