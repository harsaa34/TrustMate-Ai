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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const auth_dto_1 = require("../auth/auth.dto");
const api_decorator_1 = require("../shared/Decorator/api.decorator");
const user_dto_1 = require("./user.dto");
const user_service_1 = require("./user.service");
const jwt_auth_guard_1 = require("../auth/guard/jwt-auth.guard");
class AppError extends Error {
    statusCode;
    code;
    constructor(message, statusCode = 400, code) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.name = 'AppError';
    }
}
class UserNotFoundError extends AppError {
    constructor(message = 'User not found') {
        super(message, 404, 'USER_NOT_FOUND');
        this.name = 'UserNotFoundError';
    }
}
class UserAlreadyExistsError extends AppError {
    constructor(message = 'User already exists') {
        super(message, 409, 'USER_ALREADY_EXISTS');
        this.name = 'UserAlreadyExistsError';
    }
}
class InvalidCredentialsError extends AppError {
    constructor(message = 'Invalid credentials') {
        super(message, 401, 'INVALID_CREDENTIALS');
        this.name = 'InvalidCredentialsError';
    }
}
class UserNotActiveError extends AppError {
    constructor(message = 'User account is not active') {
        super(message, 403, 'USER_NOT_ACTIVE');
        this.name = 'UserNotActiveError';
    }
}
let UserController = class UserController {
    _userService;
    constructor(_userService) {
        this._userService = _userService;
    }
    async register(data) {
        const result = await this._userService.register(data);
        if (result instanceof AppError) {
            throw result;
        }
        return result;
    }
    async login(data) {
        const result = await this._userService.login(data);
        if (result instanceof AppError) {
            throw result;
        }
        return result;
    }
    async getProfile(req) {
        const userId = req.user?.id || req.user?._id;
        if (!userId) {
            throw new InvalidCredentialsError('User not authenticated');
        }
        const result = await this._userService.getProfile(userId);
        if (result instanceof AppError) {
            throw result;
        }
        return result;
    }
    async updateProfile(req, data) {
        const userId = req.user?.id || req.user?._id;
        if (!userId) {
            throw new InvalidCredentialsError('User not authenticated');
        }
        const result = await this._userService.updateUser(userId, data);
        if (result instanceof AppError) {
            throw result;
        }
        return result;
    }
    async deleteAccount(req) {
        const userId = req.user?.id || req.user?._id;
        if (!userId) {
            throw new InvalidCredentialsError('User not authenticated');
        }
        const result = await this._userService.deleteAccount(userId);
        if (result instanceof AppError) {
            throw result;
        }
        return new user_dto_1.SuccessResponseDto('Account deleted successfully');
    }
    async changePassword(req, data) {
        const userId = req.user?.id || req.user?._id;
        if (!userId) {
            throw new InvalidCredentialsError('User not authenticated');
        }
        const result = await this._userService.changePassword(userId, data);
        if (result instanceof AppError) {
            throw result;
        }
        return new user_dto_1.SuccessResponseDto('Password changed successfully');
    }
    async deactivateOwnAccount(req) {
        const userId = req.user?.id || req.user?._id;
        if (!userId) {
            throw new InvalidCredentialsError('User not authenticated');
        }
        const result = await this._userService.deactivateUser(userId);
        if (result instanceof AppError) {
            throw result;
        }
        return new user_dto_1.SuccessResponseDto('Account deactivated successfully');
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)('register'),
    (0, api_decorator_1.Api)({
        isPublic: true,
        verb: 'POST',
        path: 'register',
        swaggerSuccessResponse: user_dto_1.UserResponseDto,
        swaggerRequestErrors: [UserAlreadyExistsError],
        description: 'Register a new user',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, api_decorator_1.Api)({
        isPublic: true,
        verb: 'POST',
        path: 'login',
        swaggerSuccessResponse: user_dto_1.LoginResponseDto,
        swaggerRequestErrors: [InvalidCredentialsError, UserNotActiveError],
        description: 'User login',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, api_decorator_1.Api)({
        isPublic: false,
        verb: 'GET',
        path: 'profile',
        swaggerSuccessResponse: user_dto_1.UserResponseDto,
        swaggerRequestErrors: [UserNotFoundError],
        description: 'Get current user profile',
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Put)('profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, api_decorator_1.Api)({
        isPublic: false,
        verb: 'PUT',
        path: 'profile',
        swaggerSuccessResponse: user_dto_1.UserResponseDto,
        swaggerRequestErrors: [UserNotFoundError],
        description: 'Update own profile',
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Delete)('profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, api_decorator_1.Api)({
        isPublic: false,
        verb: 'DELETE',
        path: 'profile',
        swaggerSuccessResponse: user_dto_1.SuccessResponseDto,
        swaggerRequestErrors: [UserNotFoundError],
        description: 'Delete own account',
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteAccount", null);
__decorate([
    (0, common_1.Post)('change-password'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, api_decorator_1.Api)({
        isPublic: false,
        verb: 'POST',
        path: 'change-password',
        swaggerSuccessResponse: user_dto_1.SuccessResponseDto,
        swaggerRequestErrors: [UserNotFoundError, InvalidCredentialsError],
        description: 'Change own password',
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "changePassword", null);
__decorate([
    (0, common_1.Delete)('deactivate'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, api_decorator_1.Api)({
        isPublic: false,
        verb: 'DELETE',
        path: 'deactivate',
        swaggerSuccessResponse: user_dto_1.SuccessResponseDto,
        swaggerRequestErrors: [UserNotFoundError],
        description: 'Deactivate own account',
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deactivateOwnAccount", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map