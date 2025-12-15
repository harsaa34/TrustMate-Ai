// src/auth/auth.error.ts
import { AppError } from '../shared/types/app-error';

export class UserAlreadyExistsError extends AppError {
  constructor(email: string) {
    super(`User with email ${email} already exists`, 409);
    this.name = 'UserAlreadyExistsError';
  }
}

export class InvalidCredentialsError extends AppError {
  constructor() {
    super('Invalid email or password', 401);
    this.name = 'InvalidCredentialsError';
  }
}

export class AccountNotVerifiedError extends AppError {
  constructor() {
    super('Account not verified. Please verify your email first.', 403);
    this.name = 'AccountNotVerifiedError';
  }
}

export class AccountDeactivatedError extends AppError {
  constructor() {
    super('Account is deactivated', 403);
    this.name = 'AccountDeactivatedError';
  }
}

export class InvalidTokenError extends AppError {
  constructor(message: string = 'Invalid token') {
    super(message, 401);
    this.name = 'InvalidTokenError';
  }
}

export class TokenExpiredError extends AppError {
  constructor() {
    super('Token has expired', 401);
    this.name = 'TokenExpiredError';
  }
}

export class PasswordValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
    this.name = 'PasswordValidationError';
  }
}

export class UserUpdateError extends AppError {
  constructor(message: string = 'Failed to update user') {
    super(message, 400);
    this.name = 'UserUpdateError';
  }
}

// Additional auth-specific errors
export class RefreshTokenExpiredError extends AppError {
  constructor() {
    super('Refresh token has expired', 401);
    this.name = 'RefreshTokenExpiredError';
  }
}

export class RefreshTokenInvalidError extends AppError {
  constructor() {
    super('Invalid refresh token', 401);
    this.name = 'RefreshTokenInvalidError';
  }
}

export class EmailAlreadyVerifiedError extends AppError {
  constructor() {
    super('Email is already verified', 400);
    this.name = 'EmailAlreadyVerifiedError';
  }
}

export class TooManyResetAttemptsError extends AppError {
  constructor() {
    super('Too many password reset attempts. Please try again later.', 429);
    this.name = 'TooManyResetAttemptsError';
  }
}

export class PasswordSameAsCurrentError extends AppError {
  constructor() {
    super('New password cannot be the same as current password', 400);
    this.name = 'PasswordSameAsCurrentError';
  }
}

export class WeakPasswordError extends AppError {
  constructor(requirements: string) {
    super(`Password does not meet requirements: ${requirements}`, 400);
    this.name = 'WeakPasswordError';
  }
}

export class EmailSendingError extends AppError {
  constructor() {
    super('Failed to send email', 500);
    this.name = 'EmailSendingError';
  }
}