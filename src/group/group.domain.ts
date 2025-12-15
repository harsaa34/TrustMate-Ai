// src/group/group.domain.ts
export interface GroupMember {
  userId: string;
  role: string;
  joinedAt: Date;
}

export class GroupDomain {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly members: GroupMember[],
    public readonly currency: string = 'USD',
    public readonly isActive: boolean = true,
    public readonly createdByUserId: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  static create(
    name: string,
    description: string,
    createdByUserId: string,
    currency: string = 'USD',
  ): GroupDomain {
    return new GroupDomain(
      '',
      name,
      description,
      [{ userId: createdByUserId, role: 'admin', joinedAt: new Date() }],
      currency,
      true,
      createdByUserId,
    );
  }

  addMember(userId: string, role: string = 'member'): GroupDomain {
    if (this.members.some(m => m.userId === userId)) {
      throw new Error('User is already a member');
    }

    const updatedMembers = [
      ...this.members,
      { userId, role, joinedAt: new Date() }
    ];

    return new GroupDomain(
      this.id,
      this.name,
      this.description,
      updatedMembers,
      this.currency,
      this.isActive,
      this.createdByUserId,
      this.createdAt,
      this.updatedAt,
    );
  }

  removeMember(userId: string): GroupDomain {
    if (userId === this.createdByUserId) {
      throw new Error('Cannot remove group creator');
    }

    const updatedMembers = this.members.filter(m => m.userId !== userId);

    return new GroupDomain(
      this.id,
      this.name,
      this.description,
      updatedMembers,
      this.currency,
      this.isActive,
      this.createdByUserId,
      this.createdAt,
      this.updatedAt,
    );
  }
}