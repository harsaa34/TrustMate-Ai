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
exports.ReceiptListResponseDto = exports.ReceiptAnalysisResultDto = exports.ReceiptResponseDto = exports.ProcessReceiptDto = exports.UpdateReceiptDto = exports.CreateReceiptDto = exports.ExpenseCategory = exports.ReceiptStatus = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var ReceiptStatus;
(function (ReceiptStatus) {
    ReceiptStatus["PENDING"] = "PENDING";
    ReceiptStatus["PROCESSING"] = "PROCESSING";
    ReceiptStatus["PROCESSED"] = "PROCESSED";
    ReceiptStatus["ERROR"] = "ERROR";
    ReceiptStatus["ARCHIVED"] = "ARCHIVED";
})(ReceiptStatus || (exports.ReceiptStatus = ReceiptStatus = {}));
var ExpenseCategory;
(function (ExpenseCategory) {
    ExpenseCategory["FOOD_DINING"] = "FOOD_DINING";
    ExpenseCategory["SHOPPING"] = "SHOPPING";
    ExpenseCategory["TRANSPORTATION"] = "TRANSPORTATION";
    ExpenseCategory["ENTERTAINMENT"] = "ENTERTAINMENT";
    ExpenseCategory["UTILITIES"] = "UTILITIES";
    ExpenseCategory["HEALTHCARE"] = "HEALTHCARE";
    ExpenseCategory["TRAVEL"] = "TRAVEL";
    ExpenseCategory["EDUCATION"] = "EDUCATION";
    ExpenseCategory["OTHER"] = "OTHER";
})(ExpenseCategory || (exports.ExpenseCategory = ExpenseCategory = {}));
class CreateReceiptDto {
    merchantName;
    amount;
    currency;
    transactionDate;
    imageUrl;
    paymentMethod;
    notes;
    tags;
    metadata;
}
exports.CreateReceiptDto = CreateReceiptDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Merchant name', example: 'Amazon India' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateReceiptDto.prototype, "merchantName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total amount', example: 1999.99 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateReceiptDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Currency code', example: 'INR' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateReceiptDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Transaction date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateReceiptDto.prototype, "transactionDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Receipt image URL' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], CreateReceiptDto.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Payment method', example: 'Credit Card' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateReceiptDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional notes' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateReceiptDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Tags for categorization', example: ['business', 'travel'], type: [String] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateReceiptDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional metadata', type: Object }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateReceiptDto.prototype, "metadata", void 0);
class UpdateReceiptDto {
    merchantName;
    amount;
    currency;
    transactionDate;
    status;
    notes;
    tags;
    isActive;
    analysisResult;
}
exports.UpdateReceiptDto = UpdateReceiptDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Updated merchant name' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateReceiptDto.prototype, "merchantName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Updated amount' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateReceiptDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Updated currency' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateReceiptDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Updated transaction date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateReceiptDto.prototype, "transactionDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Updated status', enum: ReceiptStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(ReceiptStatus),
    __metadata("design:type", String)
], UpdateReceiptDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Updated notes' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateReceiptDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Updated tags', type: [String] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateReceiptDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Whether the receipt is active' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateReceiptDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Analysis result', type: Object }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateReceiptDto.prototype, "analysisResult", void 0);
class ProcessReceiptDto {
    merchantName;
    amount;
}
exports.ProcessReceiptDto = ProcessReceiptDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Merchant name', example: 'Amazon' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ProcessReceiptDto.prototype, "merchantName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total amount', example: 99.99 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], ProcessReceiptDto.prototype, "amount", void 0);
class ReceiptResponseDto {
    id;
    merchantName;
    amount;
    currency;
    transactionDate;
    imageUrl;
    fileName;
    fileSize;
    mimeType;
    ocrData;
    analysisResult;
    status;
    confidenceScore;
    processedAt;
    paymentMethod;
    notes;
    tags;
    isActive;
    createdBy;
    createdAt;
    updatedAt;
}
exports.ReceiptResponseDto = ReceiptResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Receipt ID' }),
    __metadata("design:type", String)
], ReceiptResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Merchant name' }),
    __metadata("design:type", String)
], ReceiptResponseDto.prototype, "merchantName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total amount' }),
    __metadata("design:type", Number)
], ReceiptResponseDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Currency code' }),
    __metadata("design:type", String)
], ReceiptResponseDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Transaction date' }),
    __metadata("design:type", Date)
], ReceiptResponseDto.prototype, "transactionDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Receipt image URL' }),
    __metadata("design:type", String)
], ReceiptResponseDto.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'File name' }),
    __metadata("design:type", String)
], ReceiptResponseDto.prototype, "fileName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'File size in bytes' }),
    __metadata("design:type", Number)
], ReceiptResponseDto.prototype, "fileSize", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'MIME type' }),
    __metadata("design:type", String)
], ReceiptResponseDto.prototype, "mimeType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'OCR extracted data', type: Object }),
    __metadata("design:type", Object)
], ReceiptResponseDto.prototype, "ocrData", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Analysis result', type: Object }),
    __metadata("design:type", Object)
], ReceiptResponseDto.prototype, "analysisResult", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Processing status', enum: ReceiptStatus }),
    __metadata("design:type", String)
], ReceiptResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Confidence score (0-100)' }),
    __metadata("design:type", Number)
], ReceiptResponseDto.prototype, "confidenceScore", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Processing completion timestamp' }),
    __metadata("design:type", Date)
], ReceiptResponseDto.prototype, "processedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Payment method' }),
    __metadata("design:type", String)
], ReceiptResponseDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Notes' }),
    __metadata("design:type", String)
], ReceiptResponseDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Tags', type: [String] }),
    __metadata("design:type", Array)
], ReceiptResponseDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether the receipt is active' }),
    __metadata("design:type", Boolean)
], ReceiptResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User who created the receipt' }),
    __metadata("design:type", String)
], ReceiptResponseDto.prototype, "createdBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Creation timestamp' }),
    __metadata("design:type", Date)
], ReceiptResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last update timestamp' }),
    __metadata("design:type", Date)
], ReceiptResponseDto.prototype, "updatedAt", void 0);
class ReceiptAnalysisResultDto {
    receiptId;
    merchantName;
    totalAmount;
    currency;
    transactionDate;
    category;
    subcategory;
    items;
    confidence;
    expenseType;
    taxAmount;
    tipAmount;
    isBusinessExpense;
    insights;
}
exports.ReceiptAnalysisResultDto = ReceiptAnalysisResultDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Receipt ID' }),
    __metadata("design:type", String)
], ReceiptAnalysisResultDto.prototype, "receiptId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Merchant name' }),
    __metadata("design:type", String)
], ReceiptAnalysisResultDto.prototype, "merchantName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total amount' }),
    __metadata("design:type", Number)
], ReceiptAnalysisResultDto.prototype, "totalAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Currency code' }),
    __metadata("design:type", String)
], ReceiptAnalysisResultDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Transaction date' }),
    __metadata("design:type", Date)
], ReceiptAnalysisResultDto.prototype, "transactionDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Expense category' }),
    __metadata("design:type", String)
], ReceiptAnalysisResultDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Expense subcategory' }),
    __metadata("design:type", String)
], ReceiptAnalysisResultDto.prototype, "subcategory", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'List of items', type: [Object] }),
    __metadata("design:type", Array)
], ReceiptAnalysisResultDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Analysis confidence (0-100)' }),
    __metadata("design:type", Number)
], ReceiptAnalysisResultDto.prototype, "confidence", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Expense type (Business/Personal)' }),
    __metadata("design:type", String)
], ReceiptAnalysisResultDto.prototype, "expenseType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tax amount' }),
    __metadata("design:type", Number)
], ReceiptAnalysisResultDto.prototype, "taxAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tip amount' }),
    __metadata("design:type", Number)
], ReceiptAnalysisResultDto.prototype, "tipAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether it is a business expense' }),
    __metadata("design:type", Boolean)
], ReceiptAnalysisResultDto.prototype, "isBusinessExpense", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Insights', type: [String] }),
    __metadata("design:type", Array)
], ReceiptAnalysisResultDto.prototype, "insights", void 0);
class ReceiptListResponseDto {
    receipts;
    total;
    page;
    limit;
    totalPages;
}
exports.ReceiptListResponseDto = ReceiptListResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'List of receipts', type: [ReceiptResponseDto] }),
    __metadata("design:type", Array)
], ReceiptListResponseDto.prototype, "receipts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total number of receipts' }),
    __metadata("design:type", Number)
], ReceiptListResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Current page' }),
    __metadata("design:type", Number)
], ReceiptListResponseDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Items per page' }),
    __metadata("design:type", Number)
], ReceiptListResponseDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total number of pages' }),
    __metadata("design:type", Number)
], ReceiptListResponseDto.prototype, "totalPages", void 0);
//# sourceMappingURL=receipt.dto.js.map