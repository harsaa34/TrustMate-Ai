import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UpiService } from './upi.service';
import { UpiController } from './upi.controller';
import { Settlement, SettlementSchema } from '../settlement/settlement.schema';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: Settlement.name, schema: SettlementSchema },
    ]),
  ],
  controllers: [UpiController],
  providers: [UpiService],
  exports: [UpiService],
})
export class UpiModule {}