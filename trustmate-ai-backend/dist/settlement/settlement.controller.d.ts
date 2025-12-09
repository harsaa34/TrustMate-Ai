import { SettlementService } from './settlement.service';
import { CreateSettlementDto, UpdateSettlementStatusDto, GetSettlementsQueryDto, CreateOptimizedSettlementsDto, SettlementResponseDto, BalanceResponseDto, SettlementOptimizationResultDto, SettlementStatisticsDto, SettlementListResponseDto } from './settlement.dto';
export declare class SettlementController {
    private readonly settlementService;
    constructor(settlementService: SettlementService);
    createSettlement(groupId: string, createDto: CreateSettlementDto, createdByUserId: string): Promise<SettlementResponseDto>;
    getGroupSettlements(groupId: string, query: GetSettlementsQueryDto): Promise<SettlementListResponseDto>;
    getBalances(groupId: string): Promise<BalanceResponseDto[]>;
    getOptimizedSettlements(groupId: string): Promise<SettlementOptimizationResultDto[]>;
    createOptimizedSettlements(groupId: string, body: CreateOptimizedSettlementsDto, createdByUserId: string): Promise<SettlementResponseDto[]>;
    getStatistics(groupId: string): Promise<SettlementStatisticsDto>;
    getSettlementById(groupId: string, settlementId: string): Promise<SettlementResponseDto>;
    updateSettlementStatus(groupId: string, settlementId: string, updateDto: UpdateSettlementStatusDto): Promise<SettlementResponseDto>;
    deleteSettlement(groupId: string, settlementId: string): Promise<void>;
}
