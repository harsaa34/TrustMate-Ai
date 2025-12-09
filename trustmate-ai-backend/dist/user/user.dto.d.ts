export declare class CreateUserDto {
    email: string;
    password: string;
    name: string;
    phone?: string;
}
export declare class UpdateUserDto {
    name?: string;
    phone?: string;
    avatar?: string;
    bio?: string;
}
export declare class ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
}
export declare class UserResponseDto {
    id: string;
    email: string;
    name: string;
    isActive: boolean;
    isVerified: boolean;
    phone?: string;
    avatar?: string;
    bio?: string;
    createdAt: Date;
    updatedAt: Date;
    constructor(data: any);
}
export declare class LoginResponseDto {
    token: string;
    user: UserResponseDto;
    refreshToken?: string;
    constructor(token: string, user: UserResponseDto, refreshToken?: string);
}
export declare class SuccessResponseDto {
    message: string;
    constructor(message: string);
}
