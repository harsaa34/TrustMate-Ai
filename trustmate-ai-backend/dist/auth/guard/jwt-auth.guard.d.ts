import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
interface JwtUser {
    id: string;
    email: string;
    iat: number;
    exp: number;
}
declare const JwtAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class JwtAuthGuard extends JwtAuthGuard_base {
    private reflector;
    constructor(reflector: Reflector);
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | import("rxjs").Observable<boolean>;
    handleRequest<TUser = JwtUser>(err: any, user: TUser, info: any, context?: ExecutionContext, status?: any): TUser;
}
export {};
