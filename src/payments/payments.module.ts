import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { PaymentValidatorService } from './payment-validator.service';
import { Payment } from './entities/payment.entity';
import { Reservation } from '../reservations/entities/reservation.entity';
import { TicketsModule } from '../tickets/tickets.module';
import { PdfModule } from '../pdf/pdf.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, Reservation]),
    TicketsModule,
    PdfModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, PaymentValidatorService],
  exports: [PaymentsService],
})
export class PaymentsModule {}

