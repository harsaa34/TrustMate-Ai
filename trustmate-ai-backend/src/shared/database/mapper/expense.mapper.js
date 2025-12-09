"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseMapper = void 0;
const mongoose_1 = require("mongoose");
const expense_domain_1 = require("../../../expense/expense.domain");
class ExpenseMapper {
    static toDomain(expense) {
        if (!expense)
            return null;
        return new expense_domain_1.ExpenseDomain(expense._id.toString(), expense.groupId.toString(), expense.title, expense.amount, expense.paidByUserId.toString(), expense.date, expense.splitType, expense.splits.map(split => ({
            userId: split.userId.toString(),
            amount: split.amount,
            percentage: split.percentage,
            shares: split.shares,
            note: split.note
        })), expense.createdByUserId.toString(), expense.description, expense.category, expense.receiptImageUrl, expense.location, expense.tags || [], expense.verified, expense.createdAt, expense.updatedAt);
    }
    static toEntity(domain) {
        const splits = domain.splits.map(split => {
            const expenseSplit = {
                userId: new mongoose_1.Types.ObjectId(split.userId),
                amount: split.amount || 0,
                ...(split.percentage !== undefined && { percentage: split.percentage }),
                ...(split.shares !== undefined && { shares: split.shares }),
                ...(split.note && { note: split.note }),
            };
            return expenseSplit;
        });
        return {
            groupId: new mongoose_1.Types.ObjectId(domain.groupId),
            title: domain.title,
            description: domain.description,
            amount: domain.amount,
            paidByUserId: new mongoose_1.Types.ObjectId(domain.paidByUserId),
            date: domain.date,
            category: domain.category,
            splitType: domain.splitType,
            splits,
            receiptImageUrl: domain.receiptImageUrl,
            location: domain.location,
            tags: domain.tags,
            verified: domain.verified,
            createdByUserId: new mongoose_1.Types.ObjectId(domain.createdByUserId),
            isActive: true
        };
    }
}
exports.ExpenseMapper = ExpenseMapper;
//# sourceMappingURL=expense.mapper.js.map