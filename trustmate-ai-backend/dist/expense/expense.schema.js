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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseSchema = exports.Expense = exports.ExpenseSplitSchema = exports.ExpenseSplit = exports.ExpenseCategory = exports.ExpenseSplitType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var ExpenseSplitType;
(function (ExpenseSplitType) {
    ExpenseSplitType["EQUAL"] = "equal";
    ExpenseSplitType["PERCENTAGE"] = "percentage";
    ExpenseSplitType["EXACT"] = "exact";
    ExpenseSplitType["SHARES"] = "shares";
    ExpenseSplitType["ADJUSTMENT"] = "adjustment";
})(ExpenseSplitType || (exports.ExpenseSplitType = ExpenseSplitType = {}));
var ExpenseCategory;
(function (ExpenseCategory) {
    ExpenseCategory["FOOD"] = "food";
    ExpenseCategory["TRANSPORT"] = "transport";
    ExpenseCategory["ACCOMMODATION"] = "accommodation";
    ExpenseCategory["SHOPPING"] = "shopping";
    ExpenseCategory["ENTERTAINMENT"] = "entertainment";
    ExpenseCategory["BILLS"] = "bills";
    ExpenseCategory["HEALTH"] = "health";
    ExpenseCategory["EDUCATION"] = "education";
    ExpenseCategory["OTHER"] = "other";
})(ExpenseCategory || (exports.ExpenseCategory = ExpenseCategory = {}));
let ExpenseSplit = class ExpenseSplit {
    userId;
    amount;
    percentage;
    shares;
    note;
};
exports.ExpenseSplit = ExpenseSplit;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ExpenseSplit.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: true, min: 0 }),
    __metadata("design:type", Number)
], ExpenseSplit.prototype, "amount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, min: 0 }),
    __metadata("design:type", Number)
], ExpenseSplit.prototype, "percentage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, min: 0 }),
    __metadata("design:type", Number)
], ExpenseSplit.prototype, "shares", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, maxlength: 200 }),
    __metadata("design:type", String)
], ExpenseSplit.prototype, "note", void 0);
exports.ExpenseSplit = ExpenseSplit = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], ExpenseSplit);
exports.ExpenseSplitSchema = mongoose_1.SchemaFactory.createForClass(ExpenseSplit);
let Expense = class Expense {
    groupId;
    title;
    description;
    amount;
    paidByUserId;
    date;
    category;
    splitType;
    splits;
    verified;
    receiptImageUrl;
    verificationId;
    isActive;
    location;
    tags;
    createdByUserId;
    createdAt;
    updatedAt;
};
exports.Expense = Expense;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Group', required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Expense.prototype, "groupId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true, trim: true, maxlength: 200 }),
    __metadata("design:type", String)
], Expense.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, trim: true, maxlength: 500 }),
    __metadata("design:type", String)
], Expense.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: true, min: 0.01 }),
    __metadata("design:type", Number)
], Expense.prototype, "amount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Expense.prototype, "paidByUserId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, required: true, default: Date.now }),
    __metadata("design:type", Date)
], Expense.prototype, "date", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: Object.values(ExpenseCategory),
        default: ExpenseCategory.OTHER
    }),
    __metadata("design:type", String)
], Expense.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: Object.values(ExpenseSplitType),
        default: ExpenseSplitType.EQUAL,
        required: true
    }),
    __metadata("design:type", String)
], Expense.prototype, "splitType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [exports.ExpenseSplitSchema], required: true }),
    __metadata("design:type", Array)
], Expense.prototype, "splits", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], Expense.prototype, "verified", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Expense.prototype, "receiptImageUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'ReceiptVerification' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Expense.prototype, "verificationId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: true }),
    __metadata("design:type", Boolean)
], Expense.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, maxlength: 200 }),
    __metadata("design:type", String)
], Expense.prototype, "location", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Expense.prototype, "tags", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Expense.prototype, "createdByUserId", void 0);
exports.Expense = Expense = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Expense);
exports.ExpenseSchema = mongoose_1.SchemaFactory.createForClass(Expense);
exports.ExpenseSchema.index({ groupId: 1, date: -1 });
exports.ExpenseSchema.index({ groupId: 1, paidByUserId: 1 });
exports.ExpenseSchema.index({ groupId: 1, category: 1 });
exports.ExpenseSchema.index({ verified: 1 });
exports.ExpenseSchema.index({ createdByUserId: 1 });
//# sourceMappingURL=expense.schema.js.map