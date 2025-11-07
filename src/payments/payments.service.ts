import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Reservation } from '../reservations/entities/reservation.entity';
import { PaymentStatus } from '../common/enums/payment-status.enum';
import { ReservationStatus } from '../common/enums/reservation-status.enum';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    @InjectRepository(Reservation)
    private reservationsRepository: Repository<Reservation>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const reservation = await this.reservationsRepository.findOne({
      where: { id: createPaymentDto.reservationId },
      relations: ['payment'],
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    if (reservation.payment) {
      throw new BadRequestException('Payment already exists for this reservation');
    }

    if (reservation.status === ReservationStatus.CANCELLED) {
      throw new BadRequestException('Cannot process payment for cancelled reservation');
    }

    if (Math.abs(createPaymentDto.amount - reservation.totalPrice) > 0.01) {
      throw new BadRequestException('Payment amount does not match reservation total');
    }

    // Generate transaction ID
    const transactionId = this.generateTransactionId();

    const payment = this.paymentsRepository.create({
      reservation,
      amount: createPaymentDto.amount,
      currency: createPaymentDto.currency || 'MAD',
      paymentMethod: createPaymentDto.paymentMethod,
      transactionId,
      status: PaymentStatus.COMPLETED, // In production, this would be pending and updated after payment gateway confirmation
    });

    const savedPayment = await this.paymentsRepository.save(payment);

    // Update reservation status
    reservation.status = ReservationStatus.CONFIRMED;
    await this.reservationsRepository.save(reservation);

    return savedPayment;
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentsRepository.find({
      relations: ['reservation', 'reservation.user', 'reservation.flight'],
    });
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentsRepository.findOne({
      where: { id },
      relations: ['reservation', 'reservation.user', 'reservation.flight'],
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    return payment;
  }

  async findByReservation(reservationId: string): Promise<Payment | null> {
    return this.paymentsRepository.findOne({
      where: { reservation: { id: reservationId } },
      relations: ['reservation'],
    });
  }

  async updateStatus(id: string, status: PaymentStatus): Promise<Payment> {
    const payment = await this.findOne(id);
    payment.status = status;
    return this.paymentsRepository.save(payment);
  }

  private generateTransactionId(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `TXN${timestamp}${random}`;
  }
}

