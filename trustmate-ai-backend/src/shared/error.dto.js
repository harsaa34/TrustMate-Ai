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
exports.InsufficientPermissionsErrorDto = exports.UserNotActiveErrorDto = exports.AccountDeactivatedErrorDto = exports.PasswordValidationErrorDto = exports.InvalidTokenErrorDto = exports.UserNotFoundErrorDto = exports.InvalidCredentialsErrorDto = exports.UserAlreadyExistsErrorDto = exports.ErrorResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class ErrorResponseDto {
    statusCode;
    message;
    error;
    timestamp;
    path;
}
exports.ErrorResponseDto = ErrorResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'HTTP status code',
        example: 400,
    }),
    __metadata("design:type", Number)
], ErrorResponseDto.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Error message',
        example: 'Invalid input data',
    }),
    __metadata("design:type", String)
], ErrorResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Error type',
        example: 'Bad Request',
    }),
    __metadata("design:type", String)
], ErrorResponseDto.prototype, "error", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Timestamp',
        example: '2024-01-15T10:30:00.000Z',
    }),
    __metadata("design:type", String)
], ErrorResponseDto.prototype, "timestamp", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Request path',
        example: '/api/groups/groupId/settlements',
    }),
    __metadata("design:type", String)
], ErrorResponseDto.prototype, "path", void 0);
class UserAlreadyExistsErrorDto extends ErrorResponseDto {
    statusCode = 409;
    message = 'User already exists';
    error = 'Conflict';
}
exports.UserAlreadyExistsErrorDto = UserAlreadyExistsErrorDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 409,
        description: 'HTTP status code',
    }),
    __metadata("design:type", Number)
], UserAlreadyExistsErrorDto.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'User with email user@example.com already exists',
        description: 'Error message',
    }),
    __metadata("design:type", String)
], UserAlreadyExistsErrorDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Conflict',
        description: 'Error type',
    }),
    __metadata("design:type", String)
], UserAlreadyExistsErrorDto.prototype, "error", void 0);
class InvalidCredentialsErrorDto extends ErrorResponseDto {
    statusCode = 401;
    message = 'Invalid credentials';
    error = 'Unauthorized';
}
exports.InvalidCredentialsErrorDto = InvalidCredentialsErrorDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 401,
        description: 'HTTP status code',
    }),
    __metadata("design:type", Number)
], InvalidCredentialsErrorDto.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Invalid email or password',
        description: 'Error message',
    }),
    __metadata("design:type", String)
], InvalidCredentialsErrorDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Unauthorized',
        description: 'Error type',
    }),
    __metadata("design:type", String)
], InvalidCredentialsErrorDto.prototype, "error", void 0);
class UserNotFoundErrorDto extends ErrorResponseDto {
    statusCode = 404;
    message = 'User not found';
    error = 'Not Found';
}
exports.UserNotFoundErrorDto = UserNotFoundErrorDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 404,
        description: 'HTTP status code',
    }),
    __metadata("design:type", Number)
], UserNotFoundErrorDto.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'User not found',
        description: 'Error message',
    }),
    __metadata("design:type", String)
], UserNotFoundErrorDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Not Found',
        description: 'Error type',
    }),
    __metadata("design:type", String)
], UserNotFoundErrorDto.prototype, "error", void 0);
class InvalidTokenErrorDto extends ErrorResponseDto {
    statusCode = 400;
    message = 'Invalid token';
    error = 'Bad Request';
}
exports.InvalidTokenErrorDto = InvalidTokenErrorDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 400,
        description: 'HTTP status code',
    }),
    __metadata("design:type", Number)
], InvalidTokenErrorDto.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Invalid or expired token',
        description: 'Error message',
    }),
    __metadata("design:type", String)
], InvalidTokenErrorDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Bad Request',
        description: 'Error type',
    }),
    __metadata("design:type", String)
], InvalidTokenErrorDto.prototype, "error", void 0);
class PasswordValidationErrorDto extends ErrorResponseDto {
    statusCode = 400;
    message = 'Password validation failed';
    error = 'Bad Request';
}
exports.PasswordValidationErrorDto = PasswordValidationErrorDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 400,
        description: 'HTTP status code',
    }),
    __metadata("design:type", Number)
], PasswordValidationErrorDto.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Password must contain uppercase, lowercase, and number',
        description: 'Error message',
    }),
    __metadata("design:type", String)
], PasswordValidationErrorDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Bad Request',
        description: 'Error type',
    }),
    __metadata("design:type", String)
], PasswordValidationErrorDto.prototype, "error", void 0);
class AccountDeactivatedErrorDto extends ErrorResponseDto {
    statusCode = 403;
    message = 'Account deactivated';
    error = 'Forbidden';
}
exports.AccountDeactivatedErrorDto = AccountDeactivatedErrorDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 403,
        description: 'HTTP status code',
    }),
    __metadata("design:type", Number)
], AccountDeactivatedErrorDto.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Your account has been deactivated',
        description: 'Error message',
    }),
    __metadata("design:type", String)
], AccountDeactivatedErrorDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Forbidden',
        description: 'Error type',
    }),
    __metadata("design:type", String)
], AccountDeactivatedErrorDto.prototype, "error", void 0);
class UserNotActiveErrorDto extends ErrorResponseDto {
    statusCode = 403;
    message = 'User not active';
    error = 'Forbidden';
}
exports.UserNotActiveErrorDto = UserNotActiveErrorDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 403,
        description: 'HTTP status code',
    }),
    __metadata("design:type", Number)
], UserNotActiveErrorDto.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'User account is not active',
        description: 'Error message',
    }),
    __metadata("design:type", String)
], UserNotActiveErrorDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Forbidden',
        description: 'Error type',
    }),
    __metadata("design:type", String)
], UserNotActiveErrorDto.prototype, "error", void 0);
class InsufficientPermissionsErrorDto extends ErrorResponseDto {
    statusCode = 403;
    message = 'Insufficient permissions';
    error = 'Forbidden';
}
exports.InsufficientPermissionsErrorDto = InsufficientPermissionsErrorDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 403,
        description: 'HTTP status code',
    }),
    __metadata("design:type", Number)
], InsufficientPermissionsErrorDto.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Insufficient permissions',
        description: 'Error message',
    }),
    __metadata("design:type", String)
], InsufficientPermissionsErrorDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Forbidden',
        description: 'Error type',
    }),
    __metadata("design:type", String)
], InsufficientPermissionsErrorDto.prototype, "error", void 0);
//# sourceMappingURL=error.dto.js.map