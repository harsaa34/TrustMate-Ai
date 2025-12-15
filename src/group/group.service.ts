// src/group/group.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Group, GroupDocument, GroupMember } from './group.schema';
import { User, UserDocument } from '../user/schemas/user.schema';
import { CreateGroupDto, UpdateGroupDto, AddMemberDto } from './group.dto';
import { GroupResponse, GroupMemberResponse } from './group.type';
import { 
  GroupNotFoundError, 
  UserNotMemberError, 
  UnauthorizedGroupAccessError,
  UserAlreadyMemberError,
  CannotRemoveOnlyAdminError 
} from './group.error';

@Injectable()
export class GroupService {
  private readonly _logger = new Logger(GroupService.name);

  constructor(
    @InjectModel(Group.name) private readonly groupModel: Model<GroupDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async createGroup(createDto: CreateGroupDto, userId: string): Promise<GroupResponse> {
    const groupData = {
      ...createDto,
      createdBy: new Types.ObjectId(userId),
      members: [
        {
          userId: new Types.ObjectId(userId),
          role: 'admin',
          joinedAt: new Date(),
        },
      ],
    };

    const group = await this.groupModel.create(groupData);
    const populatedGroup = await this.groupModel
      .findById(group._id)
      .populate('createdBy', 'name email')
      .populate('members.userId', 'name email');

    return this.mapToResponse(populatedGroup!);
  }

  async getUserGroups(userId: string): Promise<GroupResponse[]> {
    const groups = await this.groupModel.find({
      'members.userId': new Types.ObjectId(userId),
      isActive: true,
    })
      .populate('createdBy', 'name email')
      .populate('members.userId', 'name email');

    return groups.map(group => this.mapToResponse(group));
  }

  async getGroupById(groupId: string, userId: string): Promise<GroupResponse> {
    const group = await this.groupModel.findOne({
      _id: groupId,
      isActive: true,
    })
      .populate('createdBy', 'name email')
      .populate('members.userId', 'name email');

    if (!group) {
      throw new GroupNotFoundError(groupId);
    }

    // Check if user is a member
    const isMember = group.members.some(member => 
      member.userId.toString() === userId
    );

    if (!isMember) {
      throw new UserNotMemberError(userId, groupId);
    }

    return this.mapToResponse(group);
  }

  async updateGroup(groupId: string, updateDto: UpdateGroupDto, userId: string): Promise<GroupResponse> {
    const group = await this.groupModel.findOne({
      _id: groupId,
      isActive: true,
    });

    if (!group) {
      throw new GroupNotFoundError(groupId);
    }

    // Check if user is admin
    const isAdmin = group.members.some(member => 
      member.userId.toString() === userId && member.role === 'admin'
    );

    if (!isAdmin) {
      throw new UnauthorizedGroupAccessError(userId, groupId);
    }

    const updatedGroup = await this.groupModel.findByIdAndUpdate(
      groupId,
      updateDto,
      { new: true }
    )
      .populate('createdBy', 'name email')
      .populate('members.userId', 'name email');

    if (!updatedGroup) {
      throw new GroupNotFoundError(groupId);
    }

    return this.mapToResponse(updatedGroup);
  }

  async deleteGroup(groupId: string, userId: string): Promise<void> {
    const group = await this.groupModel.findOne({
      _id: groupId,
      isActive: true,
    });

    if (!group) {
      throw new GroupNotFoundError(groupId);
    }

    // Check if user is admin
    const isAdmin = group.members.some(member => 
      member.userId.toString() === userId && member.role === 'admin'
    );

    if (!isAdmin) {
      throw new UnauthorizedGroupAccessError(userId, groupId);
    }

    await this.groupModel.findByIdAndUpdate(groupId, { isActive: false });
  }

  async addMember(groupId: string, addMemberDto: AddMemberDto, userId: string): Promise<GroupResponse> {
    const group = await this.groupModel.findOne({
      _id: groupId,
      isActive: true,
    });

    if (!group) {
      throw new GroupNotFoundError(groupId);
    }

    // Check if user is admin
    const isAdmin = group.members.some(member => 
      member.userId.toString() === userId && member.role === 'admin'
    );

    if (!isAdmin) {
      throw new UnauthorizedGroupAccessError(userId, groupId);
    }

    // Check if user is already a member
    const isAlreadyMember = group.members.some(member => 
      member.userId.toString() === addMemberDto.userId
    );

    if (isAlreadyMember) {
      throw new UserAlreadyMemberError();
    }

    // Check if user exists
    const user = await this.userModel.findById(addMemberDto.userId);
    if (!user) {
      throw new GroupNotFoundError(addMemberDto.userId);
    }

    group.members.push({
  userId: new Types.ObjectId(addMemberDto.userId),
  role: (addMemberDto.role as 'admin' | 'member') || 'member',
  joinedAt: new Date(),
});
    await group.save();

    const updatedGroup = await this.groupModel.findById(groupId)
      .populate('createdBy', 'name email')
      .populate('members.userId', 'name email');

    if (!updatedGroup) {
      throw new GroupNotFoundError(groupId);
    }

    return this.mapToResponse(updatedGroup);
  }

  async removeMember(groupId: string, memberId: string, userId: string): Promise<GroupResponse> {
    const group = await this.groupModel.findOne({
      _id: groupId,
      isActive: true,
    });

    if (!group) {
      throw new GroupNotFoundError(groupId);
    }

    // Check if user is admin
    const isAdmin = group.members.some(member => 
      member.userId.toString() === userId && member.role === 'admin'
    );

    if (!isAdmin) {
      throw new UnauthorizedGroupAccessError(userId, groupId);
    }

    // Cannot remove admin if they're the only admin
    const memberToRemove = group.members.find(member => 
      member.userId.toString() === memberId
    );

    if (memberToRemove?.role === 'admin') {
      const adminCount = group.members.filter(member => member.role === 'admin').length;
      if (adminCount <= 1) {
        throw new CannotRemoveOnlyAdminError();
      }
    }

    group.members = group.members.filter(member => 
      member.userId.toString() !== memberId
    );

    await group.save();

    const updatedGroup = await this.groupModel.findById(groupId)
      .populate('createdBy', 'name email')
      .populate('members.userId', 'name email');

    if (!updatedGroup) {
      throw new GroupNotFoundError(groupId);
    }

    return this.mapToResponse(updatedGroup);
  }

  async getGroupMembers(groupId: string, userId: string): Promise<GroupMemberResponse[]> {
    const group = await this.groupModel.findOne({
      _id: groupId,
      isActive: true,
    }).populate('members.userId', 'name email');

    if (!group) {
      throw new GroupNotFoundError(groupId);
    }

    // Check if user is a member
    const isMember = group.members.some(member => 
      member.userId.toString() === userId
    );

    if (!isMember) {
      throw new UserNotMemberError(userId, groupId);
    }

    return group.members.map(member => ({
      userId: member.userId['_id'].toString(),
      userName: member.userId['name'],
      userEmail: member.userId['email'],
      role: member.role,
      joinedAt: member.joinedAt,
    }));
  }

  async getGroupStatistics(groupId: string, userId: string): Promise<any> {
    const group = await this.groupModel.findOne({
      _id: groupId,
      isActive: true,
    });

    if (!group) {
      throw new GroupNotFoundError(groupId);
    }

    // Check if user is a member
    const isMember = group.members.some(member => 
      member.userId.toString() === userId
    );

    if (!isMember) {
      throw new UserNotMemberError(userId, groupId);
    }

    // Get member count
    const memberCount = group.members.length;

    return {
      groupId,
      name: group.name,
      memberCount,
      createdAt: group.createdAt,
    };
  }

  private mapToResponse(group: GroupDocument): GroupResponse {
    return {
      id: group._id.toString(),
      name: group.name,
      description: group.description,
      createdBy: {
        id: group.createdBy['_id']?.toString() || group.createdBy.toString(),
        name: group.createdBy['name'] || 'Unknown',
        email: group.createdBy['email'] || '',
      },
      members: group.members.map(member => ({
        userId: member.userId['_id']?.toString() || member.userId.toString(),
        userName: member.userId['name'] || 'Unknown',
        userEmail: member.userId['email'] || '',
        role: member.role,
        joinedAt: member.joinedAt,
      })),
      settings: group.settings,
      isActive: group.isActive,
      createdAt: group.createdAt!,
      updatedAt: group.updatedAt!,
    };
  }
}