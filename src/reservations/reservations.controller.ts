import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@Controller('reservations')
@UseGuards(JwtAuthGuard)
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  create(@Request() req, @Body() createReservationDto: CreateReservationDto) {
    return this.reservationsService.create(req.user.id, createReservationDto);
  }

  @Get()
  findAll(@Request() req) {
    // Admin can see all, clients see only their own
    const userId = req.user.role === UserRole.ADMIN ? undefined : req.user.id;
    return this.reservationsService.findAll(userId);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    const userId = req.user.role === UserRole.ADMIN ? undefined : req.user.id;
    return this.reservationsService.findOne(id, userId);
  }

  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() updateReservationDto: UpdateReservationDto) {
    const userId = req.user.role === UserRole.ADMIN ? undefined : req.user.id;
    return this.reservationsService.update(id, updateReservationDto, userId);
  }

  @Post(':id/cancel')
  cancel(@Request() req, @Param('id') id: string) {
    const userId = req.user.role === UserRole.ADMIN ? undefined : req.user.id;
    return this.reservationsService.cancel(id, userId);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.reservationsService.remove(id);
  }
}

