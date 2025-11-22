# Next Tasks - Frontend-Backend Integration

## 📋 Overview
This document outlines the tasks needed to integrate the Trimpa2 frontend with the AtlasAir-backend API. Currently, the frontend uses mock data and needs to be connected to the real backend services.

---

## 🔴 Priority 1: Core Infrastructure Setup

### 1.1 Create API Service Layer
**Status:** ✅ **COMPLETED**  
**Files Created:**
- ✅ `src/services/api.ts` - Axios instance with base configuration
- ✅ `src/services/auth.service.ts` - Authentication API calls
- ✅ `src/services/flights.service.ts` - Flight search and CRUD operations
- ✅ `src/services/airports.service.ts` - Airport data fetching
- ✅ `src/services/airlines.service.ts` - Airline data fetching
- ✅ `src/services/reservations.service.ts` - Reservation management
- ✅ `src/services/payments.service.ts` - Payment processing
- ✅ `src/services/types/api.types.ts` - TypeScript interfaces matching backend DTOs
- ✅ `src/services/index.ts` - Central export for all services

**Tasks:**
- [x] Set up Axios instance with base URL from environment variables
- [x] Add request interceptor to attach JWT token to headers
- [x] Add response interceptor for error handling
- [x] Create TypeScript interfaces matching backend DTOs
- [x] Implement all service methods for each module

---

### 1.2 Environment Configuration
**Status:** ✅ **COMPLETED**  
**Files Created:**
- ✅ `.env.example` - Template with environment variables
- ✅ API base URL configured in `src/services/api.ts` with fallback

**Tasks:**
- [x] Add `VITE_API_BASE_URL` environment variable (configured in api.ts with fallback)
- [x] Set default to `http://localhost:3000/api/v1` for development
- [x] Create `.env.example` with template values (documented in code)
- [x] Update `.gitignore` to exclude `.env.local` (already in .gitignore as `*.local`)

---

### 1.3 Authentication Integration
**Status:** ✅ **COMPLETED**  
**Files Created/Updated:**
- ✅ `src/context/AuthContext.tsx` - Authentication state management with useAuth hook
- ✅ `src/services/auth.service.ts` - Auth API calls (created in 1.1)
- ✅ `src/util/auth.tsx` - Updated to use authService
- ✅ `src/shared/layout/Header/Header.tsx` - Updated with AuthContext integration
- ✅ `src/features/auth/Signup/SignUp.tsx` - Updated with login/register functionality
- ✅ `src/components/ProtectedRoute.tsx` - Protected route wrapper component
- ✅ `src/main.tsx` - Wrapped app with AuthProvider

**Tasks:**
- [x] Create AuthContext with login, logout, register, and user state
- [x] Implement JWT token storage in localStorage/sessionStorage
- [x] Add token refresh logic (if needed) - Basic implementation done
- [x] Create protected route wrapper component
- [x] Update Header component with user menu and logout
- [x] Add login/register pages or modals (integrated in SignUp component)
- [x] Handle token expiration and auto-logout (handled in API interceptor)

---

## 🟡 Priority 2: Flight Search & Display Integration

### 2.1 Airport Data Integration
**Status:** ✅ **COMPLETED**  
**Files Created/Updated:**
- ✅ `src/hooks/useAirports.tsx` - Custom hook for fetching and managing airports
- ✅ `src/features/flights/FlightSearchBar/FlightSearchBar.tsx` - Updated to use real airport data

**Tasks:**
- [x] Fetch airports from `/api/v1/airports` endpoint
- [x] Replace hardcoded `destinations` array with real airport data
- [x] Map airport codes to full names (e.g., "JFK" → "John F. Kennedy International Airport")
- [x] Add airport search/filter functionality (in useAirports hook)
- [x] Handle loading and error states

---

### 2.2 Flight Search Integration
**Status:** ✅ **COMPLETED**  
**Files Updated:**
- ✅ `src/pages/FlightsSearch/index.tsx` - Integrated real flight search API
- ✅ `src/services/flights.service.ts` - Already created with data transformation

**Tasks:**
- [x] Replace mock `departingFlights` and `returningFlights` with API calls
- [x] Map search form values to backend `SearchFlightDto` format:
  - Convert airport codes to UUIDs (using airport lookup)
  - Format dates correctly (ISO 8601)
  - Handle round-trip vs one-way searches
- [x] Call `/api/v1/flights/search` with proper query parameters
- [x] Transform backend flight response to match frontend `Flight` interface (in flightsService)
- [x] Handle empty results and display appropriate messages
- [x] Add loading states while fetching
- [x] Implement error handling with user-friendly messages

**Backend Response Mapping:**
- Backend returns flight entities with relationships (airline, airports)
- Frontend expects: `id`, `logo`, `airline`, `duration`, `time`, `stops[]`, `price{}`, `flightType`, `flightNumber`
- Need to map backend data structure to frontend format

---

### 2.3 Flight Details Integration
**Status:** Not Started  
**Files to Update:**
- `src/services/flights.service.ts`
- `src/features/flights/SelectedFlights/SelectedFlights.tsx`

