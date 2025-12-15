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
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { ReceiptService } from './receipt.service';
import {
  CreateReceiptDto,
  UpdateReceiptDto,
  ReceiptResponseDto,
  ProcessReceiptDto,
  ReceiptAnalysisResultDto,
  ReceiptListResponseDto,
} from './receipt.dto';
import { memoryStorage } from 'multer';

@ApiTags('Receipts')
@ApiBearerAuth()
@Controller('receipts')
@UseGuards(JwtAuthGuard)
export class ReceiptController {
  constructor(private readonly receiptService: ReceiptService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new receipt record' })
  @ApiResponse({ status: 201, description: 'Receipt created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createReceiptDto: CreateReceiptDto,
  ): Promise<ReceiptResponseDto> {
    const mockUserId = '65f7b8e9c9b1a3d9f8c7b6a5';
    return this.receiptService.create(createReceiptDto, mockUserId);
  }

  @Post('upload')
  @ApiOperation({ summary: 'Upload and process receipt image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        merchantName: { type: 'string', example: 'Amazon' },
        amount: { type: 'number', example: 99.99 },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Receipt processed successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|pdf)$/)) {
          return callback(new BadRequestException('Only image and PDF files are allowed'), false);
        }
        callback(null, true);
      },
    }),
  )
  @HttpCode(HttpStatus.CREATED)
  async uploadAndProcess(
    @UploadedFile() file: Express.Multer.File,
    @Body() processDto: ProcessReceiptDto,
  ): Promise<ReceiptResponseDto> {
    const mockUserId = '65f7b8e9c9b1a3d9f8c7b6a5';
    return this.receiptService.processReceiptImage(file, processDto, mockUserId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all receipts for current user' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'status', required: false, enum: ['PENDING', 'PROCESSED', 'ERROR', 'ARCHIVED'] })
  @ApiQuery({ name: 'merchantName', required: false, type: String })
  @ApiQuery({ name: 'fromDate', required: false, type: String })
  @ApiQuery({ name: 'toDate', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Receipts retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUserItems(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('status') status?: string,
    @Query('merchantName') merchantName?: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ): Promise<ReceiptListResponseDto> {
    const mockUserId = '65f7b8e9c9b1a3d9f8c7b6a5';
    return this.receiptService.getUserItems(mockUserId, page, limit, {
      status,
      merchantName,
      fromDate,
      toDate,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get receipt by ID' })
  @ApiParam({ name: 'id', description: 'Receipt ID', type: String })
  @ApiResponse({ status: 200, description: 'Receipt retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Receipt not found' })
  async getById(
    @Param('id') id: string,
  ): Promise<ReceiptResponseDto> {
    const mockUserId = '65f7b8e9c9b1a3d9f8c7b6a5';
    return this.receiptService.getById(id, mockUserId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update receipt' })
  @ApiParam({ name: 'id', description: 'Receipt ID', type: String })
  @ApiResponse({ status: 200, description: 'Receipt updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Receipt not found' })
  async update(
    @Param('id') id: string,
    @Body() updateReceiptDto: UpdateReceiptDto,
  ): Promise<ReceiptResponseDto> {
    const mockUserId = '65f7b8e9c9b1a3d9f8c7b6a5';
    return this.receiptService.update(id, updateReceiptDto, mockUserId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete receipt' })
  @ApiParam({ name: 'id', description: 'Receipt ID', type: String })
  @ApiResponse({ status: 204, description: 'Receipt deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Receipt not found' })
  async delete(
    @Param('id') id: string,
  ): Promise<void> {
    const mockUserId = '65f7b8e9c9b1a3d9f8c7b6a5';
    return this.receiptService.delete(id, mockUserId);
  }

  @Post(':id/analyze')
  @ApiOperation({ summary: 'Analyze receipt for expense categorization' })
  @ApiParam({ name: 'id', description: 'Receipt ID', type: String })
  @ApiResponse({ status: 200, description: 'Receipt analyzed successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Receipt not found' })
  async analyzeReceipt(
    @Param('id') id: string,
  ): Promise<ReceiptAnalysisResultDto> {
    const mockUserId = '65f7b8e9c9b1a3d9f8c7b6a5';
    return this.receiptService.analyzeReceipt(id, mockUserId);
  }

  @Get('statistics/summary')
  @ApiOperation({ summary: 'Get receipt processing statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getStatistics(): Promise<any> {
    const mockUserId = '65f7b8e9c9b1a3d9f8c7b6a5';
    return this.receiptService.getStatistics(mockUserId);
  }
}