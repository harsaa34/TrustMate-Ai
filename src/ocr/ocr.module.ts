// src/ocr/ocr.module.ts
import { Module } from '@nestjs/common';
import { OcrService } from './ocr.service';
import { OcrController } from './ocr.controller'; // Optional
import { FraudCheckModule } from '../fraudcheck/fraudcheck.module';

@Module({
  imports: [
    FraudCheckModule, // If OcrService needs FraudCheckService
  ],
  providers: [OcrService],
  exports: [OcrService], // Important: export the service so other modules can use it
  controllers: [OcrController], // Optional - remove if you don't need endpoints
})
export class OcrModule {}