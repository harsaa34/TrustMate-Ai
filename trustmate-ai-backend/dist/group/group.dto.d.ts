export declare class CreateGroupDto {
    name: string;
    description?: string;
    currency?: string;
}
export declare class UpdateGroupDto {
    name?: string;
    description?: string;
    currency?: string;
}
export declare class AddMemberDto {
    userId: string;
    role?: string;
}
export declare class GetGroupsQueryDto {
    sortBy?: string;
    sortOrder?: string;
    page?: number;
    limit?: number;
}
export declare class GroupResponseDto {
    id: string;
    name: string;
    description?: string;
    createdBy: {
        id: string;
        name: string;
        email: string;
    };
    members: Array<{
        userId: string;
        userName: string;
        userEmail: string;
        role: string;
        joinedAt: Date;
    }>;
    settings: Record<string, any>;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare class GroupMemberResponseDto {
    userId: string;
    userName: string;
    userEmail: string;
    role: string;
    joinedAt: Date;
}
export declare class GroupStatisticsDto {
    groupId: string;
    name: string;
    memberCount: number;
    createdAt: Date;
}
