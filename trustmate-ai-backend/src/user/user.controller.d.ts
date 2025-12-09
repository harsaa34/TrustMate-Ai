import { LoginDto } from 'src/auth/auth.dto';
import { CreateUserDto, UserResponseDto, SuccessResponseDto, LoginResponseDto } from './user.dto';
import { UserService } from './user.service';
interface AuthenticatedRequest {
    user: {
        id: string;
        _id?: string;
        email?: string;
        [key: string]: unknown;
    };
}
export declare class UserController {
    private _userService;
    constructor(_userService: UserService);
    register(data: CreateUserDto): Promise<UserResponseDto>;
    login(data: LoginDto): Promise<LoginResponseDto>;
    getProfile(req: AuthenticatedRequest): Promise<UserResponseDto>;
    updateProfile(req: AuthenticatedRequest, data: {
        name?: string;
        phone?: string;
        avatar?: string;
        bio?: string;
    }): Promise<UserResponseDto>;
    deleteAccount(req: AuthenticatedRequest): Promise<SuccessResponseDto>;
    changePassword(req: AuthenticatedRequest, data: {
        currentPassword: string;
        newPassword: string;
    }): Promise<SuccessResponseDto>;
    deactivateOwnAccount(req: AuthenticatedRequest): Promise<SuccessResponseDto>;
}
export {};
