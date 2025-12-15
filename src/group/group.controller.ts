// src/group/group.controller.ts - FIXED IMPORTS
import { 
  Controller, Body, Param, UseGuards, Get, Post, Put, Delete, Query 
} from '@nestjs/common';
import { GroupService } from './group.service';
import { 
  CreateGroupDto, 
  UpdateGroupDto, 
  AddMemberDto,
  GetGroupsQueryDto,
  GroupResponseDto,
  GroupMemberResponseDto,
  GroupStatisticsDto 
} from './group.dto';
import { Api, User } from '../shared/Decorator/api.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('Groups')
@Controller('groups')
@UseGuards(JwtAuthGuard)
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Api({
    isPublic: false,
    verb: 'POST',
    path: '',
    description: 'Create a new group',
    swaggerSuccessResponse: GroupResponseDto,
    swaggerRequestErrors: [],
    httpCode: 201,
  })
  async createGroup(
    @Body() createDto: CreateGroupDto,
    @User('id') userId: string,
  ): Promise<GroupResponseDto> {
    return this.groupService.createGroup(createDto, userId);
  }

  @Api({
    isPublic: false,
    verb: 'GET',
    path: '',
    description: "Get user's groups",
    swaggerSuccessResponse: [GroupResponseDto],
    swaggerRequestErrors: [],
  })
  async getUserGroups(
    @User('id') userId: string,
    @Query() query: GetGroupsQueryDto,
  ): Promise<GroupResponseDto[]> {
    return this.groupService.getUserGroups(userId);
  }

  @Api({
    isPublic: false,
    verb: 'GET',
    path: ':id',
    description: 'Get group details',
    swaggerSuccessResponse: GroupResponseDto,
    swaggerRequestErrors: [],
  })
  async getGroupById(
    @Param('id') groupId: string,
    @User('id') userId: string,
  ): Promise<GroupResponseDto> {
    return this.groupService.getGroupById(groupId, userId);
  }

  @Api({
    isPublic: false,
    verb: 'PUT',
    path: ':id',
    description: 'Update group',
    swaggerSuccessResponse: GroupResponseDto,
    swaggerRequestErrors: [],
  })
  async updateGroup(
    @Param('id') groupId: string,
    @Body() updateDto: UpdateGroupDto,
    @User('id') userId: string,
  ): Promise<GroupResponseDto> {
    return this.groupService.updateGroup(groupId, updateDto, userId);
  }

  @Api({
    isPublic: false,
    verb: 'DELETE',
    path: ':id',
    description: 'Delete group',
    swaggerSuccessResponse: null,
    swaggerRequestErrors: [],
    httpCode: 204,
  })
  async deleteGroup(
    @Param('id') groupId: string,
    @User('id') userId: string,
  ): Promise<void> {
    return this.groupService.deleteGroup(groupId, userId);
  }

  @Api({
    isPublic: false,
    verb: 'POST',
    path: ':id/members',
    description: 'Add member to group',
    swaggerSuccessResponse: GroupResponseDto,
    swaggerRequestErrors: [],
  })
  async addMember(
    @Param('id') groupId: string,
    @Body() addMemberDto: AddMemberDto,
    @User('id') userId: string,
  ): Promise<GroupResponseDto> {
    return this.groupService.addMember(groupId, addMemberDto, userId);
  }

  @Api({
    isPublic: false,
    verb: 'DELETE',
    path: ':id/members/:memberId',
    description: 'Remove member from group',
    swaggerSuccessResponse: null,
    swaggerRequestErrors: [],
    httpCode: 204,
  })
  async removeMember(
    @Param('id') groupId: string,
    @Param('memberId') memberId: string,
    @User('id') userId: string,
  ): Promise<void> {
    await this.groupService.removeMember(groupId, memberId, userId);
  }

  @Api({
    isPublic: false,
    verb: 'GET',
    path: ':id/members',
    description: 'Get group members',
    swaggerSuccessResponse: [GroupMemberResponseDto],
    swaggerRequestErrors: [],
  })
  async getGroupMembers(
    @Param('id') groupId: string,
    @User('id') userId: string,
  ): Promise<GroupMemberResponseDto[]> {
    return this.groupService.getGroupMembers(groupId, userId);
  }

  @Api({
    isPublic: false,
    verb: 'GET',
    path: ':id/stats',
    description: 'Get group statistics',
    swaggerSuccessResponse: GroupStatisticsDto,
    swaggerRequestErrors: [],
  })
  async getGroupStatistics(
    @Param('id') groupId: string,
    @User('id') userId: string,
  ): Promise<GroupStatisticsDto> {
    return this.groupService.getGroupStatistics(groupId, userId);
  }
}