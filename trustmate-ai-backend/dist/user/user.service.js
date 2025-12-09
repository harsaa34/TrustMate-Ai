"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const user_schema_1 = require("./schemas/user.schema");
const bcrypt = __importStar(require("bcryptjs"));
const jwt_1 = require("@nestjs/jwt");
const user_dto_1 = require("./user.dto");
let UserService = class UserService {
    userModel;
    jwtService;
    constructor(userModel, jwtService) {
        this.userModel = userModel;
        this.jwtService = jwtService;
    }
    async register(createUserDto) {
        const existingUser = await this.userModel.findOne({
            email: createUserDto.email.toLowerCase()
        });
        if (existingUser) {
            throw new common_1.ConflictException('Email already exists');
        }
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const user = await this.userModel.create({
            email: createUserDto.email.toLowerCase(),
            password: hashedPassword,
            name: createUserDto.name,
            phone: createUserDto.phone,
            isActive: true,
            isVerified: false,
        });
        return this.toUserResponse(user);
    }
    async login(loginDto) {
        const user = await this.userModel.findOne({
            email: loginDto.email.toLowerCase()
        }).select('+password');
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('Account is deactivated');
        }
        user.lastLogin = new Date();
        await user.save();
        const token = this.generateToken(user.id);
        return new user_dto_1.LoginResponseDto(token, this.toUserResponse(user));
    }
    async updateUser(userId, updateUserDto) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (updateUserDto.name !== undefined) {
            user.name = updateUserDto.name;
        }
        if (updateUserDto.phone !== undefined) {
            user.phone = updateUserDto.phone;
        }
        if (updateUserDto.avatar !== undefined) {
            user.avatar = updateUserDto.avatar;
        }
        if (updateUserDto.bio !== undefined) {
            user.bio = updateUserDto.bio;
        }
        await user.save();
        return this.toUserResponse(user);
    }
    async getProfile(userId) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return this.toUserResponse(user);
    }
    async getUserByEmail(email) {
        const user = await this.userModel.findOne({ email: email.toLowerCase() });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return this.toUserResponse(user);
    }
    async changePassword(userId, changePasswordDto) {
        const user = await this.userModel.findById(userId).select('+password');
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const isCurrentPasswordValid = await bcrypt.compare(changePasswordDto.currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            throw new common_1.UnauthorizedException('Current password is incorrect');
        }
        if (changePasswordDto.currentPassword === changePasswordDto.newPassword) {
            throw new common_1.BadRequestException('New password cannot be the same as current password');
        }
        if (changePasswordDto.newPassword.length < 6) {
            throw new common_1.BadRequestException('Password must be at least 6 characters');
        }
        const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
        user.password = hashedPassword;
        user.lastPasswordChange = new Date();
        await user.save();
        return new user_dto_1.SuccessResponseDto('Password changed successfully');
    }
    async deactivateUser(userId) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        user.isActive = false;
        await user.save();
        return this.toUserResponse(user);
    }
    async checkEmailExists(email) {
        const user = await this.userModel.findOne({ email: email.toLowerCase() });
        return { exists: !!user };
    }
    async deleteAccount(userId) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        user.isActive = false;
        await user.save();
        return new user_dto_1.SuccessResponseDto('Account deleted successfully');
    }
    async validateUser(userId) {
        const user = await this.userModel.findById(userId);
        if (!user || !user.isActive) {
            return null;
        }
        return user;
    }
    async findById(userId) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return this.toUserResponse(user);
    }
    toUserResponse(user) {
        const userObj = user.toObject();
        return new user_dto_1.UserResponseDto({
            id: userObj._id.toString(),
            email: userObj.email,
            name: userObj.name,
            isActive: userObj.isActive,
            isVerified: userObj.isVerified,
            phone: userObj.phone,
            avatar: userObj.avatar,
            bio: userObj.bio,
            createdAt: userObj.createdAt,
            updatedAt: userObj.updatedAt,
        });
    }
    generateToken(userId) {
        return this.jwtService.sign({ id: userId }, {
            secret: process.env.JWT_SECRET || 'default-secret',
            expiresIn: '15m',
        });
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        jwt_1.JwtService])
], UserService);
//# sourceMappingURL=user.service.js.map