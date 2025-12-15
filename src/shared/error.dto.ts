// src/shared/dtos/error.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// Base error DTO for all error responses
export class ErrorResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error message',
    example: 'Invalid input data',
  })
  message: string;

  @ApiProperty({
    description: 'Error type',
    example: 'Bad Request',
  })
  error: string;

  @ApiPropertyOptional({
    description: 'Timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  timestamp?: string;

  @ApiPropertyOptional({
    description: 'Request path',
    example: '/api/groups/groupId/settlements',
  })
  path?: string;
}

// Specific error DTOs that match your error classes
export class UserAlreadyExistsErrorDto extends ErrorResponseDto {
  @ApiProperty({
    example: 409,
    description: 'HTTP status code',
  })
  statusCode: number = 409;

  @ApiProperty({
    example: 'User with email user@example.com already exists',
    description: 'Error message',
  })
  message: string = 'User already exists';

  @ApiProperty({
    example: 'Conflict',
    description: 'Error type',
  })
  error: string = 'Conflict';
}

export class InvalidCredentialsErrorDto extends ErrorResponseDto {
  @ApiProperty({
    example: 401,
    description: 'HTTP status code',
  })
  statusCode: number = 401;

  @ApiProperty({
    example: 'Invalid email or password',
    description: 'Error message',
  })
  message: string = 'Invalid credentials';

  @ApiProperty({
    example: 'Unauthorized',
    description: 'Error type',
  })
  error: string = 'Unauthorized';
}

export class UserNotFoundErrorDto extends ErrorResponseDto {
  @ApiProperty({
    example: 404,
    description: 'HTTP status code',
  })
  statusCode: number = 404;

  @ApiProperty({
    example: 'User not found',
    description: 'Error message',
  })
  message: string = 'User not found';

  @ApiProperty({
    example: 'Not Found',
    description: 'Error type',
  })
  error: string = 'Not Found';
}

export class InvalidTokenErrorDto extends ErrorResponseDto {
  @ApiProperty({
    example: 400,
    description: 'HTTP status code',
  })
  statusCode: number = 400;

  @ApiProperty({
    example: 'Invalid or expired token',
    description: 'Error message',
  })
  message: string = 'Invalid token';

  @ApiProperty({
    example: 'Bad Request',
    description: 'Error type',
  })
  error: string = 'Bad Request';
}

export class PasswordValidationErrorDto extends ErrorResponseDto {
  @ApiProperty({
    example: 400,
    description: 'HTTP status code',
  })
  statusCode: number = 400;

  @ApiProperty({
    example: 'Password must contain uppercase, lowercase, and number',
    description: 'Error message',
  })
  message: string = 'Password validation failed';

  @ApiProperty({
    example: 'Bad Request',
    description: 'Error type',
  })
  error: string = 'Bad Request';
}

export class AccountDeactivatedErrorDto extends ErrorResponseDto {
  @ApiProperty({
    example: 403,
    description: 'HTTP status code',
  })
  statusCode: number = 403;

  @ApiProperty({
    example: 'Your account has been deactivated',
    description: 'Error message',
  })
  message: string = 'Account deactivated';

  @ApiProperty({
    example: 'Forbidden',
    description: 'Error type',
  })
  error: string = 'Forbidden';
}

export class UserNotActiveErrorDto extends ErrorResponseDto {
  @ApiProperty({
    example: 403,
    description: 'HTTP status code',
  })
  statusCode: number = 403;

  @ApiProperty({
    example: 'User account is not active',
    description: 'Error message',
  })
  message: string = 'User not active';

  @ApiProperty({
    example: 'Forbidden',
    description: 'Error type',
  })
  error: string = 'Forbidden';
}

export class InsufficientPermissionsErrorDto extends ErrorResponseDto {
  @ApiProperty({
    example: 403,
    description: 'HTTP status code',
  })
  statusCode: number = 403;

  @ApiProperty({
    example: 'Insufficient permissions',
    description: 'Error message',
  })
  message: string = 'Insufficient permissions';

  @ApiProperty({
    example: 'Forbidden',
    description: 'Error type',
  })
  error: string = 'Forbidden';
}