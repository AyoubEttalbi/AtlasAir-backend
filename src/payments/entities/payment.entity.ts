import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { PaymentStatus } from '../../common/enums/payment-status.enum';
import { Reservation } from '../../reservations/entities/reservation.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Reservation, (reservation) => reservation.payment)
  @JoinColumn({ name: 'reservation_id' })
  reservation: Reservation;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ length: 10, default: 'MAD' })
  currency: string;

  @Column({ length: 50 })
  paymentMethod: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Column({ unique: true, length: 100 })
  transactionId: string;

  @CreateDateColumn()
  createdAt: Date;
}

