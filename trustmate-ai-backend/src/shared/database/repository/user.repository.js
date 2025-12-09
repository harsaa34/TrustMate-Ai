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
exports.UserRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../../../user/schemas/user.schema");
const user_mapper_1 = require("../mapper/user.mapper");
class UserNotFoundError extends Error {
    constructor(message = 'User not found') {
        super(message);
        this.name = 'UserNotFoundError';
    }
}
class UserAlreadyExistsError extends Error {
    constructor(message = 'User already exists') {
        super(message);
        this.name = 'UserAlreadyExistsError';
    }
}
let UserRepository = class UserRepository {
    userModel;
    constructor(userModel) {
        this.userModel = userModel;
    }
    async findByEmail(email) {
        try {
            const user = await this.userModel
                .findOne({ email: email.toLowerCase().trim() })
                .exec();
            return user_mapper_1.UserMapper.toDomain(user);
        }
        catch (error) {
            throw error;
        }
    }
    async findById(id) {
        try {
            const user = await this.userModel.findById(id).exec();
            if (!user) {
                throw new UserNotFoundError(id);
            }
            const domain = user_mapper_1.UserMapper.toDomain(user);
            if (!domain) {
                throw new UserNotFoundError(id);
            }
            return domain;
        }
        catch (error) {
            throw error;
        }
    }
    async save(user) {
        try {
            const entity = user_mapper_1.UserMapper.toEntity(user);
            const saved = await this.userModel
                .findByIdAndUpdate(user.id, entity, { new: true })
                .exec();
            const domain = user_mapper_1.UserMapper.toDomain(saved);
            if (!domain) {
                throw new Error('Failed to convert saved user to domain');
            }
            return domain;
        }
        catch (error) {
            throw error;
        }
    }
    async existsByEmail(email) {
        try {
            const count = await this.userModel
                .countDocuments({ email: email.toLowerCase().trim() })
                .exec();
            return count > 0;
        }
        catch {
            return false;
        }
    }
    async create(user) {
        try {
            const exists = await this.existsByEmail(user.email);
            if (exists) {
                throw new UserAlreadyExistsError(user.email);
            }
            const entity = user_mapper_1.UserMapper.toEntity(user);
            const created = await this.userModel.create(entity);
            const domain = user_mapper_1.UserMapper.toDomain(created);
            if (!domain) {
                throw new Error('Failed to convert created user to domain');
            }
            return domain;
        }
        catch (error) {
            throw error;
        }
    }
    async findOne(conditions) {
        try {
            return await this.userModel.findOne(conditions).exec();
        }
        catch (error) {
            throw error;
        }
    }
    async findAll() {
        try {
            const users = await this.userModel
                .find()
                .sort({ createdAt: -1 })
                .exec();
            return user_mapper_1.UserMapper.toDomains(users);
        }
        catch (error) {
            throw error;
        }
    }
    async deactivate(id) {
        try {
            const user = await this.userModel.findById(id).exec();
            if (!user) {
                throw new UserNotFoundError(id);
            }
            user.isActive = false;
            user.updatedAt = new Date();
            const updated = await user.save();
            const domain = user_mapper_1.UserMapper.toDomain(updated);
            if (!domain) {
                throw new Error('Failed to convert deactivated user to domain');
            }
            return domain;
        }
        catch (error) {
            throw error;
        }
    }
    async update(id, updateData) {
        try {
            const updated = await this.userModel
                .findByIdAndUpdate(id, updateData, { new: true })
                .exec();
            if (!updated) {
                throw new UserNotFoundError(id);
            }
            const domain = user_mapper_1.UserMapper.toDomain(updated);
            if (!domain) {
                throw new Error('Failed to convert updated user to domain');
            }
            return domain;
        }
        catch (error) {
            throw error;
        }
    }
};
exports.UserRepository = UserRepository;
exports.UserRepository = UserRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UserRepository);
//# sourceMappingURL=user.repository.js.map