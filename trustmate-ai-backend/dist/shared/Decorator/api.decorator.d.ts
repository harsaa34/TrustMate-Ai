import { HttpStatus } from '@nestjs/common';
interface ApiOptions {
    isPublic?: boolean;
    verb: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    path?: string;
    swaggerSuccessResponse: any;
    swaggerRequestErrors?: any[];
    description?: string;
    httpCode?: HttpStatus;
    requestBody?: any;
    params?: Array<{
        name: string;
        description?: string;
    }>;
    consumes?: string[];
    produces?: string[];
}
export declare function Api(options: ApiOptions): MethodDecorator & ClassDecorator;
export declare const User: (...dataOrPipes: (string | import("@nestjs/common").PipeTransform<any, any> | import("@nestjs/common").Type<import("@nestjs/common").PipeTransform<any, any>>)[]) => ParameterDecorator;
export {};
