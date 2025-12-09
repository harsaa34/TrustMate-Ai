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
exports.TrustScoreController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guard/jwt-auth.guard");
const trustscore_service_1 = require("./trustscore.service");
const trustscore_dto_1 = require("./trustscore.dto");
let TrustScoreController = class TrustScoreController {
    trustScoreService;
    constructor(trustScoreService) {
        this.trustScoreService = trustScoreService;
    }
    async create(createTrustScoreDto) {
        const mockUserId = '65f7b8e9c9b1a3d9f8c7b6a5';
        return this.trustScoreService.create(createTrustScoreDto, mockUserId);
    }
    async getUserItems(page = 1, limit = 10) {
        const mockUserId = '65f7b8e9c9b1a3d9f8c7b6a5';
        return this.trustScoreService.getUserItems(mockUserId, page, limit);
    }
    async getById(id) {
        const mockUserId = '65f7b8e9c9b1a3d9f8c7b6a5';
        return this.trustScoreService.getById(id, mockUserId);
    }
    async update(id, updateTrustScoreDto) {
        const mockUserId = '65f7b8e9c9b1a3d9f8c7b6a5';
        return this.trustScoreService.update(id, updateTrustScoreDto, mockUserId);
    }
    async delete(id) {
        const mockUserId = '65f7b8e9c9b1a3d9f8c7b6a5';
        return this.trustScoreService.delete(id, mockUserId);
    }
};
exports.TrustScoreController = TrustScoreController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new trust score' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Trust score created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [trustscore_dto_1.CreateTrustScoreDto]),
    __metadata("design:returntype", Promise)
], TrustScoreController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all trust scores for current user' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, example: 10 }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Trust scores retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TrustScoreController.prototype, "getUserItems", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get trust score by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Trust score ID', type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Trust score retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Trust score not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TrustScoreController.prototype, "getById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update trust score' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Trust score ID', type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Trust score updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Trust score not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, trustscore_dto_1.UpdateTrustScoreDto]),
    __metadata("design:returntype", Promise)
], TrustScoreController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Soft delete trust score' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Trust score ID', type: String }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Trust score deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Trust score not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TrustScoreController.prototype, "delete", null);
exports.TrustScoreController = TrustScoreController = __decorate([
    (0, swagger_1.ApiTags)('TrustScores'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('trustscores'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [trustscore_service_1.TrustScoreService])
], TrustScoreController);
//# sourceMappingURL=trustscore.controller.js.map