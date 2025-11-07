import { IsNotEmpty, IsString, IsUUID, IsDateString, IsEnum, IsNumber } from 'class-validator';
import { FlightClass } from '../../common/enums/flight-class.enum';

export class CreateReservationDto {
  @IsUUID()
  @IsNotEmpty()
  flightId: string;

  @IsString()
  @IsNotEmpty()
  passengerFirstName: string;

  @IsString()
  @IsNotEmpty()
  passengerLastName: string;

  @IsString()
  @IsNotEmpty()
  passengerPassport: string;

  @IsDateString()
  @IsNotEmpty()
  passengerDateOfBirth: string;

  @IsEnum(FlightClass)
  @IsNotEmpty()
  flightClass: FlightClass;
}

