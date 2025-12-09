"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
exports.Api = Api;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
function Api(options) {
    const decorators = [];
    switch (options.verb) {
        case 'GET':
            decorators.push((0, common_1.Get)(options.path));
            break;
        case 'POST':
            decorators.push((0, common_1.Post)(options.path));
            break;
        case 'PUT':
            decorators.push((0, common_1.Put)(options.path));
            break;
        case 'DELETE':
            decorators.push((0, common_1.Delete)(options.path));
            break;
        case 'PATCH':
            decorators.push((0, common_1.Patch)(options.path));
            break;
    }
    const httpCode = options.httpCode ||
        (options.verb === 'POST' ? common_1.HttpStatus.CREATED : common_1.HttpStatus.OK);
    decorators.push((0, common_1.HttpCode)(httpCode));
    if (options.description) {
        decorators.push((0, swagger_1.ApiOperation)({
            description: options.description,
            summary: options.description
        }));
    }
    if (options.params && options.params.length > 0) {
        options.params.forEach(param => {
            decorators.push((0, swagger_1.ApiParam)({
                name: param.name,
                description: param.description,
                required: true
            }));
        });
    }
    if (options.requestBody) {
        decorators.push((0, swagger_1.ApiBody)({
            type: options.requestBody,
            required: true
        }));
    }
    if (options.consumes && options.consumes.length > 0) {
        decorators.push((0, swagger_1.ApiConsumes)(...options.consumes));
    }
    if (options.produces && options.produces.length > 0) {
        decorators.push((0, swagger_1.ApiProduces)(...options.produces));
    }
    decorators.push((0, swagger_1.ApiResponse)({
        status: httpCode,
        description: 'Success',
        type: options.swaggerSuccessResponse,
    }));
    if (options.swaggerRequestErrors && options.swaggerRequestErrors.length > 0) {
        options.swaggerRequestErrors.forEach(ErrorClass => {
            const errorInstance = new ErrorClass();
            decorators.push((0, swagger_1.ApiResponse)({
                status: errorInstance.statusCode || 400,
                description: errorInstance.message || 'Error occurred',
                type: ErrorClass
            }));
        });
    }
    decorators.push((0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or missing token'
    }));
    if (!options.isPublic) {
        decorators.push((0, swagger_1.ApiResponse)({
            status: 403,
            description: 'Forbidden - Insufficient permissions'
        }));
    }
    if (!options.isPublic) {
        decorators.push((0, swagger_1.ApiBearerAuth)('JWT-auth'));
    }
    return (0, common_1.applyDecorators)(...decorators);
}
exports.User = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
});
//# sourceMappingURL=api.decorator.js.map