// src/group/group.dto.ts - FIXED (NO IMPORTS FROM ITSELF)
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, IsOptional, IsArray, IsEnum, IsBoolean, 
  IsMongoId, MinLength, MaxLength, IsNotEmpty, IsDateString 
} from 'class-validator';
import { Type } from 'class-transformer';

// Request DTOs
export class CreateGroupDto {
  @ApiProperty({ 
    example: 'Trip to Goa', 
    description: 'Group name',
    minLength: 3,
    maxLength: 100
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ 
    example: 'Our vacation group for Goa trip 2024', 
    description: 'Group description',
    maxLength: 500
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ 
    example: 'INR', 
    description: 'Default currency for the group',
    enum: ['INR', 'USD', 'EUR', 'GBP'],
    default: 'INR'
  })
  @IsString()
  @IsOptional()
  @IsEnum(['INR', 'USD', 'EUR', 'GBP'])
  currency?: string;
}

export class UpdateGroupDto {
  @ApiPropertyOptional({ 
    example: 'Goa Trip 2024', 
    description: 'Group name',
    minLength: 3,
    maxLength: 100
  })
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({ 
    example: 'Updated description for our Goa trip', 
    description: 'Group description',
    maxLength: 500
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ 
    example: 'USD', 
    description: 'Default currency for the group',
    enum: ['INR', 'USD', 'EUR', 'GBP']
  })
  @IsString()
  @IsOptional()
  @IsEnum(['INR', 'USD', 'EUR', 'GBP'])
  currency?: string;
}

export class AddMemberDto {
  @ApiProperty({ 
    example: '507f1f77bcf86cd799439011', 
    description: 'User ID to add to the group'
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiPropertyOptional({ 
    example: 'member', 
    description: 'Role for the new member',
    enum: ['admin', 'member'],
    default: 'member'
  })
  @IsString()
  @IsOptional()
  @IsEnum(['admin', 'member'])
  role?: string;
}

export class GetGroupsQueryDto {
  @ApiPropertyOptional({ 
    example: 'createdAt', 
    description: 'Field to sort by',
    enum: ['name', 'createdAt', 'updatedAt']
  })
  @IsString()
  @IsOptional()
  @IsEnum(['name', 'createdAt', 'updatedAt'])
  sortBy?: string;

  @ApiPropertyOptional({ 
    example: 'desc', 
    description: 'Sort order',
    enum: ['asc', 'desc']
  })
  @IsString()
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: string;

  @ApiPropertyOptional({ 
    example: 1, 
    description: 'Page number',
    minimum: 1,
    default: 1
  })
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({ 
    example: 20, 
    description: 'Items per page',
    minimum: 1,
    maximum: 100,
    default: 20
  })
  @IsOptional()
  @Type(() => Number)
  limit?: number = 20;
}

// Response DTOs - Define them here
export class GroupResponseDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'Group ID' })
  id: string;

  @ApiProperty({ example: 'Trip to Goa', description: 'Group name' })
  name: string;

  @ApiPropertyOptional({ example: 'Our vacation group', description: 'Group description' })
  description?: string;

  @ApiProperty({ 
    description: 'Group creator',
    example: { id: '507f1f77bcf86cd799439011', name: 'John Doe', email: 'john@example.com' }
  })
  createdBy: {
    id: string;
    name: string;
    email: string;
  };

  @ApiProperty({ 
    description: 'Group members',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        userId: { type: 'string', example: '507f1f77bcf86cd799439011' },
        userName: { type: 'string', example: 'Jane Smith' },
        userEmail: { type: 'string', example: 'jane@example.com' },
        role: { type: 'string', example: 'member', enum: ['admin', 'member'] },
        joinedAt: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00.000Z' }
      }
    }
  })
  members: Array<{
    userId: string;
    userName: string;
    userEmail: string;
    role: string;
    joinedAt: Date;
  }>;

  @ApiProperty({ 
    example: { currency: 'INR', defaultSplitType: 'equal' },
    description: 'Group settings'
  })
  settings: Record<string, any>;

  @ApiProperty({ example: true, description: 'Whether the group is active' })
  isActive: boolean;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z', description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z', description: 'Last update date' })
  updatedAt: Date;
}

export class GroupMemberResponseDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'User ID' })
  userId: string;

  @ApiProperty({ example: 'John Doe', description: 'User name' })
  userName: string;

  @ApiProperty({ example: 'john@example.com', description: 'User email' })
  userEmail: string;

  @ApiProperty({ example: 'member', description: 'Member role', enum: ['admin', 'member'] })
  role: string;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z', description: 'Join date' })
  joinedAt: Date;
}

export class GroupStatisticsDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'Group ID' })
  groupId: string;

  @ApiProperty({ example: 'Trip to Goa', description: 'Group name' })
  name: string;

  @ApiProperty({ example: 5, description: 'Number of members' })
  memberCount: number;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z', description: 'Creation date' })
  createdAt: Date;
}