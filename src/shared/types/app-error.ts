// src/shared/errors/app.error.ts
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly timestamp: Date;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.timestamp = new Date();

    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);

    // Set prototype explicitly for instanceof checks
    Object.setPrototypeOf(this, AppError.prototype);
  }

  // Serialize error for API responses
  serialize(): {
    statusCode: number;
    message: string;
    timestamp: Date;
    isOperational: boolean;
  } {
    return {
      statusCode: this.statusCode,
      message: this.message,
      timestamp: this.timestamp,
      isOperational: this.isOperational,
    };
  }

  // Static factory methods
  static badRequest(message: string): AppError {
    return new AppError(message, 400);
  }

  static unauthorized(message: string = 'Unauthorized'): AppError {
    return new AppError(message, 401);
  }

  static forbidden(message: string = 'Forbidden'): AppError {
    return new AppError(message, 403);
  }

  static notFound(message: string = 'Not found'): AppError {
    return new AppError(message, 404);
  }

  static internal(message: string = 'Internal server error'): AppError {
    return new AppError(message, 500);
  }
}