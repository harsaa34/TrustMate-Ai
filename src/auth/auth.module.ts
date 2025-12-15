// src/auth/auth.module.ts - PRAGMATIC SOLUTION
import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { User, UserSchema } from '../user/schemas/user.schema';
import { AuthRepository } from '../shared/database/repository/auth.repository';
import { EmailService } from '../shared/services/email.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): JwtModuleOptions => {
        const secret = configService.get<string>('JWT_SECRET');
        const expiresIn = configService.get<string>('JWT_ACCESS_EXPIRES_IN');
        
        if (!secret) {
          throw new Error('JWT_SECRET is not defined in environment variables');
        }
        
        // Use environment variable or default
        const jwtExpiresIn = expiresIn || '15m';
        
        // Minimal validation
        const isValidFormat = /^\d+\s*(ms|s|m|h|d|w|y)?$/i.test(jwtExpiresIn.trim());
        
        return {
          secret: secret,
          signOptions: {
            // Using 'as any' here because we know '15m' is valid for jsonwebtoken
            // and TypeScript is being overly strict about the StringValue type
            expiresIn: (isValidFormat ? jwtExpiresIn : '15m') as any,
          },
        };
      },
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: 'IAuthRepository',
      useClass: AuthRepository,
    },
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
    EmailService,
  ],
  exports: [AuthService, JwtAuthGuard],
})
export class AuthModule {}