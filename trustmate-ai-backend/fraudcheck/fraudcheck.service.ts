import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { FraudCheck, FraudStatus, RiskLevel } from './fraudcheck.schema';
import {
  CreateFraudCheckDto,
  UpdateFraudCheckDto,
  FraudCheckResponseDto,
  AnalyzeTransactionDto,
  FraudAnalysisResponseDto,
} from './fraudcheck.dto';

@Injectable()
export class FraudCheckService {
  constructor(
    @InjectModel(FraudCheck.name)
    private readonly fraudCheckModel: Model<FraudCheck>,
  ) {}

  async create(
    createFraudCheckDto: CreateFraudCheckDto,
    userId: string,
  ): Promise<FraudCheckResponseDto> {
    try {
      if (!Types.ObjectId.isValid(userId)) {
        throw new BadRequestException('Invalid user ID');
      }

      const fraudCheck = new this.fraudCheckModel({
        ...createFraudCheckDto,
        createdBy: new Types.ObjectId(userId),
        isActive: true,
        status: FraudStatus.PENDING,
        riskLevel: createFraudCheckDto.riskScore >= 80 ? RiskLevel.CRITICAL : 
                  createFraudCheckDto.riskScore >= 60 ? RiskLevel.HIGH :
                  createFraudCheckDto.riskScore >= 40 ? RiskLevel.MEDIUM : RiskLevel.LOW,
      });

      const savedFraudCheck = await fraudCheck.save();
      return this.mapToResponseDto(savedFraudCheck);
    } catch (error) {
      throw new BadRequestException('Failed to create fraud check');
    }
  }

  async getUserItems(
    userId: string,
    page: number,
    limit: number,
    filters?: { status?: string; riskLevel?: string },
  ): Promise<FraudCheckResponseDto[]> {
    try {
      if (!Types.ObjectId.isValid(userId)) {
        throw new BadRequestException('Invalid user ID');
      }

      const skip = (page - 1) * limit;
      const query: any = { 
        createdBy: new Types.ObjectId(userId), 
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
    } catch (error) {
      throw new BadRequestException('Failed to fetch fraud checks');
    }
  }

  async getById(
    id: string,
    userId: string,
  ): Promise<FraudCheckResponseDto> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid fraud check ID');
      }

      if (!Types.ObjectId.isValid(userId)) {
        throw new BadRequestException('Invalid user ID');
      }

      const fraudCheck = await this.fraudCheckModel
        .findOne({ _id: new Types.ObjectId(id), isActive: true })
        .exec();

      if (!fraudCheck) {
        throw new NotFoundException('Fraud check not found');
      }

      if (!fraudCheck.createdBy.equals(new Types.ObjectId(userId))) {
        throw new ForbiddenException('Access denied');
      }

