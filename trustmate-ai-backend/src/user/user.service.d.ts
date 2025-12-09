import { Model } from 'mongoose';
import { UserDocument } from './schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto, UpdateUserDto, ChangePasswordDto, UserResponseDto, LoginResponseDto, SuccessResponseDto } from './user.dto';
import { LoginDto } from 'src/auth/auth.dto';
export declare class UserService {
    private userModel;
    private jwtService;
    constructor(userModel: Model<UserDocument>, jwtService: JwtService);
    register(createUserDto: CreateUserDto): Promise<UserResponseDto>;
    login(loginDto: LoginDto): Promise<LoginResponseDto>;
    updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto>;
    getProfile(userId: string): Promise<UserResponseDto>;
    getUserByEmail(email: string): Promise<UserResponseDto>;
    changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<SuccessResponseDto>;
    deactivateUser(userId: string): Promise<UserResponseDto>;
    checkEmailExists(email: string): Promise<{
        exists: boolean;
    }>;
    deleteAccount(userId: string): Promise<SuccessResponseDto>;
    validateUser(userId: string): Promise<any>;
    findById(userId: string): Promise<UserResponseDto>;
    private toUserResponse;
    private generateToken;
}
