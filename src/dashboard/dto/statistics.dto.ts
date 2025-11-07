export class StatisticsDto {
  totalReservations: number;
  totalRevenue: number;
  totalUsers: number;
  totalFlights: number;
  activeReservations: number;
  cancelledReservations: number;
  completedReservations: number;
  pendingPayments: number;
  monthlyRevenue: Array<{ month: string; revenue: number }>;
  popularDestinations: Array<{ airport: string; count: number }>;
}