      return this.mapToResponseDto(fraudCheck);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      throw new BadRequestException('Failed to fetch fraud check');
    }
  }

  async update(
    id: string,
    updateFraudCheckDto: UpdateFraudCheckDto,
    userId: string,
  ): Promise<FraudCheckResponseDto> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid fraud check ID');
      }

      if (!Types.ObjectId.isValid(userId)) {
        throw new BadRequestException('Invalid user ID');
      }

      const fraudCheck = await this.fraudCheckModel
        .findOne({ _id: new Types.ObjectId(id), isActive: true })
        .exec();

      if (!fraudCheck) {
        throw new NotFoundException('Fraud check not found');
      }

      if (!fraudCheck.createdBy.equals(new Types.ObjectId(userId))) {
        throw new ForbiddenException('Access denied');
      }

      Object.assign(fraudCheck, updateFraudCheckDto);
      
      // Update risk level based on risk score if provided
      if (updateFraudCheckDto.riskScore !== undefined) {
        fraudCheck.riskLevel = updateFraudCheckDto.riskScore >= 80 ? RiskLevel.CRITICAL : 
                              updateFraudCheckDto.riskScore >= 60 ? RiskLevel.HIGH :
                              updateFraudCheckDto.riskScore >= 40 ? RiskLevel.MEDIUM : RiskLevel.LOW;
      }

      const updatedFraudCheck = await fraudCheck.save();
      return this.mapToResponseDto(updatedFraudCheck);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      throw new BadRequestException('Failed to update fraud check');
    }
  }

  async delete(id: string, userId: string): Promise<void> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid fraud check ID');
      }

      if (!Types.ObjectId.isValid(userId)) {
        throw new BadRequestException('Invalid user ID');
      }

      const fraudCheck = await this.fraudCheckModel
        .findOne({ _id: new Types.ObjectId(id), isActive: true })
        .exec();

      if (!fraudCheck) {
        throw new NotFoundException('Fraud check not found');
      }

      if (!fraudCheck.createdBy.equals(new Types.ObjectId(userId))) {
        throw new ForbiddenException('Access denied');
      }

      fraudCheck.isActive = false;
      await fraudCheck.save();
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete fraud check');
    }
  }

  async analyzeTransaction(
    analyzeDto: AnalyzeTransactionDto,
    userId: string,
  ): Promise<FraudAnalysisResponseDto> {
    try {
      if (!Types.ObjectId.isValid(userId)) {
        throw new BadRequestException('Invalid user ID');
      }

      // Mock fraud analysis logic
      const riskScore = this.calculateRiskScore(analyzeDto);
      const riskLevel = riskScore >= 80 ? RiskLevel.CRITICAL : 
                       riskScore >= 60 ? RiskLevel.HIGH :
                       riskScore >= 40 ? RiskLevel.MEDIUM : RiskLevel.LOW;
      
      const flags = this.detectFraudFlags(analyzeDto);
      const isFraudulent = riskLevel === RiskLevel.CRITICAL || riskLevel === RiskLevel.HIGH;

      // Create fraud check record
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
        status: isFraudulent ? FraudStatus.FLAGGED : FraudStatus.APPROVED,
        isActive: true,
        createdBy: new Types.ObjectId(userId),
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
    } catch (error) {
      throw new BadRequestException('Failed to analyze transaction');
    }
  }

  async getStatistics(userId: string): Promise<any> {
    try {
      if (!Types.ObjectId.isValid(userId)) {
        throw new BadRequestException('Invalid user ID');
      }

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const stats = await this.fraudCheckModel.aggregate([
        {
          $match: {
            createdBy: new Types.ObjectId(userId),
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
                $cond: [{ $eq: ['$status', FraudStatus.FLAGGED] }, 1, 0],
              },
            },
            avgRiskScore: { $avg: '$riskScore' },
            highRiskCount: {
              $sum: {
                $cond: [{ $in: ['$riskLevel', [RiskLevel.HIGH, RiskLevel.CRITICAL]] }, 1, 0],
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
    } catch (error) {
      throw new BadRequestException('Failed to fetch statistics');
    }
  }

  private calculateRiskScore(analyzeDto: AnalyzeTransactionDto): number {
    // Mock risk calculation logic
    let score = 0;
    
    if (analyzeDto.amount > 10000) score += 30; // Large amount
    if (analyzeDto.currency !== 'INR') score += 20; // Foreign currency
    if (analyzeDto.location?.country !== 'IN') score += 25; // Foreign transaction
    if (analyzeDto.deviceId?.includes('emulator')) score += 40; // Emulator detected
    
    // Time-based scoring (late night transactions)
    const hour = new Date().getHours();
    if (hour >= 0 && hour <= 5) score += 15;
    
    return Math.min(100, score);
  }

  private detectFraudFlags(analyzeDto: AnalyzeTransactionDto): string[] {
    const flags: string[] = [];
    
    if (analyzeDto.amount > 10000) flags.push('LARGE_AMOUNT');
    if (analyzeDto.currency !== 'INR') flags.push('FOREIGN_CURRENCY');
    if (analyzeDto.location?.country !== 'IN') flags.push('FOREIGN_LOCATION');
    if (analyzeDto.deviceId?.includes('emulator')) flags.push('EMULATOR_DETECTED');
    
    // Check for velocity (multiple transactions in short time)
    const hour = new Date().getHours();
    if (hour >= 0 && hour <= 5) flags.push('UNUSUAL_TIME');
    
    return flags;
  }

  private mapToResponseDto(fraudCheck: any): FraudCheckResponseDto {
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
}