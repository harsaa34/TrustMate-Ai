"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettlementSameUserError = exports.InsufficientBalanceError = exports.SettlementValidationError = exports.SettlementNotFoundError = void 0;
const app_error_1 = require("../shared/types/app-error");
class SettlementNotFoundError extends app_error_1.AppError {
    constructor(settlementId) {
        super(`Settlement with ID ${settlementId} not found`, 404);
    }
}
exports.SettlementNotFoundError = SettlementNotFoundError;
class SettlementValidationError extends app_error_1.AppError {
    constructor(message) {
        super(message, 400);
    }
}
exports.SettlementValidationError = SettlementValidationError;
class InsufficientBalanceError extends app_error_1.AppError {
    constructor(userId) {
        super(`User ${userId} does not owe this amount`, 400);
    }
}
exports.InsufficientBalanceError = InsufficientBalanceError;
class SettlementSameUserError extends app_error_1.AppError {
    constructor() {
        super('Cannot settle with yourself', 400);
    }
}
exports.SettlementSameUserError = SettlementSameUserError;
//# sourceMappingURL=settlement.error.js.map