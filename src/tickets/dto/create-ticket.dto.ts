import { IsString, IsDateString, IsOptional, IsUUID } from 'class-validator';

export class CreateTicketDto {
  @IsString()
  numeroBillet: string;

  @IsDateString()
  dateEmission: string;

  @IsOptional()
  @IsString()
  fichierPDF?: string;

  @IsUUID()
  reservationId: string;
}

