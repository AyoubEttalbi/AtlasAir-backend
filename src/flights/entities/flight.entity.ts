import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { FlightClass } from '../../common/enums/flight-class.enum';
import { Airline } from '../../airlines/entities/airline.entity';
import { Airport } from '../../airports/entities/airport.entity';
import { Reservation } from '../../reservations/entities/reservation.entity';

@Entity('flights')
export class Flight {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 20 })
  flightNumber: string;

  @ManyToOne(() => Airline, (airline) => airline.flights)
  @JoinColumn({ name: 'airline_id' })
  airline: Airline;

  @ManyToOne(() => Airport)
  @JoinColumn({ name: 'departure_airport_id' })
  departureAirport: Airport;

  @ManyToOne(() => Airport)
  @JoinColumn({ name: 'arrival_airport_id' })
  arrivalAirport: Airport;

  @Column({ type: 'timestamp' })
  departureTime: Date;

  @Column({ type: 'timestamp' })
  arrivalTime: Date;

  @Column({ type: 'int' })
  durationMinutes: number;

  @Column({ type: 'int', default: 0 })
  stops: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  economyPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  businessPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  firstClassPrice: number;

  @Column({ type: 'int', default: 180 })
  economySeats: number;

  @Column({ type: 'int', default: 50 })
  businessSeats: number;

  @Column({ type: 'int', default: 20 })
  firstClassSeats: number;

  @Column({ type: 'int', default: 180 })
  availableEconomySeats: number;

  @Column({ type: 'int', default: 50 })
  availableBusinessSeats: number;

  @Column({ type: 'int', default: 20 })
  availableFirstClassSeats: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Reservation, (reservation) => reservation.flight)
  reservations: Reservation[];
}