**Tasks:**
- [ ] Fetch individual flight details from `/api/v1/flights/:id`
- [ ] Display airline logos (may need to add logo URLs to backend or use CDN)
- [ ] Show flight duration, stops, and pricing correctly
- [ ] Handle flight not found errors

---

## 🟢 Priority 3: Reservation Flow Integration

### 3.1 Passenger Information Submission
**Status:** ✅ **COMPLETED**  
**Files Updated:**
- ✅ `src/pages/FlightsPassengerInfo/index.tsx` - Added validation and form handling
- ✅ `src/features/PassengerInfo/PassengerForm/PassengerForm.tsx` - Added passport field
- ✅ `src/shared/types/index.ts` - Updated Passenger and BookedFlights types

**Tasks:**
- [x] Map frontend passenger form data to `CreateReservationDto` (done in seat selection)
- [x] Handle multiple passengers (create multiple reservations)
- [x] Validate passenger data before submission
- [x] Store reservation IDs after creation (in seat selection)
- [x] Handle validation errors from backend
- [x] Add form validation matching backend requirements

**Note:** Backend `CreateReservationDto` expects:
- `flightId` (UUID)
- `passengerFirstName`
- `passengerLastName`
- `passengerPassport`
- `passengerDateOfBirth`
- `flightClass` (enum)

Frontend has more fields (email, phone, etc.) - may need to extend backend DTO or store separately.

---

### 3.2 Seat Selection Integration
**Status:** ✅ **COMPLETED**  
**Files Updated:**
- ✅ `src/pages/FlightsSeatSelection/index.tsx` - Integrated reservation creation after seat selection
- ✅ `src/shared/types/index.ts` - Added selectedSeats and reservationIds to BookedFlights

**Tasks:**
- [x] Store selected seats with reservation (stored in localStorage)
- [x] Create reservations after seat selection (one per passenger per flight)
- [x] Map seat class to FlightClass enum
- [x] Handle reservation creation errors
- [x] Store reservation IDs for payment processing

**Note:** Backend may need seat management endpoints if not already implemented.

---

### 3.3 Payment Integration
**Status:** ✅ **COMPLETED**  
**Files Created/Updated:**
- ✅ `src/pages/FlightsPayment/index.tsx` - Complete payment page with form and processing
- ✅ `src/services/payments.service.ts` - Already created in Priority 1

**Tasks:**
- [x] Build payment page UI (complete with card form)
- [x] Create payment form with card details
- [x] Call `/api/v1/payments` endpoint with `CreatePaymentDto`
- [x] Link payment to reservation (creates payment for each reservation)
- [x] Handle payment status updates
- [x] Show payment confirmation
- [x] Clear booking data after successful payment

**Backend Payment DTO:**
- Need to check `CreatePaymentDto` structure
- Likely needs: `reservationId`, `amount`, `paymentMethod`, etc.

---

## 🔵 Priority 4: User Experience Enhancements

### 4.1 Loading States
**Status:** Not Started  
**Files to Update:**
- All pages and components making API calls

**Tasks:**
- [ ] Add loading spinners/skeletons for all async operations
- [ ] Prevent duplicate API calls
- [ ] Show loading states during form submissions
- [ ] Add debouncing for search inputs

---

### 4.2 Error Handling
**Status:** Not Started  
**Files to Create/Update:**
- `src/components/ErrorBoundary.tsx`
- `src/utils/errorHandler.ts`
- All service files

**Tasks:**
- [ ] Create global error boundary
- [ ] Implement consistent error message display
- [ ] Handle network errors gracefully
- [ ] Show user-friendly error messages
- [ ] Log errors for debugging
- [ ] Handle 401 (unauthorized) - redirect to login
- [ ] Handle 403 (forbidden) - show access denied
- [ ] Handle 404 (not found) - show not found page
- [ ] Handle 500 (server error) - show generic error message

---

### 4.3 Success States & Feedback
**Status:** Not Started  
**Files to Create/Update:**
- `src/components/Toast/Toast.tsx` or use a library
- All form submission handlers

**Tasks:**
- [ ] Add success notifications for completed actions
- [ ] Show confirmation messages after booking
- [ ] Display booking confirmation number
- [ ] Add success animations/transitions

---

## 🟣 Priority 5: Data Management

### 5.1 State Management
**Status:** Not Started  
**Files to Create/Update:**
- Consider adding Zustand/Redux or using React Context more extensively

**Tasks:**
- [ ] Decide on state management solution (Context API vs Zustand/Redux)
- [ ] Create global state for:
  - Current search results
  - Selected flights
  - Booking flow state
  - User preferences
- [ ] Replace sessionStorage usage with proper state management
- [ ] Implement state persistence where needed

---

### 5.2 Caching & Optimization
**Status:** Not Started  
**Tasks:**
- [ ] Cache airport/airline data (rarely changes)
- [ ] Implement React Query or SWR for data fetching
- [ ] Add request deduplication
- [ ] Cache flight search results (with expiration)
- [ ] Optimize re-renders with React.memo where appropriate

---

## 🟠 Priority 6: Additional Features

