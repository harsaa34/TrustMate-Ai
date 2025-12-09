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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../../../user/schemas/user.schema");
const user_mapper_1 = require("../../database/mapper/user.mapper");
let AuthRepository = class AuthRepository {
    userModel;
    constructor(userModel) {
        this.userModel = userModel;
    }
    async create(user) {
        const userData = user_mapper_1.UserMapper.toEntity(user);
        const createdUser = await this.userModel.create(userData);
        const domain = user_mapper_1.UserMapper.toDomain(createdUser);
        if (!domain) {
            throw new Error('Failed to create user domain');
        }
        return domain;
    }
    async findByEmail(email) {
        const user = await this.userModel
            .findOne({ email: email.toLowerCase().trim() })
            .select('+password +refreshToken +resetPasswordToken +verificationToken')
            .exec();
        return user ? user_mapper_1.UserMapper.toDomain(user) : null;
    }
    async findById(id) {
        const user = await this.userModel
            .findById(id)
            .select('+refreshToken +resetPasswordToken +verificationToken')
            .exec();
        return user ? user_mapper_1.UserMapper.toDomain(user) : null;
    }
    async findByResetToken(token) {
        const user = await this.userModel
            .findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: new Date() },
        })
            .select('+password +resetPasswordToken +resetPasswordExpires')
            .exec();
        return user ? user_mapper_1.UserMapper.toDomain(user) : null;
    }
    async findByVerificationToken(token) {
        const user = await this.userModel
            .findOne({
            verificationToken: token,
            verificationTokenExpires: { $gt: new Date() },
        })
            .select('+verificationToken +verificationTokenExpires')
            .exec();
        return user ? user_mapper_1.UserMapper.toDomain(user) : null;
    }
    async findByRefreshToken(token) {
        const user = await this.userModel
            .findOne({ refreshToken: token })
            .select('+refreshToken')
            .exec();
        return user ? user_mapper_1.UserMapper.toDomain(user) : null;
    }
    async save(user) {
        const userData = user_mapper_1.UserMapper.toEntity(user);
        const updatedUser = await this.userModel
            .findByIdAndUpdate(user.id, userData, { new: true })
            .select('+password +refreshToken +resetPasswordToken +verificationToken')
            .exec();
        if (!updatedUser) {
            throw new Error(`User with ID ${user.id} not found`);
        }
        const domain = user_mapper_1.UserMapper.toDomain(updatedUser);
        if (!domain) {
            throw new Error('Failed to convert updated user to domain');
        }
        return domain;
    }
    async updatePassword(userId, hashedPassword) {
        await this.userModel
            .findByIdAndUpdate(userId, {
            password: hashedPassword,
            lastPasswordChange: new Date(),
            resetPasswordToken: null,
            resetPasswordExpires: null,
        })
            .exec();
    }
    async updateLoginInfo(userId, lastLogin) {
        await this.userModel
            .findByIdAndUpdate(userId, {
            lastLogin,
        })
            .exec();
    }
    async updateVerificationStatus(userId, isVerified) {
        await this.userModel
            .findByIdAndUpdate(userId, {
            isVerified,
            verificationToken: null,
            verificationTokenExpires: null,
            emailVerifiedAt: isVerified ? new Date() : null,
        })
            .exec();
    }
    async updateResetToken(userId, token, expiresAt) {
        await this.userModel
            .findByIdAndUpdate(userId, {
            resetPasswordToken: token,
            resetPasswordExpires: expiresAt || (token ? new Date(Date.now() + 3600000) : null),
        })
            .exec();
    }
    async updateRefreshToken(userId, token) {
        await this.userModel
            .findByIdAndUpdate(userId, {
            refreshToken: token,
            lastLogout: token ? null : new Date(),
        })
            .exec();
    }
    async existsByEmail(email) {
        const count = await this.userModel
            .countDocuments({ email: email.toLowerCase().trim() })
            .exec();
        return count > 0;
    }
    async findAll() {
        const users = await this.userModel.find().exec();
        const domains = users
            .map((user) => user_mapper_1.UserMapper.toDomain(user))
            .filter(Boolean);
        return domains;
    }
    async softDelete(userId) {
        await this.userModel
            .findByIdAndUpdate(userId, {
            isActive: false,
            email: `deleted_${Date.now()}_${userId}@deleted.com`,
            deletedAt: new Date(),
        })
            .exec();
    }
};
exports.AuthRepository = AuthRepository;
exports.AuthRepository = AuthRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], AuthRepository);
//# sourceMappingURL=auth.repository.js.map