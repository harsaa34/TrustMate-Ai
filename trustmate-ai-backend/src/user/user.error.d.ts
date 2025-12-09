import { AppError } from 'src/shared/types/app-error';
export declare class UserError extends AppError {
    constructor(message: string, statusCode?: number);
}
export declare class UserAlreadyExistsError extends UserError {
    constructor(email: string);
}
export declare class InvalidCredentialsError extends UserError {
    constructor();
}
export declare class AccountNotVerifiedError extends UserError {
    constructor();
}
export declare class AccountSuspendedError extends UserError {
    constructor(reason?: string);
}
export declare class AccountDeactivatedError extends UserError {
    constructor();
}
export declare class TooManyLoginAttemptsError extends UserError {
    constructor(lockDuration: number);
}
export declare class InvalidTokenError extends UserError {
    constructor(tokenType?: 'verification' | 'reset' | 'refresh');
}
export declare class TokenExpiredError extends UserError {
    constructor(tokenType?: 'verification' | 'reset' | 'refresh');
}
export declare class PasswordValidationError extends UserError {
    constructor(message: string);
}
export declare class WeakPasswordError extends PasswordValidationError {
    constructor();
}
export declare class SamePasswordError extends UserError {
    constructor();
}
export declare class InsufficientPermissionsError extends UserError {
    constructor(requiredRole?: string, additionalMessage?: string);
}
export declare class RoleChangeError extends UserError {
    constructor(message: string);
}
export declare class UserNotFoundError extends UserError {
    constructor(identifier?: string | number, identifierType?: 'id' | 'email');
}
export declare class SelfOperationError extends UserError {
    constructor(operation: string);
}
export declare class CannotDeleteAdminError extends UserError {
    constructor();
}
export declare class UserUpdateError extends UserError {
    constructor(message: string, field?: string);
}
export declare class ProfileUpdateError extends UserError {
    constructor(field: string, message: string);
}
export declare class SocialLoginError extends UserError {
    constructor(provider: string, message: string);
}
export declare class SocialAccountAlreadyLinkedError extends UserError {
    constructor(provider: string);
}
export declare class SocialAccountNotLinkedError extends UserError {
    constructor(provider: string);
}
export declare class TwoFactorNotEnabledError extends UserError {
    constructor();
}
export declare class TwoFactorAlreadyEnabledError extends UserError {
    constructor();
}
export declare class InvalidTwoFactorCodeError extends UserError {
    constructor();
}
export declare class EmailAlreadyVerifiedError extends UserError {
    constructor();
}
export declare class PhoneAlreadyVerifiedError extends UserError {
    constructor();
}
export declare class RateLimitExceededError extends UserError {
    constructor(action: string, retryAfter?: number);
}
export declare function handleUserError(error: unknown): never;
export declare function isUserError(error: unknown): error is UserError;
export declare function mapToUserError(error: unknown): UserError;
export declare function isErrorOfType<T extends UserError>(error: unknown, errorType: new (...args: any[]) => T): error is T;
export declare function handleUserErrors(errors: unknown[]): UserError[];
export declare class UserErrorFactory {
    static notFound(identifier?: string | number): UserNotFoundError;
    static alreadyExists(email: string): UserAlreadyExistsError;
    static invalidCredentials(): InvalidCredentialsError;
    static insufficientPermissions(requiredRole?: string): InsufficientPermissionsError;
    static selfOperation(operation: string): SelfOperationError;
    static updateError(message: string, field?: string): UserUpdateError;
}
export declare const UserErrors: {
    UserError: typeof UserError;
    UserAlreadyExistsError: typeof UserAlreadyExistsError;
    InvalidCredentialsError: typeof InvalidCredentialsError;
    AccountNotVerifiedError: typeof AccountNotVerifiedError;
    AccountSuspendedError: typeof AccountSuspendedError;
    AccountDeactivatedError: typeof AccountDeactivatedError;
    TooManyLoginAttemptsError: typeof TooManyLoginAttemptsError;
    InvalidTokenError: typeof InvalidTokenError;
    TokenExpiredError: typeof TokenExpiredError;
    PasswordValidationError: typeof PasswordValidationError;
    WeakPasswordError: typeof WeakPasswordError;
    SamePasswordError: typeof SamePasswordError;
    InsufficientPermissionsError: typeof InsufficientPermissionsError;
    RoleChangeError: typeof RoleChangeError;
    UserNotFoundError: typeof UserNotFoundError;
    SelfOperationError: typeof SelfOperationError;
    CannotDeleteAdminError: typeof CannotDeleteAdminError;
    UserUpdateError: typeof UserUpdateError;
    ProfileUpdateError: typeof ProfileUpdateError;
    SocialLoginError: typeof SocialLoginError;
    SocialAccountAlreadyLinkedError: typeof SocialAccountAlreadyLinkedError;
    SocialAccountNotLinkedError: typeof SocialAccountNotLinkedError;
    TwoFactorNotEnabledError: typeof TwoFactorNotEnabledError;
    TwoFactorAlreadyEnabledError: typeof TwoFactorAlreadyEnabledError;
    InvalidTwoFactorCodeError: typeof InvalidTwoFactorCodeError;
    EmailAlreadyVerifiedError: typeof EmailAlreadyVerifiedError;
    PhoneAlreadyVerifiedError: typeof PhoneAlreadyVerifiedError;
    RateLimitExceededError: typeof RateLimitExceededError;
};
