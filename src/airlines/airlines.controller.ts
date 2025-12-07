import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AirlinesService } from './airlines.service';
import { CreateAirlineDto } from './dto/create-airline.dto';
import { UpdateAirlineDto } from './dto/update-airline.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@Controller('airlines')
export class AirlinesController {
  constructor(private readonly airlinesService: AirlinesService) { }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createAirlineDto: CreateAirlineDto) {
    return this.airlinesService.create(createAirlineDto);
  }

  @Get()
  findAll() {
    return this.airlinesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.airlinesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateAirlineDto: UpdateAirlineDto) {
    return this.airlinesService.update(id, updateAirlineDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.airlinesService.remove(id);
  }
}

