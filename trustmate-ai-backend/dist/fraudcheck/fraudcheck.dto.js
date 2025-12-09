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
exports.FraudAnalysisResponseDto = exports.FraudCheckResponseDto = exports.AnalyzeTransactionDto = exports.UpdateFraudCheckDto = exports.CreateFraudCheckDto = exports.RiskLevel = exports.FraudStatus = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var FraudStatus;
(function (FraudStatus) {
    FraudStatus["PENDING"] = "PENDING";
    FraudStatus["APPROVED"] = "APPROVED";
    FraudStatus["REJECTED"] = "REJECTED";
    FraudStatus["FLAGGED"] = "FLAGGED";
    FraudStatus["UNDER_REVIEW"] = "UNDER_REVIEW";
})(FraudStatus || (exports.FraudStatus = FraudStatus = {}));
var RiskLevel;
(function (RiskLevel) {
    RiskLevel["LOW"] = "LOW";
    RiskLevel["MEDIUM"] = "MEDIUM";
    RiskLevel["HIGH"] = "HIGH";
    RiskLevel["CRITICAL"] = "CRITICAL";
})(RiskLevel || (exports.RiskLevel = RiskLevel = {}));
class CreateFraudCheckDto {
    transactionId;
    amount;
    currency;
    merchantId;
    customerId;
    deviceId;
    ipAddress;
    location;
    riskScore;
    flags;
    metadata;
}
exports.CreateFraudCheckDto = CreateFraudCheckDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Transaction ID', example: 'txn_123456789' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateFraudCheckDto.prototype, "transactionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Transaction amount', example: 1000.50 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateFraudCheckDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Currency code', example: 'INR' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFraudCheckDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Merchant ID', example: 'merch_12345' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFraudCheckDto.prototype, "merchantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Customer ID', example: 'cust_12345' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFraudCheckDto.prototype, "customerId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Device ID', example: 'device_fingerprint_123' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFraudCheckDto.prototype, "deviceId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'IP Address', example: '192.168.1.1' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFraudCheckDto.prototype, "ipAddress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Transaction location', example: { city: 'Mumbai', country: 'IN' } }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateFraudCheckDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Risk score (0-100)', example: 65, minimum: 0, maximum: 100 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], CreateFraudCheckDto.prototype, "riskScore", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Fraud flags', example: ['LARGE_AMOUNT', 'UNUSUAL_TIME'], type: [String] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateFraudCheckDto.prototype, "flags", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional metadata', type: Object }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateFraudCheckDto.prototype, "metadata", void 0);
class UpdateFraudCheckDto {
    riskScore;
    status;
    flags;
    analysisResult;
    reviewNotes;
    reviewedBy;
    reviewedAt;
    isActive;
}
exports.UpdateFraudCheckDto = UpdateFraudCheckDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Updated risk score', example: 70, minimum: 0, maximum: 100 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], UpdateFraudCheckDto.prototype, "riskScore", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Updated fraud status', enum: FraudStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(FraudStatus),
    __metadata("design:type", String)
], UpdateFraudCheckDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Updated fraud flags', type: [String] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateFraudCheckDto.prototype, "flags", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Analysis result', type: Object }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateFraudCheckDto.prototype, "analysisResult", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Review notes', example: 'Manually reviewed and approved' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateFraudCheckDto.prototype, "reviewNotes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Reviewed by user ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateFraudCheckDto.prototype, "reviewedBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Review timestamp' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateFraudCheckDto.prototype, "reviewedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Whether the check is active' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateFraudCheckDto.prototype, "isActive", void 0);
class AnalyzeTransactionDto {
    transactionId;
    amount;
    currency;
    merchantId;
    customerId;
    deviceId;
    ipAddress;
    location;
    transactionTime;
}
exports.AnalyzeTransactionDto = AnalyzeTransactionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Transaction ID', example: 'txn_987654321' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AnalyzeTransactionDto.prototype, "transactionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Transaction amount', example: 15000.75 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], AnalyzeTransactionDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Currency code', example: 'INR' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AnalyzeTransactionDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Merchant ID', example: 'merch_54321' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AnalyzeTransactionDto.prototype, "merchantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Customer ID', example: 'cust_54321' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AnalyzeTransactionDto.prototype, "customerId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Device ID', example: 'android_emulator_001' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AnalyzeTransactionDto.prototype, "deviceId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'IP Address', example: '103.21.244.0' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AnalyzeTransactionDto.prototype, "ipAddress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Transaction location', example: { city: 'Singapore', country: 'SG' } }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], AnalyzeTransactionDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Transaction timestamp' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], AnalyzeTransactionDto.prototype, "transactionTime", void 0);
class FraudCheckResponseDto {
    id;
    transactionId;
    amount;
    currency;
    merchantId;
    customerId;
    deviceId;
    ipAddress;
    location;
    riskScore;
    riskLevel;
    flags;
    status;
    analysisResult;
    reviewNotes;
    reviewedBy;
    reviewedAt;
    isActive;
    createdBy;
    createdAt;
    updatedAt;
}
exports.FraudCheckResponseDto = FraudCheckResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fraud check ID' }),
    __metadata("design:type", String)
], FraudCheckResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Transaction ID' }),
    __metadata("design:type", String)
], FraudCheckResponseDto.prototype, "transactionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Transaction amount' }),
    __metadata("design:type", Number)
], FraudCheckResponseDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Currency code' }),
    __metadata("design:type", String)
], FraudCheckResponseDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Merchant ID' }),
    __metadata("design:type", String)
], FraudCheckResponseDto.prototype, "merchantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Customer ID' }),
    __metadata("design:type", String)
], FraudCheckResponseDto.prototype, "customerId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Device ID' }),
    __metadata("design:type", String)
], FraudCheckResponseDto.prototype, "deviceId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'IP Address' }),
    __metadata("design:type", String)
], FraudCheckResponseDto.prototype, "ipAddress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Transaction location', type: Object }),
    __metadata("design:type", Object)
], FraudCheckResponseDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Risk score (0-100)' }),
    __metadata("design:type", Number)
], FraudCheckResponseDto.prototype, "riskScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Risk level', enum: RiskLevel }),
    __metadata("design:type", String)
], FraudCheckResponseDto.prototype, "riskLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fraud flags', type: [String] }),
    __metadata("design:type", Array)
], FraudCheckResponseDto.prototype, "flags", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fraud status', enum: FraudStatus }),
    __metadata("design:type", String)
], FraudCheckResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Analysis result', type: Object }),
    __metadata("design:type", Object)
], FraudCheckResponseDto.prototype, "analysisResult", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Review notes' }),
    __metadata("design:type", String)
], FraudCheckResponseDto.prototype, "reviewNotes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Reviewed by user ID' }),
    __metadata("design:type", String)
], FraudCheckResponseDto.prototype, "reviewedBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Review timestamp' }),
    __metadata("design:type", Date)
], FraudCheckResponseDto.prototype, "reviewedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether the check is active' }),
    __metadata("design:type", Boolean)
], FraudCheckResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User who created the check' }),
    __metadata("design:type", String)
], FraudCheckResponseDto.prototype, "createdBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Creation timestamp' }),
    __metadata("design:type", Date)
], FraudCheckResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last update timestamp' }),
    __metadata("design:type", Date)
], FraudCheckResponseDto.prototype, "updatedAt", void 0);
class FraudAnalysisResponseDto {
    id;
    transactionId;
    riskScore;
    riskLevel;
    isFraudulent;
    flags;
    confidence;
    recommendations;
    createdAt;
}
exports.FraudAnalysisResponseDto = FraudAnalysisResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fraud check ID' }),
    __metadata("design:type", String)
], FraudAnalysisResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Transaction ID' }),
    __metadata("design:type", String)
], FraudAnalysisResponseDto.prototype, "transactionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Risk score (0-100)' }),
    __metadata("design:type", Number)
], FraudAnalysisResponseDto.prototype, "riskScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Risk level', enum: RiskLevel }),
    __metadata("design:type", String)
], FraudAnalysisResponseDto.prototype, "riskLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether transaction is fraudulent' }),
    __metadata("design:type", Boolean)
], FraudAnalysisResponseDto.prototype, "isFraudulent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fraud flags', type: [String] }),
    __metadata("design:type", Array)
], FraudAnalysisResponseDto.prototype, "flags", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Confidence level (0-100)' }),
    __metadata("design:type", Number)
], FraudAnalysisResponseDto.prototype, "confidence", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Recommendations', type: [String] }),
    __metadata("design:type", Array)
], FraudAnalysisResponseDto.prototype, "recommendations", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Analysis timestamp' }),
    __metadata("design:type", Date)
], FraudAnalysisResponseDto.prototype, "createdAt", void 0);
//# sourceMappingURL=fraudcheck.dto.js.map