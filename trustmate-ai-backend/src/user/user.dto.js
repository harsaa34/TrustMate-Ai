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
exports.SuccessResponseDto = exports.LoginResponseDto = exports.UserResponseDto = exports.ChangePasswordDto = exports.UpdateUserDto = exports.CreateUserDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateUserDto {
    email;
    password;
    name;
    phone;
}
exports.CreateUserDto = CreateUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User email address',
        example: 'john.doe@example.com',
    }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User password',
        example: 'SecurePass123!',
        minLength: 6,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User full name',
        example: 'John Doe',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'User phone number',
        example: '+1234567890',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "phone", void 0);
class UpdateUserDto {
    name;
    phone;
    avatar;
    bio;
}
exports.UpdateUserDto = UpdateUserDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'User full name',
        example: 'John Smith',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'User phone number',
        example: '+9876543210',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'User avatar URL',
        example: 'https://example.com/avatar.jpg',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "avatar", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'User biography',
        example: 'Software developer with 5 years of experience',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "bio", void 0);
class ChangePasswordDto {
    currentPassword;
    newPassword;
}
exports.ChangePasswordDto = ChangePasswordDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Current password',
        example: 'OldPassword123!',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "currentPassword", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'New password',
        example: 'NewPassword456!',
        minLength: 6,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "newPassword", void 0);
class UserResponseDto {
    id;
    email;
    name;
    isActive;
    isVerified;
    phone;
    avatar;
    bio;
    createdAt;
    updatedAt;
    constructor(data) {
        this.id = data.id || data._id?.toString();
        this.email = data.email;
        this.name = data.name;
        this.isActive = data.isActive;
        this.isVerified = data.isVerified;
        this.phone = data.phone;
        this.avatar = data.avatar;
        this.bio = data.bio;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }
}
exports.UserResponseDto = UserResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User ID',
        example: '507f1f77bcf86cd799439011',
    }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User email address',
        example: 'john.doe@example.com',
    }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User full name',
        example: 'John Doe',
    }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the user account is active',
        example: true,
    }),
    __metadata("design:type", Boolean)
], UserResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the user email is verified',
        example: true,
    }),
    __metadata("design:type", Boolean)
], UserResponseDto.prototype, "isVerified", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'User phone number',
        example: '+1234567890',
    }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'User avatar URL',
        example: 'https://example.com/avatar.jpg',
    }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "avatar", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'User biography',
        example: 'Software developer with 5 years of experience',
    }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "bio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Account creation date',
        example: '2024-01-15T10:30:00.000Z',
    }),
    __metadata("design:type", Date)
], UserResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Last account update date',
        example: '2024-01-15T10:30:00.000Z',
    }),
    __metadata("design:type", Date)
], UserResponseDto.prototype, "updatedAt", void 0);
class LoginResponseDto {
    token;
    user;
    refreshToken;
    constructor(token, user, refreshToken) {
        this.token = token;
        this.user = user;
        this.refreshToken = refreshToken;
    }
}
exports.LoginResponseDto = LoginResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'JWT token',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjN2YxZjc3YmNmODZjZDc5OTQzOTAxMSIsImlhdCI6MTcwNTIxMDMwMH0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    }),
    __metadata("design:type", String)
], LoginResponseDto.prototype, "token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: UserResponseDto,
        description: 'Authenticated user information',
    }),
    __metadata("design:type", UserResponseDto)
], LoginResponseDto.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Refresh token',
        example: 'refresh-token-xyz123',
    }),
    __metadata("design:type", String)
], LoginResponseDto.prototype, "refreshToken", void 0);
class SuccessResponseDto {
    message;
    constructor(message) {
        this.message = message;
    }
}
exports.SuccessResponseDto = SuccessResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Success message',
        example: 'Operation completed successfully',
    }),
    __metadata("design:type", String)
], SuccessResponseDto.prototype, "message", void 0);
//# sourceMappingURL=user.dto.js.map