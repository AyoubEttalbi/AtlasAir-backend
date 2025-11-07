import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';
import { Reservation } from '../reservations/entities/reservation.entity';

@Injectable()
export class PdfService {
  constructor(private configService: ConfigService) {}

  async generateTicket(reservation: Reservation): Promise<string> {
    const uploadLocation = this.configService.get('UPLOAD_LOCATION') || './uploads';
    
    // Ensure upload directory exists
    if (!fs.existsSync(uploadLocation)) {
      fs.mkdirSync(uploadLocation, { recursive: true });
    }

    const filename = `ticket-${reservation.bookingReference}.pdf`;
    const filepath = path.join(uploadLocation, filename);

    const doc = new PDFDocument({ margin: 50 });

    doc.pipe(fs.createWriteStream(filepath));

    // Header
    doc.fontSize(20).text('Flight Ticket', { align: 'center' });
    doc.moveDown();

    // Booking Information
    doc.fontSize(16).text('Booking Information', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12);
    doc.text(`Booking Reference: ${reservation.bookingReference}`);
    doc.text(`Passenger: ${reservation.passengerFirstName} ${reservation.passengerLastName}`);
    doc.text(`Passport: ${reservation.passengerPassport}`);
    doc.moveDown();

    // Flight Information
    doc.fontSize(16).text('Flight Information', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12);
    doc.text(`Flight Number: ${reservation.flight.flightNumber}`);
    doc.text(`Airline: ${reservation.flight.airline.name}`);
    doc.text(`Departure: ${reservation.flight.departureAirport.name} (${reservation.flight.departureAirport.code})`);
    doc.text(`Arrival: ${reservation.flight.arrivalAirport.name} (${reservation.flight.arrivalAirport.code})`);
    doc.text(`Departure Time: ${new Date(reservation.flight.departureTime).toLocaleString()}`);
    doc.text(`Arrival Time: ${new Date(reservation.flight.arrivalTime).toLocaleString()}`);
    doc.text(`Class: ${reservation.flightClass}`);
    doc.moveDown();

    // Payment Information
    doc.fontSize(16).text('Payment Information', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12);
    doc.text(`Total Price: ${reservation.totalPrice} MAD`);
    doc.text(`Status: ${reservation.status}`);
    doc.moveDown();

    // Footer
    doc.fontSize(10).text('Thank you for choosing our service!', { align: 'center' });

    doc.end();

    return new Promise((resolve, reject) => {
      doc.on('end', () => resolve(filepath));
      doc.on('error', reject);
    });
  }

  async generateInvoice(reservation: Reservation): Promise<string> {
    const uploadLocation = this.configService.get('UPLOAD_LOCATION') || './uploads';
    
    if (!fs.existsSync(uploadLocation)) {
      fs.mkdirSync(uploadLocation, { recursive: true });
    }

    const filename = `invoice-${reservation.bookingReference}.pdf`;
    const filepath = path.join(uploadLocation, filename);

    const doc = new PDFDocument({ margin: 50 });

    doc.pipe(fs.createWriteStream(filepath));

    // Header
    doc.fontSize(20).text('Invoice', { align: 'center' });
    doc.moveDown();

    // Invoice Details
    doc.fontSize(12);
    doc.text(`Invoice Number: INV-${reservation.bookingReference}`);
    doc.text(`Date: ${new Date().toLocaleDateString()}`);
    doc.moveDown();

    // Customer Information
    doc.fontSize(16).text('Customer Information', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12);
    doc.text(`Name: ${reservation.passengerFirstName} ${reservation.passengerLastName}`);
    doc.moveDown();

    // Service Details
    doc.fontSize(16).text('Service Details', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12);
    doc.text(`Flight: ${reservation.flight.flightNumber}`);
    doc.text(`Route: ${reservation.flight.departureAirport.city} → ${reservation.flight.arrivalAirport.city}`);
    doc.text(`Class: ${reservation.flightClass}`);
    doc.moveDown();

    // Payment Summary
    doc.fontSize(16).text('Payment Summary', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12);
    doc.text(`Subtotal: ${reservation.totalPrice} MAD`);
    doc.text(`Total: ${reservation.totalPrice} MAD`);
    doc.moveDown();

    doc.end();

    return new Promise((resolve, reject) => {
      doc.on('end', () => resolve(filepath));
      doc.on('error', reject);
    });
  }
}

