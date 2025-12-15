// src/shared/database/mapper/group.mapper.ts - FIXED
import { Types } from 'mongoose';
import { Group, GroupDocument, GroupMember as GroupMemberSchema } from '../../../group/group.schema';
import { GroupDomain, GroupMember } from '../../../group/group.domain';

export class GroupMapper {
  static toDomain(group: GroupDocument): GroupDomain | null {
    if (!group) return null;

    return new GroupDomain(
      group._id.toString(),
      group.name,
      group.description,
      group.members.map(member => ({
        userId: member.userId.toString(),
        role: member.role,
        joinedAt: member.joinedAt,
      })),
      group.settings?.currency || 'USD', // Get currency from settings
      group.isActive,
      group.createdBy.toString(), // This should be createdBy, not createdByUserId
      group.createdAt,
      group.updatedAt,
    );
  }

  static toEntity(domain: GroupDomain): Partial<Group> {
    return {
      name: domain.name,
      description: domain.description,
      members: domain.members.map(member => ({
        userId: new Types.ObjectId(member.userId),
        role: member.role,
        joinedAt: member.joinedAt,
      })),
      settings: {
        currency: domain.currency,
        defaultSplitType: 'equal', // Default value
      },
      isActive: domain.isActive,
      createdBy: new Types.ObjectId(domain.createdByUserId),
    };
  }
}