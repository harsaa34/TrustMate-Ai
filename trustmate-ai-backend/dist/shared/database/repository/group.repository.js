"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const group_schema_1 = require("../../../group/group.schema");
const group_mapper_1 = require("../mapper/group.mapper");
let GroupRepository = class GroupRepository {
    groupModel;
    constructor(groupModel) {
        this.groupModel = groupModel;
    }
    async create(group) {
        const groupData = group_mapper_1.GroupMapper.toEntity(group);
        const createdGroup = await this.groupModel.create(groupData);
        const populated = await this.groupModel
            .findById(createdGroup._id)
            .populate('members.userId', 'name email')
            .populate('createdBy', 'name email')
            .exec();
        const domain = group_mapper_1.GroupMapper.toDomain(populated);
        if (!domain) {
            throw new Error('Failed to create group domain');
        }
        return domain;
    }
    async findById(id) {
        const group = await this.groupModel
            .findById(id)
            .populate('members.userId', 'name email')
            .populate('createdBy', 'name email')
            .exec();
        if (!group)
            return null;
        return group_mapper_1.GroupMapper.toDomain(group);
    }
    async findAll(userId) {
        const groups = await this.groupModel
            .find({
            isActive: true,
            'members.userId': new mongoose_2.Types.ObjectId(userId),
        })
            .populate('members.userId', 'name email')
            .populate('createdBy', 'name email')
            .sort({ updatedAt: -1 })
            .exec();
        return groups
            .map(group => group_mapper_1.GroupMapper.toDomain(group))
            .filter(Boolean);
    }
    async update(id, group) {
        const updateData = group_mapper_1.GroupMapper.toEntity(group);
        const updatedGroup = await this.groupModel
            .findByIdAndUpdate(id, updateData, { new: true })
            .populate('members.userId', 'name email')
            .populate('createdBy', 'name email')
            .exec();
        if (!updatedGroup) {
            throw new Error(`Group with ID ${id} not found`);
        }
        const domain = group_mapper_1.GroupMapper.toDomain(updatedGroup);
        if (!domain) {
            throw new Error('Failed to update group domain');
        }
        return domain;
    }
    async delete(id, userId) {
        const group = await this.findById(id);
        if (!group) {
            throw new Error(`Group with ID ${id} not found`);
        }
        if (group.createdByUserId !== userId) {
            throw new Error('Only the group creator can delete the group');
        }
        await this.groupModel.updateOne({ _id: id }, { isActive: false });
    }
    async addMember(groupId, userId, role = 'member') {
        const group = await this.groupModel.findById(groupId);
        if (!group) {
            throw new Error(`Group with ID ${groupId} not found`);
        }
        const isMember = group.members.some(m => m.userId.toString() === userId);
        if (isMember) {
            throw new Error('User is already a member');
        }
        group.members.push({
            userId: new mongoose_2.Types.ObjectId(userId),
            role,
            joinedAt: new Date(),
        });
        await group.save();
        const updatedGroup = await this.groupModel
            .findById(groupId)
            .populate('members.userId', 'name email')
            .populate('createdBy', 'name email')
            .exec();
        const domain = group_mapper_1.GroupMapper.toDomain(updatedGroup);
        if (!domain) {
            throw new Error('Failed to add member to group');
        }
        return domain;
    }
    async removeMember(groupId, userId) {
        const group = await this.groupModel.findById(groupId);
        if (!group) {
            throw new Error(`Group with ID ${groupId} not found`);
        }
        if (group.createdBy.toString() === userId) {
            throw new Error('Cannot remove group creator');
        }
        group.members = group.members.filter(m => m.userId.toString() !== userId);
        await group.save();
        const updatedGroup = await this.groupModel
            .findById(groupId)
            .populate('members.userId', 'name email')
            .populate('createdBy', 'name email')
            .exec();
        const domain = group_mapper_1.GroupMapper.toDomain(updatedGroup);
        if (!domain) {
            throw new Error('Failed to remove member from group');
        }
        return domain;
    }
    async isMember(groupId, userId) {
        const count = await this.groupModel.countDocuments({
            _id: groupId,
            'members.userId': new mongoose_2.Types.ObjectId(userId),
            isActive: true,
        });
        return count > 0;
    }
    async getUserGroups(userId) {
        return this.findAll(userId);
    }
    async existsById(id) {
        const count = await this.groupModel.countDocuments({ _id: id, isActive: true });
        return count > 0;
    }
};
exports.GroupRepository = GroupRepository;
exports.GroupRepository = GroupRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(group_schema_1.Group.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], GroupRepository);
//# sourceMappingURL=group.repository.js.map