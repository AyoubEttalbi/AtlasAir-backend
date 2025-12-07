import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { ReservationStatus } from '../../common/enums/reservation-status.enum';
import { FlightClass } from '../../common/enums/flight-class.enum';
import { User } from '../../users/entities/user.entity';
import { Flight } from '../../flights/entities/flight.entity';
import { Payment } from '../../payments/entities/payment.entity';
import { Ticket } from '../../tickets/entities/ticket.entity';

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 20 })
  bookingReference: string;

  @ManyToOne(() => User, (user) => user.reservations)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Flight, (flight) => flight.reservations)
  @JoinColumn({ name: 'flight_id' })
  flight: Flight;

  @Column({ length: 100 })
  passengerFirstName: string;

  @Column({ length: 100 })
  passengerLastName: string;

  @Column({ length: 50 })
  passengerPassport: string;

  @Column({ type: 'date' })
  passengerDateOfBirth: Date;

  @Column({
    type: 'varchar',
    length: 20,
  })
  flightClass: FlightClass;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  @Column({
    type: 'varchar',
    length: 20,
    default: ReservationStatus.PENDING,
  })
  status: ReservationStatus;

  @Column({ nullable: true })
  ticketPdfPath: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Payment, (payment) => payment.reservation)
  payment: Payment;

  @OneToOne(() => Ticket, (ticket) => ticket.reservation)
  ticket: Ticket;
}

