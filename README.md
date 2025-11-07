# Flight Reservation Backend - AtlasAir

NestJS backend application for flight reservation system with Oracle Database.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Oracle Database (19c or higher)
- Oracle Instant Client

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. Start the application:
```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## 📁 Project Structure

```
src/
├── auth/          # Authentication module
├── users/         # Users module
├── flights/       # Flights module
├── airlines/      # Airlines module
├── airports/      # Airports module
├── reservations/  # Reservations module
├── payments/      # Payments module
├── dashboard/     # Dashboard module
├── notifications/ # Notifications module
├── pdf/           # PDF generation module
├── common/        # Common utilities, enums, filters
└── config/        # Configuration files
```

## 🛠️ Available Scripts

- `npm run start:dev` - Start development server
- `npm run build` - Build for production
- `npm run start:prod` - Start production server
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run e2e tests

## 📚 Documentation

For detailed setup instructions, see the project setup guide.

## 🔌 API Endpoints

All endpoints are prefixed with `/api/v1`. Authentication is required for most endpoints using JWT Bearer token.

### Public Endpoints (No Authentication Required)

#### Authentication
- `POST /api/v1/auth/register` - Register a new user
  - Body: `{ email, password, firstName, lastName, phone }`
- `POST /api/v1/auth/login` - Login and get JWT token
  - Body: `{ email, password }`
  - Returns: `{ access_token, user }`

### Protected Endpoints (JWT Authentication Required)

#### Flights
- `GET /api/v1/flights` - Get all flights
- `GET /api/v1/flights/search` - Search flights (query params: `origin`, `destination`, `departureDate`, etc.)
- `GET /api/v1/flights/:id` - Get flight by ID
- `POST /api/v1/flights` - Create flight (Admin only)
- `PATCH /api/v1/flights/:id` - Update flight (Admin only)
- `DELETE /api/v1/flights/:id` - Delete flight (Admin only)

#### Airports
- `GET /api/v1/airports` - Get all airports
- `GET /api/v1/airports/:id` - Get airport by ID
- `POST /api/v1/airports` - Create airport (Admin only)
- `PATCH /api/v1/airports/:id` - Update airport (Admin only)
- `DELETE /api/v1/airports/:id` - Delete airport (Admin only)

#### Airlines
- `GET /api/v1/airlines` - Get all airlines
- `GET /api/v1/airlines/:id` - Get airline by ID
- `POST /api/v1/airlines` - Create airline (Admin only)
- `PATCH /api/v1/airlines/:id` - Update airline (Admin only)
- `DELETE /api/v1/airlines/:id` - Delete airline (Admin only)

#### Reservations
- `GET /api/v1/reservations` - Get reservations (Admin: all, User: own only)
- `GET /api/v1/reservations/:id` - Get reservation by ID
- `POST /api/v1/reservations` - Create reservation
- `PATCH /api/v1/reservations/:id` - Update reservation
- `POST /api/v1/reservations/:id/cancel` - Cancel reservation
- `DELETE /api/v1/reservations/:id` - Delete reservation (Admin only)

#### Payments
- `GET /api/v1/payments` - Get all payments (Admin only)
- `GET /api/v1/payments/:id` - Get payment by ID
- `POST /api/v1/payments` - Create payment
- `PATCH /api/v1/payments/:id/status` - Update payment status (Admin only)

#### Users
- `GET /api/v1/users` - Get all users (Admin only)
- `GET /api/v1/users/:id` - Get user by ID
- `POST /api/v1/users` - Create user (Admin only)
- `PATCH /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user (Admin only)

#### Dashboard
- `GET /api/v1/dashboard/statistics` - Get dashboard statistics (Admin only)

### Authentication

Include the JWT token in the Authorization header for protected endpoints:
```
Authorization: Bearer <your_jwt_token>
```

### Role-Based Access

- **Admin**: Full access to all endpoints
- **User/Client**: Limited access - can manage own reservations and view flights/airports/airlines

## 🔐 Security

Remember to change the JWT_SECRET in production environment!

## 📝 License

Private project - All rights reserved

