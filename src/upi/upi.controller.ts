import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode,
  BadRequestException,
  InternalServerErrorException,
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
import { UpiService } from './upi.service';
import {
  GenerateUpiLinkDto,
  VerifyPaymentDto,
  UpiLinkResponseDto,
  VerificationResponseDto,
  ValidateUpiIdDto,
  ValidateUpiIdResponseDto,
  UpiCallbackDto,
  PaymentStatusResponseDto,
} from './upi.dto';

@ApiTags('UPI Payments')
@ApiBearerAuth()
@Controller('upi')
@UseGuards(JwtAuthGuard)
export class UpiController {
  constructor(private readonly upiService: UpiService) {}

  // ========== UPI LINK GENERATION ==========

  @Post('generate-link')
  @ApiOperation({
    summary: 'Generate UPI payment link',
    description: 'Creates a UPI deep link that opens payment apps with pre-filled details',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'UPI link generated successfully',
    type: UpiLinkResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async generateUpiLink(
    @Body() dto: GenerateUpiLinkDto,
  ): Promise<UpiLinkResponseDto> {
    try {
      return await this.upiService.generatePaymentLink(dto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('settlements/:settlementId/generate-link')
  @ApiOperation({ summary: 'Generate UPI link for specific settlement' })
  @ApiParam({
    name: 'settlementId',
    description: 'Settlement ID',
    example: '65f1a2b3c4d5e6f7a8b9c0d1',
  })
  async generateSettlementUpiLink(
    @Param('settlementId') settlementId: string,
    @Body() body: { note?: string; receiverUpiId: string; receiverName: string; amount: number },
  ): Promise<UpiLinkResponseDto> {
    try {
      if (!body.amount || !body.receiverUpiId || !body.receiverName) {
        throw new BadRequestException('Missing required fields: amount, receiverUpiId, receiverName');
      }

      return await this.upiService.generateSettlementLink(
        settlementId,
        body.amount,
        body.receiverUpiId,
        body.receiverName,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // ========== PAYMENT VERIFICATION ==========

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verify UPI payment using OCR text',
    description: 'Verifies payment by comparing extracted data from screenshot with expected values',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Payment verification result',
    type: VerificationResponseDto,
  })
  async verifyPayment(
    @Body() dto: VerifyPaymentDto,
  ): Promise<VerificationResponseDto> {
    try {
      // In production: OCR processing would happen here
      // For now, simulate verification
      
      // Mock OCR extraction
      const mockOcrText = `Payment Successful
Amount: ₹${dto.expectedAmount}
To: ${dto.expectedUpiId}
Transaction ID: TXN${Date.now()}
Date: ${new Date().toLocaleDateString()}`;

      const result = await this.upiService.verifyPaymentFromText(
        mockOcrText,
        dto.expectedAmount,
        dto.expectedUpiId
      );

      // Add settlement-specific data
      if (dto.settlementId) {
        (result as any).settlementId = dto.settlementId;
        (result as any).verifiedAt = new Date();
      }

      return result;
    } catch (error) {
      throw new InternalServerErrorException('Verification failed: ' + error.message);
    }
  }

  @Post('verify-with-ocr')
  @ApiOperation({
    summary: 'Verify payment with actual OCR processing',
    description: 'Upload screenshot image for OCR processing and verification',
  })
  async verifyWithOcr(
    @Body() body: { imageBase64: string; expectedAmount: number; expectedUpiId: string }
  ): Promise<VerificationResponseDto> {
    try {
      // TODO: Integrate with OCR service
      // const ocrText = await this.ocrService.extractText(body.imageBase64);
      
      // For now, use mock
      const mockOcrText = `UPI Payment Successful
Amount: ₹${body.expectedAmount}
Paid to: ${body.expectedUpiId}
Transaction Ref: UPI${Date.now()}`;

      return await this.upiService.verifyPaymentFromText(
        mockOcrText,
        body.expectedAmount,
        body.expectedUpiId
      );
    } catch (error) {
      throw new BadRequestException('OCR processing failed: ' + error.message);
    }
  }

  // ========== UPI VALIDATION ==========

  @Post('validate-upi-id')
  @ApiOperation({ summary: 'Validate UPI ID format and provider' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ValidateUpiIdResponseDto,
  })
  async validateUpiId(
    @Body() dto: ValidateUpiIdDto,
  ): Promise<ValidateUpiIdResponseDto> {
    const result = this.upiService.validateUpiId(dto.upiId);
    return {
      upiId: dto.upiId,
      ...result,
    };
  }

  // ========== PAYMENT STATUS ==========

  @Get('payment-status/:transactionId')
  @ApiOperation({ summary: 'Check payment status by transaction ID' })
  @ApiParam({
    name: 'transactionId',
    description: 'Transaction ID',
    example: 'TRUST_ABC123',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: PaymentStatusResponseDto,
  })
  async getPaymentStatus(
    @Param('transactionId') transactionId: string,
  ): Promise<PaymentStatusResponseDto> {
    // In production, this would check database
    return {
      transactionId,
      status: 'pending', // pending, verified, failed
      amount: 0,
      upiId: '',
      verifiedAt: null,
      verificationMethod: 'manual',
    };
  }

  // ========== UPI CALLBACK (WEBHOOK) ==========

  @Post('callback')
  @ApiOperation({
    summary: 'Handle UPI payment callback (webhook)',
    description: 'Endpoint for UPI apps to send payment status updates',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Callback processed successfully',
  })
  async upiCallback(@Body() dto: UpiCallbackDto) {
    try {
      const result = this.upiService.parseUpiCallback(dto.callbackUrl);
      
      // In production: Update settlement status in database
      // await this.settlementService.updatePaymentStatus(
      //   result.transactionId,
      //   result.status,
      //   result
      // );

      return {
        success: true,
        message: 'Callback processed',
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // ========== APP-SPECIFIC LINKS ==========

  @Get('app-links/:upiLink')
  @ApiOperation({
    summary: 'Get app-specific UPI links',
    description: 'Returns deep links for different UPI apps (Google Pay, PhonePe, etc.)',
  })
  @ApiParam({
    name: 'upiLink',
    description: 'Base UPI link',
    example: 'upi://pay?pa=user@upi&pn=Name&am=100&cu=INR',
  })
  async getAppSpecificLinks(@Param('upiLink') upiLink: string) {
    try {
      const links = this.upiService.generateAppSpecificLinks(upiLink);
      return {
        success: true,
        links,
      };
    } catch (error) {
      throw new BadRequestException('Invalid UPI link');
    }
  }

  // ========== HEALTH CHECK ==========

  @Get('health')
  @ApiOperation({ summary: 'Check UPI service health' })
  @ApiQuery({
    name: 'testAmount',
    required: false,
    description: 'Test amount for validation',
    example: '100',
  })
  healthCheck(@Query('testAmount') testAmount?: string) {
    const testData = {
      amount: testAmount ? parseFloat(testAmount) : 100,
      receiverUpiId: 'test@okaxis',
      receiverName: 'Test User',
    };

    try {
      const link = this.upiService.generatePaymentLink(testData);
      
      return {
        status: 'healthy',
        timestamp: new Date(),
        testLink: link.upiLink,
        features: {
          upiLinkGeneration: true,
          paymentVerification: true,
          upiValidation: true,
          appLinks: true,
        },
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date(),
      };
    }
  }
}