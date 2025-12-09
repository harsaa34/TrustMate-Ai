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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const auth_dto_1 = require("./auth.dto");
const user_dto_1 = require("../user/user.dto");
const api_decorator_1 = require("../shared/Decorator/api.decorator");
const jwt_auth_guard_1 = require("./guard/jwt-auth.guard");
const user_error_1 = require("../user/user.error");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async signup(signupDto) {
        return this.authService.signup(signupDto);
    }
    async login(loginDto) {
        return this.authService.login(loginDto);
    }
    async forgotPassword(forgotPasswordDto) {
        return this.authService.forgotPassword(forgotPasswordDto);
    }
    async resetPassword(resetPasswordDto) {
        return this.authService.resetPassword(resetPasswordDto);
    }
    async verifyEmail(token) {
        const verifyEmailDto = { token };
        return this.authService.verifyEmail(verifyEmailDto);
    }
    async resendVerificationEmail(email) {
        return this.authService.resendVerificationEmail(email);
    }
    async refreshToken(refreshTokenDto) {
        return this.authService.refreshToken(refreshTokenDto);
    }
    async handleResetPasswordLink(token) {
        const user = await this.authService.validateResetToken(token);
        if (!user) {
            return new auth_dto_1.ResetPasswordLinkResponseDto({
                message: 'Invalid or expired token',
                valid: false
            });
        }
        return new auth_dto_1.ResetPasswordLinkResponseDto({
            message: 'Token is valid. Use POST /api/auth/reset-password with this token.',
            token: token,
            valid: true,
            instructions: 'Send POST request to /api/auth/reset-password with {"token": "' + token + '", "newPassword": "your-new-password"}'
        });
    }
    async getProfile(req) {
        const userId = req.user.id;
        return this.authService.getProfile(userId);
    }
    async updateProfile(req, updateProfileDto) {
        const userId = req.user.id;
        return this.authService.updateProfile(userId, updateProfileDto);
    }
    async changePassword(req, changePasswordDto) {
        const userId = req.user.id;
        return this.authService.changePassword(userId, changePasswordDto);
    }
    async logout(req) {
        const userId = req.user.id;
        return this.authService.logout(userId);
    }
    async logoutFromAllDevices(req) {
        const userId = req.user.id;
        return this.authService.logout(userId);
    }
    async deleteAccount(req) {
        const userId = req.user.id;
        return this.authService.deleteAccount(userId);
    }
    async checkEmailAvailability(email) {
        return this.authService.checkEmailAvailability(email);
    }
    async validateToken(req) {
        const userId = req.user.id;
        const user = await this.authService.getProfile(userId);
        return {
            valid: true,
            user,
        };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, api_decorator_1.Api)({
        isPublic: true,
        verb: 'POST',
        path: 'signup',
        description: 'Register a new user account',
        swaggerSuccessResponse: auth_dto_1.AuthResponseDto,
        swaggerRequestErrors: [
            user_error_1.UserAlreadyExistsError,
            user_error_1.PasswordValidationError,
            user_error_1.UserUpdateError,
        ],
        httpCode: 201,
    }),
    (0, common_1.Post)('signup'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.SignUpDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signup", null);
__decorate([
    (0, api_decorator_1.Api)({
        isPublic: true,
        verb: 'POST',
        path: 'login',
        description: 'Authenticate user and return JWT tokens',
        swaggerSuccessResponse: auth_dto_1.AuthResponseDto,
        swaggerRequestErrors: [
            user_error_1.InvalidCredentialsError,
            user_error_1.AccountNotVerifiedError,
            user_error_1.AccountDeactivatedError,
        ],
    }),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, api_decorator_1.Api)({
        isPublic: true,
        verb: 'POST',
        path: 'forgot-password',
        description: 'Request password reset email',
        swaggerSuccessResponse: { message: String },
        swaggerRequestErrors: [],
    }),
    (0, common_1.Post)('forgot-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.ForgotPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, api_decorator_1.Api)({
        isPublic: true,
        verb: 'POST',
        path: 'reset-password',
        description: 'Reset password using reset token',
        swaggerSuccessResponse: { message: String },
        swaggerRequestErrors: [
            user_error_1.InvalidTokenError,
            user_error_1.TokenExpiredError,
            user_error_1.PasswordValidationError,
        ],
    }),
    (0, common_1.Post)('reset-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, api_decorator_1.Api)({
        isPublic: true,
        verb: 'GET',
        path: 'verify-email',
        description: 'Verify email address using verification token',
        swaggerSuccessResponse: { message: String },
        swaggerRequestErrors: [user_error_1.InvalidTokenError, user_error_1.TokenExpiredError],
    }),
    (0, common_1.Get)('verify-email'),
    __param(0, (0, common_1.Query)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyEmail", null);
__decorate([
    (0, api_decorator_1.Api)({
        isPublic: true,
        verb: 'POST',
        path: 'resend-verification',
        description: 'Resend verification email',
        swaggerSuccessResponse: { message: String },
        swaggerRequestErrors: [],
    }),
    (0, common_1.Post)('resend-verification'),
    __param(0, (0, common_1.Body)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resendVerificationEmail", null);
__decorate([
    (0, api_decorator_1.Api)({
        isPublic: true,
        verb: 'POST',
        path: 'refresh-token',
        description: 'Refresh access token using refresh token',
        swaggerSuccessResponse: { token: String, refreshToken: String },
        swaggerRequestErrors: [user_error_1.InvalidTokenError, user_error_1.TokenExpiredError],
    }),
    (0, common_1.Post)('refresh-token'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.RefreshTokenDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.Get)('reset-password'),
    (0, api_decorator_1.Api)({
        isPublic: true,
        verb: 'GET',
        path: 'reset-password',
        description: 'Handle reset password link from email',
        swaggerSuccessResponse: auth_dto_1.ResetPasswordLinkResponseDto,
    }),
    __param(0, (0, common_1.Query)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "handleResetPasswordLink", null);
__decorate([
    (0, api_decorator_1.Api)({
        isPublic: false,
        verb: 'GET',
        path: 'profile',
        description: 'Get authenticated user profile',
        swaggerSuccessResponse: user_dto_1.UserResponseDto,
        swaggerRequestErrors: [user_error_1.UserNotFoundError],
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('profile'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, api_decorator_1.Api)({
        isPublic: false,
        verb: 'PUT',
        path: 'profile',
        description: 'Update authenticated user profile',
        swaggerSuccessResponse: user_dto_1.UserResponseDto,
        swaggerRequestErrors: [user_error_1.UserNotFoundError, user_error_1.UserUpdateError],
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)('profile'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, auth_dto_1.UpdateProfileDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateProfile", null);
__decorate([
    (0, api_decorator_1.Api)({
        isPublic: false,
        verb: 'POST',
        path: 'change-password',
        description: 'Change user password',
        swaggerSuccessResponse: { message: String },
        swaggerRequestErrors: [
            user_error_1.UserNotFoundError,
            user_error_1.InvalidCredentialsError,
            user_error_1.PasswordValidationError,
        ],
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('change-password'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, auth_dto_1.ChangePasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "changePassword", null);
__decorate([
    (0, api_decorator_1.Api)({
        isPublic: false,
        verb: 'POST',
        path: 'logout',
        description: 'Logout user and invalidate refresh token',
        swaggerSuccessResponse: { message: String },
        swaggerRequestErrors: [user_error_1.UserNotFoundError],
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, api_decorator_1.Api)({
        isPublic: false,
        verb: 'POST',
        path: 'logout-all',
        description: 'Logout user from all devices',
        swaggerSuccessResponse: { message: String },
        swaggerRequestErrors: [user_error_1.UserNotFoundError],
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('logout-all'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logoutFromAllDevices", null);
__decorate([
    (0, api_decorator_1.Api)({
        isPublic: false,
        verb: 'DELETE',
        path: 'account',
        description: 'Delete user account (soft delete)',
        swaggerSuccessResponse: { message: String },
        swaggerRequestErrors: [user_error_1.UserNotFoundError],
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)('account'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "deleteAccount", null);
__decorate([
    (0, api_decorator_1.Api)({
        isPublic: true,
        verb: 'GET',
        path: 'check-email/:email',
        description: 'Check if email is available for registration',
        swaggerSuccessResponse: { available: Boolean, message: String },
        swaggerRequestErrors: [],
    }),
    (0, common_1.Get)('check-email/:email'),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "checkEmailAvailability", null);
__decorate([
    (0, api_decorator_1.Api)({
        isPublic: false,
        verb: 'GET',
        path: 'validate',
        description: 'Validate JWT token',
        swaggerSuccessResponse: { valid: Boolean, user: user_dto_1.UserResponseDto },
        swaggerRequestErrors: [],
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('validate'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "validateToken", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Authentication'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map