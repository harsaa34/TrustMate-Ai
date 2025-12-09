"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    console.log('🚀 Starting NestJS application...');
    try {
        const app = await core_1.NestFactory.create(app_module_1.AppModule);
        console.log('✅ App created successfully');
        app.enableCors({
            origin: ['http://localhost:5173', 'http://localhost:3000'],
            credentials: true,
        });
        console.log('✅ CORS enabled');
        app.useGlobalPipes(new common_1.ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
            validationError: {
                target: false,
                value: false,
            },
        }));
        console.log('✅ Validation pipe configured');
        app.setGlobalPrefix('api');
        console.log('✅ Global prefix set to /api');
        console.log('📚 Setting up Swagger...');
        const config = new swagger_1.DocumentBuilder()
            .setTitle('TrustMate AI - Expense Tracker API')
            .setDescription('Complete API for managing groups, expenses, and settlements between friends')
            .setVersion('1.0')
            .addBearerAuth({
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            name: 'JWT',
            description: 'Enter JWT token',
            in: 'header',
        }, 'JWT-auth')
            .addTag('Authentication', 'User authentication and authorization')
            .addTag('Users', 'User management operations')
            .addTag('Groups', 'Group management operations')
            .addTag('Expenses', 'Expense tracking operations')
            .addTag('Settlements', 'Settlement operations')
            .addServer('http://localhost:3000/api', 'Local development server')
            .addServer('https://api.trustmate.ai/api', 'Production server')
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup('api/docs', app, document, {
            swaggerOptions: {
                persistAuthorization: true,
                tagsSorter: 'alpha',
                operationsSorter: 'alpha',
                docExpansion: 'list',
                filter: true,
                tryItOutEnabled: true,
                showRequestDuration: true,
            },
            customSiteTitle: 'TrustMate AI API Documentation',
            customCss: `
        .swagger-ui .topbar { display: none }
        .swagger-ui .info { margin: 20px 0; }
        .swagger-ui .scheme-container { margin: 20px 0; }
      `,
        });
        console.log('✅ Swagger setup complete');
        const port = process.env.PORT || 3000;
        console.log(`🌐 Starting server on port ${port}...`);
        await app.listen(port);
        console.log(`\n🎉 ============================================`);
        console.log(`🚀 Application is running on: http://localhost:${port}/api`);
        console.log(`📚 Swagger documentation: http://localhost:${port}/api/docs`);
        console.log(`🎉 ============================================\n`);
    }
    catch (error) {
        console.error('❌ ERROR starting application:', error);
        process.exit(1);
    }
}
bootstrap();
//# sourceMappingURL=main.js.map