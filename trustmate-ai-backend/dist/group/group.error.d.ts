import { AppError } from '../shared/types/app-error';
export declare class GroupNotFoundError extends AppError {
    constructor(groupId: string);
}
export declare class UserNotMemberError extends AppError {
    constructor(userId: string, groupId: string);
}
export declare class UnauthorizedGroupAccessError extends AppError {
    constructor(userId: string, groupId: string);
}
export declare class UserAlreadyMemberError extends AppError {
    constructor();
}
export declare class CannotRemoveOnlyAdminError extends AppError {
    constructor();
}
