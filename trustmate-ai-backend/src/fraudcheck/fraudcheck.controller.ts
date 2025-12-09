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
import { FraudCheckService } from './fraudcheck.service';
import {
  CreateFraudCheckDto,
  UpdateFraudCheckDto,
  FraudCheckResponseDto,
  AnalyzeTransactionDto,
  FraudAnalysisResponseDto,
} from './fraudcheck.dto';

@ApiTags('FraudChecks')
@ApiBearerAuth()
@Controller('fraudchecks')
@UseGuards(JwtAuthGuard)
export class FraudCheckController {
  constructor(private readonly fraudCheckService: FraudCheckService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new fraud check' })
  @ApiResponse({ status: 201, description: 'Fraud check created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createFraudCheckDto: CreateFraudCheckDto,
  ): Promise<FraudCheckResponseDto> {
    const mockUserId = '65f7b8e9c9b1a3d9f8c7b6a5';
    return this.fraudCheckService.create(createFraudCheckDto, mockUserId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all fraud checks for current user' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'status', required: false, enum: ['PENDING', 'APPROVED', 'REJECTED', 'FLAGGED'] })
  @ApiQuery({ name: 'riskLevel', required: false, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] })
  @ApiResponse({ status: 200, description: 'Fraud checks retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUserItems(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('status') status?: string,
    @Query('riskLevel') riskLevel?: string,
  ): Promise<FraudCheckResponseDto[]> {
    const mockUserId = '65f7b8e9c9b1a3d9f8c7b6a5';
    return this.fraudCheckService.getUserItems(mockUserId, page, limit, { status, riskLevel });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get fraud check by ID' })
  @ApiParam({ name: 'id', description: 'Fraud check ID', type: String })
  @ApiResponse({ status: 200, description: 'Fraud check retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Fraud check not found' })
  async getById(
    @Param('id') id: string,
  ): Promise<FraudCheckResponseDto> {
    const mockUserId = '65f7b8e9c9b1a3d9f8c7b6a5';
    return this.fraudCheckService.getById(id, mockUserId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update fraud check' })
  @ApiParam({ name: 'id', description: 'Fraud check ID', type: String })
  @ApiResponse({ status: 200, description: 'Fraud check updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Fraud check not found' })
  async update(
    @Param('id') id: string,
    @Body() updateFraudCheckDto: UpdateFraudCheckDto,
  ): Promise<FraudCheckResponseDto> {
    const mockUserId = '65f7b8e9c9b1a3d9f8c7b6a5';
    return this.fraudCheckService.update(id, updateFraudCheckDto, mockUserId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete fraud check' })
  @ApiParam({ name: 'id', description: 'Fraud check ID', type: String })
  @ApiResponse({ status: 204, description: 'Fraud check deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Fraud check not found' })
  async delete(
    @Param('id') id: string,
  ): Promise<void> {
    const mockUserId = '65f7b8e9c9b1a3d9f8c7b6a5';
    return this.fraudCheckService.delete(id, mockUserId);
  }

  @Post('analyze')
  @ApiOperation({ summary: 'Analyze transaction for fraud' })
  @ApiResponse({ status: 200, description: 'Transaction analyzed successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async analyzeTransaction(
    @Body() analyzeDto: AnalyzeTransactionDto,
  ): Promise<FraudAnalysisResponseDto> {
    const mockUserId = '65f7b8e9c9b1a3d9f8c7b6a5';
    return this.fraudCheckService.analyzeTransaction(analyzeDto, mockUserId);
  }

  @Get('statistics/summary')
  @ApiOperation({ summary: 'Get fraud detection statistics summary' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getStatistics(): Promise<any> {
    const mockUserId = '65f7b8e9c9b1a3d9f8c7b6a5';
    return this.fraudCheckService.getStatistics(mockUserId);
  }
}