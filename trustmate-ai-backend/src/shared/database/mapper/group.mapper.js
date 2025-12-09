"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupMapper = void 0;
const mongoose_1 = require("mongoose");
const group_domain_1 = require("../../../group/group.domain");
class GroupMapper {
    static toDomain(group) {
        if (!group)
            return null;
        return new group_domain_1.GroupDomain(group._id.toString(), group.name, group.description, group.members.map(member => ({
            userId: member.userId.toString(),
            role: member.role,
            joinedAt: member.joinedAt,
        })), group.settings?.currency || 'USD', group.isActive, group.createdBy.toString(), group.createdAt, group.updatedAt);
    }
    static toEntity(domain) {
        return {
            name: domain.name,
            description: domain.description,
            members: domain.members.map(member => ({
                userId: new mongoose_1.Types.ObjectId(member.userId),
                role: member.role,
                joinedAt: member.joinedAt,
            })),
            settings: {
                currency: domain.currency,
                defaultSplitType: 'equal',
            },
            isActive: domain.isActive,
            createdBy: new mongoose_1.Types.ObjectId(domain.createdByUserId),
        };
    }
}
exports.GroupMapper = GroupMapper;
//# sourceMappingURL=group.mapper.js.map