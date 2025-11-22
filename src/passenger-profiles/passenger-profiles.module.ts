import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassengerProfilesService } from './passenger-profiles.service';
import { PassengerProfilesController } from './passenger-profiles.controller';
import { PassengerProfile } from './entities/passenger-profile.entity';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PassengerProfile, User]),
    UsersModule,
  ],
  controllers: [PassengerProfilesController],
  providers: [PassengerProfilesService],
  exports: [PassengerProfilesService],
})
export class PassengerProfilesModule {}

