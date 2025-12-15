// src/group/group.error.ts
import { AppError } from '../shared/types/app-error';

export class GroupNotFoundError extends AppError {
  constructor(groupId: string) {
    super(`Group with ID ${groupId} not found`, 404);
  }
}

export class UserNotMemberError extends AppError {
  constructor(userId: string, groupId: string) {
    super(`User ${userId} is not a member of group ${groupId}`, 403);
  }
}

export class UnauthorizedGroupAccessError extends AppError {
  constructor(userId: string, groupId: string) {
    super(`User ${userId} is not authorized to perform this action on group ${groupId}`, 403);
  }
}

export class UserAlreadyMemberError extends AppError {
  constructor() {
    super('User is already a member of this group', 400);
  }
}

export class CannotRemoveOnlyAdminError extends AppError {
  constructor() {
    super('Cannot remove the only admin from group', 400);
  }
}