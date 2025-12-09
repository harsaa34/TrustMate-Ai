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
exports.ExpenseSchema = exports.Expense = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const swagger_1 = require("@nestjs/swagger");
let Expense = class Expense {
    _id;
    groupId;
    title;
    description;
    amount;
    paidByUserId;
    date;
    category;
    splitType;
    splits;
    receiptImageUrl;
    location;
    tags;
    verified;
    createdByUserId;
    createdAt;
    updatedAt;
};
exports.Expense = Expense;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Expense ID' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Expense.prototype, "_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Group', required: true, index: true }),
    (0, swagger_1.ApiProperty)({ description: 'Group ID' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Expense.prototype, "groupId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true, trim: true, maxlength: 200 }),
    (0, swagger_1.ApiProperty)({ description: 'Expense title' }),
    __metadata("design:type", String)
], Expense.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, trim: true, maxlength: 500 }),
    (0, swagger_1.ApiProperty)({ description: 'Expense description', required: false }),
    __metadata("design:type", String)
], Expense.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: true, min: 0.01 }),
    (0, swagger_1.ApiProperty)({ description: 'Total expense amount' }),
    __metadata("design:type", Number)
], Expense.prototype, "amount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    (0, swagger_1.ApiProperty)({ description: 'User who paid for the expense' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Expense.prototype, "paidByUserId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, required: true, default: Date.now }),
    (0, swagger_1.ApiProperty)({ description: 'Expense date' }),
    __metadata("design:type", Date)
], Expense.prototype, "date", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['food', 'transport', 'accommodation', 'shopping', 'entertainment', 'bills', 'health', 'education', 'other']
    }),
    (0, swagger_1.ApiProperty)({ description: 'Expense category', required: false }),
    __metadata("design:type", String)
], Expense.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
        enum: ['equal', 'percentage', 'exact', 'shares', 'adjustment']
    }),
    (0, swagger_1.ApiProperty)({ description: 'Split type' }),
    __metadata("design:type", String)
], Expense.prototype, "splitType", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{
                userId: { type: mongoose_2.Types.ObjectId, ref: 'User', required: true },
                amount: { type: Number, required: false },
                percentage: { type: Number, required: false, min: 0, max: 100 },
                shares: { type: Number, required: false },
                note: { type: String, maxlength: 200 }
            }],
        required: true,
        validate: {
            validator: function (splits) {
                return splits && splits.length >= 2;
            },
            message: 'At least 2 members must be included in expense splits'
        }
    }),
    (0, swagger_1.ApiProperty)({ description: 'Expense splits' }),
    __metadata("design:type", Array)
], Expense.prototype, "splits", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    (0, swagger_1.ApiProperty)({ description: 'Receipt image URL', required: false }),
    __metadata("design:type", String)
], Expense.prototype, "receiptImageUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, maxlength: 200 }),
    (0, swagger_1.ApiProperty)({ description: 'Expense location', required: false }),
    __metadata("design:type", String)
], Expense.prototype, "location", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String] }),
    (0, swagger_1.ApiProperty)({ description: 'Tags for categorization', required: false }),
    __metadata("design:type", Array)
], Expense.prototype, "tags", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    (0, swagger_1.ApiProperty)({ description: 'Whether expense is verified' }),
    __metadata("design:type", Boolean)
], Expense.prototype, "verified", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    (0, swagger_1.ApiProperty)({ description: 'Created by user ID' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Expense.prototype, "createdByUserId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Creation timestamp' }),
    __metadata("design:type", Date)
], Expense.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Update timestamp' }),
    __metadata("design:type", Date)
], Expense.prototype, "updatedAt", void 0);
exports.Expense = Expense = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Expense);
exports.ExpenseSchema = mongoose_1.SchemaFactory.createForClass(Expense);
exports.ExpenseSchema.index({ groupId: 1, date: -1 });
exports.ExpenseSchema.index({ groupId: 1, paidByUserId: 1 });
exports.ExpenseSchema.index({ groupId: 1, category: 1 });
exports.ExpenseSchema.index({ 'splits.userId': 1 });
//# sourceMappingURL=expense.entity.js.map