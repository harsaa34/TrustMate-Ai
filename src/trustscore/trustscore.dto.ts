import {
  IsNumber,
  IsString,
  IsEnum,
  IsOptional,
  IsArray,
  IsBoolean,
  IsDateString,
  IsObject,
  Min,
  Max,
  IsNotEmpty,
  IsMongoId,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum EntityType {
  USER = 'user',
  MERCHANT = 'merchant',
  TRANSACTION = 'transaction',
  DEVICE = 'device',
  IP_ADDRESS = 'ip_address',
}

export class CreateTrustScoreDto {
  @ApiProperty({
    description: 'Trust score value',
    example: 85.5,
    minimum: 0,
    maximum: 100,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  score: number;

  @ApiPropertyOptional({
    description: 'Maximum possible score',
    example: 100,
    default: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxScore?: number;

  @ApiPropertyOptional({
    description: 'Minimum possible score',
    example: 0,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minScore?: number;

  @ApiPropertyOptional({
    description: 'Confidence level of the score (0-1)',
    example: 0.95,
    minimum: 0,
    maximum: 1,
    default: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  confidence?: number;

  @ApiProperty({
    description: 'Factors contributing to the score',
    example: ['identity_verified', 'transaction_history', 'device_fingerprint'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  factors: string[];

  @ApiProperty({
    description: 'Type of entity being scored',
    enum: EntityType,
    example: EntityType.USER,
  })
  @IsEnum(EntityType)
  entityType: EntityType;

  @ApiProperty({
    description: 'ID of the entity being scored',
    example: '507f1f77bcf86cd799439011',
  })
  @IsNotEmpty()
  @IsString()
  entityId: string;

  @ApiPropertyOptional({
    description: 'Algorithm version used for calculation',
    example: '2.1.0',
  })
  @IsOptional()
  @IsString()
  algorithmVersion?: string;

  @ApiPropertyOptional({
    description: 'When the score was calculated',
    example: '2024-01-15T10:30:00Z',
  })
  @IsOptional()
  @IsDateString()
  calculatedAt?: string;

  @ApiPropertyOptional({
    description: 'When the score expires',
    example: '2024-02-15T10:30:00Z',
  })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @ApiPropertyOptional({
    description: 'Additional metadata',
    example: { riskLevel: 'low', flags: ['new_user'] },
    type: Object,
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class UpdateTrustScoreDto {
  @ApiPropertyOptional({
    description: 'Updated trust score value',
    example: 90.0,
    minimum: 0,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  score?: number;

  @ApiPropertyOptional({
    description: 'Updated confidence level',
    example: 0.98,
    minimum: 0,
    maximum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  confidence?: number;

  @ApiPropertyOptional({
    description: 'Updated factors',
    example: ['identity_verified', 'biometric_auth'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  factors?: string[];

  @ApiPropertyOptional({
    description: 'Updated algorithm version',
    example: '2.2.0',
  })
  @IsOptional()
  @IsString()
  algorithmVersion?: string;

  @ApiPropertyOptional({
    description: 'Updated expiration date',
    example: '2024-03-15T10:30:00Z',
  })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @ApiPropertyOptional({
    description: 'Updated metadata',
    example: { riskLevel: 'medium', reviewedBy: 'admin' },
    type: Object,
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Whether the score is active',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class TrustScoreResponseDto {
  @ApiProperty({ description: 'Trust score ID' })
  id: string;

  @ApiProperty({ description: 'Trust score value' })
  score: number;

  @ApiProperty({ description: 'Maximum possible score', default: 100 })
  maxScore: number;

  @ApiProperty({ description: 'Minimum possible score', default: 0 })
  minScore: number;

  @ApiProperty({ description: 'Confidence level', default: 1 })
  confidence: number;

  @ApiProperty({ description: 'Factors contributing to the score', type: [String] })
  factors: string[];

  @ApiProperty({ description: 'Type of entity', enum: EntityType })
  entityType: EntityType;

  @ApiProperty({ description: 'Entity ID' })
  entityId: string;

  @ApiPropertyOptional({ description: 'Algorithm version' })
  algorithmVersion?: string;

  @ApiPropertyOptional({ description: 'Calculation timestamp' })
  calculatedAt?: Date;

  @ApiPropertyOptional({ description: 'Expiration timestamp' })
  expiresAt?: Date;

  @ApiPropertyOptional({ description: 'Additional metadata', type: Object })
  metadata?: Record<string, any>;

  @ApiProperty({ description: 'Whether the score is active' })
  isActive: boolean;

  @ApiProperty({ description: 'User who created the score' })
  createdBy: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}