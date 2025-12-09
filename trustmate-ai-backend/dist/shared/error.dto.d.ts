export declare class ErrorResponseDto {
    statusCode: number;
    message: string;
    error: string;
    timestamp?: string;
    path?: string;
}
export declare class UserAlreadyExistsErrorDto extends ErrorResponseDto {
    statusCode: number;
    message: string;
    error: string;
}
export declare class InvalidCredentialsErrorDto extends ErrorResponseDto {
    statusCode: number;
    message: string;
    error: string;
}
export declare class UserNotFoundErrorDto extends ErrorResponseDto {
    statusCode: number;
    message: string;
    error: string;
}
export declare class InvalidTokenErrorDto extends ErrorResponseDto {
    statusCode: number;
    message: string;
    error: string;
}
export declare class PasswordValidationErrorDto extends ErrorResponseDto {
    statusCode: number;
    message: string;
    error: string;
}
export declare class AccountDeactivatedErrorDto extends ErrorResponseDto {
    statusCode: number;
    message: string;
    error: string;
}
export declare class UserNotActiveErrorDto extends ErrorResponseDto {
    statusCode: number;
    message: string;
    error: string;
}
export declare class InsufficientPermissionsErrorDto extends ErrorResponseDto {
    statusCode: number;
    message: string;
    error: string;
}
