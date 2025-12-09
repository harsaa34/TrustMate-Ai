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
var ExpenseService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const expense_schema_1 = require("./expense.schema");
const group_schema_1 = require("../group/group.schema");
const user_schema_1 = require("../user/schemas/user.schema");
const expense_error_1 = require("./expense.error");
const group_error_1 = require("../group/group.error");
let ExpenseService = ExpenseService_1 = class ExpenseService {
    expenseModel;
    groupModel;
    userModel;
    _logger = new common_1.Logger(ExpenseService_1.name);
    constructor(expenseModel, groupModel, userModel) {
        this.expenseModel = expenseModel;
        this.groupModel = groupModel;
        this.userModel = userModel;
    }
    async createExpense(groupId, createDto, createdByUserId) {
        const group = await this.groupModel.findOne({
            _id: groupId,
            isActive: true,
        }).populate('members.userId', 'name email avatar');
        if (!group) {
            throw new group_error_1.GroupNotFoundError(groupId);
        }
        const isMember = group.members.some(member => member.userId['_id'].toString() === createdByUserId);
        if (!isMember) {
            throw new group_error_1.UserNotMemberError(createdByUserId, groupId);
        }
        const isPaidByMember = group.members.some(member => member.userId['_id'].toString() === createDto.paidByUserId);
        if (!isPaidByMember) {
            throw new expense_error_1.ExpenseValidationError('Payer must be a group member');
        }
        await this.validateExpenseSplits(group, createDto);
        const calculatedSplits = this.calculateSplits(createDto);
        const expense = await this.expenseModel.create({
            groupId: new mongoose_2.Types.ObjectId(groupId),
            title: createDto.title,
            description: createDto.description,
            amount: createDto.amount,
            paidByUserId: new mongoose_2.Types.ObjectId(createDto.paidByUserId),
            date: createDto.date || new Date(),
            category: createDto.category || 'other',
            splitType: createDto.splitType,
            splits: calculatedSplits,
            receiptImageUrl: createDto.receiptImageUrl,
            location: createDto.location,
            tags: createDto.tags || [],
            verified: false,
            createdByUserId: new mongoose_2.Types.ObjectId(createdByUserId),
            isActive: true,
        });
        this._logger.log(`Expense created: ${expense._id}`);
        return this.mapToResponse(expense, group);
    }
    async getExpenseById(expenseId, userId) {
        const expense = await this.expenseModel
            .findOne({ _id: expenseId, isActive: true })
            .populate('paidByUserId', 'name email avatar')
            .populate('createdByUserId', 'name email');
        if (!expense) {
            throw new expense_error_1.ExpenseNotFoundError(expenseId);
        }
        const group = await this.groupModel
            .findOne({ _id: expense.groupId, isActive: true })
            .populate('members.userId', 'name email avatar');
        if (!group) {
            throw new group_error_1.GroupNotFoundError(expense.groupId.toString());
        }
        const isMember = group.members.some(member => member.userId['_id'].toString() === userId);
        if (!isMember) {
            throw new group_error_1.UserNotMemberError(userId, expense.groupId.toString());
        }
        return this.mapToResponse(expense, group);
    }
    async getGroupExpenses(groupId, userId, filters) {
        const group = await this.groupModel.findOne({ _id: groupId, isActive: true });
        if (!group) {
            throw new group_error_1.GroupNotFoundError(groupId);
        }
        const isMember = group.members.some(member => member.userId.toString() === userId);
        if (!isMember) {
            throw new group_error_1.UserNotMemberError(userId, groupId);
        }
        const query = { groupId: new mongoose_2.Types.ObjectId(groupId), isActive: true };
        if (filters?.category)
            query.category = filters.category;
        if (filters?.fromDate || filters?.toDate) {
            query.date = {};
            if (filters.fromDate)
                query.date.$gte = filters.fromDate;
            if (filters.toDate)
                query.date.$lte = filters.toDate;
        }
        if (filters?.paidByUserId)
            query.paidByUserId = new mongoose_2.Types.ObjectId(filters.paidByUserId);
        if (filters?.verified !== undefined)
            query.verified = filters.verified;
        if (filters?.search) {
            query.$or = [
                { title: { $regex: filters.search, $options: 'i' } },
                { description: { $regex: filters.search, $options: 'i' } },
            ];
        }
        const sort = {};
        const sortField = filters?.sortBy || 'date';
        const sortDirection = filters?.sortOrder === 'asc' ? 1 : -1;
        sort[sortField] = sortDirection;
        const page = filters?.page || 1;
        const limit = filters?.limit || 20;
        const skip = (page - 1) * limit;
        const [expenses, total] = await Promise.all([
            this.expenseModel
                .find(query)
                .populate('paidByUserId', 'name email avatar')
                .populate('createdByUserId', 'name email')
                .sort(sort)
                .skip(skip)
                .limit(limit),
            this.expenseModel.countDocuments(query),
        ]);
        const expenseResponses = await Promise.all(expenses.map(expense => this.mapToResponse(expense, group)));
        return { expenses: expenseResponses, total, page, limit };
    }
    async updateExpense(expenseId, updateDto, userId) {
        const expense = await this.expenseModel.findOne({ _id: expenseId, isActive: true });
        if (!expense) {
            throw new expense_error_1.ExpenseNotFoundError(expenseId);
        }
        const group = await this.groupModel
            .findOne({ _id: expense.groupId, isActive: true })
            .populate('members.userId', 'name email avatar');
        if (!group) {
            throw new group_error_1.GroupNotFoundError(expense.groupId.toString());
        }
        const isCreator = expense.createdByUserId.toString() === userId;
        const isAdmin = group.members.some(member => member.userId['_id'].toString() === userId && member.role === 'admin');
        if (!isCreator && !isAdmin) {
            throw new group_error_1.UserNotMemberError(userId, expense.groupId.toString());
        }
        const updateData = { ...updateDto };
        if (updateDto.splits) {
            const validateDto = {
                title: updateDto.title || expense.title,
                description: updateDto.description || expense.description,
                amount: updateDto.amount || expense.amount,
                paidByUserId: expense.paidByUserId.toString(),
                date: updateDto.date || expense.date,
                category: updateDto.category || expense.category,
                splitType: updateDto.splitType || expense.splitType,
                splits: updateDto.splits,
            };
            await this.validateExpenseSplits(group, validateDto);
            updateData.splits = this.calculateSplits(validateDto);
        }
        const updatedExpense = await this.expenseModel
            .findByIdAndUpdate(expenseId, updateData, { new: true })
            .populate('paidByUserId', 'name email avatar')
            .populate('createdByUserId', 'name email');
        if (!updatedExpense) {
            throw new expense_error_1.ExpenseNotFoundError(expenseId);
        }
        return this.mapToResponse(updatedExpense, group);
    }
    async deleteExpense(expenseId, userId) {
        const expense = await this.expenseModel.findOne({ _id: expenseId, isActive: true });
        if (!expense) {
            throw new expense_error_1.ExpenseNotFoundError(expenseId);
        }
        const group = await this.groupModel.findOne({ _id: expense.groupId, isActive: true });
        if (!group) {
            throw new group_error_1.GroupNotFoundError(expense.groupId.toString());
        }
        const isCreator = expense.createdByUserId.toString() === userId;
        const isAdmin = group.members.some(member => member.userId.toString() === userId && member.role === 'admin');
        if (!isCreator && !isAdmin) {
            throw new group_error_1.UserNotMemberError(userId, expense.groupId.toString());
        }
        await this.expenseModel.findByIdAndUpdate(expenseId, { isActive: false });
    }
    async verifyReceipt(expenseId, verifyDto, userId) {
        const expense = await this.expenseModel.findOne({ _id: expenseId, isActive: true });
        if (!expense) {
            throw new expense_error_1.ExpenseNotFoundError(expenseId);
        }
        const group = await this.groupModel.findOne({ _id: expense.groupId, isActive: true });
        if (!group) {
            throw new group_error_1.GroupNotFoundError(expense.groupId.toString());
        }
        const isAdmin = group.members.some(member => member.userId.toString() === userId && member.role === 'admin');
        if (!isAdmin) {
            throw new group_error_1.UserNotMemberError(userId, expense.groupId.toString());
        }
        const amountDifference = Math.abs(expense.amount - verifyDto.extractedAmount);
        const isMatch = amountDifference < 0.01;
        await this.expenseModel.findByIdAndUpdate(expenseId, { verified: isMatch });
        return {
            verified: isMatch,
            confidence: verifyDto.confidenceScore || 0.9,
        };
    }
    async calculateBalances(groupId) {
        const group = await this.groupModel
            .findById(groupId)
            .populate('members.userId', 'name email avatar');
        if (!group) {
            throw new group_error_1.GroupNotFoundError(groupId);
        }
        const balances = new Map();
        group.members.forEach(member => {
            const userId = member.userId['_id'].toString();
            balances.set(userId, {
                userId,
                userName: member.userId['name'],
                amount: 0,
                paidAmount: 0,
                owedAmount: 0,
            });
        });
        const expenses = await this.expenseModel.find({
            groupId: new mongoose_2.Types.ObjectId(groupId),
            isActive: true,
        });
        expenses.forEach(expense => {
            const paidByUserId = expense.paidByUserId.toString();
            if (balances.has(paidByUserId)) {
                const balance = balances.get(paidByUserId);
                balance.paidAmount += expense.amount;
                balance.amount += expense.amount;
            }
            expense.splits.forEach(split => {
                const splitUserId = split.userId.toString();
                if (balances.has(splitUserId)) {
                    const balance = balances.get(splitUserId);
                    balance.owedAmount += split.amount;
                    balance.amount -= split.amount;
                }
            });
        });
        return Array.from(balances.values()).sort((a, b) => b.amount - a.amount);
    }
    async getExpenseSummary(groupId, userId) {
        const group = await this.groupModel
            .findOne({ _id: groupId, isActive: true })
            .populate('members.userId', 'name email avatar');
        if (!group) {
            throw new group_error_1.GroupNotFoundError(groupId);
        }
        const isMember = group.members.some(member => member.userId['_id'].toString() === userId);
        if (!isMember) {
            throw new group_error_1.UserNotMemberError(userId, groupId);
        }
        const expenses = await this.expenseModel
            .find({ groupId: new mongoose_2.Types.ObjectId(groupId), isActive: true })
            .sort({ date: -1 });
        const totalExpenses = expenses.length;
        const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        const averageExpense = totalExpenses > 0 ? totalSpent / totalExpenses : 0;
        const categoryMap = new Map();
        expenses.forEach(expense => {
            const current = categoryMap.get(expense.category) || 0;
            categoryMap.set(expense.category, current + expense.amount);
        });
        let topCategory = 'No expenses';
        let maxAmount = 0;
        categoryMap.forEach((amount, category) => {
            if (amount > maxAmount) {
                maxAmount = amount;
                topCategory = category;
            }
        });
        const lastExpenseDate = expenses.length > 0 ? expenses[0].date : new Date();
        return {
            totalSpent,
            totalExpenses,
            averageExpense,
            topCategory,
            lastExpenseDate,
        };
    }
    async getSpendingInsights(groupId, period = 'month') {
        const group = await this.groupModel.findById(groupId);
        if (!group) {
            throw new group_error_1.GroupNotFoundError(groupId);
        }
        const now = new Date();
        let startDate = new Date();
        switch (period) {
            case 'week':
                startDate.setDate(now.getDate() - 7);
                break;
            case 'month':
                startDate.setMonth(now.getMonth() - 1);
                break;
            case 'year':
                startDate.setFullYear(now.getFullYear() - 1);
                break;
        }
        const expenses = await this.expenseModel.find({
            groupId: new mongoose_2.Types.ObjectId(groupId),
            isActive: true,
            date: { $gte: startDate, $lte: now },
        });
        const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        const expenseCount = expenses.length;
        const averagePerExpense = expenseCount > 0 ? totalSpent / expenseCount : 0;
        const categories = {};
        expenses.forEach(expense => {
            const current = categories[expense.category] || 0;
            categories[expense.category] = current + expense.amount;
        });
        const dailyBreakdown = {};
        expenses.forEach(expense => {
            const dateKey = expense.date.toISOString().split('T')[0];
            const current = dailyBreakdown[dateKey] || 0;
            dailyBreakdown[dateKey] = current + expense.amount;
        });
        return {
            totalSpent,
            averagePerExpense,
            expenseCount,
            categories,
            dailyBreakdown,
        };
    }
    async validateExpenseSplits(group, createDto) {
        const { splits, splitType, amount, paidByUserId } = createDto;
        if (splits.length < 2) {
            throw new expense_error_1.InvalidSplitError('At least 2 members must be included in expense splits');
        }
        const paidByInSplits = splits.some(split => split.userId === paidByUserId);
        if (!paidByInSplits) {
            throw new expense_error_1.InvalidSplitError('The user who paid must be included in the splits');
        }
        for (const split of splits) {
            const isMember = group.members.some(member => member.userId['_id'].toString() === split.userId);
            if (!isMember) {
                throw new expense_error_1.InvalidSplitError(`User ${split.userId} is not a group member`);
            }
        }
        switch (splitType) {
            case 'equal':
                break;
            case 'exact':
                const exactTotal = splits.reduce((sum, split) => sum + (split.amount || 0), 0);
                if (Math.abs(exactTotal - amount) > 0.01) {
                    throw new expense_error_1.InvalidSplitError(`Sum of exact amounts (${exactTotal}) does not match total amount (${amount})`);
                }
                break;
            case 'percentage':
                const percentageTotal = splits.reduce((sum, split) => sum + (split.percentage || 0), 0);
                if (Math.abs(percentageTotal - 100) > 0.01) {
                    throw new expense_error_1.InvalidSplitError(`Sum of percentages (${percentageTotal}) does not equal 100%`);
                }
                break;
            case 'shares':
                const hasShares = splits.every(split => split.shares !== undefined);
                if (!hasShares) {
                    throw new expense_error_1.InvalidSplitError('All splits must have shares for shares split type');
                }
                break;
        }
    }
    calculateSplits(createDto) {
        const { splits, splitType, amount } = createDto;
        switch (splitType) {
            case 'equal':
                const equalAmount = amount / splits.length;
                return splits.map(split => ({
                    userId: new mongoose_2.Types.ObjectId(split.userId),
                    amount: parseFloat(equalAmount.toFixed(2)),
                    note: split.note,
                }));
            case 'exact':
                return splits.map(split => ({
                    userId: new mongoose_2.Types.ObjectId(split.userId),
                    amount: split.amount,
                    note: split.note,
                }));
            case 'percentage':
                return splits.map(split => ({
                    userId: new mongoose_2.Types.ObjectId(split.userId),
                    amount: parseFloat(((split.percentage / 100) * amount).toFixed(2)),
                    percentage: split.percentage,
                    note: split.note,
                }));
            case 'shares':
                const totalShares = splits.reduce((sum, split) => sum + (split.shares || 0), 0);
                return splits.map(split => ({
                    userId: new mongoose_2.Types.ObjectId(split.userId),
                    amount: parseFloat(((split.shares / totalShares) * amount).toFixed(2)),
                    shares: split.shares,
                    note: split.note,
                }));
            default:
                return splits.map(split => ({
                    userId: new mongoose_2.Types.ObjectId(split.userId),
                    amount: split.amount,
                    note: split.note,
                }));
        }
    }
    async mapToResponse(expense, group) {
        if (!group) {
            const foundGroup = await this.groupModel.findById(expense.groupId).populate('members.userId', 'name email avatar');
            if (!foundGroup) {
                throw new group_error_1.GroupNotFoundError(expense.groupId.toString());
            }
            group = foundGroup;
        }
        const paidByUser = group.members.find(m => m.userId['_id'].toString() === expense.paidByUserId.toString())?.userId;
        const createdByUser = group.members.find(m => m.userId['_id'].toString() === expense.createdByUserId.toString())?.userId;
        const splits = expense.splits.map(split => {
            const user = group.members.find(m => m.userId['_id'].toString() === split.userId.toString())?.userId;
            return {
                userId: split.userId.toString(),
                amount: split.amount,
                ...(split.percentage !== undefined && { percentage: split.percentage }),
                ...(split.shares !== undefined && { shares: split.shares }),
                ...(split.note && { note: split.note }),
            };
        });
        return {
            id: expense._id.toString(),
            groupId: expense.groupId.toString(),
            title: expense.title,
            description: expense.description,
            amount: expense.amount,
            paidByUserId: expense.paidByUserId.toString(),
            paidByUserName: paidByUser?.['name'] || 'Unknown',
            date: expense.date,
            category: expense.category,
            splitType: expense.splitType,
            splits,
            verified: expense.verified,
            receiptImageUrl: expense.receiptImageUrl,
            location: expense.location,
            tags: expense.tags || [],
            createdByUserId: expense.createdByUserId.toString(),
            createdByUserName: createdByUser?.['name'] || 'Unknown',
            createdAt: expense.createdAt,
            updatedAt: expense.updatedAt,
        };
    }
};
exports.ExpenseService = ExpenseService;
exports.ExpenseService = ExpenseService = ExpenseService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(expense_schema_1.Expense.name)),
    __param(1, (0, mongoose_1.InjectModel)(group_schema_1.Group.name)),
    __param(2, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], ExpenseService);
//# sourceMappingURL=expense.service.js.map