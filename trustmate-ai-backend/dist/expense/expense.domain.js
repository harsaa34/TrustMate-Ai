"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseDomain = void 0;
class ExpenseDomain {
    id;
    groupId;
    title;
    amount;
    paidByUserId;
    date;
    splitType;
    splits;
    createdByUserId;
    description;
    category;
    receiptImageUrl;
    location;
    tags;
    verified;
    createdAt;
    updatedAt;
    constructor(id, groupId, title, amount, paidByUserId, date, splitType, splits, createdByUserId, description, category, receiptImageUrl, location, tags, verified, createdAt, updatedAt) {
        this.id = id;
        this.groupId = groupId;
        this.title = title;
        this.amount = amount;
        this.paidByUserId = paidByUserId;
        this.date = date;
        this.splitType = splitType;
        this.splits = splits;
        this.createdByUserId = createdByUserId;
        this.description = description;
        this.category = category;
        this.receiptImageUrl = receiptImageUrl;
        this.location = location;
        this.tags = tags;
        this.verified = verified;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    static create(data) {
        return new ExpenseDomain(null, data.groupId, data.title, data.amount, data.paidByUserId, data.date, data.splitType, data.splits, data.createdByUserId, data.description, data.category, data.receiptImageUrl, data.location, data.tags, false, new Date(), new Date());
    }
}
exports.ExpenseDomain = ExpenseDomain;
//# sourceMappingURL=expense.domain.js.map