import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TrustScoreService } from './trustscore.service';
import { TrustScoreController } from './trustscore.controller';
import { TrustScore, TrustScoreSchema } from './trustscore.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TrustScore.name, schema: TrustScoreSchema },
    ]),
  ],
  providers: [TrustScoreService],
  controllers: [TrustScoreController],
  exports: [TrustScoreService, MongooseModule], // Make sure to export MongooseModule
})
export class TrustScoreModule {}