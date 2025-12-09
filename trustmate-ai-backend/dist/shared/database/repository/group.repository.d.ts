import { Model } from 'mongoose';
import { GroupDocument } from '../../../group/group.schema';
import { GroupDomain } from '../../../group/group.domain';
export interface IGroupRepository {
    create(group: GroupDomain): Promise<GroupDomain>;
    findById(id: string): Promise<GroupDomain | null>;
    findAll(userId: string): Promise<GroupDomain[]>;
    update(id: string, group: GroupDomain): Promise<GroupDomain>;
    delete(id: string, userId: string): Promise<void>;
    addMember(groupId: string, userId: string, role?: string): Promise<GroupDomain>;
    removeMember(groupId: string, userId: string): Promise<GroupDomain>;
    isMember(groupId: string, userId: string): Promise<boolean>;
    getUserGroups(userId: string): Promise<GroupDomain[]>;
    existsById(id: string): Promise<boolean>;
}
export declare class GroupRepository implements IGroupRepository {
    private groupModel;
    constructor(groupModel: Model<GroupDocument>);
    create(group: GroupDomain): Promise<GroupDomain>;
    findById(id: string): Promise<GroupDomain | null>;
    findAll(userId: string): Promise<GroupDomain[]>;
    update(id: string, group: GroupDomain): Promise<GroupDomain>;
    delete(id: string, userId: string): Promise<void>;
    addMember(groupId: string, userId: string, role?: string): Promise<GroupDomain>;
    removeMember(groupId: string, userId: string): Promise<GroupDomain>;
    isMember(groupId: string, userId: string): Promise<boolean>;
    getUserGroups(userId: string): Promise<GroupDomain[]>;
    existsById(id: string): Promise<boolean>;
}
