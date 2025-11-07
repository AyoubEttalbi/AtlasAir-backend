import { IsNotEmpty, IsString, IsDateString, IsNumber, IsOptional, IsBoolean, IsUUID } from 'class-validator';

export class CreateFlightDto {
  @IsString()
  @IsNotEmpty()
  flightNumber: string;

  @IsUUID()
  @IsNotEmpty()
  airlineId: string;

  @IsUUID()
  @IsNotEmpty()
  departureAirportId: string;

  @IsUUID()
  @IsNotEmpty()
  arrivalAirportId: string;

  @IsDateString()
  @IsNotEmpty()
  departureTime: string;

  @IsDateString()
  @IsNotEmpty()
  arrivalTime: string;

  @IsNumber()
  @IsNotEmpty()
  durationMinutes: number;

  @IsNumber()
  @IsOptional()
  stops?: number;

  @IsNumber()
  @IsNotEmpty()
  economyPrice: number;

  @IsNumber()
  @IsNotEmpty()
  businessPrice: number;

  @IsNumber()
  @IsNotEmpty()
  firstClassPrice: number;

  @IsNumber()
  @IsOptional()
  economySeats?: number;

  @IsNumber()
  @IsOptional()
  businessSeats?: number;

  @IsNumber()
  @IsOptional()
  firstClassSeats?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

