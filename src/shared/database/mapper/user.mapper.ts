// src/shared/database/mapper/user.mapper.ts - FIXED
import { UserDocument } from '../../../user/schemas/user.schema';
import { UserDomain } from '../../../user/user.domain';
import { UserResponseDto } from '../../../user/user.dto';

export class UserMapper {
  static toDomain(userDoc: UserDocument | null): UserDomain | null {
    if (!userDoc) return null;
    
    // Use type assertion to access properties
    const userObj = userDoc.toObject();
    
    return UserDomain.fromPersistence({
      id: userObj._id.toString(),
      email: userObj.email,
      name: userObj.name,
      password: userObj.password,
      // CHECK: role field might not exist in your schema
      // Use optional chaining and provide default
      role: (userObj as any).role || 'user', // Type assertion and default
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
      // Use type assertion for timestamps
      createdAt: (userObj as any).createdAt,
      updatedAt: (userObj as any).updatedAt,
      deletedAt: userObj.deletedAt,
    });
  }

  static toResponseDto(user: UserDomain): UserResponseDto {
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role, // Keep in response
      isActive: user.isActive,
      isVerified: user.isVerified,
      phone: user.phone,
      createdAt: user.getCreatedAt() || new Date(),
      updatedAt: user.getUpdatedAt() || new Date(),
    };
    
    return new UserResponseDto(userData);
  }

  static toDomains(userDocs: UserDocument[]): UserDomain[] {
    return userDocs
      .map(user => this.toDomain(user))
      .filter(Boolean) as UserDomain[];
  }

  static toEntity(user: UserDomain): any {
    return {
      email: user.email,
      name: user.name,
      password: user.getPassword(),
      role: user.role, // Keep in entity
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