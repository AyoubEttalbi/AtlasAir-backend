# Test Cards CSV File

This CSV file contains fake card information for testing payment functionality.

## File Format

```csv
cardNumber,cardHolder,expiryMonth,expiryYear,cvv,balance
```

## Columns

- **cardNumber**: 16-digit card number (no spaces)
- **cardHolder**: Full name of card holder
- **expiryMonth**: Expiry month (01-12)
- **expiryYear**: Expiry year (4 digits, e.g., 2025)
- **cvv**: 3-digit CVV code
- **balance**: Available balance in MAD (decimal number)

## Example Test Cards

| Card Number | Card Holder | Expiry | CVV | Balance |
|------------|-------------|--------|-----|---------|
| 4111111111111111 | John Doe | 12/2025 | 123 | 10,000 MAD |
| 5555555555554444 | Jane Smith | 06/2026 | 456 | 5,000 MAD |
| 4242424242424242 | Bob Johnson | 09/2025 | 789 | 7,500 MAD |
| 378282246310005 | Alice Williams | 03/2027 | 321 | 12,000 MAD |
| 6011111111111117 | Charlie Brown | 11/2026 | 654 | 8,000 MAD |
| 4000000000000002 | Test User | 01/2025 | 999 | 1,000 MAD |

## Usage

When processing a payment, the system will:
1. Validate card number, holder name, expiry date, and CVV match
2. Check if card has expired
3. Verify sufficient balance for the payment amount
4. Process payment if all validations pass

## Adding New Test Cards

Simply add a new line to the CSV file with the card details:

```csv
1234567890123456,New User,12,2027,111,15000.00
```

**Note**: After adding new cards, restart the backend server for changes to take effect.

## Security Note

⚠️ **These are test cards only!** Do not use real card information in this file. This file should never be committed to production or exposed publicly.

