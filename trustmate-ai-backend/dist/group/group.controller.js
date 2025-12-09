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
exports.GroupController = void 0;
const common_1 = require("@nestjs/common");
const group_service_1 = require("./group.service");
const group_dto_1 = require("./group.dto");
const api_decorator_1 = require("../shared/Decorator/api.decorator");
const jwt_auth_guard_1 = require("../auth/guard/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
let GroupController = class GroupController {
    groupService;
    constructor(groupService) {
        this.groupService = groupService;
    }
    async createGroup(createDto, userId) {
        return this.groupService.createGroup(createDto, userId);
    }
    async getUserGroups(userId, query) {
        return this.groupService.getUserGroups(userId);
    }
    async getGroupById(groupId, userId) {
        return this.groupService.getGroupById(groupId, userId);
    }
    async updateGroup(groupId, updateDto, userId) {
        return this.groupService.updateGroup(groupId, updateDto, userId);
    }
    async deleteGroup(groupId, userId) {
        return this.groupService.deleteGroup(groupId, userId);
    }
    async addMember(groupId, addMemberDto, userId) {
        return this.groupService.addMember(groupId, addMemberDto, userId);
    }
    async removeMember(groupId, memberId, userId) {
        await this.groupService.removeMember(groupId, memberId, userId);
    }
    async getGroupMembers(groupId, userId) {
        return this.groupService.getGroupMembers(groupId, userId);
    }
    async getGroupStatistics(groupId, userId) {
        return this.groupService.getGroupStatistics(groupId, userId);
    }
};
exports.GroupController = GroupController;
__decorate([
    (0, api_decorator_1.Api)({
        isPublic: false,
        verb: 'POST',
        path: '',
        description: 'Create a new group',
        swaggerSuccessResponse: group_dto_1.GroupResponseDto,
        swaggerRequestErrors: [],
        httpCode: 201,
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, api_decorator_1.User)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [group_dto_1.CreateGroupDto, String]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "createGroup", null);
__decorate([
    (0, api_decorator_1.Api)({
        isPublic: false,
        verb: 'GET',
        path: '',
        description: "Get user's groups",
        swaggerSuccessResponse: [group_dto_1.GroupResponseDto],
        swaggerRequestErrors: [],
    }),
    __param(0, (0, api_decorator_1.User)('id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, group_dto_1.GetGroupsQueryDto]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "getUserGroups", null);
__decorate([
    (0, api_decorator_1.Api)({
        isPublic: false,
        verb: 'GET',
        path: ':id',
        description: 'Get group details',
        swaggerSuccessResponse: group_dto_1.GroupResponseDto,
        swaggerRequestErrors: [],
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, api_decorator_1.User)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "getGroupById", null);
__decorate([
    (0, api_decorator_1.Api)({
        isPublic: false,
        verb: 'PUT',
        path: ':id',
        description: 'Update group',
        swaggerSuccessResponse: group_dto_1.GroupResponseDto,
        swaggerRequestErrors: [],
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, api_decorator_1.User)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, group_dto_1.UpdateGroupDto, String]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "updateGroup", null);
__decorate([
    (0, api_decorator_1.Api)({
        isPublic: false,
        verb: 'DELETE',
        path: ':id',
        description: 'Delete group',
        swaggerSuccessResponse: null,
        swaggerRequestErrors: [],
        httpCode: 204,
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, api_decorator_1.User)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "deleteGroup", null);
__decorate([
    (0, api_decorator_1.Api)({
        isPublic: false,
        verb: 'POST',
        path: ':id/members',
        description: 'Add member to group',
        swaggerSuccessResponse: group_dto_1.GroupResponseDto,
        swaggerRequestErrors: [],
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, api_decorator_1.User)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, group_dto_1.AddMemberDto, String]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "addMember", null);
__decorate([
    (0, api_decorator_1.Api)({
        isPublic: false,
        verb: 'DELETE',
        path: ':id/members/:memberId',
        description: 'Remove member from group',
        swaggerSuccessResponse: null,
        swaggerRequestErrors: [],
        httpCode: 204,
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('memberId')),
    __param(2, (0, api_decorator_1.User)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "removeMember", null);
__decorate([
    (0, api_decorator_1.Api)({
        isPublic: false,
        verb: 'GET',
        path: ':id/members',
        description: 'Get group members',
        swaggerSuccessResponse: [group_dto_1.GroupMemberResponseDto],
        swaggerRequestErrors: [],
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, api_decorator_1.User)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "getGroupMembers", null);
__decorate([
    (0, api_decorator_1.Api)({
        isPublic: false,
        verb: 'GET',
        path: ':id/stats',
        description: 'Get group statistics',
        swaggerSuccessResponse: group_dto_1.GroupStatisticsDto,
        swaggerRequestErrors: [],
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, api_decorator_1.User)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "getGroupStatistics", null);
exports.GroupController = GroupController = __decorate([
    (0, swagger_1.ApiTags)('Groups'),
    (0, common_1.Controller)('groups'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [group_service_1.GroupService])
], GroupController);
//# sourceMappingURL=group.controller.js.map