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
exports.TrustScoreResponseDto = exports.UpdateTrustScoreDto = exports.CreateTrustScoreDto = exports.EntityType = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var EntityType;
(function (EntityType) {
    EntityType["USER"] = "user";
    EntityType["MERCHANT"] = "merchant";
    EntityType["TRANSACTION"] = "transaction";
    EntityType["DEVICE"] = "device";
    EntityType["IP_ADDRESS"] = "ip_address";
})(EntityType || (exports.EntityType = EntityType = {}));
class CreateTrustScoreDto {
    score;
    maxScore;
    minScore;
    confidence;
    factors;
    entityType;
    entityId;
    algorithmVersion;
    calculatedAt;
    expiresAt;
    metadata;
}
exports.CreateTrustScoreDto = CreateTrustScoreDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Trust score value',
        example: 85.5,
        minimum: 0,
        maximum: 100,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], CreateTrustScoreDto.prototype, "score", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Maximum possible score',
        example: 100,
        default: 100,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateTrustScoreDto.prototype, "maxScore", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Minimum possible score',
        example: 0,
        default: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateTrustScoreDto.prototype, "minScore", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Confidence level of the score (0-1)',
        example: 0.95,
        minimum: 0,
        maximum: 1,
        default: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(1),
    __metadata("design:type", Number)
], CreateTrustScoreDto.prototype, "confidence", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Factors contributing to the score',
        example: ['identity_verified', 'transaction_history', 'device_fingerprint'],
        type: [String],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateTrustScoreDto.prototype, "factors", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of entity being scored',
        enum: EntityType,
        example: EntityType.USER,
    }),
    (0, class_validator_1.IsEnum)(EntityType),
    __metadata("design:type", String)
], CreateTrustScoreDto.prototype, "entityType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID of the entity being scored',
        example: '507f1f77bcf86cd799439011',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTrustScoreDto.prototype, "entityId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Algorithm version used for calculation',
        example: '2.1.0',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTrustScoreDto.prototype, "algorithmVersion", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'When the score was calculated',
        example: '2024-01-15T10:30:00Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateTrustScoreDto.prototype, "calculatedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'When the score expires',
        example: '2024-02-15T10:30:00Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateTrustScoreDto.prototype, "expiresAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional metadata',
        example: { riskLevel: 'low', flags: ['new_user'] },
        type: Object,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateTrustScoreDto.prototype, "metadata", void 0);
class UpdateTrustScoreDto {
    score;
    confidence;
    factors;
    algorithmVersion;
    expiresAt;
    metadata;
    isActive;
}
exports.UpdateTrustScoreDto = UpdateTrustScoreDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Updated trust score value',
        example: 90.0,
        minimum: 0,
        maximum: 100,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], UpdateTrustScoreDto.prototype, "score", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Updated confidence level',
        example: 0.98,
        minimum: 0,
        maximum: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(1),
    __metadata("design:type", Number)
], UpdateTrustScoreDto.prototype, "confidence", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Updated factors',
        example: ['identity_verified', 'biometric_auth'],
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateTrustScoreDto.prototype, "factors", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Updated algorithm version',
        example: '2.2.0',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTrustScoreDto.prototype, "algorithmVersion", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Updated expiration date',
        example: '2024-03-15T10:30:00Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateTrustScoreDto.prototype, "expiresAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Updated metadata',
        example: { riskLevel: 'medium', reviewedBy: 'admin' },
        type: Object,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateTrustScoreDto.prototype, "metadata", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether the score is active',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateTrustScoreDto.prototype, "isActive", void 0);
class TrustScoreResponseDto {
    id;
    score;
    maxScore;
    minScore;
    confidence;
    factors;
    entityType;
    entityId;
    algorithmVersion;
    calculatedAt;
    expiresAt;
    metadata;
    isActive;
    createdBy;
    createdAt;
    updatedAt;
}
exports.TrustScoreResponseDto = TrustScoreResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Trust score ID' }),
    __metadata("design:type", String)
], TrustScoreResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Trust score value' }),
    __metadata("design:type", Number)
], TrustScoreResponseDto.prototype, "score", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Maximum possible score', default: 100 }),
    __metadata("design:type", Number)
], TrustScoreResponseDto.prototype, "maxScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Minimum possible score', default: 0 }),
    __metadata("design:type", Number)
], TrustScoreResponseDto.prototype, "minScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Confidence level', default: 1 }),
    __metadata("design:type", Number)
], TrustScoreResponseDto.prototype, "confidence", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Factors contributing to the score', type: [String] }),
    __metadata("design:type", Array)
], TrustScoreResponseDto.prototype, "factors", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Type of entity', enum: EntityType }),
    __metadata("design:type", String)
], TrustScoreResponseDto.prototype, "entityType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Entity ID' }),
    __metadata("design:type", String)
], TrustScoreResponseDto.prototype, "entityId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Algorithm version' }),
    __metadata("design:type", String)
], TrustScoreResponseDto.prototype, "algorithmVersion", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Calculation timestamp' }),
    __metadata("design:type", Date)
], TrustScoreResponseDto.prototype, "calculatedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Expiration timestamp' }),
    __metadata("design:type", Date)
], TrustScoreResponseDto.prototype, "expiresAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional metadata', type: Object }),
    __metadata("design:type", Object)
], TrustScoreResponseDto.prototype, "metadata", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether the score is active' }),
    __metadata("design:type", Boolean)
], TrustScoreResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User who created the score' }),
    __metadata("design:type", String)
], TrustScoreResponseDto.prototype, "createdBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Creation timestamp' }),
    __metadata("design:type", Date)
], TrustScoreResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last update timestamp' }),
    __metadata("design:type", Date)
], TrustScoreResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=trustscore.dto.js.map