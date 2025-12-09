"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
class AppError extends Error {
    statusCode;
    isOperational;
    timestamp;
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        this.timestamp = new Date();
        Error.captureStackTrace(this, this.constructor);
        Object.setPrototypeOf(this, AppError.prototype);
    }
    serialize() {
        return {
            statusCode: this.statusCode,
            message: this.message,
            timestamp: this.timestamp,
            isOperational: this.isOperational,
        };
    }
    static badRequest(message) {
        return new AppError(message, 400);
    }
    static unauthorized(message = 'Unauthorized') {
        return new AppError(message, 401);
    }
    static forbidden(message = 'Forbidden') {
        return new AppError(message, 403);
    }
    static notFound(message = 'Not found') {
        return new AppError(message, 404);
    }
    static internal(message = 'Internal server error') {
        return new AppError(message, 500);
    }
}
exports.AppError = AppError;
//# sourceMappingURL=app-error.js.map