import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { TrustScoreService } from './trustscore.service';
import {
  CreateTrustScoreDto,
  UpdateTrustScoreDto,
  TrustScoreResponseDto,
} from './trustscore.dto';

@ApiTags('TrustScores')
@ApiBearerAuth()
@Controller('trustscores')
@UseGuards(JwtAuthGuard)
export class TrustScoreController {
  constructor(private readonly trustScoreService: TrustScoreService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new trust score' })
  @ApiResponse({ status: 201, description: 'Trust score created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @Body() createTrustScoreDto: CreateTrustScoreDto,
  ): Promise<TrustScoreResponseDto> {
    // Note: You'll need to get user from request context
    // For now, using a mock user ID
    const mockUserId = '65f7b8e9c9b1a3d9f8c7b6a5'; // Replace with actual user extraction
    return this.trustScoreService.create(createTrustScoreDto, mockUserId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all trust scores for current user' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'Trust scores retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUserItems(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<TrustScoreResponseDto[]> {
    const mockUserId = '65f7b8e9c9b1a3d9f8c7b6a5';
    return this.trustScoreService.getUserItems(mockUserId, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get trust score by ID' })
  @ApiParam({ name: 'id', description: 'Trust score ID', type: String })
  @ApiResponse({ status: 200, description: 'Trust score retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Trust score not found' })
  async getById(
    @Param('id') id: string,
  ): Promise<TrustScoreResponseDto> {
    const mockUserId = '65f7b8e9c9b1a3d9f8c7b6a5';
    return this.trustScoreService.getById(id, mockUserId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update trust score' })
  @ApiParam({ name: 'id', description: 'Trust score ID', type: String })
  @ApiResponse({ status: 200, description: 'Trust score updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Trust score not found' })
  async update(
    @Param('id') id: string,
    @Body() updateTrustScoreDto: UpdateTrustScoreDto,
  ): Promise<TrustScoreResponseDto> {
    const mockUserId = '65f7b8e9c9b1a3d9f8c7b6a5';
    return this.trustScoreService.update(id, updateTrustScoreDto, mockUserId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete trust score' })
  @ApiParam({ name: 'id', description: 'Trust score ID', type: String })
  @ApiResponse({ status: 204, description: 'Trust score deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Trust score not found' })
  async delete(
    @Param('id') id: string,
  ): Promise<void> {
    const mockUserId = '65f7b8e9c9b1a3d9f8c7b6a5';
    return this.trustScoreService.delete(id, mockUserId);
  }
}