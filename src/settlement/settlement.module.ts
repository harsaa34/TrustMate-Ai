// src/settlement/settlement.module.ts - FINAL VERSION
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SettlementController } from './settlement.controller';
import { SettlementService } from './settlement.service';
import { Settlement, SettlementSchema } from './settlement.schema';
import { Group, GroupSchema } from '../group/group.schema';
import { SettlementRepository } from '../shared/database/repository/settlement.repository';
import { GroupRepository } from '../shared/database/repository/group.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Settlement.name, schema: SettlementSchema },
      { name: Group.name, schema: GroupSchema },
    ]),
  ],
  controllers: [SettlementController],
  providers: [
    SettlementService,
    SettlementRepository,
    GroupRepository,
  ],
  exports: [SettlementService],
})
export class SettlementModule {}