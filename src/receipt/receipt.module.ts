import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReceiptController } from './receipt.controller';
import { ReceiptService } from './receipt.service';
import { Receipt, ReceiptSchema } from './receipt.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Receipt.name, schema: ReceiptSchema },
    ]),
  ],
  controllers: [ReceiptController],
  providers: [ReceiptService],
  exports: [ReceiptService],
})
export class ReceiptModule {}