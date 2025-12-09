export interface GroupMember {
    userId: string;
    role: string;
    joinedAt: Date;
}
export declare class GroupDomain {
    readonly id: string;
    readonly name: string;
    readonly description: string;
    readonly members: GroupMember[];
    readonly currency: string;
    readonly isActive: boolean;
    readonly createdByUserId: string;
    readonly createdAt?: Date | undefined;
    readonly updatedAt?: Date | undefined;
    constructor(id: string, name: string, description: string, members: GroupMember[], currency: string | undefined, isActive: boolean | undefined, createdByUserId: string, createdAt?: Date | undefined, updatedAt?: Date | undefined);
    static create(name: string, description: string, createdByUserId: string, currency?: string): GroupDomain;
    addMember(userId: string, role?: string): GroupDomain;
    removeMember(userId: string): GroupDomain;
}
