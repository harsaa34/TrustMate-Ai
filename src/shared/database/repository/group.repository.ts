// src/shared/database/repository/group.repository.ts - FIXED
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, FilterQuery } from 'mongoose';
import { Group, GroupDocument, GroupMember } from '../../../group/group.schema';
import { GroupDomain } from '../../../group/group.domain';
import { GroupMapper } from '../mapper/group.mapper';

export interface IGroupRepository {
  // CRUD Operations
  create(group: GroupDomain): Promise<GroupDomain>;
  findById(id: string): Promise<GroupDomain | null>;
  findAll(userId: string): Promise<GroupDomain[]>;
  update(id: string, group: GroupDomain): Promise<GroupDomain>;
  delete(id: string, userId: string): Promise<void>;
  
  // Member Operations
  addMember(groupId: string, userId: string, role?: string): Promise<GroupDomain>;
  removeMember(groupId: string, userId: string): Promise<GroupDomain>;
  
  // Business Operations
  isMember(groupId: string, userId: string): Promise<boolean>;
  getUserGroups(userId: string): Promise<GroupDomain[]>;
  existsById(id: string): Promise<boolean>;
}

@Injectable()
export class GroupRepository implements IGroupRepository {
  constructor(
    @InjectModel(Group.name) private groupModel: Model<GroupDocument>,
  ) {}

  async create(group: GroupDomain): Promise<GroupDomain> {
    const groupData = GroupMapper.toEntity(group);
    const createdGroup = await this.groupModel.create(groupData);
    
    const populated = await this.groupModel
      .findById(createdGroup._id)
      .populate('members.userId', 'name email')
      .populate('createdBy', 'name email') // Changed from createdByUserId
      .exec();

    const domain = GroupMapper.toDomain(populated!);
    if (!domain) {
      throw new Error('Failed to create group domain');
    }
    return domain;
  }

  async findById(id: string): Promise<GroupDomain | null> {
    const group = await this.groupModel
      .findById(id)
      .populate('members.userId', 'name email')
      .populate('createdBy', 'name email') // Changed from createdByUserId
      .exec();

    if (!group) return null;
    return GroupMapper.toDomain(group);
  }

  async findAll(userId: string): Promise<GroupDomain[]> {
    const groups = await this.groupModel
      .find({
        isActive: true,
        'members.userId': new Types.ObjectId(userId),
      })
      .populate('members.userId', 'name email')
      .populate('createdBy', 'name email') // Changed from createdByUserId
      .sort({ updatedAt: -1 })
      .exec();

    return groups
      .map(group => GroupMapper.toDomain(group))
      .filter(Boolean) as GroupDomain[];
  }

  async update(id: string, group: GroupDomain): Promise<GroupDomain> {
    const updateData = GroupMapper.toEntity(group);
    const updatedGroup = await this.groupModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('members.userId', 'name email')
      .populate('createdBy', 'name email') // Changed from createdByUserId
      .exec();

    if (!updatedGroup) {
      throw new Error(`Group with ID ${id} not found`);
    }

    const domain = GroupMapper.toDomain(updatedGroup);
    if (!domain) {
      throw new Error('Failed to update group domain');
    }
    return domain;
  }

  async delete(id: string, userId: string): Promise<void> {
    const group = await this.findById(id);
    if (!group) {
      throw new Error(`Group with ID ${id} not found`);
    }

    if (group.createdByUserId !== userId) {
      throw new Error('Only the group creator can delete the group');
    }

    await this.groupModel.updateOne(
      { _id: id },
      { isActive: false }
    );
  }

  async addMember(groupId: string, userId: string, role: string = 'member'): Promise<GroupDomain> {
    const group = await this.groupModel.findById(groupId);
    if (!group) {
      throw new Error(`Group with ID ${groupId} not found`);
    }

    // Check if user is already a member
    const isMember = group.members.some(m => 
      m.userId.toString() === userId
    );
    if (isMember) {
      throw new Error('User is already a member');
    }

    group.members.push({
      userId: new Types.ObjectId(userId),
      role,
      joinedAt: new Date(),
    });

    await group.save();

    const updatedGroup = await this.groupModel
      .findById(groupId)
      .populate('members.userId', 'name email')
      .populate('createdBy', 'name email') // Changed from createdByUserId
      .exec();

    const domain = GroupMapper.toDomain(updatedGroup!);
    if (!domain) {
      throw new Error('Failed to add member to group');
    }
    return domain;
  }

  async removeMember(groupId: string, userId: string): Promise<GroupDomain> {
    const group = await this.groupModel.findById(groupId);
    if (!group) {
      throw new Error(`Group with ID ${groupId} not found`);
    }

    // Check if user is the creator
    if (group.createdBy.toString() === userId) { // Fixed: use createdBy, not createdByUserId
      throw new Error('Cannot remove group creator');
    }

    // Remove member
    group.members = group.members.filter(m => 
      m.userId.toString() !== userId
    );

    await group.save();

    const updatedGroup = await this.groupModel
      .findById(groupId)
      .populate('members.userId', 'name email')
      .populate('createdBy', 'name email') // Changed from createdByUserId
      .exec();

    const domain = GroupMapper.toDomain(updatedGroup!);
    if (!domain) {
      throw new Error('Failed to remove member from group');
    }
    return domain;
  }

  async isMember(groupId: string, userId: string): Promise<boolean> {
    const count = await this.groupModel.countDocuments({
      _id: groupId,
      'members.userId': new Types.ObjectId(userId),
      isActive: true,
    });
    return count > 0;
  }

  async getUserGroups(userId: string): Promise<GroupDomain[]> {
    return this.findAll(userId);
  }

  async existsById(id: string): Promise<boolean> {
    const count = await this.groupModel.countDocuments({ _id: id, isActive: true });
    return count > 0;
  }
}