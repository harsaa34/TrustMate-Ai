// src/users/errors/user.error.ts
import { AppError } from 'src/shared/types/app-error';

// Base User Error for inheritance
export class UserError extends AppError {
  constructor(message: string, statusCode: number = 400) {
    super(message, statusCode);
    this.name = 'UserError';
  }
}

// Authentication Errors
export class UserAlreadyExistsError extends UserError {
  constructor(email: string) {
    super(`User with email ${email} already exists`, 409);
    this.name = 'UserAlreadyExistsError';
  }
}

export class InvalidCredentialsError extends UserError {
  constructor() {
    super('Invalid email or password', 401);
    this.name = 'InvalidCredentialsError';
  }
}

export class AccountNotVerifiedError extends UserError {
  constructor() {
    super('Please verify your email address to login', 403);
    this.name = 'AccountNotVerifiedError';
  }
}

export class AccountSuspendedError extends UserError {
  constructor(reason?: string) {
    const message = reason 
      ? `Account suspended: ${reason}`
      : 'Your account has been suspended';
    super(message, 403);
    this.name = 'AccountSuspendedError';
  }
}

export class AccountDeactivatedError extends UserError {
  constructor() {
    super('Your account has been deactivated', 403);
    this.name = 'AccountDeactivatedError';
  }
}

export class TooManyLoginAttemptsError extends UserError {
  constructor(lockDuration: number) {
    const minutes = Math.ceil(lockDuration / 60000);
    super(`Too many login attempts. Try again in ${minutes} minute${minutes > 1 ? 's' : ''}`, 429);
    this.name = 'TooManyLoginAttemptsError';
  }
}

// Token/Verification Errors
export class InvalidTokenError extends UserError {
  constructor(tokenType: 'verification' | 'reset' | 'refresh' = 'verification') {
    super(`Invalid or expired ${tokenType} token`, 400);
    this.name = 'InvalidTokenError';
  }
}

export class TokenExpiredError extends UserError {
  constructor(tokenType: 'verification' | 'reset' | 'refresh' = 'verification') {
    super(`${tokenType.charAt(0).toUpperCase() + tokenType.slice(1)} token has expired`, 401);
    this.name = 'TokenExpiredError';
  }
}

// Password Errors
export class PasswordValidationError extends UserError {
  constructor(message: string) {
    super(`Password validation failed: ${message}`, 400);
    this.name = 'PasswordValidationError';
  }
}

export class WeakPasswordError extends PasswordValidationError {
  constructor() {
    super('Password is too weak. Must contain uppercase, lowercase, number, and special character');
    this.name = 'WeakPasswordError';
  }
}

export class SamePasswordError extends UserError {
  constructor() {
    super('New password cannot be the same as current password', 400);
    this.name = 'SamePasswordError';
  }
}

