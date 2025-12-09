export declare class AppError extends Error {
    readonly statusCode: number;
    readonly isOperational: boolean;
    readonly timestamp: Date;
    constructor(message: string, statusCode?: number);
    serialize(): {
        statusCode: number;
        message: string;
        timestamp: Date;
        isOperational: boolean;
    };
    static badRequest(message: string): AppError;
    static unauthorized(message?: string): AppError;
    static forbidden(message?: string): AppError;
    static notFound(message?: string): AppError;
    static internal(message?: string): AppError;
}
