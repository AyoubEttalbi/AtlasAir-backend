import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Reservation } from '../../reservations/entities/reservation.entity';
import { User } from '../../users/entities/user.entity';

export enum NotificationType {
  EMAIL = 'email',
  SMS = 'sms',
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar2',
    length: 20,
  })
  type: NotificationType;

  @Column({ type: 'timestamp' })
  dateEnvoi: Date;

  @Column({ type: 'clob', nullable: true })
  message: string;

  @ManyToOne(() => Reservation, { nullable: true })
  @JoinColumn({ name: 'reservation_id' })
  reservation: Reservation;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar2', length: 20, default: 'sent' })
  status: string; // 'sent', 'failed', 'pending'

  @CreateDateColumn()
  createdAt: Date;
}

