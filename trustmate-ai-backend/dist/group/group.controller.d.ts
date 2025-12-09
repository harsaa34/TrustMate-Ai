import { GroupService } from './group.service';
import { CreateGroupDto, UpdateGroupDto, AddMemberDto, GetGroupsQueryDto, GroupResponseDto, GroupMemberResponseDto, GroupStatisticsDto } from './group.dto';
export declare class GroupController {
    private readonly groupService;
    constructor(groupService: GroupService);
    createGroup(createDto: CreateGroupDto, userId: string): Promise<GroupResponseDto>;
    getUserGroups(userId: string, query: GetGroupsQueryDto): Promise<GroupResponseDto[]>;
    getGroupById(groupId: string, userId: string): Promise<GroupResponseDto>;
    updateGroup(groupId: string, updateDto: UpdateGroupDto, userId: string): Promise<GroupResponseDto>;
    deleteGroup(groupId: string, userId: string): Promise<void>;
    addMember(groupId: string, addMemberDto: AddMemberDto, userId: string): Promise<GroupResponseDto>;
    removeMember(groupId: string, memberId: string, userId: string): Promise<void>;
    getGroupMembers(groupId: string, userId: string): Promise<GroupMemberResponseDto[]>;
    getGroupStatistics(groupId: string, userId: string): Promise<GroupStatisticsDto>;
}
