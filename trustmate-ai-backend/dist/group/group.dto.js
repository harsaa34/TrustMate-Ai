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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupStatisticsDto = exports.GroupMemberResponseDto = exports.GroupResponseDto = exports.GetGroupsQueryDto = exports.AddMemberDto = exports.UpdateGroupDto = exports.CreateGroupDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreateGroupDto {
    name;
    description;
    currency;
}
exports.CreateGroupDto = CreateGroupDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Trip to Goa',
        description: 'Group name',
        minLength: 3,
        maxLength: 100
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateGroupDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Our vacation group for Goa trip 2024',
        description: 'Group description',
        maxLength: 500
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateGroupDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'INR',
        description: 'Default currency for the group',
        enum: ['INR', 'USD', 'EUR', 'GBP'],
        default: 'INR'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['INR', 'USD', 'EUR', 'GBP']),
    __metadata("design:type", String)
], CreateGroupDto.prototype, "currency", void 0);
class UpdateGroupDto {
    name;
    description;
    currency;
}
exports.UpdateGroupDto = UpdateGroupDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Goa Trip 2024',
        description: 'Group name',
        minLength: 3,
        maxLength: 100
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateGroupDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Updated description for our Goa trip',
        description: 'Group description',
        maxLength: 500
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], UpdateGroupDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'USD',
        description: 'Default currency for the group',
        enum: ['INR', 'USD', 'EUR', 'GBP']
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['INR', 'USD', 'EUR', 'GBP']),
    __metadata("design:type", String)
], UpdateGroupDto.prototype, "currency", void 0);
class AddMemberDto {
    userId;
    role;
}
exports.AddMemberDto = AddMemberDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '507f1f77bcf86cd799439011',
        description: 'User ID to add to the group'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AddMemberDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'member',
        description: 'Role for the new member',
        enum: ['admin', 'member'],
        default: 'member'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['admin', 'member']),
    __metadata("design:type", String)
], AddMemberDto.prototype, "role", void 0);
class GetGroupsQueryDto {
    sortBy;
    sortOrder;
    page = 1;
    limit = 20;
}
exports.GetGroupsQueryDto = GetGroupsQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'createdAt',
        description: 'Field to sort by',
        enum: ['name', 'createdAt', 'updatedAt']
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['name', 'createdAt', 'updatedAt']),
    __metadata("design:type", String)
], GetGroupsQueryDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'desc',
        description: 'Sort order',
        enum: ['asc', 'desc']
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['asc', 'desc']),
    __metadata("design:type", String)
], GetGroupsQueryDto.prototype, "sortOrder", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 1,
        description: 'Page number',
        minimum: 1,
        default: 1
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], GetGroupsQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 20,
        description: 'Items per page',
        minimum: 1,
        maximum: 100,
        default: 20
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], GetGroupsQueryDto.prototype, "limit", void 0);
class GroupResponseDto {
    id;
    name;
    description;
    createdBy;
    members;
    settings;
    isActive;
    createdAt;
    updatedAt;
}
exports.GroupResponseDto = GroupResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '507f1f77bcf86cd799439011', description: 'Group ID' }),
    __metadata("design:type", String)
], GroupResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Trip to Goa', description: 'Group name' }),
    __metadata("design:type", String)
], GroupResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Our vacation group', description: 'Group description' }),
    __metadata("design:type", String)
], GroupResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Group creator',
        example: { id: '507f1f77bcf86cd799439011', name: 'John Doe', email: 'john@example.com' }
    }),
    __metadata("design:type", Object)
], GroupResponseDto.prototype, "createdBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Group members',
        type: 'array',
        items: {
            type: 'object',
            properties: {
                userId: { type: 'string', example: '507f1f77bcf86cd799439011' },
                userName: { type: 'string', example: 'Jane Smith' },
                userEmail: { type: 'string', example: 'jane@example.com' },
                role: { type: 'string', example: 'member', enum: ['admin', 'member'] },
                joinedAt: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00.000Z' }
            }
        }
    }),
    __metadata("design:type", Array)
], GroupResponseDto.prototype, "members", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: { currency: 'INR', defaultSplitType: 'equal' },
        description: 'Group settings'
    }),
    __metadata("design:type", Object)
], GroupResponseDto.prototype, "settings", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: 'Whether the group is active' }),
    __metadata("design:type", Boolean)
], GroupResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-15T10:30:00.000Z', description: 'Creation date' }),
    __metadata("design:type", Date)
], GroupResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-15T10:30:00.000Z', description: 'Last update date' }),
    __metadata("design:type", Date)
], GroupResponseDto.prototype, "updatedAt", void 0);
class GroupMemberResponseDto {
    userId;
    userName;
    userEmail;
    role;
    joinedAt;
}
exports.GroupMemberResponseDto = GroupMemberResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '507f1f77bcf86cd799439011', description: 'User ID' }),
    __metadata("design:type", String)
], GroupMemberResponseDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'John Doe', description: 'User name' }),
    __metadata("design:type", String)
], GroupMemberResponseDto.prototype, "userName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'john@example.com', description: 'User email' }),
    __metadata("design:type", String)
], GroupMemberResponseDto.prototype, "userEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'member', description: 'Member role', enum: ['admin', 'member'] }),
    __metadata("design:type", String)
], GroupMemberResponseDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-15T10:30:00.000Z', description: 'Join date' }),
    __metadata("design:type", Date)
], GroupMemberResponseDto.prototype, "joinedAt", void 0);
class GroupStatisticsDto {
    groupId;
    name;
    memberCount;
    createdAt;
}
exports.GroupStatisticsDto = GroupStatisticsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '507f1f77bcf86cd799439011', description: 'Group ID' }),
    __metadata("design:type", String)
], GroupStatisticsDto.prototype, "groupId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Trip to Goa', description: 'Group name' }),
    __metadata("design:type", String)
], GroupStatisticsDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5, description: 'Number of members' }),
    __metadata("design:type", Number)
], GroupStatisticsDto.prototype, "memberCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-15T10:30:00.000Z', description: 'Creation date' }),
    __metadata("design:type", Date)
], GroupStatisticsDto.prototype, "createdAt", void 0);
//# sourceMappingURL=group.dto.js.map