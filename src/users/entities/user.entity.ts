import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserRole } from '../../common/enums/user-role.enum';
import { Reservation } from '../../reservations/entities/reservation.entity';
import { PassengerProfile } from '../../passenger-profiles/entities/passenger-profile.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column({ length: 100 })
  firstName: string;

  @Column({ length: 100 })
  lastName: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column()
  @Exclude()
  password: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: UserRole.CLIENT,
  })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Reservation, (reservation) => reservation.user)
  reservations: Reservation[];

  @OneToMany(() => PassengerProfile, (profile) => profile.user)
  passengerProfiles: PassengerProfile[];
}

