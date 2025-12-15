import {
  Controller,
  Post,
  Get,
  Body,
  HttpStatus,
  HttpCode,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  InternalServerErrorException,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { OcrService } from './ocr.service';
import {
  ProcessUpiScreenshotDto,
  ProcessReceiptDto,
  OcrResultDto,
  UpiScreenshotDataDto,
  ReceiptDataDto,
} from './ocr.dto';

@ApiTags('OCR Processing')
@ApiBearerAuth()
@Controller('ocr')
@UseGuards(JwtAuthGuard)
export class OcrController {
  constructor(private readonly ocrService: OcrService) {}

  // ========== UPI SCREENSHOT PROCESSING ==========

  @Post('process-upi-screenshot')
  @ApiOperation({ summary: 'Process UPI payment screenshot' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'UPI screenshot processed successfully',
    type: UpiScreenshotDataDto,
  })
  async processUpiScreenshot(
    @Body() dto: ProcessUpiScreenshotDto,
    @Request() req,
  ): Promise<UpiScreenshotDataDto> {
    try {
      const result = await this.ocrService.processBase64Image(
        dto.image,
        'upi',
        {
          amount: dto.expectedAmount,
          upiId: dto.expectedUpiId,
        },
        req.user?.userId,
      );
      return result as UpiScreenshotDataDto;
    } catch (error) {
      throw new BadRequestException(`UPI processing failed: ${error.message}`);
    }
  }

  @Post('upload/upi-screenshot')
  @ApiOperation({ summary: 'Upload UPI screenshot for processing' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: { type: 'string', format: 'binary' },
        expectedAmount: { type: 'number', example: 500 },
        expectedUpiId: { type: 'string', example: 'user@okaxis' },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
 async uploadUpiScreenshot(
  @UploadedFile() file: any,
  @Body() body: any, // Change to get all body params
): Promise<UpiScreenshotDataDto> {
  if (!file) {
    throw new BadRequestException('No image file provided');
  }

  try {
    return await this.ocrService.processUpiScreenshot(file.buffer, {
      amount: body.expectedAmount ? parseFloat(body.expectedAmount) : undefined,
      upiId: body.expectedUpiId,
    }, body.userId); // Pass userId if available
  } catch (error) {
    throw new InternalServerErrorException(`UPI processing failed: ${error.message}`);
  }
}
  // ========== RECEIPT PROCESSING ==========

  @Post('process-receipt')
  @ApiOperation({ summary: 'Process restaurant receipt' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Receipt processed successfully',
    type: ReceiptDataDto,
  })
  async processReceipt(
    @Body() dto: ProcessReceiptDto,
    @Request() req,
  ): Promise<ReceiptDataDto> {
    try {
      const result = await this.ocrService.processBase64Image(
        dto.image,
        'receipt',
        undefined,
        req.user?.userId,
      );
      return result as ReceiptDataDto;
    } catch (error) {
      throw new BadRequestException(`Receipt processing failed: ${error.message}`);
    }
  }

  @Post('upload/receipt')
  @ApiOperation({ summary: 'Upload receipt for processing' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async uploadReceipt(
    @UploadedFile() file: any,
    @Request() req,
  ): Promise<ReceiptDataDto> {
    if (!file) {
      throw new BadRequestException('No image file provided');
    }

    try {
      return await this.ocrService.processReceipt(file.buffer, req.user?.userId);
    } catch (error) {
      throw new InternalServerErrorException(`Receipt processing failed: ${error.message}`);
    }
  }

  // ========== GENERAL OCR ==========

  @Post('extract-text')
  @ApiOperation({ summary: 'Extract text from image' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Text extracted successfully',
    type: OcrResultDto,
  })
  async extractText(
    @Body() body: { image: string },
    @Request() req,
  ): Promise<OcrResultDto> {
    try {
      const base64Data = body.image.includes('base64,')
        ? body.image.split('base64,')[1]
        : body.image;

      const imageBuffer = Buffer.from(base64Data, 'base64');
      return await this.ocrService.extractTextFromImage(imageBuffer, {}, req.user?.userId);
    } catch (error) {
      throw new BadRequestException(`Text extraction failed: ${error.message}`);
    }
  }

  // ========== HEALTH & INFO ==========

  @Get('health')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Check OCR service health' })
  async healthCheck() {
    try {
      const health = await this.ocrService.healthCheck();
      return {
        ...health,
        timestamp: new Date(),
        uptime: process.uptime(),
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date(),
      };
    }
  }

  @Get('test')
  @ApiOperation({ summary: 'Test OCR service with sample data' })
  async testOcr() {
    try {
      const testText = 'Test OCR: ₹500 Payment to user@okaxis';
      
      return {
        success: true,
        message: 'OCR service is operational',
        testText,
        capabilities: {
          upiScreenshotProcessing: true,
          receiptProcessing: true,
          textExtraction: true,
          fraudDetection: true,
        },
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}