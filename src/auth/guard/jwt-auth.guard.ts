// src/auth/guard/jwt-auth.guard.ts - MODIFIED
import { 
  Injectable, 
  ExecutionContext, 
  UnauthorizedException 
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './../../shared/Decorator/public.decorator';

interface JwtUser {
  id: string;
  email: string;
  // ROLE REMOVED
  iat: number;
  exp: number;
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest<TUser = JwtUser>(
    err: any,
    user: TUser,
    info: any,
    context?: ExecutionContext,
    status?: any,
  ): TUser {
    if (err || !user) {
      throw new UnauthorizedException('Invalid or expired token');
    }
    return user;
  }
}