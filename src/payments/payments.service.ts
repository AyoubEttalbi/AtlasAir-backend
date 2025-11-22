import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Reservation } from '../reservations/entities/reservation.entity';
import { PaymentStatus } from '../common/enums/payment-status.enum';
import { ReservationStatus } from '../common/enums/reservation-status.enum';
import { PaymentValidatorService } from './payment-validator.service';
import { TicketsService } from '../tickets/tickets.service';
import { PdfService } from '../pdf/pdf.service';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    @InjectRepository(Reservation)
    private reservationsRepository: Repository<Reservation>,
    private paymentValidator: PaymentValidatorService,
    private ticketsService: TicketsService,
    private pdfService: PdfService,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    console.log('Creating payment with DTO:', {
      reservationId: createPaymentDto.reservationId,
      amount: createPaymentDto.amount,
      currency: createPaymentDto.currency,
      paymentMethod: createPaymentDto.paymentMethod,
      cardNumber: createPaymentDto.cardNumber?.substring(0, 4) + '****', // Only log first 4 digits
      cardHolder: createPaymentDto.cardHolder,
      expiryDate: createPaymentDto.expiryDate,
    });

    const reservation = await this.reservationsRepository.findOne({
      where: { id: createPaymentDto.reservationId },
      relations: ['payment'],
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    console.log('Reservation found:', {
      id: reservation.id,
      totalPrice: reservation.totalPrice,
      status: reservation.status,
      hasPayment: !!reservation.payment,
    });

    if (reservation.payment) {
      throw new BadRequestException('Payment already exists for this reservation');
    }

    if (reservation.status === ReservationStatus.CANCELLED) {
      throw new BadRequestException('Cannot process payment for cancelled reservation');
    }

    // Validate card details FIRST (before amount check, so we get card error if card is wrong)
    try {
      console.log('Validating card...');
      this.paymentValidator.validateCard(
        createPaymentDto.cardNumber,
        createPaymentDto.cardHolder,
        createPaymentDto.expiryDate,
        createPaymentDto.cvv,
        createPaymentDto.amount,
      );
      console.log('Card validation passed');
    } catch (error) {
      console.error('Card validation failed:', error.message);
      // Re-throw validation errors
      throw error;
    }

    // Check payment amount matches reservation total (with tolerance for floating point)
    const amountDifference = Math.abs(createPaymentDto.amount - reservation.totalPrice);
    if (amountDifference > 0.01) {
      console.error('Payment amount mismatch:', {
        paymentAmount: createPaymentDto.amount,
        reservationTotalPrice: reservation.totalPrice,
        difference: amountDifference,
        reservationId: reservation.id,
      });
      throw new BadRequestException(
        `Payment amount (${createPaymentDto.amount}) does not match reservation total (${reservation.totalPrice}). Difference: ${amountDifference.toFixed(2)}`
      );
    }

    console.log('Amount validation passed');

    // Generate transaction ID
    const transactionId = this.generateTransactionId();

    const payment = this.paymentsRepository.create({
      reservation,
      amount: createPaymentDto.amount,
      currency: createPaymentDto.currency || 'MAD',
      paymentMethod: createPaymentDto.paymentMethod,
      transactionId,
      status: PaymentStatus.COMPLETED, // Payment validated successfully
    });

    const savedPayment = await this.paymentsRepository.save(payment);

    // Update reservation status
    reservation.status = ReservationStatus.CONFIRMED;
    await this.reservationsRepository.save(reservation);

    // Generate ticket PDF and create ticket record
    try {
      const ticketPdfPath = await this.pdfService.generateTicket(reservation);
      
      // Generate ticket number (using booking reference + timestamp)
      const ticketNumber = `TKT-${reservation.bookingReference}-${Date.now().toString().slice(-6)}`;
      
      // Create ticket record
      await this.ticketsService.create({
        numeroBillet: ticketNumber,
        dateEmission: new Date().toISOString(),
        fichierPDF: ticketPdfPath,
        reservationId: reservation.id,
      });

      // Update reservation with ticket PDF path
      reservation.ticketPdfPath = ticketPdfPath;
      await this.reservationsRepository.save(reservation);
    } catch (error) {
      console.error('Error creating ticket:', error);
      // Don't fail payment if ticket creation fails, just log it
    }

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

