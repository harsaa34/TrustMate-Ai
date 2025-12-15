// src/payment-verification/payment-verification.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentVerificationController } from './payment-verification.controller';
import { PaymentVerificationService } from './payment-verification.service';
import { Settlement, SettlementSchema } from '../settlement/settlement.schema';
import { FraudCheckModule } from '../fraudcheck/fraudcheck.module';
import { TrustScoreModule } from '../trustscore/trustscore.module';
import { OcrModule } from '../ocr/ocr.module'; // Add this import

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Settlement.name, schema: SettlementSchema },
    ]),
    FraudCheckModule,
    TrustScoreModule, // If TrustScoreModule exists
    OcrModule, // Add this line to import OCR module
  ],
  controllers: [PaymentVerificationController],
  providers: [PaymentVerificationService],
  exports: [PaymentVerificationService],
})
export class PaymentVerificationModule {}