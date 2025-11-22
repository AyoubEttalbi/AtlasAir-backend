import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PassengerProfile } from './entities/passenger-profile.entity';
import { CreatePassengerProfileDto } from './dto/create-passenger-profile.dto';
import { UpdatePassengerProfileDto } from './dto/update-passenger-profile.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PassengerProfilesService {
  constructor(
    @InjectRepository(PassengerProfile)
    private passengerProfilesRepository: Repository<PassengerProfile>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(userId: string, createPassengerProfileDto: CreatePassengerProfileDto): Promise<PassengerProfile> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // If this is set as default, unset other defaults for this user
    if (createPassengerProfileDto.isDefault) {
      await this.passengerProfilesRepository.update(
        { user: { id: userId } },
        { isDefault: false },
      );
    }

    const profile = this.passengerProfilesRepository.create({
      ...createPassengerProfileDto,
      user,
      dateOfBirth: new Date(createPassengerProfileDto.dateOfBirth),
    });

    return this.passengerProfilesRepository.save(profile);
  }

  async findAll(userId: string): Promise<PassengerProfile[]> {
    return this.passengerProfilesRepository.find({
      where: { user: { id: userId } },
      order: { isDefault: 'DESC', createdAt: 'DESC' },
    });
  }

  async findDefault(userId: string): Promise<PassengerProfile | null> {
    return this.passengerProfilesRepository.findOne({
      where: { user: { id: userId }, isDefault: true },
    });
  }

  async findOne(id: string, userId: string): Promise<PassengerProfile> {
    const profile = await this.passengerProfilesRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!profile) {
      throw new NotFoundException(`Passenger profile with ID ${id} not found`);
    }

    return profile;
  }

  async update(id: string, userId: string, updatePassengerProfileDto: UpdatePassengerProfileDto): Promise<PassengerProfile> {
    const profile = await this.findOne(id, userId);

    // If setting as default, unset other defaults
    if (updatePassengerProfileDto.isDefault) {
      const otherProfiles = await this.passengerProfilesRepository.find({
        where: { user: { id: userId } },
      });
      for (const otherProfile of otherProfiles) {
        if (otherProfile.id !== id && otherProfile.isDefault) {
          otherProfile.isDefault = false;
          await this.passengerProfilesRepository.save(otherProfile);
        }
      }
    }

    if (updatePassengerProfileDto.dateOfBirth) {
      profile.dateOfBirth = new Date(updatePassengerProfileDto.dateOfBirth);
      delete (updatePassengerProfileDto as any).dateOfBirth;
    }

    Object.assign(profile, updatePassengerProfileDto);
    return this.passengerProfilesRepository.save(profile);
  }

  async remove(id: string, userId: string): Promise<void> {
    const profile = await this.findOne(id, userId);
    await this.passengerProfilesRepository.remove(profile);
  }
}

