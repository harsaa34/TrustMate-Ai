"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupDomain = void 0;
class GroupDomain {
    id;
    name;
    description;
    members;
    currency;
    isActive;
    createdByUserId;
    createdAt;
    updatedAt;
    constructor(id, name, description, members, currency = 'USD', isActive = true, createdByUserId, createdAt, updatedAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.members = members;
        this.currency = currency;
        this.isActive = isActive;
        this.createdByUserId = createdByUserId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    static create(name, description, createdByUserId, currency = 'USD') {
        return new GroupDomain('', name, description, [{ userId: createdByUserId, role: 'admin', joinedAt: new Date() }], currency, true, createdByUserId);
    }
    addMember(userId, role = 'member') {
        if (this.members.some(m => m.userId === userId)) {
            throw new Error('User is already a member');
        }
        const updatedMembers = [
            ...this.members,
            { userId, role, joinedAt: new Date() }
        ];
        return new GroupDomain(this.id, this.name, this.description, updatedMembers, this.currency, this.isActive, this.createdByUserId, this.createdAt, this.updatedAt);
    }
    removeMember(userId) {
        if (userId === this.createdByUserId) {
            throw new Error('Cannot remove group creator');
        }
        const updatedMembers = this.members.filter(m => m.userId !== userId);
        return new GroupDomain(this.id, this.name, this.description, updatedMembers, this.currency, this.isActive, this.createdByUserId, this.createdAt, this.updatedAt);
    }
}
exports.GroupDomain = GroupDomain;
//# sourceMappingURL=group.domain.js.map