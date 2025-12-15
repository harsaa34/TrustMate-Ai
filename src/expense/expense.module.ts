// src/expense/expense.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExpenseController } from './expense.controller';
import { ExpenseService } from './expense.service';
import { Expense, ExpenseSchema } from './expense.schema';
import { Group, GroupSchema } from '../group/group.schema';
import { User, UserSchema } from '../user/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Expense.name, schema: ExpenseSchema },
      { name: Group.name, schema: GroupSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [ExpenseController],
  providers: [ExpenseService],
  exports: [ExpenseService],
})
export class ExpenseModule {}