// Permission/Role Errors
export class InsufficientPermissionsError extends UserError {
  constructor(
    requiredRole?: string,
    additionalMessage?: string
  ) {
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

export class RoleChangeError extends UserError {
  constructor(message: string) {
    super(`Cannot change role: ${message}`, 400);
    this.name = 'RoleChangeError';
  }
}

// User Management Errors
export class UserNotFoundError extends UserError {
  constructor(identifier?: string | number, identifierType: 'id' | 'email' = 'id') {
    const message = identifier
      ? `User with ${identifierType} '${identifier}' not found`
      : 'User not found';
    super(message, 404);
    this.name = 'UserNotFoundError';
  }
}

export class SelfOperationError extends UserError {
  constructor(operation: string) {
    super(`Cannot ${operation} yourself`, 400);
    this.name = 'SelfOperationError';
  }
}

export class CannotDeleteAdminError extends UserError {
  constructor() {
    super('Cannot delete admin accounts', 403);
    this.name = 'CannotDeleteAdminError';
  }
}

export class UserUpdateError extends UserError {
  constructor(message: string, field?: string) {
    const fullMessage = field
      ? `Failed to update ${field}: ${message}`
      : `User update failed: ${message}`;
    super(fullMessage, 400);
    this.name = 'UserUpdateError';
  }
}

export class ProfileUpdateError extends UserError {
  constructor(field: string, message: string) {
    super(`Failed to update ${field}: ${message}`, 400);
    this.name = 'ProfileUpdateError';
  }
}

// Social Login Errors
export class SocialLoginError extends UserError {
  constructor(provider: string, message: string) {
    super(`Social login with ${provider} failed: ${message}`, 400);
    this.name = 'SocialLoginError';
  }
}

export class SocialAccountAlreadyLinkedError extends UserError {
  constructor(provider: string) {
    super(`Your account is already linked with ${provider}`, 400);
    this.name = 'SocialAccountAlreadyLinkedError';
  }
}

export class SocialAccountNotLinkedError extends UserError {
  constructor(provider: string) {
    super(`Your account is not linked with ${provider}`, 400);
    this.name = 'SocialAccountNotLinkedError';
  }
}

// Two-Factor Authentication Errors
export class TwoFactorNotEnabledError extends UserError {
  constructor() {
    super('Two-factor authentication is not enabled for your account', 400);
    this.name = 'TwoFactorNotEnabledError';
  }
}

export class TwoFactorAlreadyEnabledError extends UserError {
  constructor() {
    super('Two-factor authentication is already enabled for your account', 400);
    this.name = 'TwoFactorAlreadyEnabledError';
  }
}

export class InvalidTwoFactorCodeError extends UserError {
  constructor() {
    super('Invalid two-factor authentication code', 400);
    this.name = 'InvalidTwoFactorCodeError';
  }
}

// Validation Errors
export class EmailAlreadyVerifiedError extends UserError {
  constructor() {
    super('Email is already verified', 400);
    this.name = 'EmailAlreadyVerifiedError';
  }
}

export class PhoneAlreadyVerifiedError extends UserError {
  constructor() {
    super('Phone number is already verified', 400);
    this.name = 'PhoneAlreadyVerifiedError';
  }
}

// Rate Limiting Errors
export class RateLimitExceededError extends UserError {
  constructor(action: string, retryAfter?: number) {
    let message = `Rate limit exceeded for ${action}`;
    if (retryAfter) {
      message += `. Try again in ${retryAfter} seconds`;
    }
    super(message, 429);
    this.name = 'RateLimitExceededError';
  }
}

// Utility Functions
export function handleUserError(error: unknown): never {
  // If it's already a UserError, just re-throw it
  if (error instanceof UserError) {
    throw error;
  }

  // If it's an AppError (but not UserError), convert it
  if (error instanceof AppError) {
    throw new UserError(error.message, error.statusCode);
  }

  // Log unexpected errors for debugging
  console.error('Unexpected user error:', error);

  // Handle specific Mongoose/MongoDB errors
  if (typeof error === 'object' && error !== null) {
    const err = error as any;

    // Mongoose validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e: any) => e.message);
      throw new UserUpdateError(messages.join(', '));
    }

    // MongoDB duplicate key error (email already exists)
    if (err.code === 11000 || err.code === 11001) {
      const field = Object.keys(err.keyPattern)[0];
      const value = err.keyValue[field];
      if (field === 'email') {
        throw new UserAlreadyExistsError(value);
      }
      throw new UserError(`Duplicate ${field} value: ${value}`, 409);
    }

    // Cast errors (invalid ObjectId)
    if (err.name === 'CastError') {
      throw new UserNotFoundError(err.value, 'id');
    }
  }

  // Default fallback
  throw new UserError('An unexpected error occurred while processing user request', 500);
}

// Error type guard
export function isUserError(error: unknown): error is UserError {
  return error instanceof UserError;
}

// Error mapper for different error sources
export function mapToUserError(error: unknown): UserError {
  try {
    handleUserError(error);
    // handleUserError throws, so this won't be reached
    return new UserError('Unknown error', 500);
  } catch (err) {
    if (err instanceof UserError) {
      return err;
    }
    return new UserError('An unexpected error occurred', 500);
  }
}

// Helper to check error type
export function isErrorOfType<T extends UserError>(
  error: unknown,
  errorType: new (...args: any[]) => T
): error is T {
  return error instanceof errorType;
}

// Batch error handling
export function handleUserErrors(errors: unknown[]): UserError[] {
  return errors.map(error => {
    try {
      handleUserError(error);
      return null;
    } catch (userError) {
      return userError as UserError;
    }
  }).filter(Boolean) as UserError[];
}

// Error factory for creating specific errors
export class UserErrorFactory {
  static notFound(identifier?: string | number): UserNotFoundError {
    return new UserNotFoundError(identifier);
  }

  static alreadyExists(email: string): UserAlreadyExistsError {
    return new UserAlreadyExistsError(email);
  }

  static invalidCredentials(): InvalidCredentialsError {
    return new InvalidCredentialsError();
  }

  static insufficientPermissions(requiredRole?: string): InsufficientPermissionsError {
    return new InsufficientPermissionsError(requiredRole);
  }

  static selfOperation(operation: string): SelfOperationError {
    return new SelfOperationError(operation);
  }

  static updateError(message: string, field?: string): UserUpdateError {
    return new UserUpdateError(message, field);
  }
}

// Export all error types
export const UserErrors = {
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