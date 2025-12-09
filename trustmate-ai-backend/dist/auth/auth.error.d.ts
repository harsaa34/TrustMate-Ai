import { AppError } from '../shared/types/app-error';
export declare class UserAlreadyExistsError extends AppError {
    constructor(email: string);
}
export declare class InvalidCredentialsError extends AppError {
    constructor();
}
export declare class AccountNotVerifiedError extends AppError {
    constructor();
}
export declare class AccountDeactivatedError extends AppError {
    constructor();
}
export declare class InvalidTokenError extends AppError {
    constructor(message?: string);
}
export declare class TokenExpiredError extends AppError {
    constructor();
}
export declare class PasswordValidationError extends AppError {
    constructor(message: string);
}
export declare class UserUpdateError extends AppError {
    constructor(message?: string);
}
export declare class RefreshTokenExpiredError extends AppError {
    constructor();
}
export declare class RefreshTokenInvalidError extends AppError {
    constructor();
}
export declare class EmailAlreadyVerifiedError extends AppError {
    constructor();
}
export declare class TooManyResetAttemptsError extends AppError {
    constructor();
}
export declare class PasswordSameAsCurrentError extends AppError {
    constructor();
}
export declare class WeakPasswordError extends AppError {
    constructor(requirements: string);
}
export declare class EmailSendingError extends AppError {
    constructor();
}
