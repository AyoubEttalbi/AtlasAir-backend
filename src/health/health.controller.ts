import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { ConfigService } from '@nestjs/config';

@Controller('health')
export class HealthController {
  constructor(
    @InjectConnection()
    private connection: Connection,
    private configService: ConfigService,
  ) {}

  @Get()
  async check() {
    const dbEnabled = this.configService.get('DB_ENABLED') === 'true';
    
    try {
      // Test database connection
      const isConnected = this.connection?.isConnected || false;
      
      if (!dbEnabled) {
        return {
          status: 'ok',
          database: 'disabled',
          message: 'Database is disabled in configuration',
          timestamp: new Date().toISOString(),
        };
      }

      if (!isConnected) {
        return {
          status: 'error',
          database: 'disconnected',
          message: 'Database connection failed',
          timestamp: new Date().toISOString(),
        };
      }

      // Run a simple query to verify connection
      // For Oracle: SELECT 1 FROM DUAL
      // For SQLite: SELECT 1
      const query = this.connection.options.type === 'oracle' 
        ? 'SELECT 1 FROM DUAL' 
        : 'SELECT 1';
      
      await this.connection.query(query);
      
      // Get database info
      const dbInfo: any = {
        type: this.connection.options.type,
        host: (this.connection.options as any).host || 'N/A',
        port: (this.connection.options as any).port || 'N/A',
      };

      if (this.connection.options.type === 'oracle') {
        dbInfo.serviceName = (this.connection.options as any).serviceName || 'N/A';
      } else {
        dbInfo.database = (this.connection.options as any).database || 'N/A';
      }

      return {
        status: 'ok',
        database: 'connected',
        timestamp: new Date().toISOString(),
        databaseInfo: dbInfo,
      };
    } catch (error) {
      return {
        status: 'error',
        database: 'error',
        message: error.message,
        error: error.code || 'UNKNOWN_ERROR',
        timestamp: new Date().toISOString(),
      };
    }
  }
}

