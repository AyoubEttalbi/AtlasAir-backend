import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from '../reservations/entities/reservation.entity';
import { Payment } from '../payments/entities/payment.entity';
import { User } from '../users/entities/user.entity';
import { Flight } from '../flights/entities/flight.entity';
import { StatisticsDto } from './dto/statistics.dto';
import { ReservationStatus } from '../common/enums/reservation-status.enum';
import { PaymentStatus } from '../common/enums/payment-status.enum';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Reservation)
    private reservationsRepository: Repository<Reservation>,
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Flight)
    private flightsRepository: Repository<Flight>,
  ) { }

  async getStatistics(): Promise<StatisticsDto> {
    const [
      totalReservations,
      totalRevenue,
      totalUsers,
      totalFlights,
      activeReservations,
      cancelledReservations,
      completedReservations,
      pendingPayments,
    ] = await Promise.all([
      this.reservationsRepository.count(),
      this.getTotalRevenue(),
      this.usersRepository.count(),
      this.flightsRepository.count(),
      this.reservationsRepository.count({ where: { status: ReservationStatus.CONFIRMED } }),
      this.reservationsRepository.count({ where: { status: ReservationStatus.CANCELLED } }),
      this.reservationsRepository.count({ where: { status: ReservationStatus.COMPLETED } }),
      this.paymentsRepository.count({ where: { status: PaymentStatus.PENDING } }),
    ]);

    const monthlyRevenue = await this.getMonthlyRevenue();
    const popularDestinations = await this.getPopularDestinations();

    return {
      totalReservations,
      totalRevenue,
      totalUsers,
      totalFlights,
      activeReservations,
      cancelledReservations,
      completedReservations,
      pendingPayments,
      monthlyRevenue,
      popularDestinations,
    };
  }

  private async getTotalRevenue(): Promise<number> {
    const result = await this.paymentsRepository
      .createQueryBuilder('payment')
      .select('SUM(payment.amount)', 'total')
      .where('payment.status = :status', { status: PaymentStatus.COMPLETED })
      .getRawOne();

    return parseFloat(result?.total || '0');
  }

  private async getMonthlyRevenue(): Promise<Array<{ month: string; revenue: number }>> {
    const payments = await this.paymentsRepository.find({
      where: { status: PaymentStatus.COMPLETED },
    });

    const monthlyData = new Map<string, number>();

    payments.forEach((payment) => {
      const month = new Date(payment.createdAt).toLocaleString('en-US', { month: 'short', year: 'numeric' });
      const amount = parseFloat(String(payment.amount)) || 0;
      monthlyData.set(month, (monthlyData.get(month) || 0) + amount);
    });

    return Array.from(monthlyData.entries()).map(([month, revenue]) => ({
      month,
      revenue,
    }));
  }

  private async getPopularDestinations(): Promise<Array<{ airport: string; count: number }>> {
    const reservations = await this.reservationsRepository.find({
      relations: ['flight', 'flight.arrivalAirport'],
    });

    const destinationCount = new Map<string, number>();

    reservations.forEach((reservation) => {
      const airport = reservation.flight.arrivalAirport.name;
      destinationCount.set(airport, (destinationCount.get(airport) || 0) + 1);
    });

    return Array.from(destinationCount.entries())
      .map(([airport, count]) => ({ airport, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }
}