### 6.1 User Dashboard
**Status:** Not Started  
**Files to Create:**
- `src/pages/UserDashboard/index.tsx`
- `src/pages/MyBookings/index.tsx`

**Tasks:**
- [ ] Create user dashboard page
- [ ] Fetch user reservations from `/api/v1/reservations`
- [ ] Display booking history
- [ ] Add ability to cancel reservations
- [ ] Show upcoming trips
- [ ] Display past trips

---

### 6.2 Booking Management
**Status:** Not Started  
**Files to Update:**
- `src/services/reservations.service.ts`

**Tasks:**
- [ ] Implement reservation cancellation (`POST /api/v1/reservations/:id/cancel`)
- [ ] Add ability to view reservation details
- [ ] Generate booking PDFs (if backend supports)
- [ ] Send booking confirmation emails (backend handles, frontend triggers)

---

### 6.3 Admin Features
**Status:** ✅ **COMPLETED**  
**Files Created:**
- ✅ `src/pages/Admin/AdminLayout.tsx` - Admin layout with sidebar navigation
- ✅ `src/pages/Admin/Dashboard/index.tsx` - Admin dashboard with statistics
- ✅ `src/pages/Admin/Flights/index.tsx` - Flight CRUD management
- ✅ `src/pages/Admin/Airlines/index.tsx` - Airline CRUD management
- ✅ `src/pages/Admin/Airports/index.tsx` - Airport CRUD management
- ✅ `src/pages/Admin/Users/index.tsx` - User CRUD management
- ✅ `src/pages/Admin/Reservations/index.tsx` - Reservation management
- ✅ `src/pages/Admin/Payments/index.tsx` - Payment status management
- ✅ `src/components/AdminRoute.tsx` - Admin route protection
- ✅ `src/services/dashboard.service.ts` - Dashboard statistics service
- ✅ `src/services/users.service.ts` - User management service

**Tasks:**
- [x] Create admin dashboard (with statistics)
- [x] Add flight/airline/airport management UI (full CRUD)
- [x] Display dashboard statistics (revenue, bookings, users, etc.)
- [x] Manage users (create, update, delete)
- [x] Manage reservations (view, cancel, delete)
- [x] Manage payments (view, update status)
- [x] Role-based access control (AdminRoute component)
- [x] Admin navigation in header (only visible to admins)

---

## 🔧 Technical Debt & Improvements

### Code Quality
- [ ] Add TypeScript strict mode checks
- [ ] Ensure all API responses are properly typed
- [ ] Add JSDoc comments to service functions
- [ ] Create shared types file for API responses
- [ ] Remove all mock data imports once integration is complete

### Testing
- [ ] Write unit tests for API services
- [ ] Add integration tests for booking flow
- [ ] Test error scenarios
- [ ] Test authentication flow

### Documentation
- [ ] Document API integration patterns
- [ ] Create API response type definitions
- [ ] Document environment variables
- [ ] Update README with setup instructions

---

## 📝 Notes & Considerations

### Backend API Requirements
1. **Authentication:** All flight endpoints require JWT authentication. Need to ensure user is logged in before searching.
2. **Airport Lookup:** Backend uses UUIDs for airports, but frontend uses codes (JFK, LAX, etc.). Need mapping layer.
3. **Date Format:** Backend expects ISO 8601 date strings. Frontend date picker needs to format correctly.
4. **Flight Class:** Backend uses enum (ECONOMY, BUSINESS, FIRST). Frontend uses strings. Need mapping.
5. **Reservation Structure:** Backend creates one reservation per passenger. Frontend may need to create multiple reservations for multiple passengers.

### Potential Backend Enhancements Needed
- [ ] Seat management endpoints (if not exists)
- [ ] Batch reservation creation (for multiple passengers)
- [ ] Airport code lookup endpoint (code → UUID)
- [ ] Flight search with airport codes (instead of UUIDs)
- [ ] Enhanced passenger information in reservation DTO
- [ ] Booking confirmation PDF generation endpoint

### Frontend-Backend Data Mapping
- Backend flight entity structure may differ from frontend `Flight` interface
- Need to create mapping functions to transform data
- Consider creating a shared types package or ensuring types match

---

## 🚀 Quick Start Checklist

To begin integration, start with these steps in order:

1. ✅ **Set up environment variables** (Priority 1.2)
2. ✅ **Create API service layer** (Priority 1.1)
3. ✅ **Implement authentication** (Priority 1.3)
4. ✅ **Integrate airport data** (Priority 2.1)
5. ✅ **Connect flight search** (Priority 2.2)
6. ✅ **Complete reservation flow** (Priority 3.1-3.3)
7. ✅ **Add error handling** (Priority 4.2)
8. ✅ **Polish UX** (Priority 4.1, 4.3)

---

## 📅 Estimated Timeline

- **Week 1:** Priorities 1 & 2 (Infrastructure + Flight Search)
- **Week 2:** Priority 3 (Reservation Flow)
- **Week 3:** Priorities 4 & 5 (UX + State Management)
- **Week 4:** Priority 6 + Testing + Polish

---

**Last Updated:** [Current Date]  
**Status:** Ready to Start

