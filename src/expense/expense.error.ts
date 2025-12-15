// src/expense/expense.error.ts
import { AppError } from '../shared/types/app-error';

export class ExpenseNotFoundError extends AppError {
  constructor(expenseId: string) {
    super(`Expense with ID ${expenseId} not found`, 404);
  }
}

export class ExpenseValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class InvalidSplitError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class UserNotInSplitError extends AppError {
  constructor(userId: string, expenseId: string) {
    super(`User ${userId} is not included in expense ${expenseId} splits`, 400);
  }
}

export class ReceiptVerificationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class DuplicateReceiptError extends AppError {
  constructor() {
    super('Duplicate receipt detected', 400);
  }
}