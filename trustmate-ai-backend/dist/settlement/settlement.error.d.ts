import { AppError } from '../shared/types/app-error';
export declare class SettlementNotFoundError extends AppError {
    constructor(settlementId: string);
}
export declare class SettlementValidationError extends AppError {
    constructor(message: string);
}
export declare class InsufficientBalanceError extends AppError {
    constructor(userId: string);
}
export declare class SettlementSameUserError extends AppError {
    constructor();
}
