"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DuplicateReceiptError = exports.ReceiptVerificationError = exports.UserNotInSplitError = exports.InvalidSplitError = exports.ExpenseValidationError = exports.ExpenseNotFoundError = void 0;
const app_error_1 = require("../shared/types/app-error");
class ExpenseNotFoundError extends app_error_1.AppError {
    constructor(expenseId) {
        super(`Expense with ID ${expenseId} not found`, 404);
    }
}
exports.ExpenseNotFoundError = ExpenseNotFoundError;
class ExpenseValidationError extends app_error_1.AppError {
    constructor(message) {
        super(message, 400);
    }
}
exports.ExpenseValidationError = ExpenseValidationError;
class InvalidSplitError extends app_error_1.AppError {
    constructor(message) {
        super(message, 400);
    }
}
exports.InvalidSplitError = InvalidSplitError;
class UserNotInSplitError extends app_error_1.AppError {
    constructor(userId, expenseId) {
        super(`User ${userId} is not included in expense ${expenseId} splits`, 400);
    }
}
exports.UserNotInSplitError = UserNotInSplitError;
class ReceiptVerificationError extends app_error_1.AppError {
    constructor(message) {
        super(message, 400);
    }
}
exports.ReceiptVerificationError = ReceiptVerificationError;
class DuplicateReceiptError extends app_error_1.AppError {
    constructor() {
        super('Duplicate receipt detected', 400);
    }
}
exports.DuplicateReceiptError = DuplicateReceiptError;
//# sourceMappingURL=expense.error.js.map