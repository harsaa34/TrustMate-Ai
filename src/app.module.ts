import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { GroupModule } from './group/group.module';
import { ExpenseModule } from './expense/expense.module';
import { SettlementModule } from './settlement/settlement.module';
import { TrustScoreModule } from './trustscore/trustscore.module';
import { FraudCheckModule } from './fraudcheck/fraudcheck.module';
import { ReceiptModule } from './receipt/receipt.module';
import { UpiModule } from './upi/upi.module';
import { PaymentVerificationModule } from './payment-verification/payment-verification.module'; // Add this import

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    GroupModule,
    ExpenseModule,
    SettlementModule,
    TrustScoreModule,
    FraudCheckModule,
    ReceiptModule,
    UpiModule,
    PaymentVerificationModule, // Add this line
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}