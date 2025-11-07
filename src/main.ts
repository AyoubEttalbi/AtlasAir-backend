import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getConnectionToken } from '@nestjs/typeorm';
import { AppModule } from './app.module';

// Handle unhandled promise rejections from TypeORM and Mailer
process.on('unhandledRejection', (reason: any, promise) => {
  if (reason && (reason.code === 'NJS-503' || reason.code === 'NJS-007' || reason.code === 'NJS-518' || reason.code === 'NJS-138')) {
    // Oracle connection/pool errors - log helpful message
    if (reason.code === 'NJS-518') {
      console.error('❌ Database Connection Error: Service name not found.');
      console.error('   Please check your DB_SERVICE_NAME in .env file.');
      console.error('   Common service names: XE, XEPDB1, ORCL');
      console.error('   To find your service name, run in SQL*Plus:');
      console.error('   SELECT name FROM v$services;');
    } else if (reason.code === 'NJS-138') {
      console.error('❌ Database Version Error: Oracle 11g is not supported in Thin mode.');
      console.error('   Oracle 11g requires Thick mode (Oracle Instant Client).');
      console.error('   Solutions:');
      console.error('   1. Install Oracle Instant Client (recommended)');
      console.error('   2. Upgrade to Oracle 12c+ (12.2 or later)');
      console.error('   3. Use SQLite for development (set DB_ENABLED=false)');
      console.error('   See ORACLE_11G_SETUP.md for detailed instructions.');
    }
    return;
  }
  if (reason && reason.message && reason.message.includes('transporter.verify')) {
    // Mailer verification error - log but don't crash
    console.warn('⚠️  Email service verification failed. Application will continue without email verification.');
    return;
  }
  // For other unhandled rejections, log and potentially crash
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

async function bootstrap() {
  try {
    console.log('📦 Creating Nest application...');
    
    // Custom logger that filters out Oracle connection errors when DB is disabled
    const customLogger = {
      log: (message: any) => console.log(message),
      error: (message: any, trace?: string) => {
        // Filter out Oracle connection errors when DB is disabled
        const messageStr = message?.toString() || '';
        if (messageStr.includes('NJS-503') || 
            messageStr.includes('NJS-007') ||
            messageStr.includes('NJS-518') ||
            messageStr.includes('NJS-138') ||
            messageStr.includes('connections to this database server version are not supported') ||
            messageStr.includes('connection to host') ||
            messageStr.includes('ECONNREFUSED') ||
            messageStr.includes('Unable to connect to the database') ||
            messageStr.includes('Service') && messageStr.includes('not registered') ||
            messageStr.includes('invalid value for "poolMax"')) {
          // Suppress these errors - they're expected when DB is disabled
          return;
        }
        console.error(message, trace || '');
      },
      warn: (message: any) => console.warn(message),
      debug: (message: any) => {},
      verbose: (message: any) => {},
    };

    // Create app - TypeORM will attempt connection but errors are caught
    const app = await NestFactory.create(AppModule, {
      abortOnError: false,
      logger: customLogger,
    });
    
    console.log('✅ Nest application created successfully');
    
    const configService = app.get(ConfigService);
    const port = configService.get('PORT') || 3000;
    const apiPrefix = configService.get('API_PREFIX') || 'api/v1';

    // Global prefix
    app.setGlobalPrefix(apiPrefix);

    // CORS
    app.enableCors({
      origin: configService.get('FRONTEND_URL'),
      credentials: true,
    });

    // Global validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    // Give TypeORM a moment to attempt connection (if enabled)
    // Errors are caught by the unhandledRejection handler
    console.log('⏳ Initializing services...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check database connection status
    try {
      const connectionToken = getConnectionToken();
      const connection = app.get(connectionToken);
      if (connection && connection.isConnected) {
        console.log('✅ Database connected successfully');
      }
    } catch (error) {
      // Connection check failed - will be handled by health endpoint
      // This is expected if DB is disabled or connection hasn't been established yet
    }
    
    await app.listen(port);
    console.log(`\n✅ Application is running on: http://localhost:${port}/${apiPrefix}`);
    console.log(`📊 Health check: http://localhost:${port}/${apiPrefix}/health`);
    
    const dbEnabled = configService.get('DB_ENABLED') === 'true';
    if (dbEnabled) {
      console.log('✅ Database: Enabled (check /health endpoint for connection status)');
    } else {
      console.log('⚠️  Database: Disabled (set DB_ENABLED=true to enable)');
    }
    
    const mailEnabled = configService.get('MAIL_ENABLED') === 'true';
    if (mailEnabled) {
      console.log('✅ Email: Enabled');
    } else {
      console.log('⚠️  Email: Disabled (set MAIL_ENABLED=true to enable)');
    }
    console.log('');
  } catch (error) {
    // Log error but don't crash - allow app to continue without DB
    if (error.message && (error.message.includes('database') || error.message.includes('NJS-503') || error.message.includes('NJS-007'))) {
      // Suppress this warning - it's redundant since we already show DB disabled warning above
      // The application will continue without DB
    } else {
      throw error;
    }
  }
}
bootstrap();

