import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { TrustScore } from './trustscore.schema';
import {
  CreateTrustScoreDto,
  UpdateTrustScoreDto,
  TrustScoreResponseDto,
} from './trustscore.dto';

@Injectable()
export class TrustScoreService {
  constructor(
    @InjectModel(TrustScore.name)
    private readonly trustScoreModel: Model<TrustScore>,
  ) {}

  async create(
    createTrustScoreDto: CreateTrustScoreDto,
    userId: string,
  ): Promise<TrustScoreResponseDto> {
    try {
      if (!Types.ObjectId.isValid(userId)) {
        throw new BadRequestException('Invalid user ID');
      }

      const trustScore = new this.trustScoreModel({
        ...createTrustScoreDto,
        createdBy: new Types.ObjectId(userId),
        isActive: true,
      });

      const savedTrustScore = await trustScore.save();
      return this.mapToResponseDto(savedTrustScore);
    } catch (error) {
      throw new BadRequestException('Failed to create trust score');
    }
  }

  async getUserItems(
    userId: string,
    page: number,
    limit: number,
  ): Promise<TrustScoreResponseDto[]> {
    try {
      if (!Types.ObjectId.isValid(userId)) {
        throw new BadRequestException('Invalid user ID');
      }

      const skip = (page - 1) * limit;
      
      const trustScores = await this.trustScoreModel
        .find({ 
          createdBy: new Types.ObjectId(userId), 
          isActive: true 
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec();

      return trustScores.map((score) => this.mapToResponseDto(score));
    } catch (error) {
      throw new BadRequestException('Failed to fetch trust scores');
    }
  }

  async getById(
    id: string,
    userId: string,
  ): Promise<TrustScoreResponseDto> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid trust score ID');
      }

      if (!Types.ObjectId.isValid(userId)) {
        throw new BadRequestException('Invalid user ID');
      }

      const trustScore = await this.trustScoreModel
        .findOne({ _id: new Types.ObjectId(id), isActive: true })
        .exec();

      if (!trustScore) {
        throw new NotFoundException('Trust score not found');
      }

      if (!trustScore.createdBy.equals(new Types.ObjectId(userId))) {
        throw new ForbiddenException('Access denied');
      }

      return this.mapToResponseDto(trustScore);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      throw new BadRequestException('Failed to fetch trust score');
    }
  }

  async update(
    id: string,
    updateTrustScoreDto: UpdateTrustScoreDto,
    userId: string,
  ): Promise<TrustScoreResponseDto> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid trust score ID');
      }

      if (!Types.ObjectId.isValid(userId)) {
        throw new BadRequestException('Invalid user ID');
      }

      const trustScore = await this.trustScoreModel
        .findOne({ _id: new Types.ObjectId(id), isActive: true })
        .exec();

      if (!trustScore) {
        throw new NotFoundException('Trust score not found');
      }

      if (!trustScore.createdBy.equals(new Types.ObjectId(userId))) {
        throw new ForbiddenException('Access denied');
      }

      Object.assign(trustScore, updateTrustScoreDto);
      const updatedTrustScore = await trustScore.save();

      return this.mapToResponseDto(updatedTrustScore);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      throw new BadRequestException('Failed to update trust score');
    }
  }

  async delete(id: string, userId: string): Promise<void> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid trust score ID');
      }

      if (!Types.ObjectId.isValid(userId)) {
        throw new BadRequestException('Invalid user ID');
      }

      const trustScore = await this.trustScoreModel
        .findOne({ _id: new Types.ObjectId(id), isActive: true })
        .exec();

      if (!trustScore) {
        throw new NotFoundException('Trust score not found');
      }

      if (!trustScore.createdBy.equals(new Types.ObjectId(userId))) {
        throw new ForbiddenException('Access denied');
      }

      trustScore.isActive = false;
      await trustScore.save();
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete trust score');
    }
  }

  private mapToResponseDto(trustScore: any): TrustScoreResponseDto {
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
}