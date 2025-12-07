import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AirportsService } from './airports.service';
import { CreateAirportDto } from './dto/create-airport.dto';
import { UpdateAirportDto } from './dto/update-airport.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@Controller('airports')
export class AirportsController {
  constructor(private readonly airportsService: AirportsService) { }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createAirportDto: CreateAirportDto) {
    return this.airportsService.create(createAirportDto);
  }

  @Get()
  findAll() {
    return this.airportsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.airportsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateAirportDto: UpdateAirportDto) {
    return this.airportsService.update(id, updateAirportDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.airportsService.remove(id);
  }
}

