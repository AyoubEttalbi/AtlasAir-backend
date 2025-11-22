import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { Reservation } from '../../reservations/entities/reservation.entity';

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  numeroBillet: string;

  @Column({ type: 'date' })
  dateEmission: Date;

  @Column({ nullable: true })
  fichierPDF: string;

  @OneToOne(() => Reservation, (reservation) => reservation.ticket)
  @JoinColumn({ name: 'reservation_id' })
  reservation: Reservation;

  @CreateDateColumn()
  createdAt: Date;
}

