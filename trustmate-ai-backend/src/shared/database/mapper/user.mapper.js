"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMapper = void 0;
const user_domain_1 = require("../../../user/user.domain");
const user_dto_1 = require("../../../user/user.dto");
class UserMapper {
    static toDomain(userDoc) {
        if (!userDoc)
            return null;
        const userObj = userDoc.toObject();
        return user_domain_1.UserDomain.fromPersistence({
            id: userObj._id.toString(),
            email: userObj.email,
            name: userObj.name,
            password: userObj.password,
            role: userObj.role || 'user',
            isActive: userObj.isActive,
            isVerified: userObj.isVerified,
            phone: userObj.phone,
            avatar: userObj.avatar,
            bio: userObj.bio,
            refreshToken: userObj.refreshToken,
            resetPasswordToken: userObj.resetPasswordToken,
            resetPasswordExpires: userObj.resetPasswordExpires,
            verificationToken: userObj.verificationToken,
            verificationTokenExpires: userObj.verificationTokenExpires,
            emailVerifiedAt: userObj.emailVerifiedAt,
            lastLogin: userObj.lastLogin,
            lastPasswordChange: userObj.lastPasswordChange,
            createdAt: userObj.createdAt,
            updatedAt: userObj.updatedAt,
            deletedAt: userObj.deletedAt,
        });
    }
    static toResponseDto(user) {
        const userData = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            isActive: user.isActive,
            isVerified: user.isVerified,
            phone: user.phone,
            createdAt: user.getCreatedAt() || new Date(),
            updatedAt: user.getUpdatedAt() || new Date(),
        };
        return new user_dto_1.UserResponseDto(userData);
    }
    static toDomains(userDocs) {
        return userDocs
            .map(user => this.toDomain(user))
            .filter(Boolean);
    }
    static toEntity(user) {
        return {
            email: user.email,
            name: user.name,
            password: user.getPassword(),
            role: user.role,
            isActive: user.isActive,
            isVerified: user.isVerified,
            phone: user.phone,
            refreshToken: user.getRefreshToken(),
            resetPasswordToken: user.getResetPasswordToken(),
            resetPasswordExpires: user.getResetPasswordExpires(),
            verificationToken: user.getVerificationToken(),
            verificationTokenExpires: user.getVerificationTokenExpires(),
            emailVerifiedAt: user.getEmailVerifiedAt(),
            lastLogin: user.getLastLogin(),
            lastPasswordChange: user.getLastPasswordChange(),
            createdAt: user.getCreatedAt(),
            updatedAt: user.getUpdatedAt(),
            deletedAt: user.getDeletedAt(),
        };
    }
}
exports.UserMapper = UserMapper;
//# sourceMappingURL=user.mapper.js.map