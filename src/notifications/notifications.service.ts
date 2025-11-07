import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { Reservation } from '../reservations/entities/reservation.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class NotificationsService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async sendBookingConfirmation(reservation: Reservation, user: User): Promise<void> {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Booking Confirmation - Flight Reservation',
      template: 'booking-confirmation',
      context: {
        firstName: user.firstName,
        lastName: user.lastName,
        bookingReference: reservation.bookingReference,
        flightNumber: reservation.flight.flightNumber,
        departureAirport: reservation.flight.departureAirport.name,
        arrivalAirport: reservation.flight.arrivalAirport.name,
        departureTime: reservation.flight.departureTime,
        arrivalTime: reservation.flight.arrivalTime,
        totalPrice: reservation.totalPrice,
      },
    });
  }

  async sendPaymentConfirmation(reservation: Reservation, user: User): Promise<void> {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Payment Confirmed - Flight Reservation',
      template: 'payment-confirmation',
      context: {
        firstName: user.firstName,
        bookingReference: reservation.bookingReference,
        amount: reservation.totalPrice,
      },
    });
  }

  async sendFlightReminder(reservation: Reservation, user: User): Promise<void> {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Flight Reminder - Your Flight is Tomorrow',
      template: 'flight-reminder',
      context: {
        firstName: user.firstName,
        bookingReference: reservation.bookingReference,
        flightNumber: reservation.flight.flightNumber,
        departureTime: reservation.flight.departureTime,
        departureAirport: reservation.flight.departureAirport.name,
      },
    });
  }

  async sendCancellationNotification(reservation: Reservation, user: User): Promise<void> {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Reservation Cancelled',
      template: 'cancellation',
      context: {
        firstName: user.firstName,
        bookingReference: reservation.bookingReference,
        flightNumber: reservation.flight.flightNumber,
      },
    });
  }
}

