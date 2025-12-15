// src/settlement/settlement.controller.ts - FIXED TYPES
import { Controller, Body, Param, UseGuards, Query, Get, Post, Put, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SettlementService } from './settlement.service';
import { 
  CreateSettlementDto, 
  UpdateSettlementStatusDto, 
  GetSettlementsQueryDto, 
  CreateOptimizedSettlementsDto,
  SettlementResponseDto,
  BalanceResponseDto,
  SettlementOptimizationResultDto,
  SettlementStatisticsDto,
  SettlementListResponseDto
} from './settlement.dto';
import { Api, User } from '../shared/Decorator/api.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { SettlementStatus } from './settlement.schema';

@ApiTags('Settlements')
@Controller('groups/:groupId/settlements')
@UseGuards(JwtAuthGuard)
export class SettlementController {
  constructor(private readonly settlementService: SettlementService) {}

  @Api({
    isPublic: false,
    verb: 'POST',
    path: '',
    description: 'Create a new settlement',
    swaggerSuccessResponse: SettlementResponseDto,
    swaggerRequestErrors: [],
    httpCode: 201,
  })
  async createSettlement(
    @Param('groupId') groupId: string,
    @Body() createDto: CreateSettlementDto,
    @User('id') createdByUserId: string,
  ): Promise<SettlementResponseDto> {
    return this.settlementService.createSettlement(groupId, createDto, createdByUserId);
  }

  @Api({
    isPublic: false,
    verb: 'GET',
    path: '',
    description: 'Get all settlements for a group',
    swaggerSuccessResponse: SettlementListResponseDto,
    swaggerRequestErrors: [],
  })
  async getGroupSettlements(
    @Param('groupId') groupId: string,
    @Query() query: GetSettlementsQueryDto,
  ): Promise<SettlementListResponseDto> {
    // Convert string status to SettlementStatus enum
    const filters = {
      ...query,
      status: query.status as SettlementStatus,
    };
    const settlements = await this.settlementService.getGroupSettlements(groupId, filters);
    
    return {
      settlements,
      total: settlements.length,
      page: query.page || 1,
      limit: query.limit || 20,
      totalPages: Math.ceil(settlements.length / (query.limit || 20))
    };
  }

  @Api({
    isPublic: false,
    verb: 'GET',
    path: 'balances',
    description: 'Calculate balances for all group members',
    swaggerSuccessResponse: [BalanceResponseDto],
    swaggerRequestErrors: [],
  })
  async getBalances(
    @Param('groupId') groupId: string,
  ): Promise<BalanceResponseDto[]> {
    const balances = await this.settlementService.calculateBalances(groupId);
    // Convert Balance[] to BalanceResponseDto[] by adding currency
    return balances.map(balance => ({
      ...balance,
      currency: 'INR' // Or get from group settings
    }));
  }

  @Api({
    isPublic: false,
    verb: 'GET',
    path: 'optimize',
    description: 'Get optimized settlement suggestions',
    swaggerSuccessResponse: [SettlementOptimizationResultDto],
    swaggerRequestErrors: [],
  })
  async getOptimizedSettlements(
    @Param('groupId') groupId: string,
  ): Promise<SettlementOptimizationResultDto[]> {
    return this.settlementService.optimizeSettlements(groupId);
  }

  @Api({
    isPublic: false,
    verb: 'POST',
    path: 'optimize/auto-create',
    description: 'Create optimized settlements automatically',
    swaggerSuccessResponse: [SettlementResponseDto],
    swaggerRequestErrors: [],
    httpCode: 201,
  })
  async createOptimizedSettlements(
    @Param('groupId') groupId: string,
    @Body() body: CreateOptimizedSettlementsDto,
    @User('id') createdByUserId: string,
  ): Promise<SettlementResponseDto[]> {
    return this.settlementService.createOptimizedSettlements(
      groupId, 
      createdByUserId,
      body.maxSettlements,
    );
  }

  @Api({
    isPublic: false,
    verb: 'GET',
    path: 'statistics',
    description: 'Get settlement statistics',
    swaggerSuccessResponse: SettlementStatisticsDto,
    swaggerRequestErrors: [],
  })
  async getStatistics(
    @Param('groupId') groupId: string,
  ): Promise<SettlementStatisticsDto> {
    const stats = await this.settlementService.getSettlementStatistics(groupId);
    // Convert Balance[] to BalanceResponseDto[] by adding currency
    return {
      ...stats,
      balances: stats.balances.map(balance => ({
        ...balance,
        currency: 'INR' // Or get from group settings
      }))
    };
  }

  @Api({
    isPublic: false,
    verb: 'GET',
    path: ':settlementId',
    description: 'Get settlement by ID',
    swaggerSuccessResponse: SettlementResponseDto,
    swaggerRequestErrors: [],
  })
  async getSettlementById(
    @Param('groupId') groupId: string,
    @Param('settlementId') settlementId: string,
  ): Promise<SettlementResponseDto> {
    return this.settlementService.getSettlementById(settlementId);
  }

  @Api({
    isPublic: false,
    verb: 'PUT',
    path: ':settlementId/status',
    description: 'Update settlement status',
    swaggerSuccessResponse: SettlementResponseDto,
    swaggerRequestErrors: [],
  })
  async updateSettlementStatus(
    @Param('groupId') groupId: string,
    @Param('settlementId') settlementId: string,
    @Body() updateDto: UpdateSettlementStatusDto,
  ): Promise<SettlementResponseDto> {
    return this.settlementService.updateSettlementStatus(settlementId, updateDto);
  }

  @Api({
    isPublic: false,
    verb: 'DELETE',
    path: ':settlementId',
    description: 'Delete a settlement',
    swaggerSuccessResponse: null,
    swaggerRequestErrors: [],
    httpCode: 204,
  })
  async deleteSettlement(
    @Param('groupId') groupId: string,
    @Param('settlementId') settlementId: string,
  ): Promise<void> {
    return this.settlementService.deleteSettlement(settlementId);
  }
}