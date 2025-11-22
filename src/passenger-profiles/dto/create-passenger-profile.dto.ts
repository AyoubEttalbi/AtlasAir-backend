import { IsNotEmpty, IsString, IsEmail, IsDateString, IsOptional, IsBoolean } from 'class-validator';

export class CreatePassengerProfileDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  middleName?: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  suffix?: string;

  @IsNotEmpty()
  @IsDateString()
  dateOfBirth: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  redressNumber?: string;

  @IsOptional()
  @IsString()
  knownTravelerNumber?: string;

  @IsNotEmpty()
  @IsString()
  passportNumber: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

