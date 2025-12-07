import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions | null => {
  const isDevelopment = configService.get('NODE_ENV') === 'development';
  const dbEnabled = configService.get('DB_ENABLED', 'true') === 'true';
  const dbUsername = configService.get('DB_USERNAME');
  const dbPassword = configService.get('DB_PASSWORD');

  // If DB is disabled or credentials are missing, return null to prevent connection
  if (!dbEnabled || !dbUsername || !dbPassword) {
    console.warn('⚠️  Database connection disabled. Set DB_ENABLED=true and provide credentials to enable.');
    return null;
  }

  return {
    type: 'mysql',
    host: configService.get('DB_HOST', 'localhost'),
    port: parseInt(configService.get('DB_PORT', '3306'), 10),
    username: dbUsername,
    password: dbPassword,
    database: configService.get('DB_NAME', 'atlasair'),
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: configService.get('DB_SYNCHRONIZE') === 'true',
    logging: isDevelopment,
    // Reduced retries to fail faster if DB is not available
    retryAttempts: isDevelopment ? 1 : 3,
    retryDelay: 2000,
    autoLoadEntities: true,
    // MySQL connection options
    extra: {
      connectionLimit: 10,
    },
  };
};

