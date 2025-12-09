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
exports.SettlementController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const settlement_service_1 = require("./settlement.service");
const settlement_dto_1 = require("./settlement.dto");
const api_decorator_1 = require("../shared/Decorator/api.decorator");
const jwt_auth_guard_1 = require("../auth/guard/jwt-auth.guard");
let SettlementController = class SettlementController {
    settlementService;
    constructor(settlementService) {
        this.settlementService = settlementService;
    }
    async createSettlement(groupId, createDto, createdByUserId) {
        return this.settlementService.createSettlement(groupId, createDto, createdByUserId);
    }
    async getGroupSettlements(groupId, query) {
        const filters = {
            ...query,
            status: query.status,
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
    async getBalances(groupId) {
        const balances = await this.settlementService.calculateBalances(groupId);
        return balances.map(balance => ({
            ...balance,
            currency: 'INR'
        }));
    }
    async getOptimizedSettlements(groupId) {
        return this.settlementService.optimizeSettlements(groupId);
    }
    async createOptimizedSettlements(groupId, body, createdByUserId) {
        return this.settlementService.createOptimizedSettlements(groupId, createdByUserId, body.maxSettlements);
    }
    async getStatistics(groupId) {
        const stats = await this.settlementService.getSettlementStatistics(groupId);
        return {
            ...stats,
            balances: stats.balances.map(balance => ({
                ...balance,
                currency: 'INR'
            }))
        };
    }
    async getSettlementById(groupId, settlementId) {
        return this.settlementService.getSettlementById(settlementId);
    }
    async updateSettlementStatus(groupId, settlementId, updateDto) {
        return this.settlementService.updateSettlementStatus(settlementId, updateDto);
    }
    async deleteSettlement(groupId, settlementId) {
        return this.settlementService.deleteSettlement(settlementId);
    }
};
exports.SettlementController = SettlementController;
__decorate([
    (0, api_decorator_1.Api)({
        isPublic: false,
        verb: 'POST',
        path: '',
        description: 'Create a new settlement',
        swaggerSuccessResponse: settlement_dto_1.SettlementResponseDto,
        swaggerRequestErrors: [],
        httpCode: 201,
    }),
    __param(0, (0, common_1.Param)('groupId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, api_decorator_1.User)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, settlement_dto_1.CreateSettlementDto, String]),
    __metadata("design:returntype", Promise)
], SettlementController.prototype, "createSettlement", null);
__decorate([
    (0, api_decorator_1.Api)({
        isPublic: false,
        verb: 'GET',
        path: '',
        description: 'Get all settlements for a group',
        swaggerSuccessResponse: settlement_dto_1.SettlementListResponseDto,
        swaggerRequestErrors: [],
    }),
    __param(0, (0, common_1.Param)('groupId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, settlement_dto_1.GetSettlementsQueryDto]),
    __metadata("design:returntype", Promise)
], SettlementController.prototype, "getGroupSettlements", null);
__decorate([
    (0, api_decorator_1.Api)({
        isPublic: false,
        verb: 'GET',
        path: 'balances',
        description: 'Calculate balances for all group members',
        swaggerSuccessResponse: [settlement_dto_1.BalanceResponseDto],
        swaggerRequestErrors: [],
    }),
    __param(0, (0, common_1.Param)('groupId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SettlementController.prototype, "getBalances", null);
__decorate([
    (0, api_decorator_1.Api)({
        isPublic: false,
        verb: 'GET',
        path: 'optimize',
        description: 'Get optimized settlement suggestions',
        swaggerSuccessResponse: [settlement_dto_1.SettlementOptimizationResultDto],
        swaggerRequestErrors: [],
    }),
    __param(0, (0, common_1.Param)('groupId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SettlementController.prototype, "getOptimizedSettlements", null);
__decorate([
    (0, api_decorator_1.Api)({
        isPublic: false,
        verb: 'POST',
        path: 'optimize/auto-create',
        description: 'Create optimized settlements automatically',
        swaggerSuccessResponse: [settlement_dto_1.SettlementResponseDto],
        swaggerRequestErrors: [],
        httpCode: 201,
    }),
    __param(0, (0, common_1.Param)('groupId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, api_decorator_1.User)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, settlement_dto_1.CreateOptimizedSettlementsDto, String]),
    __metadata("design:returntype", Promise)
], SettlementController.prototype, "createOptimizedSettlements", null);
__decorate([
    (0, api_decorator_1.Api)({
        isPublic: false,
        verb: 'GET',
        path: 'statistics',
        description: 'Get settlement statistics',
        swaggerSuccessResponse: settlement_dto_1.SettlementStatisticsDto,
        swaggerRequestErrors: [],
    }),
    __param(0, (0, common_1.Param)('groupId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SettlementController.prototype, "getStatistics", null);
__decorate([
    (0, api_decorator_1.Api)({
        isPublic: false,
        verb: 'GET',
        path: ':settlementId',
        description: 'Get settlement by ID',
        swaggerSuccessResponse: settlement_dto_1.SettlementResponseDto,
        swaggerRequestErrors: [],
    }),
    __param(0, (0, common_1.Param)('groupId')),
    __param(1, (0, common_1.Param)('settlementId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SettlementController.prototype, "getSettlementById", null);
__decorate([
    (0, api_decorator_1.Api)({
        isPublic: false,
        verb: 'PUT',
        path: ':settlementId/status',
        description: 'Update settlement status',
        swaggerSuccessResponse: settlement_dto_1.SettlementResponseDto,
        swaggerRequestErrors: [],
    }),
    __param(0, (0, common_1.Param)('groupId')),
    __param(1, (0, common_1.Param)('settlementId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, settlement_dto_1.UpdateSettlementStatusDto]),
    __metadata("design:returntype", Promise)
], SettlementController.prototype, "updateSettlementStatus", null);
__decorate([
    (0, api_decorator_1.Api)({
        isPublic: false,
        verb: 'DELETE',
        path: ':settlementId',
        description: 'Delete a settlement',
        swaggerSuccessResponse: null,
        swaggerRequestErrors: [],
        httpCode: 204,
    }),
    __param(0, (0, common_1.Param)('groupId')),
    __param(1, (0, common_1.Param)('settlementId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SettlementController.prototype, "deleteSettlement", null);
exports.SettlementController = SettlementController = __decorate([
    (0, swagger_1.ApiTags)('Settlements'),
    (0, common_1.Controller)('groups/:groupId/settlements'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [settlement_service_1.SettlementService])
], SettlementController);
//# sourceMappingURL=settlement.controller.js.map