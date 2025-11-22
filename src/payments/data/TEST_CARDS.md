# Test Cards for Payment Testing

## Available Test Cards

Use these cards to test payment functionality:

| Card Number | Card Holder | Expiry (MM/YY) | CVV | Balance |
|------------|-------------|----------------|-----|---------|
| 4111111111111111 | John Doe | 12/25 | 123 | 10,000 MAD |
| 5555555555554444 | Jane Smith | 06/26 | 456 | 5,000 MAD |
| 4242424242424242 | Bob Johnson | 09/25 | 789 | 7,500 MAD |
| 378282246310005 | Alice Williams | 03/27 | 321 | 12,000 MAD |
| 6011111111111117 | Charlie Brown | 11/26 | 654 | 8,000 MAD |
| 4000000000000002 | Test User | 01/25 | 999 | 1,000 MAD |

## How to Use

1. Fill in the payment form with any of the above card details
2. Make sure the card holder name matches exactly (case-insensitive)
3. Use the correct expiry date format: MM/YY (e.g., 12/25)
4. Enter the matching CVV code
5. Ensure the payment amount doesn't exceed the card's balance

## Testing Scenarios

### ✅ Valid Payment
- Use any card from the list with correct details
- Payment amount ≤ card balance
- Card not expired

### ❌ Invalid Card Details
- Wrong card number
- Wrong card holder name
- Wrong expiry date
- Wrong CVV

### ❌ Insufficient Balance
- Try to pay more than the card's balance
- Example: Use "Test User" card (1,000 MAD) and try to pay 2,000 MAD

### ❌ Expired Card
- Use a card with expiry date in the past
- System will reject the payment

## Notes

- Card numbers can be entered with or without spaces
- Card holder names are case-insensitive
- Expiry dates must be in MM/YY format
- CVV must match exactly

