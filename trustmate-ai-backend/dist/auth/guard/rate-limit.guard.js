"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimitGuard = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = require("ioredis");
let RateLimitGuard = class RateLimitGuard {
    redis;
    constructor() {
        this.redis = new ioredis_1.Redis({
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379'),
        });
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const ip = request.ip;
        const endpoint = request.route.path;
        const key = `rate_limit:${ip}:${endpoint}`;
        const current = await this.redis.get(key);
        const currentCount = current ? parseInt(current) : 0;
        if (currentCount >= 5) {
            throw new common_1.HttpException('Too many attempts. Please try again later.', common_1.HttpStatus.TOO_MANY_REQUESTS);
        }
        await this.redis.multi()
            .incr(key)
            .expire(key, 900)
            .exec();
        return true;
    }
};
exports.RateLimitGuard = RateLimitGuard;
exports.RateLimitGuard = RateLimitGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], RateLimitGuard);
//# sourceMappingURL=rate-limit.guard.js.map