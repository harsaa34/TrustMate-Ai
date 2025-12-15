// src/user/user.controller.ts - SIMPLIFIED (NO ROLES)
import {
  Body,
  Controller,
  Param,
  Request,
  UseGuards,
  Post,
  Get,
  Put,
  Delete,
} from '@nestjs/common';
import { LoginDto } from 'src/auth/auth.dto';
import { Api } from '../shared/Decorator/api.decorator';
import {
  CreateUserDto,
  UserResponseDto,
  SuccessResponseDto,
  LoginResponseDto,
} from './user.dto';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

// Define request interface - REMOVE ROLE
interface AuthenticatedRequest {
  user: {
    id: string;
    _id?: string;
    email?: string;
    // REMOVE: role?: Role;
    [key: string]: unknown;
  };
}

// Define your errors locally
class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400,
    public code?: string,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

class UserNotFoundError extends AppError {
  constructor(message = 'User not found') {
    super(message, 404, 'USER_NOT_FOUND');
    this.name = 'UserNotFoundError';
  }
}

class UserAlreadyExistsError extends AppError {
  constructor(message = 'User already exists') {
    super(message, 409, 'USER_ALREADY_EXISTS');
    this.name = 'UserAlreadyExistsError';
  }
}

class InvalidCredentialsError extends AppError {
  constructor(message = 'Invalid credentials') {
    super(message, 401, 'INVALID_CREDENTIALS');
    this.name = 'InvalidCredentialsError';
  }
}

class UserNotActiveError extends AppError {
  constructor(message = 'User account is not active') {
    super(message, 403, 'USER_NOT_ACTIVE');
    this.name = 'UserNotActiveError';
  }
}

@Controller('users')
export class UserController {
  constructor(private _userService: UserService) {}

  @Post('register')
  @Api({
    isPublic: true,
    verb: 'POST',
    path: 'register',
    swaggerSuccessResponse: UserResponseDto,
    swaggerRequestErrors: [UserAlreadyExistsError],
    description: 'Register a new user',
  })
  async register(@Body() data: CreateUserDto): Promise<UserResponseDto> {
    const result = await this._userService.register(data);
    if (result instanceof AppError) {
      throw result;
    }
    return result;
  }

  @Post('login')
  @Api({
    isPublic: true,
    verb: 'POST',
    path: 'login',
    swaggerSuccessResponse: LoginResponseDto,
    swaggerRequestErrors: [InvalidCredentialsError, UserNotActiveError],
    description: 'User login',
  })
  async login(@Body() data: LoginDto): Promise<LoginResponseDto> {
    const result = await this._userService.login(data);
    if (result instanceof AppError) {
      throw result;
    }
    return result;
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @Api({
    isPublic: false,
    verb: 'GET',
    path: 'profile',
    swaggerSuccessResponse: UserResponseDto,
    swaggerRequestErrors: [UserNotFoundError],
    description: 'Get current user profile',
  })
  async getProfile(@Request() req: AuthenticatedRequest): Promise<UserResponseDto> {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      throw new InvalidCredentialsError('User not authenticated');
    }
    const result = await this._userService.getProfile(userId);
    if (result instanceof AppError) {
      throw result;
    }
    return result;
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  @Api({
    isPublic: false,
    verb: 'PUT',
    path: 'profile',
    swaggerSuccessResponse: UserResponseDto,
    swaggerRequestErrors: [UserNotFoundError],
    description: 'Update own profile',
  })
  async updateProfile(
    @Request() req: AuthenticatedRequest,
    @Body() data: { name?: string; phone?: string; avatar?: string; bio?: string }
  ): Promise<UserResponseDto> {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      throw new InvalidCredentialsError('User not authenticated');
    }

    const result = await this._userService.updateUser(userId, data);
    if (result instanceof AppError) {
      throw result;
    }

    return result;
  }

  @Delete('profile')
  @UseGuards(JwtAuthGuard)
  @Api({
    isPublic: false,
    verb: 'DELETE',
    path: 'profile',
    swaggerSuccessResponse: SuccessResponseDto,
    swaggerRequestErrors: [UserNotFoundError],
    description: 'Delete own account',
  })
  async deleteAccount(@Request() req: AuthenticatedRequest): Promise<SuccessResponseDto> {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      throw new InvalidCredentialsError('User not authenticated');
    }
    
    const result = await this._userService.deleteAccount(userId);
    if (result instanceof AppError) {
      throw result;
    }
    
    return new SuccessResponseDto('Account deleted successfully');
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @Api({
    isPublic: false,
    verb: 'POST',
    path: 'change-password',
    swaggerSuccessResponse: SuccessResponseDto,
    swaggerRequestErrors: [UserNotFoundError, InvalidCredentialsError],
    description: 'Change own password',
  })
  async changePassword(
    @Request() req: AuthenticatedRequest,
    @Body() data: { currentPassword: string; newPassword: string }
  ): Promise<SuccessResponseDto> {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      throw new InvalidCredentialsError('User not authenticated');
    }
    
    const result = await this._userService.changePassword(userId, data);
    if (result instanceof AppError) {
      throw result;
    }
    
    return new SuccessResponseDto('Password changed successfully');
  }

  @Delete('deactivate')
  @UseGuards(JwtAuthGuard)
  @Api({
    isPublic: false,
    verb: 'DELETE',
    path: 'deactivate',
    swaggerSuccessResponse: SuccessResponseDto,
    swaggerRequestErrors: [UserNotFoundError],
    description: 'Deactivate own account',
  })
  async deactivateOwnAccount(@Request() req: AuthenticatedRequest): Promise<SuccessResponseDto> {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      throw new InvalidCredentialsError('User not authenticated');
    }
    const result = await this._userService.deactivateUser(userId);
    if (result instanceof AppError) {
      throw result;
    }
    return new SuccessResponseDto('Account deactivated successfully');
  }
}