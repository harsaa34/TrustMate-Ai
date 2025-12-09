import { Model } from 'mongoose';
import { UserDocument } from '../../../user/schemas/user.schema';
import { UserDomain } from '../../../user/user.domain';
export interface IAuthRepository {
    create(user: UserDomain): Promise<UserDomain>;
    findByEmail(email: string): Promise<UserDomain | null>;
    findById(id: string): Promise<UserDomain | null>;
    findByResetToken(token: string): Promise<UserDomain | null>;
    findByVerificationToken(token: string): Promise<UserDomain | null>;
    findByRefreshToken(token: string): Promise<UserDomain | null>;
    save(user: UserDomain): Promise<UserDomain>;
    updatePassword(userId: string, hashedPassword: string): Promise<void>;
    updateLoginInfo(userId: string, lastLogin: Date): Promise<void>;
    updateVerificationStatus(userId: string, isVerified: boolean): Promise<void>;
    updateResetToken(userId: string, token: string | null, expiresAt?: Date): Promise<void>;
    updateRefreshToken(userId: string, token: string | null): Promise<void>;
    existsByEmail(email: string): Promise<boolean>;
}
export declare class AuthRepository implements IAuthRepository {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    create(user: UserDomain): Promise<UserDomain>;
    findByEmail(email: string): Promise<UserDomain | null>;
    findById(id: string): Promise<UserDomain | null>;
    findByResetToken(token: string): Promise<UserDomain | null>;
    findByVerificationToken(token: string): Promise<UserDomain | null>;
    findByRefreshToken(token: string): Promise<UserDomain | null>;
    save(user: UserDomain): Promise<UserDomain>;
    updatePassword(userId: string, hashedPassword: string): Promise<void>;
    updateLoginInfo(userId: string, lastLogin: Date): Promise<void>;
    updateVerificationStatus(userId: string, isVerified: boolean): Promise<void>;
    updateResetToken(userId: string, token: string | null, expiresAt?: Date): Promise<void>;
    updateRefreshToken(userId: string, token: string | null): Promise<void>;
    existsByEmail(email: string): Promise<boolean>;
    findAll(): Promise<UserDomain[]>;
    softDelete(userId: string): Promise<void>;
}
