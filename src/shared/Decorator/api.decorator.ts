// src/shared/Decorator/api.decorator.ts - ENHANCED VERSION
import { 
  applyDecorators, 
  HttpCode, 
  HttpStatus, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Patch, 
  createParamDecorator, 
  ExecutionContext 
} from '@nestjs/common';
import { 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth, 
  ApiParam,
  ApiBody,
  ApiConsumes,
  ApiProduces 
} from '@nestjs/swagger';

interface ApiOptions {
  isPublic?: boolean;
  verb: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path?: string;
  swaggerSuccessResponse: any;
  swaggerRequestErrors?: any[];
  description?: string;
  httpCode?: HttpStatus;
  requestBody?: any; // Add this for request body schemas
  params?: Array<{ name: string; description?: string }>; // Add this for path params
  consumes?: string[]; // Add this for content types
  produces?: string[]; // Add this for response content types
}

export function Api(options: ApiOptions): MethodDecorator & ClassDecorator {
  const decorators: (MethodDecorator | ClassDecorator | PropertyDecorator)[] = [];
  
  // Add HTTP method decorator based on verb
  switch (options.verb) {
    case 'GET':
      decorators.push(Get(options.path));
      break;
    case 'POST':
      decorators.push(Post(options.path));
      break;
    case 'PUT':
      decorators.push(Put(options.path));
      break;
    case 'DELETE':
      decorators.push(Delete(options.path));
      break;
    case 'PATCH':
      decorators.push(Patch(options.path));
      break;
  }

  // Add HTTP status code
  const httpCode = options.httpCode || 
    (options.verb === 'POST' ? HttpStatus.CREATED : HttpStatus.OK);
  decorators.push(HttpCode(httpCode));

  // Add Swagger operation description
  if (options.description) {
    decorators.push(ApiOperation({ 
      description: options.description,
      summary: options.description 
    }));
  }

  // Add path parameters
  if (options.params && options.params.length > 0) {
    options.params.forEach(param => {
      decorators.push(ApiParam({
        name: param.name,
        description: param.description,
        required: true
      }));
    });
  }

  // Add request body
  if (options.requestBody) {
    decorators.push(ApiBody({
      type: options.requestBody,
      required: true
    }));
  }

  // Add content types
  if (options.consumes && options.consumes.length > 0) {
    decorators.push(ApiConsumes(...options.consumes));
  }
  
  if (options.produces && options.produces.length > 0) {
    decorators.push(ApiProduces(...options.produces));
  }

  // Add Swagger success response
  decorators.push(
    ApiResponse({
      status: httpCode,
      description: 'Success',
      type: options.swaggerSuccessResponse,
    })
  );

  // Add Swagger error responses
  if (options.swaggerRequestErrors && options.swaggerRequestErrors.length > 0) {
    options.swaggerRequestErrors.forEach(ErrorClass => {
      // Create instance to get status code
      const errorInstance = new (ErrorClass as any)();
      decorators.push(
        ApiResponse({
          status: errorInstance.statusCode || 400,
          description: errorInstance.message || 'Error occurred',
          type: ErrorClass
        })
      );
    });
  }

  // Add default error responses
  decorators.push(
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid or missing token'
    })
  );
  
  if (!options.isPublic) {
    decorators.push(ApiResponse({
      status: 403,
      description: 'Forbidden - Insufficient permissions'
    }));
  }

  // Add Bearer Auth if not public
  if (!options.isPublic) {
    decorators.push(ApiBearerAuth('JWT-auth'));
  }

  return applyDecorators(...(decorators as any));
}

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    
    return data ? user?.[data] : user;
  },
);