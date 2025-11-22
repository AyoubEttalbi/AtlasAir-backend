import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.createNotification(createNotificationDto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.notificationsService.findAll();
  }

  @Get('reservation/:reservationId')
  @Roles(UserRole.ADMIN, UserRole.CLIENT)
  findByReservation(@Param('reservationId') reservationId: string) {
    return this.notificationsService.findByReservationId(reservationId);
  }

  @Get('user/:userId')
  @Roles(UserRole.ADMIN, UserRole.CLIENT)
  findByUser(@Param('userId') userId: string) {
    return this.notificationsService.findByUserId(userId);
  }
}

