import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Flight } from './entities/flight.entity';
import { CreateFlightDto } from './dto/create-flight.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';
import { SearchFlightDto } from './dto/search-flight.dto';
import { Airline } from '../airlines/entities/airline.entity';
import { Airport } from '../airports/entities/airport.entity';

@Injectable()
export class FlightsService {
  constructor(
    @InjectRepository(Flight)
    private flightsRepository: Repository<Flight>,
    @InjectRepository(Airline)
    private airlinesRepository: Repository<Airline>,
    @InjectRepository(Airport)
    private airportsRepository: Repository<Airport>,
  ) {}

  async create(createFlightDto: CreateFlightDto): Promise<Flight> {
    const airline = await this.airlinesRepository.findOne({
      where: { id: createFlightDto.airlineId },
    });

    if (!airline) {
      throw new NotFoundException('Airline not found');
    }

    const departureAirport = await this.airportsRepository.findOne({
      where: { id: createFlightDto.departureAirportId },
    });

    if (!departureAirport) {
      throw new NotFoundException('Departure airport not found');
    }

    const arrivalAirport = await this.airportsRepository.findOne({
      where: { id: createFlightDto.arrivalAirportId },
    });

    if (!arrivalAirport) {
      throw new NotFoundException('Arrival airport not found');
    }

    const flight = this.flightsRepository.create({
      ...createFlightDto,
      airline,
      departureAirport,
      arrivalAirport,
      departureTime: new Date(createFlightDto.departureTime),
      arrivalTime: new Date(createFlightDto.arrivalTime),
      availableEconomySeats: createFlightDto.economySeats || 180,
      availableBusinessSeats: createFlightDto.businessSeats || 50,
      availableFirstClassSeats: createFlightDto.firstClassSeats || 20,
    });

    return this.flightsRepository.save(flight);
  }

  async findAll(): Promise<Flight[]> {
    return this.flightsRepository.find({
      relations: ['airline', 'departureAirport', 'arrivalAirport'],
    });
  }

  async findOne(id: string): Promise<Flight> {
    const flight = await this.flightsRepository.findOne({
      where: { id },
      relations: ['airline', 'departureAirport', 'arrivalAirport', 'reservations'],
    });

    if (!flight) {
      throw new NotFoundException(`Flight with ID ${id} not found`);
    }

    return flight;
  }

  async search(searchFlightDto: SearchFlightDto): Promise<Flight[]> {
    const departureDate = new Date(searchFlightDto.departureDate);
    const nextDay = new Date(departureDate);
    nextDay.setDate(nextDay.getDate() + 1);

    console.log('Search parameters:', {
      departureAirportId: searchFlightDto.departureAirportId,
      arrivalAirportId: searchFlightDto.arrivalAirportId,
      departureDate: departureDate.toISOString(),
      nextDay: nextDay.toISOString(),
      passengers: searchFlightDto.passengers,
      flightClass: searchFlightDto.flightClass,
    });

    const flights = await this.flightsRepository.find({
      where: {
        departureAirport: { id: searchFlightDto.departureAirportId },
        arrivalAirport: { id: searchFlightDto.arrivalAirportId },
        departureTime: Between(departureDate, nextDay),
        isActive: true,
      },
      relations: ['airline', 'departureAirport', 'arrivalAirport'],
    });

    console.log(`Found ${flights.length} flights matching search criteria`);

    const filteredFlights = flights.filter((flight) => {
      if (searchFlightDto.flightClass) {
        const availableSeats = this.getAvailableSeats(flight, searchFlightDto.flightClass);
        return availableSeats >= (searchFlightDto.passengers || 1);
      }
      return true;
    });

    console.log(`Returning ${filteredFlights.length} flights after filtering by class/passengers`);

    return filteredFlights;
  }

  private getAvailableSeats(flight: Flight, flightClass: string): number {
    switch (flightClass) {
      case 'ECONOMY':
        return flight.availableEconomySeats;
      case 'BUSINESS':
        return flight.availableBusinessSeats;
      case 'FIRST_CLASS':
        return flight.availableFirstClassSeats;
      default:
        return 0;
    }
  }

  async update(id: string, updateFlightDto: UpdateFlightDto): Promise<Flight> {
    const flight = await this.findOne(id);
    
    if (updateFlightDto.airlineId) {
      const airline = await this.airlinesRepository.findOne({
        where: { id: updateFlightDto.airlineId },
      });
      if (airline) flight.airline = airline;
    }

    if (updateFlightDto.departureAirportId) {
      const airport = await this.airportsRepository.findOne({
        where: { id: updateFlightDto.departureAirportId },
      });
      if (airport) flight.departureAirport = airport;
    }

    if (updateFlightDto.arrivalAirportId) {
      const airport = await this.airportsRepository.findOne({
        where: { id: updateFlightDto.arrivalAirportId },
      });
      if (airport) flight.arrivalAirport = airport;
    }

    if (updateFlightDto.departureTime) {
      flight.departureTime = new Date(updateFlightDto.departureTime);
    }

    if (updateFlightDto.arrivalTime) {
      flight.arrivalTime = new Date(updateFlightDto.arrivalTime);
    }

    Object.assign(flight, {
      ...updateFlightDto,
      airline: flight.airline,
      departureAirport: flight.departureAirport,
      arrivalAirport: flight.arrivalAirport,
    });

    return this.flightsRepository.save(flight);
  }

  async remove(id: string): Promise<void> {
    const flight = await this.findOne(id);
    await this.flightsRepository.remove(flight);
  }
}

