import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { PassengerProfilesService } from './passenger-profiles.service';
import { CreatePassengerProfileDto } from './dto/create-passenger-profile.dto';
import { UpdatePassengerProfileDto } from './dto/update-passenger-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('passenger-profiles')
@UseGuards(JwtAuthGuard)
export class PassengerProfilesController {
  constructor(private readonly passengerProfilesService: PassengerProfilesService) {}

  @Post()
  create(@Request() req, @Body() createPassengerProfileDto: CreatePassengerProfileDto) {
    return this.passengerProfilesService.create(req.user.id, createPassengerProfileDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.passengerProfilesService.findAll(req.user.id);
  }

  @Get('default')
  findDefault(@Request() req) {
    return this.passengerProfilesService.findDefault(req.user.id);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.passengerProfilesService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() updatePassengerProfileDto: UpdatePassengerProfileDto) {
    return this.passengerProfilesService.update(id, req.user.id, updatePassengerProfileDto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.passengerProfilesService.remove(id, req.user.id);
  }
}

