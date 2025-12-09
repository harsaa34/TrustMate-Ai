"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailSendingError = exports.WeakPasswordError = exports.PasswordSameAsCurrentError = exports.TooManyResetAttemptsError = exports.EmailAlreadyVerifiedError = exports.RefreshTokenInvalidError = exports.RefreshTokenExpiredError = exports.UserUpdateError = exports.PasswordValidationError = exports.TokenExpiredError = exports.InvalidTokenError = exports.AccountDeactivatedError = exports.AccountNotVerifiedError = exports.InvalidCredentialsError = exports.UserAlreadyExistsError = void 0;
const app_error_1 = require("../shared/types/app-error");
class UserAlreadyExistsError extends app_error_1.AppError {
    constructor(email) {
        super(`User with email ${email} already exists`, 409);
        this.name = 'UserAlreadyExistsError';
    }
}
exports.UserAlreadyExistsError = UserAlreadyExistsError;
class InvalidCredentialsError extends app_error_1.AppError {
    constructor() {
        super('Invalid email or password', 401);
        this.name = 'InvalidCredentialsError';
    }
}
exports.InvalidCredentialsError = InvalidCredentialsError;
class AccountNotVerifiedError extends app_error_1.AppError {
    constructor() {
        super('Account not verified. Please verify your email first.', 403);
        this.name = 'AccountNotVerifiedError';
    }
}
exports.AccountNotVerifiedError = AccountNotVerifiedError;
class AccountDeactivatedError extends app_error_1.AppError {
    constructor() {
        super('Account is deactivated', 403);
        this.name = 'AccountDeactivatedError';
    }
}
exports.AccountDeactivatedError = AccountDeactivatedError;
class InvalidTokenError extends app_error_1.AppError {
    constructor(message = 'Invalid token') {
        super(message, 401);
        this.name = 'InvalidTokenError';
    }
}
exports.InvalidTokenError = InvalidTokenError;
class TokenExpiredError extends app_error_1.AppError {
    constructor() {
        super('Token has expired', 401);
        this.name = 'TokenExpiredError';
    }
}
exports.TokenExpiredError = TokenExpiredError;
class PasswordValidationError extends app_error_1.AppError {
    constructor(message) {
        super(message, 400);
        this.name = 'PasswordValidationError';
    }
}
exports.PasswordValidationError = PasswordValidationError;
class UserUpdateError extends app_error_1.AppError {
    constructor(message = 'Failed to update user') {
        super(message, 400);
        this.name = 'UserUpdateError';
    }
}
exports.UserUpdateError = UserUpdateError;
class RefreshTokenExpiredError extends app_error_1.AppError {
    constructor() {
        super('Refresh token has expired', 401);
        this.name = 'RefreshTokenExpiredError';
    }
}
exports.RefreshTokenExpiredError = RefreshTokenExpiredError;
class RefreshTokenInvalidError extends app_error_1.AppError {
    constructor() {
        super('Invalid refresh token', 401);
        this.name = 'RefreshTokenInvalidError';
    }
}
exports.RefreshTokenInvalidError = RefreshTokenInvalidError;
class EmailAlreadyVerifiedError extends app_error_1.AppError {
    constructor() {
        super('Email is already verified', 400);
        this.name = 'EmailAlreadyVerifiedError';
    }
}
exports.EmailAlreadyVerifiedError = EmailAlreadyVerifiedError;
class TooManyResetAttemptsError extends app_error_1.AppError {
    constructor() {
        super('Too many password reset attempts. Please try again later.', 429);
        this.name = 'TooManyResetAttemptsError';
    }
}
exports.TooManyResetAttemptsError = TooManyResetAttemptsError;
class PasswordSameAsCurrentError extends app_error_1.AppError {
    constructor() {
        super('New password cannot be the same as current password', 400);
        this.name = 'PasswordSameAsCurrentError';
    }
}
exports.PasswordSameAsCurrentError = PasswordSameAsCurrentError;
class WeakPasswordError extends app_error_1.AppError {
    constructor(requirements) {
        super(`Password does not meet requirements: ${requirements}`, 400);
        this.name = 'WeakPasswordError';
    }
}
exports.WeakPasswordError = WeakPasswordError;
class EmailSendingError extends app_error_1.AppError {
    constructor() {
        super('Failed to send email', 500);
        this.name = 'EmailSendingError';
    }
}
exports.EmailSendingError = EmailSendingError;
//# sourceMappingURL=auth.error.js.map