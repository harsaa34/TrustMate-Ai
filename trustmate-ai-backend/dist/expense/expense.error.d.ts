import { AppError } from '../shared/types/app-error';
export declare class ExpenseNotFoundError extends AppError {
    constructor(expenseId: string);
}
export declare class ExpenseValidationError extends AppError {
    constructor(message: string);
}
export declare class InvalidSplitError extends AppError {
    constructor(message: string);
}
export declare class UserNotInSplitError extends AppError {
    constructor(userId: string, expenseId: string);
}
export declare class ReceiptVerificationError extends AppError {
    constructor(message: string);
}
export declare class DuplicateReceiptError extends AppError {
    constructor();
}
