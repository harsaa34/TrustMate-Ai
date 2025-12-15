// src/auth/strategies/jwt.strategy.ts - MODIFIED
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

interface JwtPayload {
  id: string;
  email?: string;
  iat?: number;
  exp?: number;
  sub?: string;
}

interface ValidatedUser {
  id: string;
  email: string;
  // ROLE REMOVED
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'default-secret',
    });
  }

  async validate(payload: JwtPayload): Promise<ValidatedUser> {
    const user = await this.authService.validateUser(payload.id);
    
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    
    return { 
      id: user.id, 
      email: user.email,
      // ROLE REMOVED
    };
  }
}