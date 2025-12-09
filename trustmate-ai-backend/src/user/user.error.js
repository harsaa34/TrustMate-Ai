"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserErrors = exports.UserErrorFactory = exports.RateLimitExceededError = exports.PhoneAlreadyVerifiedError = exports.EmailAlreadyVerifiedError = exports.InvalidTwoFactorCodeError = exports.TwoFactorAlreadyEnabledError = exports.TwoFactorNotEnabledError = exports.SocialAccountNotLinkedError = exports.SocialAccountAlreadyLinkedError = exports.SocialLoginError = exports.ProfileUpdateError = exports.UserUpdateError = exports.CannotDeleteAdminError = exports.SelfOperationError = exports.UserNotFoundError = exports.RoleChangeError = exports.InsufficientPermissionsError = exports.SamePasswordError = exports.WeakPasswordError = exports.PasswordValidationError = exports.TokenExpiredError = exports.InvalidTokenError = exports.TooManyLoginAttemptsError = exports.AccountDeactivatedError = exports.AccountSuspendedError = exports.AccountNotVerifiedError = exports.InvalidCredentialsError = exports.UserAlreadyExistsError = exports.UserError = void 0;
exports.handleUserError = handleUserError;
exports.isUserError = isUserError;
exports.mapToUserError = mapToUserError;
exports.isErrorOfType = isErrorOfType;
exports.handleUserErrors = handleUserErrors;
const app_error_1 = require("../shared/types/app-error");
class UserError extends app_error_1.AppError {
    constructor(message, statusCode = 400) {
        super(message, statusCode);
        this.name = 'UserError';
    }
}
exports.UserError = UserError;
class UserAlreadyExistsError extends UserError {
    constructor(email) {
        super(`User with email ${email} already exists`, 409);
        this.name = 'UserAlreadyExistsError';
    }
}
exports.UserAlreadyExistsError = UserAlreadyExistsError;
class InvalidCredentialsError extends UserError {
    constructor() {
        super('Invalid email or password', 401);
        this.name = 'InvalidCredentialsError';
    }
}
exports.InvalidCredentialsError = InvalidCredentialsError;
class AccountNotVerifiedError extends UserError {
    constructor() {
        super('Please verify your email address to login', 403);
        this.name = 'AccountNotVerifiedError';
    }
}
exports.AccountNotVerifiedError = AccountNotVerifiedError;
class AccountSuspendedError extends UserError {
    constructor(reason) {
        const message = reason
            ? `Account suspended: ${reason}`
            : 'Your account has been suspended';
        super(message, 403);
        this.name = 'AccountSuspendedError';
    }
}
exports.AccountSuspendedError = AccountSuspendedError;
class AccountDeactivatedError extends UserError {
    constructor() {
        super('Your account has been deactivated', 403);
        this.name = 'AccountDeactivatedError';
    }
}
exports.AccountDeactivatedError = AccountDeactivatedError;
class TooManyLoginAttemptsError extends UserError {
    constructor(lockDuration) {
        const minutes = Math.ceil(lockDuration / 60000);
        super(`Too many login attempts. Try again in ${minutes} minute${minutes > 1 ? 's' : ''}`, 429);
        this.name = 'TooManyLoginAttemptsError';
    }
}
exports.TooManyLoginAttemptsError = TooManyLoginAttemptsError;
class InvalidTokenError extends UserError {
    constructor(tokenType = 'verification') {
        super(`Invalid or expired ${tokenType} token`, 400);
        this.name = 'InvalidTokenError';
    }
}
exports.InvalidTokenError = InvalidTokenError;
class TokenExpiredError extends UserError {
    constructor(tokenType = 'verification') {
        super(`${tokenType.charAt(0).toUpperCase() + tokenType.slice(1)} token has expired`, 401);
        this.name = 'TokenExpiredError';
    }
}
exports.TokenExpiredError = TokenExpiredError;
class PasswordValidationError extends UserError {
    constructor(message) {
        super(`Password validation failed: ${message}`, 400);
        this.name = 'PasswordValidationError';
    }
}
exports.PasswordValidationError = PasswordValidationError;
class WeakPasswordError extends PasswordValidationError {
    constructor() {
        super('Password is too weak. Must contain uppercase, lowercase, number, and special character');
        this.name = 'WeakPasswordError';
    }
}
exports.WeakPasswordError = WeakPasswordError;
class SamePasswordError extends UserError {
    constructor() {
        super('New password cannot be the same as current password', 400);
        this.name = 'SamePasswordError';
    }
}
exports.SamePasswordError = SamePasswordError;
class InsufficientPermissionsError extends UserError {
    constructor(requiredRole, additionalMessage) {
        let message = 'Insufficient permissions';
        if (requiredRole) {
            message += `. Required role: ${requiredRole}`;
        }
        if (additionalMessage) {
            message += `. ${additionalMessage}`;
        }
        super(message, 403);
        this.name = 'InsufficientPermissionsError';
    }
}
exports.InsufficientPermissionsError = InsufficientPermissionsError;
class RoleChangeError extends UserError {
    constructor(message) {
        super(`Cannot change role: ${message}`, 400);
        this.name = 'RoleChangeError';
    }
}
exports.RoleChangeError = RoleChangeError;
class UserNotFoundError extends UserError {
    constructor(identifier, identifierType = 'id') {
        const message = identifier
            ? `User with ${identifierType} '${identifier}' not found`
            : 'User not found';
        super(message, 404);
        this.name = 'UserNotFoundError';
    }
}
exports.UserNotFoundError = UserNotFoundError;
class SelfOperationError extends UserError {
    constructor(operation) {
        super(`Cannot ${operation} yourself`, 400);
        this.name = 'SelfOperationError';
    }
}
exports.SelfOperationError = SelfOperationError;
class CannotDeleteAdminError extends UserError {
    constructor() {
        super('Cannot delete admin accounts', 403);
        this.name = 'CannotDeleteAdminError';
    }
}
exports.CannotDeleteAdminError = CannotDeleteAdminError;
class UserUpdateError extends UserError {
    constructor(message, field) {
        const fullMessage = field
            ? `Failed to update ${field}: ${message}`
            : `User update failed: ${message}`;
        super(fullMessage, 400);
        this.name = 'UserUpdateError';
    }
}
exports.UserUpdateError = UserUpdateError;
class ProfileUpdateError extends UserError {
    constructor(field, message) {
        super(`Failed to update ${field}: ${message}`, 400);
        this.name = 'ProfileUpdateError';
    }
}
exports.ProfileUpdateError = ProfileUpdateError;
class SocialLoginError extends UserError {
    constructor(provider, message) {
        super(`Social login with ${provider} failed: ${message}`, 400);
        this.name = 'SocialLoginError';
    }
}
exports.SocialLoginError = SocialLoginError;
class SocialAccountAlreadyLinkedError extends UserError {
    constructor(provider) {
        super(`Your account is already linked with ${provider}`, 400);
        this.name = 'SocialAccountAlreadyLinkedError';
    }
}
exports.SocialAccountAlreadyLinkedError = SocialAccountAlreadyLinkedError;
class SocialAccountNotLinkedError extends UserError {
    constructor(provider) {
        super(`Your account is not linked with ${provider}`, 400);
        this.name = 'SocialAccountNotLinkedError';
    }
}
exports.SocialAccountNotLinkedError = SocialAccountNotLinkedError;
class TwoFactorNotEnabledError extends UserError {
    constructor() {
        super('Two-factor authentication is not enabled for your account', 400);
        this.name = 'TwoFactorNotEnabledError';
    }
}
exports.TwoFactorNotEnabledError = TwoFactorNotEnabledError;
class TwoFactorAlreadyEnabledError extends UserError {
    constructor() {
        super('Two-factor authentication is already enabled for your account', 400);
        this.name = 'TwoFactorAlreadyEnabledError';
    }
}
exports.TwoFactorAlreadyEnabledError = TwoFactorAlreadyEnabledError;
class InvalidTwoFactorCodeError extends UserError {
    constructor() {
        super('Invalid two-factor authentication code', 400);
        this.name = 'InvalidTwoFactorCodeError';
    }
}
exports.InvalidTwoFactorCodeError = InvalidTwoFactorCodeError;
class EmailAlreadyVerifiedError extends UserError {
    constructor() {
        super('Email is already verified', 400);
        this.name = 'EmailAlreadyVerifiedError';
    }
}
exports.EmailAlreadyVerifiedError = EmailAlreadyVerifiedError;
class PhoneAlreadyVerifiedError extends UserError {
    constructor() {
        super('Phone number is already verified', 400);
        this.name = 'PhoneAlreadyVerifiedError';
    }
}
exports.PhoneAlreadyVerifiedError = PhoneAlreadyVerifiedError;
class RateLimitExceededError extends UserError {
    constructor(action, retryAfter) {
        let message = `Rate limit exceeded for ${action}`;
        if (retryAfter) {
            message += `. Try again in ${retryAfter} seconds`;
        }
        super(message, 429);
        this.name = 'RateLimitExceededError';
    }
}
exports.RateLimitExceededError = RateLimitExceededError;
function handleUserError(error) {
    if (error instanceof UserError) {
        throw error;
    }
    if (error instanceof app_error_1.AppError) {
        throw new UserError(error.message, error.statusCode);
    }
    console.error('Unexpected user error:', error);
    if (typeof error === 'object' && error !== null) {
        const err = error;
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map((e) => e.message);
            throw new UserUpdateError(messages.join(', '));
        }
        if (err.code === 11000 || err.code === 11001) {
            const field = Object.keys(err.keyPattern)[0];
            const value = err.keyValue[field];
            if (field === 'email') {
                throw new UserAlreadyExistsError(value);
            }
            throw new UserError(`Duplicate ${field} value: ${value}`, 409);
        }
        if (err.name === 'CastError') {
            throw new UserNotFoundError(err.value, 'id');
        }
    }
    throw new UserError('An unexpected error occurred while processing user request', 500);
}
function isUserError(error) {
    return error instanceof UserError;
}
function mapToUserError(error) {
    try {
        handleUserError(error);
        return new UserError('Unknown error', 500);
    }
    catch (err) {
        if (err instanceof UserError) {
            return err;
        }
        return new UserError('An unexpected error occurred', 500);
    }
}
function isErrorOfType(error, errorType) {
    return error instanceof errorType;
}
function handleUserErrors(errors) {
    return errors.map(error => {
        try {
            handleUserError(error);
            return null;
        }
        catch (userError) {
            return userError;
        }
    }).filter(Boolean);
}
class UserErrorFactory {
    static notFound(identifier) {
        return new UserNotFoundError(identifier);
    }
    static alreadyExists(email) {
        return new UserAlreadyExistsError(email);
    }
    static invalidCredentials() {
        return new InvalidCredentialsError();
    }
    static insufficientPermissions(requiredRole) {
        return new InsufficientPermissionsError(requiredRole);
    }
    static selfOperation(operation) {
        return new SelfOperationError(operation);
    }
    static updateError(message, field) {
        return new UserUpdateError(message, field);
    }
}
exports.UserErrorFactory = UserErrorFactory;
exports.UserErrors = {
    UserError,
    UserAlreadyExistsError,
    InvalidCredentialsError,
    AccountNotVerifiedError,
    AccountSuspendedError,
    AccountDeactivatedError,
    TooManyLoginAttemptsError,
    InvalidTokenError,
    TokenExpiredError,
    PasswordValidationError,
    WeakPasswordError,
    SamePasswordError,
    InsufficientPermissionsError,
    RoleChangeError,
    UserNotFoundError,
    SelfOperationError,
    CannotDeleteAdminError,
    UserUpdateError,
    ProfileUpdateError,
    SocialLoginError,
    SocialAccountAlreadyLinkedError,
    SocialAccountNotLinkedError,
    TwoFactorNotEnabledError,
    TwoFactorAlreadyEnabledError,
    InvalidTwoFactorCodeError,
    EmailAlreadyVerifiedError,
    PhoneAlreadyVerifiedError,
    RateLimitExceededError,
};
//# sourceMappingURL=user.error.js.map