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
exports.ExpenseController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const expense_service_1 = require("./expense.service");
const api_decorator_1 = require("../shared/Decorator/api.decorator");
const jwt_auth_guard_1 = require("../auth/guard/jwt-auth.guard");
const expense_dto_1 = require("./expense.dto");
const expense_dto_2 = require("./expense.dto");
const settlement_dto_1 = require("../settlement/settlement.dto");
let ExpenseController = class ExpenseController {
    expenseService;
    constructor(expenseService) {
        this.expenseService = expenseService;
    }
    async createExpense(groupId, createDto, createdByUserId) {
        return this.expenseService.createExpense(groupId, createDto, createdByUserId);
    }
    async getGroupExpenses(groupId, userId, query) {
        const result = await this.expenseService.getGroupExpenses(groupId, userId, query);
        const totalPages = Math.ceil(result.total / result.limit);
        return {
            expenses: result.expenses,
            total: result.total,
            page: result.page,
            limit: result.limit,
            totalPages,
        };
    }
    async getExpenseSummary(groupId, userId) {
        return this.expenseService.getExpenseSummary(groupId, userId);
    }
    async getBalances(groupId) {
        const balances = await this.expenseService.calculateBalances(groupId);
        return balances.map(balance => ({
            userId: balance.userId,
            userName: balance.userName,
            amount: balance.amount,
            paidAmount: balance.paidAmount,
            owedAmount: balance.owedAmount,
            currency: 'USD',
        }));
    }
    async getSpendingInsights(groupId, query) {
        const period = query.period || 'month';
        const insights = await this.expenseService.getSpendingInsights(groupId, period);
        return {
            totalSpent: insights.totalSpent,
            averagePerExpense: insights.averagePerExpense,
            expenseCount: insights.expenseCount,
            categories: insights.categories,
            dailyBreakdown: insights.dailyBreakdown,
        };
    }
    async getExpenseById(groupId, expenseId, userId) {
        return this.expenseService.getExpenseById(expenseId, userId);
    }
    async updateExpense(groupId, expenseId, updateDto, userId) {
        return this.expenseService.updateExpense(expenseId, updateDto, userId);
    }
    async deleteExpense(groupId, expenseId, userId) {
        await this.expenseService.deleteExpense(expenseId, userId);
        return { success: true, message: 'Expense deleted successfully' };
    }
    async verifyReceipt(groupId, expenseId, verifyDto, userId) {
        return this.expenseService.verifyReceipt(expenseId, verifyDto, userId);
    }
    async uploadReceipt(body) {
        return {
            url: `https://storage.example.com/receipts/${body.file?.originalname || 'receipt.jpg'}`,
            filename: body.file?.originalname || 'receipt.jpg',
        };
    }
};
exports.ExpenseController = ExpenseController;
__decorate([
    (0, common_1.Post)(),
    (0, api_decorator_1.Api)({
        isPublic: false,
        verb: 'POST',
        path: '',
        description: 'Create a new expense in a group',
        requestBody: expense_dto_1.CreateExpenseDto,
        params: [{ name: 'groupId', description: 'Group ID' }],
        swaggerSuccessResponse: expense_dto_2.ExpenseResponseDto,
        httpCode: common_1.HttpStatus.CREATED,
        consumes: ['application/json'],
        produces: ['application/json']
    }),
    __param(0, (0, common_1.Param)('groupId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, api_decorator_1.User)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, expense_dto_1.CreateExpenseDto, String]),
    __metadata("design:returntype", Promise)
], ExpenseController.prototype, "createExpense", null);
__decorate([
    (0, common_1.Get)(),
    (0, api_decorator_1.Api)({
        isPublic: false,
        verb: 'GET',
        path: '',
        description: 'Get all expenses for a group with filters',
        params: [{ name: 'groupId', description: 'Group ID' }],
        swaggerSuccessResponse: expense_dto_2.ExpenseListResponseDto,
        produces: ['application/json']
    }),
    __param(0, (0, common_1.Param)('groupId')),
    __param(1, (0, api_decorator_1.User)('id')),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, expense_dto_1.GetExpensesQueryDto]),
    __metadata("design:returntype", Promise)
], ExpenseController.prototype, "getGroupExpenses", null);
__decorate([
    (0, common_1.Get)('summary'),
    (0, api_decorator_1.Api)({
        isPublic: false,
        verb: 'GET',
        path: 'summary',
        description: 'Get expense summary for a group',
        params: [{ name: 'groupId', description: 'Group ID' }],
        swaggerSuccessResponse: {
            totalSpent: Number,
            totalExpenses: Number,
            averageExpense: Number,
            topCategory: String,
            lastExpenseDate: Date
        },
        produces: ['application/json']
    }),
    __param(0, (0, common_1.Param)('groupId')),
    __param(1, (0, api_decorator_1.User)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ExpenseController.prototype, "getExpenseSummary", null);
__decorate([
    (0, common_1.Get)('balances'),
    (0, api_decorator_1.Api)({
        isPublic: false,
        verb: 'GET',
        path: 'balances',
        description: 'Calculate balances for all group members',
        params: [{ name: 'groupId', description: 'Group ID' }],
        swaggerSuccessResponse: [settlement_dto_1.BalanceResponseDto],
        produces: ['application/json']
    }),
    __param(0, (0, common_1.Param)('groupId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ExpenseController.prototype, "getBalances", null);
__decorate([
    (0, common_1.Get)('insights'),
    (0, api_decorator_1.Api)({
        isPublic: false,
        verb: 'GET',
        path: 'insights',
        description: 'Get spending insights for a group',
        params: [{ name: 'groupId', description: 'Group ID' }],
        swaggerSuccessResponse: expense_dto_2.InsightResponseDto,
        produces: ['application/json']
    }),
    __param(0, (0, common_1.Param)('groupId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ExpenseController.prototype, "getSpendingInsights", null);
__decorate([
    (0, common_1.Get)(':expenseId'),
    (0, api_decorator_1.Api)({
        isPublic: false,
        verb: 'GET',
        path: ':expenseId',
        description: 'Get expense by ID',
        params: [
            { name: 'groupId', description: 'Group ID' },
            { name: 'expenseId', description: 'Expense ID' }
        ],
        swaggerSuccessResponse: expense_dto_2.ExpenseResponseDto,
        produces: ['application/json']
    }),
    __param(0, (0, common_1.Param)('groupId')),
    __param(1, (0, common_1.Param)('expenseId')),
    __param(2, (0, api_decorator_1.User)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ExpenseController.prototype, "getExpenseById", null);
__decorate([
    (0, common_1.Put)(':expenseId'),
    (0, api_decorator_1.Api)({
        isPublic: false,
        verb: 'PUT',
        path: ':expenseId',
        description: 'Update an expense',
        params: [
            { name: 'groupId', description: 'Group ID' },
            { name: 'expenseId', description: 'Expense ID' }
        ],
        requestBody: expense_dto_1.UpdateExpenseDto,
        swaggerSuccessResponse: expense_dto_2.ExpenseResponseDto,
        consumes: ['application/json'],
        produces: ['application/json']
    }),
    __param(0, (0, common_1.Param)('groupId')),
    __param(1, (0, common_1.Param)('expenseId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, api_decorator_1.User)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, expense_dto_1.UpdateExpenseDto, String]),
    __metadata("design:returntype", Promise)
], ExpenseController.prototype, "updateExpense", null);
__decorate([
    (0, common_1.Delete)(':expenseId'),
    (0, api_decorator_1.Api)({
        isPublic: false,
        verb: 'DELETE',
        path: ':expenseId',
        description: 'Delete an expense',
        params: [
            { name: 'groupId', description: 'Group ID' },
            { name: 'expenseId', description: 'Expense ID' }
        ],
        swaggerSuccessResponse: { success: Boolean, message: String },
        produces: ['application/json']
    }),
    __param(0, (0, common_1.Param)('groupId')),
    __param(1, (0, common_1.Param)('expenseId')),
    __param(2, (0, api_decorator_1.User)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ExpenseController.prototype, "deleteExpense", null);
__decorate([
    (0, common_1.Post)(':expenseId/verify'),
    (0, api_decorator_1.Api)({
        isPublic: false,
        verb: 'POST',
        path: ':expenseId/verify',
        description: 'Verify receipt for an expense',
        params: [
            { name: 'groupId', description: 'Group ID' },
            { name: 'expenseId', description: 'Expense ID' }
        ],
        requestBody: expense_dto_1.VerifyReceiptDto,
        swaggerSuccessResponse: { verified: Boolean, confidence: Number },
        consumes: ['application/json'],
        produces: ['application/json']
    }),
    __param(0, (0, common_1.Param)('groupId')),
    __param(1, (0, common_1.Param)('expenseId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, api_decorator_1.User)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, expense_dto_1.VerifyReceiptDto, String]),
    __metadata("design:returntype", Promise)
], ExpenseController.prototype, "verifyReceipt", null);
__decorate([
    (0, common_1.Post)('upload-receipt'),
    (0, api_decorator_1.Api)({
        isPublic: false,
        verb: 'POST',
        path: 'upload-receipt',
        description: 'Upload receipt image',
        swaggerSuccessResponse: { url: String, filename: String },
        consumes: ['multipart/form-data'],
        produces: ['application/json']
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ExpenseController.prototype, "uploadReceipt", null);
exports.ExpenseController = ExpenseController = __decorate([
    (0, swagger_1.ApiTags)('Expenses'),
    (0, common_1.Controller)('groups/:groupId/expenses'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [expense_service_1.ExpenseService])
], ExpenseController);
//# sourceMappingURL=expense.controller.js.map