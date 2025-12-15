import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FraudCheckController } from './fraudcheck.controller';
import { FraudCheckService } from './fraudcheck.service';
import { FraudCheck, FraudCheckSchema } from './fraudcheck.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FraudCheck.name, schema: FraudCheckSchema },
    ]),
  ],
  controllers: [FraudCheckController],
  providers: [FraudCheckService],
  exports: [FraudCheckService],
})
export class FraudCheckModule {}