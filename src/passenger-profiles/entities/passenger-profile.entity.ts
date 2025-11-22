import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('passenger_profiles')
export class PassengerProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.passengerProfiles)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ length: 100 })
  firstName: string;

  @Column({ length: 100, nullable: true })
  middleName: string;

  @Column({ length: 100 })
  lastName: string;

  @Column({ length: 20, nullable: true })
  suffix: string;

  @Column({ type: 'date' })
  dateOfBirth: Date;

  @Column({ length: 100 })
  email: string;

  @Column({ length: 20 })
  phone: string;

  @Column({ length: 50, nullable: true })
  redressNumber: string;

  @Column({ length: 50, nullable: true })
  knownTravelerNumber: string;

  @Column({ length: 50 })
  passportNumber: string;

  @Column({ default: true })
  isDefault: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

