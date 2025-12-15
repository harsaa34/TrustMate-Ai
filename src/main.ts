// src/main.ts - UPDATED WITH ALL TAGS
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log('🚀 Starting NestJS application...');
  
  try {
    const app = await NestFactory.create(AppModule);
    console.log('✅ App created successfully');

    // Enable CORS for frontend
    app.enableCors({
      origin: ['http://localhost:5173', 'http://localhost:3000'],
      credentials: true,
    });
    console.log('✅ CORS enabled');

    // Global validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
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
      }),
    );
    console.log('✅ Validation pipe configured');

    // Global prefix
    app.setGlobalPrefix('api');
    console.log('✅ Global prefix set to /api');

    // ==================== SWAGGER CONFIGURATION ====================
    console.log('📚 Setting up Swagger...');
    const config = new DocumentBuilder()
      .setTitle('TrustMate AI - Expense Tracker API')
      .setDescription('Complete API for managing groups, expenses, and settlements between friends')
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        'JWT-auth',
      )
      // Add ALL your tags here
      .addTag('Authentication', 'User authentication and authorization')
      .addTag('Users', 'User management operations')
      .addTag('Groups', 'Group management operations')
      .addTag('Expenses', 'Expense tracking operations')
      .addTag('Settlements', 'Settlement operations')
      .addServer('http://localhost:3000/api', 'Local development server')
      .addServer('https://api.trustmate.ai/api', 'Production server')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    
    // Swagger UI setup
    SwaggerModule.setup('api/docs', app, document, {
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

    // ==================== START SERVER ====================
    const port = process.env.PORT || 3000;
    console.log(`🌐 Starting server on port ${port}...`);
    
    await app.listen(port);
    
    console.log(`\n🎉 ============================================`);
    console.log(`🚀 Application is running on: http://localhost:${port}/api`);
    console.log(`📚 Swagger documentation: http://localhost:${port}/api/docs`);
    console.log(`🎉 ============================================\n`);

  } catch (error) {
    console.error('❌ ERROR starting application:', error);
    process.exit(1);
  }
}

bootstrap();