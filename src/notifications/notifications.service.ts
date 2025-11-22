import { Injectable, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { Reservation } from '../reservations/entities/reservation.entity';
import { User } from '../users/entities/user.entity';
import { Notification, NotificationType } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
    @InjectRepository(Reservation)
    private reservationsRepository: Repository<Reservation>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @Optional() private mailerService: MailerService | null,
    private configService: ConfigService,
  ) {}

  async sendBookingConfirmation(reservation: Reservation, user: User): Promise<void> {
    const message = `Booking confirmation for reservation ${reservation.bookingReference}`;
    
    try {
      if (this.mailerService) {
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

      // Save notification to database
      await this.createNotification({
        type: NotificationType.EMAIL,
        dateEnvoi: new Date().toISOString(),
        message,
        reservationId: reservation.id,
        userId: user.id,
        status: 'sent',
      });
    } catch (error) {
      // Save failed notification
      await this.createNotification({
        type: NotificationType.EMAIL,
        dateEnvoi: new Date().toISOString(),
        message: `Failed to send booking confirmation: ${error.message}`,
        reservationId: reservation.id,
        userId: user.id,
        status: 'failed',
      });
      throw error;
    }
  }

  async sendPaymentConfirmation(reservation: Reservation, user: User): Promise<void> {
    const message = `Payment confirmation for reservation ${reservation.bookingReference}`;
    
    try {
      if (this.mailerService) {
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

      // Save notification to database
      await this.createNotification({
        type: NotificationType.EMAIL,
        dateEnvoi: new Date().toISOString(),
        message,
        reservationId: reservation.id,
        userId: user.id,
        status: 'sent',
      });
    } catch (error) {
      // Save failed notification
      await this.createNotification({
        type: NotificationType.EMAIL,
        dateEnvoi: new Date().toISOString(),
        message: `Failed to send payment confirmation: ${error.message}`,
        reservationId: reservation.id,
        userId: user.id,
        status: 'failed',
      });
      throw error;
    }
  }

  async sendFlightReminder(reservation: Reservation, user: User): Promise<void> {
    const message = `Flight reminder for reservation ${reservation.bookingReference}`;
    
    try {
      if (this.mailerService) {
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

      // Save notification to database
      await this.createNotification({
        type: NotificationType.EMAIL,
        dateEnvoi: new Date().toISOString(),
        message,
        reservationId: reservation.id,
        userId: user.id,
        status: 'sent',
      });
    } catch (error) {
      // Save failed notification
      await this.createNotification({
        type: NotificationType.EMAIL,
        dateEnvoi: new Date().toISOString(),
        message: `Failed to send flight reminder: ${error.message}`,
        reservationId: reservation.id,
        userId: user.id,
        status: 'failed',
      });
      throw error;
    }
  }

  async sendCancellationNotification(reservation: Reservation, user: User): Promise<void> {
    const message = `Cancellation notification for reservation ${reservation.bookingReference}`;
    
    try {
      if (this.mailerService) {
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

      // Save notification to database
      await this.createNotification({
        type: NotificationType.EMAIL,
        dateEnvoi: new Date().toISOString(),
        message,
        reservationId: reservation.id,
        userId: user.id,
        status: 'sent',
      });
    } catch (error) {
      // Save failed notification
      await this.createNotification({
        type: NotificationType.EMAIL,
        dateEnvoi: new Date().toISOString(),
        message: `Failed to send cancellation notification: ${error.message}`,
        reservationId: reservation.id,
        userId: user.id,
        status: 'failed',
      });
      throw error;
    }
  }

  async createNotification(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    const notification = this.notificationsRepository.create({
      type: createNotificationDto.type,
      dateEnvoi: new Date(createNotificationDto.dateEnvoi),
      message: createNotificationDto.message,
      status: createNotificationDto.status || 'sent',
    });

    if (createNotificationDto.reservationId) {
      const reservation = await this.reservationsRepository.findOne({
        where: { id: createNotificationDto.reservationId },
      });
      if (reservation) {
        notification.reservation = reservation;
      }
    }

    if (createNotificationDto.userId) {
      const user = await this.usersRepository.findOne({
        where: { id: createNotificationDto.userId },
      });
      if (user) {
        notification.user = user;
      }
    }

    return this.notificationsRepository.save(notification);
  }

  async findAll(): Promise<Notification[]> {
    return this.notificationsRepository.find({
      relations: ['reservation', 'user'],
      order: { dateEnvoi: 'DESC' },
    });
  }

  async findByReservationId(reservationId: string): Promise<Notification[]> {
    return this.notificationsRepository.find({
      where: { reservation: { id: reservationId } },
      relations: ['reservation', 'user'],
      order: { dateEnvoi: 'DESC' },
    });
  }

  async findByUserId(userId: string): Promise<Notification[]> {
    return this.notificationsRepository.find({
      where: { user: { id: userId } },
      relations: ['reservation', 'user'],
      order: { dateEnvoi: 'DESC' },
    });
  }
}
