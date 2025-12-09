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
exports.ReceiptController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const jwt_auth_guard_1 = require("../auth/guard/jwt-auth.guard");
const receipt_service_1 = require("./receipt.service");
const receipt_dto_1 = require("./receipt.dto");
const multer_1 = require("multer");
let ReceiptController = class ReceiptController {
    receiptService;
    constructor(receiptService) {
        this.receiptService = receiptService;
    }
    async create(createReceiptDto) {
        const mockUserId = '65f7b8e9c9b1a3d9f8c7b6a5';
        return this.receiptService.create(createReceiptDto, mockUserId);
    }
    async uploadAndProcess(file, processDto) {
        const mockUserId = '65f7b8e9c9b1a3d9f8c7b6a5';
        return this.receiptService.processReceiptImage(file, processDto, mockUserId);
    }
    async getUserItems(page = 1, limit = 10, status, merchantName, fromDate, toDate) {
        const mockUserId = '65f7b8e9c9b1a3d9f8c7b6a5';
        return this.receiptService.getUserItems(mockUserId, page, limit, {
            status,
            merchantName,
            fromDate,
            toDate,
        });
    }
    async getById(id) {
        const mockUserId = '65f7b8e9c9b1a3d9f8c7b6a5';
        return this.receiptService.getById(id, mockUserId);
    }
    async update(id, updateReceiptDto) {
        const mockUserId = '65f7b8e9c9b1a3d9f8c7b6a5';
        return this.receiptService.update(id, updateReceiptDto, mockUserId);
    }
    async delete(id) {
        const mockUserId = '65f7b8e9c9b1a3d9f8c7b6a5';
        return this.receiptService.delete(id, mockUserId);
    }
    async analyzeReceipt(id) {
        const mockUserId = '65f7b8e9c9b1a3d9f8c7b6a5';
        return this.receiptService.analyzeReceipt(id, mockUserId);
    }
    async getStatistics() {
        const mockUserId = '65f7b8e9c9b1a3d9f8c7b6a5';
        return this.receiptService.getStatistics(mockUserId);
    }
};
exports.ReceiptController = ReceiptController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new receipt record' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Receipt created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [receipt_dto_1.CreateReceiptDto]),
    __metadata("design:returntype", Promise)
], ReceiptController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, swagger_1.ApiOperation)({ summary: 'Upload and process receipt image' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
                merchantName: { type: 'string', example: 'Amazon' },
                amount: { type: 'number', example: 99.99 },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Receipt processed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.memoryStorage)(),
        limits: {
            fileSize: 10 * 1024 * 1024,
        },
        fileFilter: (req, file, callback) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png|pdf)$/)) {
                return callback(new common_1.BadRequestException('Only image and PDF files are allowed'), false);
            }
            callback(null, true);
        },
    })),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, receipt_dto_1.ProcessReceiptDto]),
    __metadata("design:returntype", Promise)
], ReceiptController.prototype, "uploadAndProcess", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all receipts for current user' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, example: 10 }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: ['PENDING', 'PROCESSED', 'ERROR', 'ARCHIVED'] }),
    (0, swagger_1.ApiQuery)({ name: 'merchantName', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'fromDate', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'toDate', required: false, type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Receipts retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('merchantName')),
    __param(4, (0, common_1.Query)('fromDate')),
    __param(5, (0, common_1.Query)('toDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String, String, String]),
    __metadata("design:returntype", Promise)
], ReceiptController.prototype, "getUserItems", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get receipt by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Receipt ID', type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Receipt retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Receipt not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReceiptController.prototype, "getById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update receipt' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Receipt ID', type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Receipt updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Receipt not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, receipt_dto_1.UpdateReceiptDto]),
    __metadata("design:returntype", Promise)
], ReceiptController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Soft delete receipt' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Receipt ID', type: String }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Receipt deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Receipt not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReceiptController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)(':id/analyze'),
    (0, swagger_1.ApiOperation)({ summary: 'Analyze receipt for expense categorization' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Receipt ID', type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Receipt analyzed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Receipt not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReceiptController.prototype, "analyzeReceipt", null);
__decorate([
    (0, common_1.Get)('statistics/summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Get receipt processing statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Statistics retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReceiptController.prototype, "getStatistics", null);
exports.ReceiptController = ReceiptController = __decorate([
    (0, swagger_1.ApiTags)('Receipts'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('receipts'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [receipt_service_1.ReceiptService])
], ReceiptController);
//# sourceMappingURL=receipt.controller.js.map