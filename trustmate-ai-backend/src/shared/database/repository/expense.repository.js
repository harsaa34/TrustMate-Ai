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
exports.ExpenseRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const expense_schema_1 = require("../../../expense/expense.schema");
const expense_mapper_1 = require("../mapper/expense.mapper");
const expense_error_1 = require("../../../expense/expense.error");
let ExpenseRepository = class ExpenseRepository {
    expenseModel;
    constructor(expenseModel) {
        this.expenseModel = expenseModel;
    }
    async create(expense) {
        this.validateSplits(expense);
        const expenseData = expense_mapper_1.ExpenseMapper.toEntity(expense);
        const createdExpense = await this.expenseModel.create(expenseData);
        const populated = await this.expenseModel
            .findById(createdExpense._id)
            .populate('paidByUserId', 'name email avatar')
            .populate('createdByUserId', 'name email')
            .exec();
        const domain = expense_mapper_1.ExpenseMapper.toDomain(populated);
        if (!domain) {
            throw new Error('Failed to create expense domain');
        }
        return domain;
    }
    async findById(id, userId) {
        const expense = await this.expenseModel
            .findById(id)
            .populate('paidByUserId', 'name email avatar')
            .populate('createdByUserId', 'name email')
            .exec();
        if (!expense) {
            throw new expense_error_1.ExpenseNotFoundError(id);
        }
        if (userId) {
            const hasAccess = await this.userHasAccess(id, userId);
            if (!hasAccess) {
                throw new expense_error_1.ExpenseValidationError('You do not have access to this expense');
            }
        }
        return expense_mapper_1.ExpenseMapper.toDomain(expense);
    }
    async findAll(groupId, userId, query) {
        const { category, fromDate, toDate, paidByUserId, verified, search, sortBy = 'date', sortOrder = 'desc', page = 1, limit = 20 } = query;
        const skip = (page - 1) * limit;
        const filter = {
            groupId: new mongoose_2.Types.ObjectId(groupId),
            isActive: true
        };
        const userObjectId = new mongoose_2.Types.ObjectId(userId);
        filter.$or = [
            { 'splits.userId': userObjectId },
            { paidByUserId: userObjectId },
            { createdByUserId: userObjectId }
        ];
        if (category)
            filter.category = category;
        if (paidByUserId)
            filter.paidByUserId = new mongoose_2.Types.ObjectId(paidByUserId);
        if (verified !== undefined)
            filter.verified = verified;
        if (fromDate || toDate) {
            filter.date = {};
            if (fromDate)
                filter.date.$gte = fromDate;
            if (toDate)
                filter.date.$lte = toDate;
        }
        let finalFilter = filter;
        if (search) {
            finalFilter = {
                $and: [
                    filter,
                    {
                        $or: [
                            { title: { $regex: search, $options: 'i' } },
                            { description: { $regex: search, $options: 'i' } }
                        ]
                    }
                ]
            };
        }
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
        const [expenses, total] = await Promise.all([
            this.expenseModel
                .find(finalFilter)
                .populate('paidByUserId', 'name email avatar')
                .populate('createdByUserId', 'name email')
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .exec(),
            this.expenseModel.countDocuments(finalFilter)
        ]);
        const expenseDomains = expenses
            .map(expense => expense_mapper_1.ExpenseMapper.toDomain(expense))
            .filter(Boolean);
        return {
            expenses: expenseDomains,
            total,
            page,
            limit
        };
    }
    async update(id, expense, userId) {
        const existing = await this.findById(id, userId);
        if (!existing || existing.createdByUserId !== userId) {
            throw new expense_error_1.ExpenseValidationError('Only the expense creator can update it');
        }
        this.validateSplits(expense);
        const updateData = expense_mapper_1.ExpenseMapper.toEntity(expense);
        const updatedExpense = await this.expenseModel
            .findByIdAndUpdate(id, { ...updateData, isActive: true }, { new: true })
            .populate('paidByUserId', 'name email avatar')
            .populate('createdByUserId', 'name email')
            .exec();
        if (!updatedExpense) {
            throw new expense_error_1.ExpenseNotFoundError(id);
        }
        const domain = expense_mapper_1.ExpenseMapper.toDomain(updatedExpense);
        if (!domain) {
            throw new Error('Failed to update expense domain');
        }
        return domain;
    }
    async delete(id, userId) {
        const expense = await this.findById(id, userId);
        if (!expense || expense.createdByUserId !== userId) {
            throw new expense_error_1.ExpenseValidationError('Only the expense creator can delete it');
        }
        const result = await this.expenseModel.updateOne({ _id: id }, { isActive: false });
        if (result.modifiedCount === 0) {
            throw new expense_error_1.ExpenseNotFoundError(id);
        }
    }
    async calculateBalances(groupId) {
        const pipeline = [
            {
                $match: {
                    groupId: new mongoose_2.Types.ObjectId(groupId),
                    verified: true,
                    isActive: true
                }
            },
            {
                $unwind: '$splits'
            },
            {
                $group: {
                    _id: '$splits.userId',
                    totalOwed: { $sum: '$splits.amount' }
                }
            },
            {
                $lookup: {
                    from: 'expenses',
                    let: { userId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$groupId', new mongoose_2.Types.ObjectId(groupId)] },
                                        { $eq: ['$paidByUserId', '$$userId'] },
                                        { $eq: ['$verified', true] },
                                        { $eq: ['$isActive', true] }
                                    ]
                                }
                            }
                        },
                        {
                            $group: {
                                _id: null,
                                totalPaid: { $sum: '$amount' }
                            }
                        }
                    ],
                    as: 'paidExpenses'
                }
            },
            {
                $addFields: {
                    totalPaid: { $ifNull: [{ $arrayElemAt: ['$paidExpenses.totalPaid', 0] }, 0] }
                }
            },
            {
                $project: {
                    userId: { $toString: '$_id' },
                    balance: { $subtract: ['$totalPaid', '$totalOwed'] },
                    _id: 0
                }
            },
            { $sort: { balance: -1 } }
        ];
        const balances = await this.expenseModel.aggregate(pipeline);
        return balances.map(balance => ({
            ...balance,
            currency: 'USD'
        }));
    }
    async getExpenseSummary(groupId, userId) {
        const userObjectId = new mongoose_2.Types.ObjectId(userId);
        const groupObjectId = new mongoose_2.Types.ObjectId(groupId);
        const pipeline = [
            {
                $match: {
                    groupId: groupObjectId,
                    isActive: true,
                    $or: [
                        { 'splits.userId': userObjectId },
                        { paidByUserId: userObjectId }
                    ]
                }
            },
            {
                $facet: {
                    totalStats: [
                        {
                            $group: {
                                _id: null,
                                totalSpent: { $sum: '$amount' },
                                totalExpenses: { $sum: 1 },
                                averageExpense: { $avg: '$amount' }
                            }
                        }
                    ],
                    categoryStats: [
                        {
                            $group: {
                                _id: '$category',
                                total: { $sum: '$amount' }
                            }
                        },
                        { $sort: { total: -1 } },
                        { $limit: 1 }
                    ],
                    latestExpense: [
                        { $sort: { date: -1 } },
                        { $limit: 1 },
                        { $project: { date: 1 } }
                    ]
                }
            }
        ];
        const [result] = await this.expenseModel.aggregate(pipeline);
        return {
            totalSpent: result.totalStats[0]?.totalSpent || 0,
            totalExpenses: result.totalStats[0]?.totalExpenses || 0,
            averageExpense: result.totalStats[0]?.averageExpense || 0,
            topCategory: result.categoryStats[0]?._id || 'No expenses',
            lastExpenseDate: result.latestExpense[0]?.date || new Date()
        };
    }
    async getSpendingInsights(groupId, period) {
        const dateFilter = this.getDateFilter(period);
        const groupObjectId = new mongoose_2.Types.ObjectId(groupId);
        const pipeline = [
            {
                $match: {
                    groupId: groupObjectId,
                    isActive: true,
                    date: dateFilter
                }
            },
            {
                $facet: {
                    overallStats: [
                        {
                            $group: {
                                _id: null,
                                totalAmount: { $sum: '$amount' },
                                averageAmount: { $avg: '$amount' },
                                count: { $sum: 1 }
                            }
                        }
                    ],
                    categoryBreakdown: [
                        {
                            $group: {
                                _id: '$category',
                                total: { $sum: '$amount' }
                            }
                        }
                    ],
                    dailyBreakdown: [
                        {
                            $group: {
                                _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
                                total: { $sum: '$amount' }
                            }
                        },
                        { $sort: { _id: 1 } }
                    ]
                }
            }
        ];
        const [result] = await this.expenseModel.aggregate(pipeline);
        const categoryBreakdown = {};
        result.categoryBreakdown?.forEach(item => {
            categoryBreakdown[item._id || 'uncategorized'] = item.total;
        });
        const dailyBreakdown = {};
        result.dailyBreakdown?.forEach(item => {
            dailyBreakdown[item._id] = item.total;
        });
        return {
            totalAmount: result.overallStats[0]?.totalAmount || 0,
            averageAmount: result.overallStats[0]?.averageAmount || 0,
            count: result.overallStats[0]?.count || 0,
            categoryBreakdown,
            dailyBreakdown
        };
    }
    async verifyReceipt(expenseId, verifyDto, userId) {
        const expense = await this.findById(expenseId, userId);
        if (!expense || expense.createdByUserId !== userId) {
            throw new expense_error_1.ExpenseValidationError('Only the expense creator can verify it');
        }
        const amountDifference = Math.abs(expense.amount - verifyDto.extractedAmount);
        const amountTolerance = expense.amount * 0.05;
        const isVerified = amountDifference <= amountTolerance;
        const confidenceScore = isVerified ?
            Math.max(0.8, 1 - (amountDifference / expense.amount)) :
            Math.min(0.3, 1 - (amountDifference / expense.amount));
        const receiptImageUrl = verifyDto.receiptImageUrl || expense.receiptImageUrl;
        await this.expenseModel.updateOne({ _id: expenseId }, {
            verified: isVerified,
            receiptImageUrl
        });
        return {
            isVerified,
            confidenceScore,
            extractedAmount: verifyDto.extractedAmount,
            extractedDate: verifyDto.extractedDate
        };
    }
    validateSplits(expense) {
        if (!expense.splits || expense.splits.length < 2) {
            throw new expense_error_1.InvalidSplitError('At least 2 members must be included in expense splits');
        }
        const paidByInSplits = expense.splits.some(split => split.userId === expense.paidByUserId);
        if (!paidByInSplits) {
            throw new expense_error_1.UserNotInSplitError(expense.paidByUserId, expense.id || 'unknown-expense-id');
        }
        if (expense.splitType === 'exact') {
            const totalSplitAmount = expense.splits.reduce((sum, split) => sum + (split.amount || 0), 0);
            if (Math.abs(totalSplitAmount - expense.amount) > 0.01) {
                throw new expense_error_1.InvalidSplitError('Total split amounts must equal expense amount for exact splits');
            }
        }
        if (expense.splitType === 'percentage') {
            const totalPercentage = expense.splits.reduce((sum, split) => sum + (split.percentage || 0), 0);
            if (Math.abs(totalPercentage - 100) > 0.01) {
                throw new expense_error_1.InvalidSplitError('Total percentages must equal 100% for percentage splits');
            }
        }
    }
    async existsById(id) {
        const count = await this.expenseModel.countDocuments({ _id: id, isActive: true });
        return count > 0;
    }
    async userHasAccess(expenseId, userId) {
        const expense = await this.expenseModel.findById(expenseId);
        if (!expense)
            return false;
        const userObjectId = new mongoose_2.Types.ObjectId(userId);
        const isMember = expense.splits.some(split => split.userId.equals(userObjectId));
        const isCreator = expense.createdByUserId?.equals(userObjectId) || false;
        return isMember || isCreator;
    }
    getDateFilter(period) {
        const now = new Date();
        const startDate = new Date();
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
            default:
                startDate.setMonth(now.getMonth() - 1);
        }
        return { $gte: startDate, $lte: now };
    }
};
exports.ExpenseRepository = ExpenseRepository;
exports.ExpenseRepository = ExpenseRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(expense_schema_1.Expense.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ExpenseRepository);
//# sourceMappingURL=expense.repository.js.map