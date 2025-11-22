import { Injectable, BadRequestException } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';

interface TestCard {
  cardNumber: string;
  cardHolder: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  balance: number;
}

@Injectable()
export class PaymentValidatorService {
  private testCards: TestCard[] = [];

  constructor() {
    this.loadTestCards();
  }

  private loadTestCards(): void {
    try {
      // Try multiple paths to find the CSV file
      const possiblePaths = [
        join(__dirname, 'data', 'test-cards.csv'), // Compiled location
        join(process.cwd(), 'src', 'payments', 'data', 'test-cards.csv'), // Source location
        join(process.cwd(), 'dist', 'src', 'payments', 'data', 'test-cards.csv'), // Dist location
      ];

      let fileContent: string | null = null;
      for (const csvPath of possiblePaths) {
        try {
          fileContent = readFileSync(csvPath, 'utf-8');
          break;
        } catch (err) {
          // Try next path
          continue;
        }
      }

      if (!fileContent) {
        throw new Error('CSV file not found in any expected location');
      }

      const lines = fileContent.trim().split('\n');
      
      // Skip header line
      const dataLines = lines.slice(1);
      
      this.testCards = dataLines
        .filter(line => line.trim()) // Skip empty lines
        .map(line => {
          const [cardNumber, cardHolder, expiryMonth, expiryYear, cvv, balance] = line.split(',');
          return {
            cardNumber: cardNumber.trim(),
            cardHolder: cardHolder.trim(),
            expiryMonth: expiryMonth.trim(),
            expiryYear: expiryYear.trim(),
            cvv: cvv.trim(),
            balance: parseFloat(balance.trim()),
          };
        });

      console.log(`✅ Loaded ${this.testCards.length} test cards from CSV`);
    } catch (error) {
      console.warn('⚠️  Could not load test cards CSV file:', error.message);
      console.warn('Using default test cards...');
      // Use default test cards if CSV fails to load
      this.testCards = [
        {
          cardNumber: '4111111111111111',
          cardHolder: 'John Doe',
          expiryMonth: '12',
          expiryYear: '2025',
          cvv: '123',
          balance: 10000.00,
        },
        {
          cardNumber: '5555555555554444',
          cardHolder: 'Jane Smith',
          expiryMonth: '06',
          expiryYear: '2026',
          cvv: '456',
          balance: 5000.00,
        },
      ];
    }
  }

  /**
   * Validate card information against test cards
   * @param cardNumber - Card number (spaces removed)
   * @param cardHolder - Card holder name
   * @param expiryDate - Expiry date in MM/YY format
   * @param cvv - CVV code
   * @param amount - Payment amount
   * @returns true if valid, throws error if invalid
   */
  validateCard(
    cardNumber: string,
    cardHolder: string,
    expiryDate: string,
    cvv: string,
    amount: number,
  ): { valid: boolean; card?: TestCard } {
    // Remove spaces and dashes from card number
    const cleanCardNumber = cardNumber.replace(/\s|-/g, '');

    // Parse expiry date (MM/YY format)
    const [expiryMonth, expiryYear] = expiryDate.split('/');
    if (!expiryMonth || !expiryYear) {
      throw new BadRequestException('Invalid expiry date format. Use MM/YY');
    }

    // Normalize expiry year for comparison (handle both 2-digit and 4-digit in CSV)
    const normalizeYear = (year: string): string => {
      const yearNum = parseInt(year);
      if (yearNum < 100) {
        return year; // Already 2-digit
      }
      // Convert 4-digit to 2-digit
      return String(yearNum % 100).padStart(2, '0');
    };

    // Find matching card
    const card = this.testCards.find(
      (c) =>
        c.cardNumber === cleanCardNumber &&
        c.expiryMonth === expiryMonth &&
        normalizeYear(c.expiryYear) === expiryYear &&
        c.cvv === cvv &&
        c.cardHolder.toLowerCase() === cardHolder.toLowerCase(),
    );

    if (!card) {
      console.error('Card validation failed - card not found:', {
        cardNumber: cleanCardNumber.substring(0, 4) + '****',
        expiryMonth,
        expiryYear,
        cvv: '***',
        cardHolder,
        availableCards: this.testCards.map(c => ({
          number: c.cardNumber.substring(0, 4) + '****',
          holder: c.cardHolder,
          expiry: `${c.expiryMonth}/${c.expiryYear}`,
        })),
      });
      throw new BadRequestException(
        'Invalid card details. Card not found or details do not match. Please check card number, holder name, expiry date, and CVV.',
      );
    }

    // Check if card has sufficient balance
    if (card.balance < amount) {
      throw new BadRequestException(
        `Insufficient balance. Available: ${card.balance.toFixed(2)} MAD, Required: ${amount.toFixed(2)} MAD`,
      );
    }

    // Check if card is expired
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    
    // Handle both 2-digit and 4-digit years in CSV
    let cardYear = parseInt(card.expiryYear);
    if (cardYear < 100) {
      // 2-digit year: assume 00-50 is 2000-2050, 51-99 is 1951-1999
      cardYear = cardYear < 50 ? 2000 + cardYear : 1900 + cardYear;
    }
    const cardMonth = parseInt(card.expiryMonth);

    if (
      cardYear < currentYear ||
      (cardYear === currentYear && cardMonth < currentMonth)
    ) {
      throw new BadRequestException(`Card has expired. Expiry: ${card.expiryMonth}/${card.expiryYear}`);
    }

    return { valid: true, card };
  }

  /**
   * Get all test cards (for admin/testing purposes)
   */
  getTestCards(): TestCard[] {
    return this.testCards;
  }

  /**
   * Reload test cards from CSV file
   */
  reloadTestCards(): void {
    this.loadTestCards();
  }
}

