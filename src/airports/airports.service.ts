import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Airport } from './entities/airport.entity';
import { CreateAirportDto } from './dto/create-airport.dto';
import { UpdateAirportDto } from './dto/update-airport.dto';

@Injectable()
export class AirportsService {
  constructor(
    @InjectRepository(Airport)
    private airportsRepository: Repository<Airport>,
  ) {}

  async create(createAirportDto: CreateAirportDto): Promise<Airport> {
    const airport = this.airportsRepository.create(createAirportDto);
    return this.airportsRepository.save(airport);
  }

  async findAll(): Promise<Airport[]> {
    return this.airportsRepository.find();
  }

  async findOne(id: string): Promise<Airport> {
    const airport = await this.airportsRepository.findOne({
      where: { id },
    });

    if (!airport) {
      throw new NotFoundException(`Airport with ID ${id} not found`);
    }

    return airport;
  }

  async update(id: string, updateAirportDto: UpdateAirportDto): Promise<Airport> {
    const airport = await this.findOne(id);
    Object.assign(airport, updateAirportDto);
    return this.airportsRepository.save(airport);
  }

  async remove(id: string): Promise<void> {
    const airport = await this.findOne(id);
    await this.airportsRepository.remove(airport);
  }
}

