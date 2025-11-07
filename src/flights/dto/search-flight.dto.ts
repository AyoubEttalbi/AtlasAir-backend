import { IsNotEmpty, IsUUID, IsDateString, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { FlightClass } from '../../common/enums/flight-class.enum';

export class SearchFlightDto {
  @IsUUID()
  @IsNotEmpty()
  departureAirportId: string;

  @IsUUID()
  @IsNotEmpty()
  arrivalAirportId: string;

  @IsDateString()
  @IsNotEmpty()
  departureDate: string;

  @IsDateString()
  @IsOptional()
  returnDate?: string;

  @IsEnum(FlightClass)
  @IsOptional()
  flightClass?: FlightClass;

  @IsNumber()
  @IsOptional()
  passengers?: number;
}

