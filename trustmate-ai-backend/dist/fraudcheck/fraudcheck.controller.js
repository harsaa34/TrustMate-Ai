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
exports.FraudCheckController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guard/jwt-auth.guard");
const fraudcheck_service_1 = require("./fraudcheck.service");
const fraudcheck_dto_1 = require("./fraudcheck.dto");
let FraudCheckController = class FraudCheckController {
    fraudCheckService;
    constructor(fraudCheckService) {
        this.fraudCheckService = fraudCheckService;
    }
    async create(createFraudCheckDto) {
        const mockUserId = '65f7b8e9c9b1a3d9f8c7b6a5';
        return this.fraudCheckService.create(createFraudCheckDto, mockUserId);
    }
    async getUserItems(page = 1, limit = 10, status, riskLevel) {
        const mockUserId = '65f7b8e9c9b1a3d9f8c7b6a5';
        return this.fraudCheckService.getUserItems(mockUserId, page, limit, { status, riskLevel });
    }
    async getById(id) {
        const mockUserId = '65f7b8e9c9b1a3d9f8c7b6a5';
        return this.fraudCheckService.getById(id, mockUserId);
    }
    async update(id, updateFraudCheckDto) {
        const mockUserId = '65f7b8e9c9b1a3d9f8c7b6a5';
        return this.fraudCheckService.update(id, updateFraudCheckDto, mockUserId);
    }
    async delete(id) {
        const mockUserId = '65f7b8e9c9b1a3d9f8c7b6a5';
        return this.fraudCheckService.delete(id, mockUserId);
    }
    async analyzeTransaction(analyzeDto) {
        const mockUserId = '65f7b8e9c9b1a3d9f8c7b6a5';
        return this.fraudCheckService.analyzeTransaction(analyzeDto, mockUserId);
    }
    async getStatistics() {
        const mockUserId = '65f7b8e9c9b1a3d9f8c7b6a5';
        return this.fraudCheckService.getStatistics(mockUserId);
    }
};
exports.FraudCheckController = FraudCheckController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new fraud check' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Fraud check created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fraudcheck_dto_1.CreateFraudCheckDto]),
    __metadata("design:returntype", Promise)
], FraudCheckController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all fraud checks for current user' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, example: 10 }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: ['PENDING', 'APPROVED', 'REJECTED', 'FLAGGED'] }),
    (0, swagger_1.ApiQuery)({ name: 'riskLevel', required: false, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Fraud checks retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('riskLevel')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String]),
    __metadata("design:returntype", Promise)
], FraudCheckController.prototype, "getUserItems", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get fraud check by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Fraud check ID', type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Fraud check retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Fraud check not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FraudCheckController.prototype, "getById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update fraud check' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Fraud check ID', type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Fraud check updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Fraud check not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, fraudcheck_dto_1.UpdateFraudCheckDto]),
    __metadata("design:returntype", Promise)
], FraudCheckController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Soft delete fraud check' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Fraud check ID', type: String }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Fraud check deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Fraud check not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FraudCheckController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)('analyze'),
    (0, swagger_1.ApiOperation)({ summary: 'Analyze transaction for fraud' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Transaction analyzed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fraudcheck_dto_1.AnalyzeTransactionDto]),
    __metadata("design:returntype", Promise)
], FraudCheckController.prototype, "analyzeTransaction", null);
__decorate([
    (0, common_1.Get)('statistics/summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Get fraud detection statistics summary' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Statistics retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FraudCheckController.prototype, "getStatistics", null);
exports.FraudCheckController = FraudCheckController = __decorate([
    (0, swagger_1.ApiTags)('FraudChecks'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('fraudchecks'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [fraudcheck_service_1.FraudCheckService])
], FraudCheckController);
//# sourceMappingURL=fraudcheck.controller.js.map