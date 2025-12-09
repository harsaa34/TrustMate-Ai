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
exports.InsightResponseDto = exports.VerifyReceiptResponseDto = exports.ExpenseSummaryResponseDto = exports.ExpenseListResponseDto = exports.ExpenseResponseDto = exports.VerifyReceiptDto = exports.GetExpensesQueryDto = exports.UpdateExpenseDto = exports.CreateExpenseDto = exports.ExpenseSplitResponseDto = exports.ExpenseSplitDto = exports.MinTwoMembersConstraint = exports.PaidByInSplitsConstraint = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
let PaidByInSplitsConstraint = class PaidByInSplitsConstraint {
    validate(splits, args) {
        const object = args.object;
        const paidByUserId = object.paidByUserId;
        if (!paidByUserId || !splits || splits.length === 0) {
            return false;
        }
        return splits.some(split => split.userId === paidByUserId);
    }
    defaultMessage(args) {
        return 'The user who paid (paidByUserId) must be included in the splits';
    }
};
exports.PaidByInSplitsConstraint = PaidByInSplitsConstraint;
exports.PaidByInSplitsConstraint = PaidByInSplitsConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'paidByInSplits', async: false })
], PaidByInSplitsConstraint);
let MinTwoMembersConstraint = class MinTwoMembersConstraint {
    validate(splits) {
        return splits && splits.length >= 2;
    }
    defaultMessage() {
        return 'At least 2 members must be included in expense splits';
    }
};
exports.MinTwoMembersConstraint = MinTwoMembersConstraint;
exports.MinTwoMembersConstraint = MinTwoMembersConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'minTwoMembers', async: false })
], MinTwoMembersConstraint);
class ExpenseSplitDto {
    userId;
    amount;
    percentage;
    shares;
    note;
}
exports.ExpenseSplitDto = ExpenseSplitDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User ID for this split' }),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], ExpenseSplitDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Amount for this user (required for exact splits)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], ExpenseSplitDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Percentage for this user (required for percentage splits)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", Number)
], ExpenseSplitDto.prototype, "percentage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Shares for this user (required for share splits)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], ExpenseSplitDto.prototype, "shares", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Note for this split' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], ExpenseSplitDto.prototype, "note", void 0);
class ExpenseSplitResponseDto {
    userId;
    amount;
    percentage;
    shares;
    note;
}
exports.ExpenseSplitResponseDto = ExpenseSplitResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User ID for this split' }),
    __metadata("design:type", String)
], ExpenseSplitResponseDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Amount for this user' }),
    __metadata("design:type", Number)
], ExpenseSplitResponseDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Percentage for this user', required: false }),
    __metadata("design:type", Number)
], ExpenseSplitResponseDto.prototype, "percentage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Shares for this user', required: false }),
    __metadata("design:type", Number)
], ExpenseSplitResponseDto.prototype, "shares", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Note for this split', required: false }),
    __metadata("design:type", String)
], ExpenseSplitResponseDto.prototype, "note", void 0);
class CreateExpenseDto {
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
}
exports.CreateExpenseDto = CreateExpenseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Expense title' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Expense description' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total expense amount' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01, { message: 'Amount must be greater than 0' }),
    __metadata("design:type", Number)
], CreateExpenseDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User who paid for the expense' }),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "paidByUserId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Expense date' }),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CreateExpenseDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Expense category',
        enum: ['food', 'transport', 'accommodation', 'shopping', 'entertainment', 'bills', 'health', 'education', 'other']
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['food', 'transport', 'accommodation', 'shopping', 'entertainment', 'bills', 'health', 'education', 'other']),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Split type',
        enum: ['equal', 'percentage', 'exact', 'shares', 'adjustment']
    }),
    (0, class_validator_1.IsEnum)(['equal', 'percentage', 'exact', 'shares', 'adjustment']),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "splitType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [ExpenseSplitDto],
        description: 'Expense splits for each user (minimum 2 users)'
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(2, { message: 'At least 2 members must be included in expense splits' }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_validator_1.Validate)(MinTwoMembersConstraint),
    (0, class_validator_1.Validate)(PaidByInSplitsConstraint),
    (0, class_transformer_1.Type)(() => ExpenseSplitDto),
    __metadata("design:type", Array)
], CreateExpenseDto.prototype, "splits", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Receipt image URL' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "receiptImageUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Expense location' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Tags for categorization' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateExpenseDto.prototype, "tags", void 0);
class UpdateExpenseDto {
    title;
    description;
    amount;
    paidByUserId;
    date;
    category;
    splitType;
    splits;
    receiptImageUrl;
    verified;
    location;
    tags;
}
exports.UpdateExpenseDto = UpdateExpenseDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Expense title' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], UpdateExpenseDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Expense description' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], UpdateExpenseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Total expense amount' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01),
    __metadata("design:type", Number)
], UpdateExpenseDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'User who paid for the expense' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], UpdateExpenseDto.prototype, "paidByUserId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Expense date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], UpdateExpenseDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Expense category',
        enum: ['food', 'transport', 'accommodation', 'shopping', 'entertainment', 'bills', 'health', 'education', 'other']
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['food', 'transport', 'accommodation', 'shopping', 'entertainment', 'bills', 'health', 'education', 'other']),
    __metadata("design:type", String)
], UpdateExpenseDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Split type',
        enum: ['equal', 'percentage', 'exact', 'shares', 'adjustment']
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['equal', 'percentage', 'exact', 'shares', 'adjustment']),
    __metadata("design:type", String)
], UpdateExpenseDto.prototype, "splitType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [ExpenseSplitDto],
        description: 'Updated expense splits (minimum 2 users)'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ExpenseSplitDto),
    __metadata("design:type", Array)
], UpdateExpenseDto.prototype, "splits", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Receipt image URL' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateExpenseDto.prototype, "receiptImageUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Mark expense as verified' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateExpenseDto.prototype, "verified", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Expense location' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], UpdateExpenseDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Tags for categorization' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateExpenseDto.prototype, "tags", void 0);
class GetExpensesQueryDto {
    category;
    fromDate;
    toDate;
    paidByUserId;
    verified;
    search;
    sortBy;
    sortOrder;
    page;
    limit;
}
exports.GetExpensesQueryDto = GetExpensesQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by category',
        enum: ['food', 'transport', 'accommodation', 'shopping', 'entertainment', 'bills', 'health', 'education', 'other']
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['food', 'transport', 'accommodation', 'shopping', 'entertainment', 'bills', 'health', 'education', 'other']),
    __metadata("design:type", String)
], GetExpensesQueryDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter from date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], GetExpensesQueryDto.prototype, "fromDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter to date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], GetExpensesQueryDto.prototype, "toDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by paid by user ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], GetExpensesQueryDto.prototype, "paidByUserId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by verified status' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], GetExpensesQueryDto.prototype, "verified", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Search in title and description' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetExpensesQueryDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sort field',
        enum: ['date', 'amount', 'createdAt']
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetExpensesQueryDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sort direction',
        enum: ['asc', 'desc']
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetExpensesQueryDto.prototype, "sortOrder", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Page number' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], GetExpensesQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Items per page' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], GetExpensesQueryDto.prototype, "limit", void 0);
class VerifyReceiptDto {
    extractedAmount;
    extractedDate;
    confidenceScore;
    metadata;
}
exports.VerifyReceiptDto = VerifyReceiptDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Actual amount from receipt' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01),
    __metadata("design:type", Number)
], VerifyReceiptDto.prototype, "extractedAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Extracted date from receipt' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], VerifyReceiptDto.prototype, "extractedDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Confidence score of OCR extraction' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], VerifyReceiptDto.prototype, "confidenceScore", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional verification metadata' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], VerifyReceiptDto.prototype, "metadata", void 0);
class ExpenseResponseDto {
    id;
    groupId;
    title;
    description;
    amount;
    paidByUserId;
    paidByUserName;
    date;
    category;
    splitType;
    splits;
    receiptImageUrl;
    location;
    tags;
    verified;
    createdByUserId;
    createdByUserName;
    createdAt;
    updatedAt;
}
exports.ExpenseResponseDto = ExpenseResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Expense ID' }),
    __metadata("design:type", String)
], ExpenseResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Group ID' }),
    __metadata("design:type", String)
], ExpenseResponseDto.prototype, "groupId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Expense title' }),
    __metadata("design:type", String)
], ExpenseResponseDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Expense description', required: false }),
    __metadata("design:type", String)
], ExpenseResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total expense amount' }),
    __metadata("design:type", Number)
], ExpenseResponseDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User who paid for the expense' }),
    __metadata("design:type", String)
], ExpenseResponseDto.prototype, "paidByUserId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Paid by user name', required: false }),
    __metadata("design:type", String)
], ExpenseResponseDto.prototype, "paidByUserName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Expense date' }),
    __metadata("design:type", Date)
], ExpenseResponseDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Expense category', required: false }),
    __metadata("design:type", String)
], ExpenseResponseDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Split type' }),
    __metadata("design:type", String)
], ExpenseResponseDto.prototype, "splitType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [ExpenseSplitResponseDto],
        description: 'Expense splits'
    }),
    __metadata("design:type", Array)
], ExpenseResponseDto.prototype, "splits", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Receipt image URL', required: false }),
    __metadata("design:type", String)
], ExpenseResponseDto.prototype, "receiptImageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Expense location', required: false }),
    __metadata("design:type", String)
], ExpenseResponseDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tags for categorization', required: false }),
    __metadata("design:type", Array)
], ExpenseResponseDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether expense is verified' }),
    __metadata("design:type", Boolean)
], ExpenseResponseDto.prototype, "verified", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Created by user ID' }),
    __metadata("design:type", String)
], ExpenseResponseDto.prototype, "createdByUserId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Created by user name', required: false }),
    __metadata("design:type", String)
], ExpenseResponseDto.prototype, "createdByUserName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Creation timestamp' }),
    __metadata("design:type", Date)
], ExpenseResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Update timestamp' }),
    __metadata("design:type", Date)
], ExpenseResponseDto.prototype, "updatedAt", void 0);
class ExpenseListResponseDto {
    expenses;
    total;
    page;
    limit;
    totalPages;
}
exports.ExpenseListResponseDto = ExpenseListResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ExpenseResponseDto], description: 'List of expenses' }),
    __metadata("design:type", Array)
], ExpenseListResponseDto.prototype, "expenses", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total count' }),
    __metadata("design:type", Number)
], ExpenseListResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Page number' }),
    __metadata("design:type", Number)
], ExpenseListResponseDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Items per page' }),
    __metadata("design:type", Number)
], ExpenseListResponseDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total pages' }),
    __metadata("design:type", Number)
], ExpenseListResponseDto.prototype, "totalPages", void 0);
class ExpenseSummaryResponseDto {
    totalSpent;
    totalExpenses;
    averageExpense;
    topCategory;
    lastExpenseDate;
}
exports.ExpenseSummaryResponseDto = ExpenseSummaryResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total amount spent',
        example: 15000.75,
    }),
    __metadata("design:type", Number)
], ExpenseSummaryResponseDto.prototype, "totalSpent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of expenses',
        example: 25,
    }),
    __metadata("design:type", Number)
], ExpenseSummaryResponseDto.prototype, "totalExpenses", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Average expense amount',
        example: 600.03,
    }),
    __metadata("design:type", Number)
], ExpenseSummaryResponseDto.prototype, "averageExpense", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Top expense category',
        example: 'food',
    }),
    __metadata("design:type", String)
], ExpenseSummaryResponseDto.prototype, "topCategory", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Last expense date',
        example: '2024-01-15T10:30:00.000Z',
    }),
    __metadata("design:type", Date)
], ExpenseSummaryResponseDto.prototype, "lastExpenseDate", void 0);
class VerifyReceiptResponseDto {
    verified;
    confidence;
}
exports.VerifyReceiptResponseDto = VerifyReceiptResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether receipt was verified',
        example: true,
    }),
    __metadata("design:type", Boolean)
], VerifyReceiptResponseDto.prototype, "verified", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Confidence score',
        example: 0.95,
    }),
    __metadata("design:type", Number)
], VerifyReceiptResponseDto.prototype, "confidence", void 0);
class InsightResponseDto {
    totalSpent;
    averagePerExpense;
    expenseCount;
    categories;
    dailyBreakdown;
}
exports.InsightResponseDto = InsightResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total spent in period' }),
    __metadata("design:type", Number)
], InsightResponseDto.prototype, "totalSpent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Average per expense' }),
    __metadata("design:type", Number)
], InsightResponseDto.prototype, "averagePerExpense", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of expenses' }),
    __metadata("design:type", Number)
], InsightResponseDto.prototype, "expenseCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Top categories with amounts' }),
    __metadata("design:type", Object)
], InsightResponseDto.prototype, "categories", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Daily spending breakdown' }),
    __metadata("design:type", Object)
], InsightResponseDto.prototype, "dailyBreakdown", void 0);
//# sourceMappingURL=expense.dto.js.map