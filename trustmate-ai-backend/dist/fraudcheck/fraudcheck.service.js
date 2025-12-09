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
exports.FraudCheckService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const fraudcheck_schema_1 = require("./fraudcheck.schema");
let FraudCheckService = class FraudCheckService {
    fraudCheckModel;
    constructor(fraudCheckModel) {
        this.fraudCheckModel = fraudCheckModel;
    }
    async create(createFraudCheckDto, userId) {
        try {
            if (!mongoose_2.Types.ObjectId.isValid(userId)) {
                throw new common_1.BadRequestException('Invalid user ID');
            }
            const fraudCheck = new this.fraudCheckModel({
                ...createFraudCheckDto,
                createdBy: new mongoose_2.Types.ObjectId(userId),
                isActive: true,
                status: fraudcheck_schema_1.FraudStatus.PENDING,
                riskLevel: createFraudCheckDto.riskScore >= 80 ? fraudcheck_schema_1.RiskLevel.CRITICAL :
                    createFraudCheckDto.riskScore >= 60 ? fraudcheck_schema_1.RiskLevel.HIGH :
                        createFraudCheckDto.riskScore >= 40 ? fraudcheck_schema_1.RiskLevel.MEDIUM : fraudcheck_schema_1.RiskLevel.LOW,
            });
            const savedFraudCheck = await fraudCheck.save();
            return this.mapToResponseDto(savedFraudCheck);
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to create fraud check');
        }
    }
    async getUserItems(userId, page, limit, filters) {
        try {
            if (!mongoose_2.Types.ObjectId.isValid(userId)) {
                throw new common_1.BadRequestException('Invalid user ID');
            }
            const skip = (page - 1) * limit;
            const query = {
                createdBy: new mongoose_2.Types.ObjectId(userId),
                isActive: true
            };
            if (filters?.status) {
                query.status = filters.status;
            }
            if (filters?.riskLevel) {
                query.riskLevel = filters.riskLevel;
            }
            const fraudChecks = await this.fraudCheckModel
                .find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec();
            return fraudChecks.map((check) => this.mapToResponseDto(check));
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to fetch fraud checks');
        }
    }
    async getById(id, userId) {
        try {
            if (!mongoose_2.Types.ObjectId.isValid(id)) {
                throw new common_1.BadRequestException('Invalid fraud check ID');
            }
            if (!mongoose_2.Types.ObjectId.isValid(userId)) {
                throw new common_1.BadRequestException('Invalid user ID');
            }
            const fraudCheck = await this.fraudCheckModel
                .findOne({ _id: new mongoose_2.Types.ObjectId(id), isActive: true })
                .exec();
            if (!fraudCheck) {
                throw new common_1.NotFoundException('Fraud check not found');
            }
            if (!fraudCheck.createdBy.equals(new mongoose_2.Types.ObjectId(userId))) {
                throw new common_1.ForbiddenException('Access denied');
            }
            return this.mapToResponseDto(fraudCheck);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.ForbiddenException) {
                throw error;
            }
            throw new common_1.BadRequestException('Failed to fetch fraud check');
        }
    }
    async update(id, updateFraudCheckDto, userId) {
        try {
            if (!mongoose_2.Types.ObjectId.isValid(id)) {
                throw new common_1.BadRequestException('Invalid fraud check ID');
            }
            if (!mongoose_2.Types.ObjectId.isValid(userId)) {
                throw new common_1.BadRequestException('Invalid user ID');
            }
            const fraudCheck = await this.fraudCheckModel
                .findOne({ _id: new mongoose_2.Types.ObjectId(id), isActive: true })
                .exec();
            if (!fraudCheck) {
                throw new common_1.NotFoundException('Fraud check not found');
            }
            if (!fraudCheck.createdBy.equals(new mongoose_2.Types.ObjectId(userId))) {
                throw new common_1.ForbiddenException('Access denied');
            }
            Object.assign(fraudCheck, updateFraudCheckDto);
            if (updateFraudCheckDto.riskScore !== undefined) {
                fraudCheck.riskLevel = updateFraudCheckDto.riskScore >= 80 ? fraudcheck_schema_1.RiskLevel.CRITICAL :
                    updateFraudCheckDto.riskScore >= 60 ? fraudcheck_schema_1.RiskLevel.HIGH :
                        updateFraudCheckDto.riskScore >= 40 ? fraudcheck_schema_1.RiskLevel.MEDIUM : fraudcheck_schema_1.RiskLevel.LOW;
            }
            const updatedFraudCheck = await fraudCheck.save();
            return this.mapToResponseDto(updatedFraudCheck);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.ForbiddenException) {
                throw error;
            }
            throw new common_1.BadRequestException('Failed to update fraud check');
        }
    }
    async delete(id, userId) {
        try {
            if (!mongoose_2.Types.ObjectId.isValid(id)) {
                throw new common_1.BadRequestException('Invalid fraud check ID');
            }
            if (!mongoose_2.Types.ObjectId.isValid(userId)) {
                throw new common_1.BadRequestException('Invalid user ID');
            }
            const fraudCheck = await this.fraudCheckModel
                .findOne({ _id: new mongoose_2.Types.ObjectId(id), isActive: true })
                .exec();
            if (!fraudCheck) {
                throw new common_1.NotFoundException('Fraud check not found');
            }
            if (!fraudCheck.createdBy.equals(new mongoose_2.Types.ObjectId(userId))) {
                throw new common_1.ForbiddenException('Access denied');
            }
            fraudCheck.isActive = false;
            await fraudCheck.save();
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.ForbiddenException) {
                throw error;
            }
            throw new common_1.BadRequestException('Failed to delete fraud check');
        }
    }
    async analyzeTransaction(analyzeDto, userId) {
        try {
            if (!mongoose_2.Types.ObjectId.isValid(userId)) {
                throw new common_1.BadRequestException('Invalid user ID');
            }
            const riskScore = this.calculateRiskScore(analyzeDto);
            const riskLevel = riskScore >= 80 ? fraudcheck_schema_1.RiskLevel.CRITICAL :
                riskScore >= 60 ? fraudcheck_schema_1.RiskLevel.HIGH :
                    riskScore >= 40 ? fraudcheck_schema_1.RiskLevel.MEDIUM : fraudcheck_schema_1.RiskLevel.LOW;
            const flags = this.detectFraudFlags(analyzeDto);
            const isFraudulent = riskLevel === fraudcheck_schema_1.RiskLevel.CRITICAL || riskLevel === fraudcheck_schema_1.RiskLevel.HIGH;
            const fraudCheck = new this.fraudCheckModel({
                transactionId: analyzeDto.transactionId,
                amount: analyzeDto.amount,
                currency: analyzeDto.currency,
                merchantId: analyzeDto.merchantId,
                customerId: analyzeDto.customerId,
                deviceId: analyzeDto.deviceId,
                ipAddress: analyzeDto.ipAddress,
                location: analyzeDto.location,
                riskScore,
                riskLevel,
                flags,
                status: isFraudulent ? fraudcheck_schema_1.FraudStatus.FLAGGED : fraudcheck_schema_1.FraudStatus.APPROVED,
                isActive: true,
                createdBy: new mongoose_2.Types.ObjectId(userId),
                analysisResult: {
                    isFraudulent,
                    confidence: 100 - riskScore,
                    recommendations: isFraudulent ? ['Review manually', 'Contact customer'] : ['Approve automatically'],
                },
            });
            await fraudCheck.save();
            return {
                id: fraudCheck._id.toString(),
                transactionId: analyzeDto.transactionId,
                riskScore,
                riskLevel,
                isFraudulent,
                flags,
                confidence: 100 - riskScore,
                recommendations: isFraudulent ? ['Review manually', 'Contact customer'] : ['Approve automatically'],
                createdAt: fraudCheck.createdAt,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to analyze transaction');
        }
    }
    async getStatistics(userId) {
        try {
            if (!mongoose_2.Types.ObjectId.isValid(userId)) {
                throw new common_1.BadRequestException('Invalid user ID');
            }
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            const stats = await this.fraudCheckModel.aggregate([
                {
                    $match: {
                        createdBy: new mongoose_2.Types.ObjectId(userId),
                        isActive: true,
                        createdAt: { $gte: thirtyDaysAgo },
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalChecks: { $sum: 1 },
                        totalFraudulent: {
                            $sum: {
                                $cond: [{ $eq: ['$status', fraudcheck_schema_1.FraudStatus.FLAGGED] }, 1, 0],
                            },
                        },
                        avgRiskScore: { $avg: '$riskScore' },
                        highRiskCount: {
                            $sum: {
                                $cond: [{ $in: ['$riskLevel', [fraudcheck_schema_1.RiskLevel.HIGH, fraudcheck_schema_1.RiskLevel.CRITICAL]] }, 1, 0],
                            },
                        },
                        byStatus: {
                            $push: {
                                status: '$status',
                                count: 1,
                            },
                        },
                        byRiskLevel: {
                            $push: {
                                riskLevel: '$riskLevel',
                                count: 1,
                            },
                        },
                    },
                },
                {
                    $project: {
                        totalChecks: 1,
                        totalFraudulent: 1,
                        fraudRate: {
                            $multiply: [
                                { $divide: ['$totalFraudulent', '$totalChecks'] },
                                100,
                            ],
                        },
                        avgRiskScore: 1,
                        highRiskCount: 1,
                        highRiskPercentage: {
                            $multiply: [
                                { $divide: ['$highRiskCount', '$totalChecks'] },
                                100,
                            ],
                        },
                        statusDistribution: {
                            $arrayToObject: {
                                $map: {
                                    input: '$byStatus',
                                    as: 'item',
                                    in: {
                                        k: '$$item.status',
                                        v: { $sum: '$$item.count' },
                                    },
                                },
                            },
                        },
                        riskLevelDistribution: {
                            $arrayToObject: {
                                $map: {
                                    input: '$byRiskLevel',
                                    as: 'item',
                                    in: {
                                        k: '$$item.riskLevel',
                                        v: { $sum: '$$item.count' },
                                    },
                                },
                            },
                        },
                    },
                },
            ]);
            return stats[0] || {
                totalChecks: 0,
                totalFraudulent: 0,
                fraudRate: 0,
                avgRiskScore: 0,
                highRiskCount: 0,
                highRiskPercentage: 0,
                statusDistribution: {},
                riskLevelDistribution: {},
            };
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to fetch statistics');
        }
    }
    calculateRiskScore(analyzeDto) {
        let score = 0;
        if (analyzeDto.amount > 10000)
            score += 30;
        if (analyzeDto.currency !== 'INR')
            score += 20;
        if (analyzeDto.location?.country !== 'IN')
            score += 25;
        if (analyzeDto.deviceId?.includes('emulator'))
            score += 40;
        const hour = new Date().getHours();
        if (hour >= 0 && hour <= 5)
            score += 15;
        return Math.min(100, score);
    }
    detectFraudFlags(analyzeDto) {
        const flags = [];
        if (analyzeDto.amount > 10000)
            flags.push('LARGE_AMOUNT');
        if (analyzeDto.currency !== 'INR')
            flags.push('FOREIGN_CURRENCY');
        if (analyzeDto.location?.country !== 'IN')
            flags.push('FOREIGN_LOCATION');
        if (analyzeDto.deviceId?.includes('emulator'))
            flags.push('EMULATOR_DETECTED');
        const hour = new Date().getHours();
        if (hour >= 0 && hour <= 5)
            flags.push('UNUSUAL_TIME');
        return flags;
    }
    mapToResponseDto(fraudCheck) {
        return {
            id: fraudCheck._id ? fraudCheck._id.toString() : fraudCheck.id,
            transactionId: fraudCheck.transactionId,
            amount: fraudCheck.amount,
            currency: fraudCheck.currency,
            merchantId: fraudCheck.merchantId,
            customerId: fraudCheck.customerId,
            deviceId: fraudCheck.deviceId,
            ipAddress: fraudCheck.ipAddress,
            location: fraudCheck.location,
            riskScore: fraudCheck.riskScore,
            riskLevel: fraudCheck.riskLevel,
            flags: fraudCheck.flags || [],
            status: fraudCheck.status,
            analysisResult: fraudCheck.analysisResult,
            isActive: fraudCheck.isActive,
            createdBy: fraudCheck.createdBy.toString(),
            createdAt: fraudCheck.createdAt,
            updatedAt: fraudCheck.updatedAt,
        };
    }
};
exports.FraudCheckService = FraudCheckService;
exports.FraudCheckService = FraudCheckService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(fraudcheck_schema_1.FraudCheck.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], FraudCheckService);
//# sourceMappingURL=fraudcheck.service.js.map