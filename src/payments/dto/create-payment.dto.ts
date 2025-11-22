import { IsNotEmpty, IsUUID, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreatePaymentDto {
  @IsUUID()
  @IsNotEmpty()
  reservationId: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsString()
  @IsNotEmpty()
  paymentMethod: string;

  // Card details for validation
  @IsString()
  @IsNotEmpty()
  cardNumber: string;

  @IsString()
  @IsNotEmpty()
  cardHolder: string;

  @IsString()
  @IsNotEmpty()
  expiryDate: string; // MM/YY format

  @IsString()
  @IsNotEmpty()
  cvv: string;
}

