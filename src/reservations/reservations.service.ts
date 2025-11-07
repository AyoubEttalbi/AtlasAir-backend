import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Flight } from '../flights/entities/flight.entity';
import { User } from '../users/entities/user.entity';
import { ReservationStatus } from '../common/enums/reservation-status.enum';
import { FlightClass } from '../common/enums/flight-class.enum';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private reservationsRepository: Repository<Reservation>,
    @InjectRepository(Flight)
    private flightsRepository: Repository<Flight>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(userId: string, createReservationDto: CreateReservationDto): Promise<Reservation> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const flight = await this.flightsRepository.findOne({
      where: { id: createReservationDto.flightId },
    });

    if (!flight) {
      throw new NotFoundException('Flight not found');
    }

    // Check seat availability
    const availableSeats = this.getAvailableSeats(flight, createReservationDto.flightClass);
    if (availableSeats <= 0) {
      throw new BadRequestException('No available seats for this flight class');
    }

    // Calculate price
    const price = this.getPrice(flight, createReservationDto.flightClass);

    // Generate booking reference
    const bookingReference = this.generateBookingReference();

    const reservation = this.reservationsRepository.create({
      ...createReservationDto,
      user,
      flight,
      bookingReference,
      totalPrice: price,
      passengerDateOfBirth: new Date(createReservationDto.passengerDateOfBirth),
      status: ReservationStatus.PENDING,
    });

    const savedReservation = await this.reservationsRepository.save(reservation);

    // Update available seats
    await this.updateAvailableSeats(flight, createReservationDto.flightClass, -1);

    return savedReservation;
  }

  async findAll(userId?: string): Promise<Reservation[]> {
    const where = userId ? { user: { id: userId } } : {};
    return this.reservationsRepository.find({
      where,
      relations: ['user', 'flight', 'flight.airline', 'flight.departureAirport', 'flight.arrivalAirport', 'payment'],
    });
  }

  async findOne(id: string, userId?: string): Promise<Reservation> {
    const where: any = { id };
    if (userId) {
      where.user = { id: userId };
    }

    const reservation = await this.reservationsRepository.findOne({
      where,
      relations: ['user', 'flight', 'flight.airline', 'flight.departureAirport', 'flight.arrivalAirport', 'payment'],
    });

    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }

    return reservation;
  }

  async update(id: string, updateReservationDto: UpdateReservationDto, userId?: string): Promise<Reservation> {
    const reservation = await this.findOne(id, userId);
    Object.assign(reservation, updateReservationDto);
    return this.reservationsRepository.save(reservation);
  }

  async cancel(id: string, userId?: string): Promise<Reservation> {
    const reservation = await this.findOne(id, userId);

    if (reservation.status === ReservationStatus.CANCELLED) {
      throw new BadRequestException('Reservation is already cancelled');
    }

    if (reservation.status === ReservationStatus.COMPLETED) {
      throw new BadRequestException('Cannot cancel completed reservation');
    }

    reservation.status = ReservationStatus.CANCELLED;
    const savedReservation = await this.reservationsRepository.save(reservation);

    // Restore available seats
    const flight = await this.flightsRepository.findOne({
      where: { id: reservation.flight.id },
    });
    if (flight) {
      await this.updateAvailableSeats(flight, reservation.flightClass, 1);
    }

    return savedReservation;
  }

  async remove(id: string): Promise<void> {
    const reservation = await this.findOne(id);
    await this.reservationsRepository.remove(reservation);
  }

  private getAvailableSeats(flight: Flight, flightClass: FlightClass): number {
    switch (flightClass) {
      case FlightClass.ECONOMY:
        return flight.availableEconomySeats;
      case FlightClass.BUSINESS:
        return flight.availableBusinessSeats;
      case FlightClass.FIRST_CLASS:
        return flight.availableFirstClassSeats;
      default:
        return 0;
    }
  }

  private getPrice(flight: Flight, flightClass: FlightClass): number {
    switch (flightClass) {
      case FlightClass.ECONOMY:
        return flight.economyPrice;
      case FlightClass.BUSINESS:
        return flight.businessPrice;
      case FlightClass.FIRST_CLASS:
        return flight.firstClassPrice;
      default:
        return 0;
    }
  }

  private async updateAvailableSeats(flight: Flight, flightClass: FlightClass, change: number): Promise<void> {
    switch (flightClass) {
      case FlightClass.ECONOMY:
        flight.availableEconomySeats += change;
        break;
      case FlightClass.BUSINESS:
        flight.availableBusinessSeats += change;
        break;
      case FlightClass.FIRST_CLASS:
        flight.availableFirstClassSeats += change;
        break;
    }
    await this.flightsRepository.save(flight);
  }

  private generateBookingReference(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}

