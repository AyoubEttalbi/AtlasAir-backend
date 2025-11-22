import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { FlightsModule } from './flights/flights.module';
import { AirlinesModule } from './airlines/airlines.module';
import { AirportsModule } from './airports/airports.module';
import { ReservationsModule } from './reservations/reservations.module';
import { PaymentsModule } from './payments/payments.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { PassengerProfilesModule } from './passenger-profiles/passenger-profiles.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PdfModule } from './pdf/pdf.module';
import { HealthModule } from './health/health.module';
import { TicketsModule } from './tickets/tickets.module';
import { getDatabaseConfig } from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // TypeORM with timeout to prevent blocking
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const config = getDatabaseConfig(configService);
        if (!config) {
          // Use sqlite in-memory database when Oracle is disabled
          // This prevents connection blocking while still allowing TypeORM to initialize
          return {
            type: 'sqlite',
            database: ':memory:',
            entities: [],
            synchronize: false,
            logging: false,
            autoLoadEntities: false,
          } as any;
        }
        return config;
      },
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    FlightsModule,
    AirlinesModule,
    AirportsModule,
    ReservationsModule,
    PaymentsModule,
    DashboardModule,
    PassengerProfilesModule,
    NotificationsModule,
    PdfModule,
    TicketsModule,
    HealthModule,
  ],
})
export class AppModule {}

