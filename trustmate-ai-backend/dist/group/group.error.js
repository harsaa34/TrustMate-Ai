"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CannotRemoveOnlyAdminError = exports.UserAlreadyMemberError = exports.UnauthorizedGroupAccessError = exports.UserNotMemberError = exports.GroupNotFoundError = void 0;
const app_error_1 = require("../shared/types/app-error");
class GroupNotFoundError extends app_error_1.AppError {
    constructor(groupId) {
        super(`Group with ID ${groupId} not found`, 404);
    }
}
exports.GroupNotFoundError = GroupNotFoundError;
class UserNotMemberError extends app_error_1.AppError {
    constructor(userId, groupId) {
        super(`User ${userId} is not a member of group ${groupId}`, 403);
    }
}
exports.UserNotMemberError = UserNotMemberError;
class UnauthorizedGroupAccessError extends app_error_1.AppError {
    constructor(userId, groupId) {
        super(`User ${userId} is not authorized to perform this action on group ${groupId}`, 403);
    }
}
exports.UnauthorizedGroupAccessError = UnauthorizedGroupAccessError;
class UserAlreadyMemberError extends app_error_1.AppError {
    constructor() {
        super('User is already a member of this group', 400);
    }
}
exports.UserAlreadyMemberError = UserAlreadyMemberError;
class CannotRemoveOnlyAdminError extends app_error_1.AppError {
    constructor() {
        super('Cannot remove the only admin from group', 400);
    }
}
exports.CannotRemoveOnlyAdminError = CannotRemoveOnlyAdminError;
//# sourceMappingURL=group.error.js.map