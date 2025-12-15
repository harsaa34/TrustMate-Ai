// src/settlement/settlement.error.ts
import { AppError } from '../shared/types/app-error';

export class SettlementNotFoundError extends AppError {
  constructor(settlementId: string) {
    super(`Settlement with ID ${settlementId} not found`, 404);
  }
}

export class SettlementValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class InsufficientBalanceError extends AppError {
  constructor(userId: string) {
    super(`User ${userId} does not owe this amount`, 400);
  }
}

export class SettlementSameUserError extends AppError {
  constructor() {
    super('Cannot settle with yourself', 400);
  }
}