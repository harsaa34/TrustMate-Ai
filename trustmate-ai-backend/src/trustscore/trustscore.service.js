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
exports.TrustScoreService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const trustscore_schema_1 = require("./trustscore.schema");
let TrustScoreService = class TrustScoreService {
    trustScoreModel;
    constructor(trustScoreModel) {
        this.trustScoreModel = trustScoreModel;
    }
    async create(createTrustScoreDto, userId) {
        try {
            if (!mongoose_2.Types.ObjectId.isValid(userId)) {
                throw new common_1.BadRequestException('Invalid user ID');
            }
            const trustScore = new this.trustScoreModel({
                ...createTrustScoreDto,
                createdBy: new mongoose_2.Types.ObjectId(userId),
                isActive: true,
            });
            const savedTrustScore = await trustScore.save();
            return this.mapToResponseDto(savedTrustScore);
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to create trust score');
        }
    }
    async getUserItems(userId, page, limit) {
        try {
            if (!mongoose_2.Types.ObjectId.isValid(userId)) {
                throw new common_1.BadRequestException('Invalid user ID');
            }
            const skip = (page - 1) * limit;
            const trustScores = await this.trustScoreModel
                .find({
                createdBy: new mongoose_2.Types.ObjectId(userId),
                isActive: true
            })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec();
            return trustScores.map((score) => this.mapToResponseDto(score));
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to fetch trust scores');
        }
    }
    async getById(id, userId) {
        try {
            if (!mongoose_2.Types.ObjectId.isValid(id)) {
                throw new common_1.BadRequestException('Invalid trust score ID');
            }
            if (!mongoose_2.Types.ObjectId.isValid(userId)) {
                throw new common_1.BadRequestException('Invalid user ID');
            }
            const trustScore = await this.trustScoreModel
                .findOne({ _id: new mongoose_2.Types.ObjectId(id), isActive: true })
                .exec();
            if (!trustScore) {
                throw new common_1.NotFoundException('Trust score not found');
            }
            if (!trustScore.createdBy.equals(new mongoose_2.Types.ObjectId(userId))) {
                throw new common_1.ForbiddenException('Access denied');
            }
            return this.mapToResponseDto(trustScore);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.ForbiddenException) {
                throw error;
            }
            throw new common_1.BadRequestException('Failed to fetch trust score');
        }
    }
    async update(id, updateTrustScoreDto, userId) {
        try {
            if (!mongoose_2.Types.ObjectId.isValid(id)) {
                throw new common_1.BadRequestException('Invalid trust score ID');
            }
            if (!mongoose_2.Types.ObjectId.isValid(userId)) {
                throw new common_1.BadRequestException('Invalid user ID');
            }
            const trustScore = await this.trustScoreModel
                .findOne({ _id: new mongoose_2.Types.ObjectId(id), isActive: true })
                .exec();
            if (!trustScore) {
                throw new common_1.NotFoundException('Trust score not found');
            }
            if (!trustScore.createdBy.equals(new mongoose_2.Types.ObjectId(userId))) {
                throw new common_1.ForbiddenException('Access denied');
            }
            Object.assign(trustScore, updateTrustScoreDto);
            const updatedTrustScore = await trustScore.save();
            return this.mapToResponseDto(updatedTrustScore);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.ForbiddenException) {
                throw error;
            }
            throw new common_1.BadRequestException('Failed to update trust score');
        }
    }
    async delete(id, userId) {
        try {
            if (!mongoose_2.Types.ObjectId.isValid(id)) {
                throw new common_1.BadRequestException('Invalid trust score ID');
            }
            if (!mongoose_2.Types.ObjectId.isValid(userId)) {
                throw new common_1.BadRequestException('Invalid user ID');
            }
            const trustScore = await this.trustScoreModel
                .findOne({ _id: new mongoose_2.Types.ObjectId(id), isActive: true })
                .exec();
            if (!trustScore) {
                throw new common_1.NotFoundException('Trust score not found');
            }
            if (!trustScore.createdBy.equals(new mongoose_2.Types.ObjectId(userId))) {
                throw new common_1.ForbiddenException('Access denied');
            }
            trustScore.isActive = false;
            await trustScore.save();
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.ForbiddenException) {
                throw error;
            }
            throw new common_1.BadRequestException('Failed to delete trust score');
        }
    }
    mapToResponseDto(trustScore) {
        return {
            id: trustScore._id ? trustScore._id.toString() : trustScore.id,
            score: trustScore.score,
            maxScore: trustScore.maxScore,
            minScore: trustScore.minScore,
            confidence: trustScore.confidence,
            factors: trustScore.factors,
            entityType: trustScore.entityType,
            entityId: trustScore.entityId,
            algorithmVersion: trustScore.algorithmVersion,
            calculatedAt: trustScore.calculatedAt,
            expiresAt: trustScore.expiresAt,
            metadata: trustScore.metadata,
            isActive: trustScore.isActive,
            createdBy: trustScore.createdBy.toString(),
            createdAt: trustScore.createdAt,
            updatedAt: trustScore.updatedAt,
        };
    }
};
exports.TrustScoreService = TrustScoreService;
exports.TrustScoreService = TrustScoreService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(trustscore_schema_1.TrustScore.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], TrustScoreService);
//# sourceMappingURL=trustscore.service.js.map