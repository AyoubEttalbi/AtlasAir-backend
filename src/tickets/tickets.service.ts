import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Reservation } from '../reservations/entities/reservation.entity';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private ticketsRepository: Repository<Ticket>,
    @InjectRepository(Reservation)
    private reservationsRepository: Repository<Reservation>,
  ) {}

  async create(createTicketDto: CreateTicketDto): Promise<Ticket> {
    // Check if ticket number already exists
    const existingTicket = await this.ticketsRepository.findOne({
      where: { numeroBillet: createTicketDto.numeroBillet },
    });

    if (existingTicket) {
      throw new ConflictException('Ticket number already exists');
    }

    // Check if reservation exists
    const reservation = await this.reservationsRepository.findOne({
      where: { id: createTicketDto.reservationId },
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    // Check if reservation already has a ticket
    const existingTicketForReservation = await this.ticketsRepository.findOne({
      where: { reservation: { id: createTicketDto.reservationId } },
    });

    if (existingTicketForReservation) {
      throw new ConflictException('Reservation already has a ticket');
    }

    const ticket = this.ticketsRepository.create({
      numeroBillet: createTicketDto.numeroBillet,
      dateEmission: new Date(createTicketDto.dateEmission),
      fichierPDF: createTicketDto.fichierPDF,
      reservation,
    });

    return this.ticketsRepository.save(ticket);
  }

  async findAll(): Promise<Ticket[]> {
    return this.ticketsRepository.find({
      relations: ['reservation', 'reservation.user', 'reservation.flight'],
    });
  }

  async findOne(id: string): Promise<Ticket> {
    const ticket = await this.ticketsRepository.findOne({
      where: { id },
      relations: ['reservation', 'reservation.user', 'reservation.flight'],
    });

    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }

    return ticket;
  }

  async findByReservationId(reservationId: string): Promise<Ticket | null> {
    return this.ticketsRepository.findOne({
      where: { reservation: { id: reservationId } },
      relations: ['reservation', 'reservation.user', 'reservation.flight'],
    });
  }

  async update(id: string, updateTicketDto: UpdateTicketDto): Promise<Ticket> {
    const ticket = await this.findOne(id);

    if (updateTicketDto.numeroBillet && updateTicketDto.numeroBillet !== ticket.numeroBillet) {
      const existingTicket = await this.ticketsRepository.findOne({
        where: { numeroBillet: updateTicketDto.numeroBillet },
      });

      if (existingTicket && existingTicket.id !== id) {
        throw new ConflictException('Ticket number already exists');
      }
    }

    if (updateTicketDto.dateEmission) {
      ticket.dateEmission = new Date(updateTicketDto.dateEmission);
    }

    if (updateTicketDto.fichierPDF !== undefined) {
      ticket.fichierPDF = updateTicketDto.fichierPDF;
    }

    if (updateTicketDto.numeroBillet) {
      ticket.numeroBillet = updateTicketDto.numeroBillet;
    }

    return this.ticketsRepository.save(ticket);
  }

  async remove(id: string): Promise<void> {
    const ticket = await this.findOne(id);
    await this.ticketsRepository.remove(ticket);
  }
}

