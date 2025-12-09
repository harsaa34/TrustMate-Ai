import { Strategy } from 'passport-jwt';
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
}
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithoutRequest] | [opt: import("passport-jwt").StrategyOptionsWithRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly authService;
    constructor(authService: AuthService);
    validate(payload: JwtPayload): Promise<ValidatedUser>;
}
export {};
