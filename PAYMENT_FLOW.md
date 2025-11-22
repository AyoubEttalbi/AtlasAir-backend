# Payment Handling System Documentation

## Overview
Your website uses a **mock payment system** that simulates payment processing without integrating with a real payment gateway (like Stripe, PayPal, etc.). This is suitable for development/testing but needs a real gateway integration for production.

## Payment Flow

### 1. **User Journey**
```
Flight Search → Select Flights → Passenger Info → Seat Selection → Payment → Confirmation
```

### 2. **Payment Page** (`/flights/payment`)

**Frontend (`Trimpa2/src/pages/FlightsPayment/index.tsx`):**
- **Authentication Check**: Redirects to login if user is not authenticated
- **Data Loading**: Loads booking data from `localStorage` (includes `reservationIds`)
- **Payment Form**: Collects:
  - Card Number
  - Card Holder Name
  - Expiry Date (MM/YY)
  - CVV
  - Payment Method (default: "credit_card")

**Features:**
- Calculates total price from selected flights
- Validates all payment fields before submission
- Shows booking summary with flight details
- Displays total amount in MAD (Moroccan Dirham)

### 3. **Payment Processing**

**When user clicks "Pay":**

1. **Frontend Validation**:
   - Checks all payment fields are filled
   - Verifies reservation IDs exist

2. **Payment Creation**:
   - Creates a payment record for **each reservation** (one per passenger per flight)
   - Splits total amount across all reservations
   - Sends payment data to backend API

3. **Backend Processing** (`AtlasAir-backend/src/payments/payments.service.ts`):
   ```typescript
   - Validates reservation exists
   - Checks reservation is not cancelled
   - Verifies payment amount matches reservation total (±0.01 tolerance)
   - Prevents duplicate payments (one payment per reservation)
   - Generates unique transaction ID (format: TXN{timestamp}{random})
   - Creates payment record with status: COMPLETED
   - Updates reservation status to: CONFIRMED
   ```

### 4. **Payment Entity Structure**

**Database Table: `payments`**
- `id`: UUID (Primary Key)
- `reservation_id`: Foreign Key to reservations (One-to-One relationship)
- `amount`: Decimal (10,2) - Payment amount
- `currency`: String (default: "MAD")
- `paymentMethod`: String (e.g., "credit_card")
- `status`: Enum (PENDING, COMPLETED, FAILED, REFUNDED)
- `transactionId`: Unique transaction identifier
- `createdAt`: Timestamp

### 5. **Payment Status Flow**

```
PENDING → COMPLETED (on successful payment)
       → FAILED (if payment fails)
COMPLETED → REFUNDED (if refunded)
```

**Current Implementation:**
- Payments are automatically set to `COMPLETED` status
- No real payment gateway integration
- No actual card validation or processing

### 6. **Reservation Status Update**

When payment is created:
- Reservation status changes from `PENDING` → `CONFIRMED`
- Payment is linked to reservation (One-to-One relationship)
- Booking is finalized

### 7. **After Payment**

**Success:**
- Shows success message
- Clears booking data from `localStorage`
- Redirects to flights page after 3 seconds
- Reservation is confirmed and ready for ticket generation

**Failure:**
- Shows error message
- Keeps booking data in `localStorage`
- User can retry payment

## API Endpoints

### Create Payment
```
POST /api/v1/payments
Headers: Authorization: Bearer {token}
Body: {
  reservationId: string (UUID)
  amount: number
  currency?: string (default: "MAD")
  paymentMethod: string
}
```

### Get Payment
```
GET /api/v1/payments/:id
Headers: Authorization: Bearer {token}
```

### Get All Payments (Admin Only)
```
GET /api/v1/payments
Headers: Authorization: Bearer {token}
Requires: ADMIN role
```

### Update Payment Status (Admin Only)
```
PATCH /api/v1/payments/:id/status
Headers: Authorization: Bearer {token}
Body: { status: PaymentStatus }
Requires: ADMIN role
```

## Security Features

1. **Authentication Required**: All payment endpoints require JWT authentication
2. **Amount Validation**: Payment amount must match reservation total
3. **Duplicate Prevention**: One payment per reservation
4. **Status Checks**: Cannot pay for cancelled reservations
5. **Admin Controls**: Only admins can view all payments and update statuses

## Current Limitations

⚠️ **Important**: This is a **mock payment system**:

1. **No Real Payment Gateway**: Cards are not actually charged
2. **No Card Validation**: No Luhn algorithm or card type validation
3. **No PCI Compliance**: Card data is sent but not securely stored
4. **Auto-Complete**: Payments are automatically marked as COMPLETED
5. **No Refund Processing**: Refund status exists but no actual refund logic

## Production Recommendations

For production, integrate with a real payment gateway:

### Option 1: Stripe
- Most popular payment gateway
- Supports cards, digital wallets
- Strong security and PCI compliance
- Webhook support for payment confirmations

### Option 2: PayPal
- Widely recognized
- Supports multiple payment methods
- Good for international payments

### Option 3: Local Payment Gateway (Morocco)
- CMI (Credit Mutuel International)
- Payzone
- Other local providers

### Integration Steps:
1. Install payment gateway SDK
2. Create payment intent on backend
3. Send client secret to frontend
4. Process payment on frontend
5. Receive webhook confirmation
6. Update payment status based on webhook
7. Never store full card numbers (use tokens)

## Payment Data Flow Diagram

```
User fills payment form
    ↓
Frontend validates form
    ↓
Frontend calls POST /payments for each reservation
    ↓
Backend validates:
  - Reservation exists
  - Amount matches
  - No duplicate payment
    ↓
Backend creates Payment record
    ↓
Backend updates Reservation status to CONFIRMED
    ↓
Backend returns payment confirmation
    ↓
Frontend shows success message
    ↓
Frontend clears booking data
    ↓
Redirect to flights page
```

## Testing

To test payments:
1. Complete flight booking flow
2. Fill in payment form (any card number works)
3. Submit payment
4. Check database for payment records
5. Verify reservation status is CONFIRMED

## Related Files

**Backend:**
- `src/payments/payments.service.ts` - Payment business logic
- `src/payments/payments.controller.ts` - Payment API endpoints
- `src/payments/entities/payment.entity.ts` - Payment database model
- `src/payments/dto/create-payment.dto.ts` - Payment creation DTO

**Frontend:**
- `src/pages/FlightsPayment/index.tsx` - Payment page component
- `src/services/payments.service.ts` - Payment API service

