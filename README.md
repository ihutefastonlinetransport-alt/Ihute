# IHUTE Online Fast Booking Transport

Complete transport booking platform for Rwanda with support for public buses and private vehicles.

## Features

✅ **Public Transport**
- Express bus booking with real-time seat availability
- Multi-express support (RITCO, Stella, etc.)
- Route management and pricing
- Trip scheduling

✅ **Private Transport**
- Private car booking with driver assignment
- Real-time driver location tracking
- Seat selection and locking
- Direct driver communication

✅ **Secure Payments**
- MOMO, Airtel Money, Card, and Cash options
- Payment locking during checkout
- Transaction tracking and receipts

✅ **Multi-Role Access**
- Super Admin: Full system control
- Express Admin: Manage assigned express with permanent codes
- Viewer Admin: Read-only access
- Private Admin: Vehicle & driver management
- Driver: Trip management and passenger tracking
- Passenger: Full booking workflow

✅ **Security & Compliance**
- JWT-based authentication
- Role-based access control (RBAC)
- Audit logs for all admin actions
- Encrypted passwords with bcrypt

✅ **Multi-Language**
- English, French, Swahili, Kinyarwanda
- Language switcher on homepage
- Full i18n support with next-i18next

✅ **Notifications**
- Email confirmations and reminders
- SMS notifications for bookings
- 30-minute pre-departure reminders

## Tech Stack

- **Frontend**: Next.js 14, React 18, Zustand (state), Axios
- **Backend**: Express.js, Node.js, TypeScript
- **Database**: PostgreSQL 15
- **Auth**: JWT + Role-based middleware
- **Emails**: Nodemailer
- **Deployment**: Docker & Docker Compose

## Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- Docker & Docker Compose (optional)

### Quick Start with Docker

```bash
# Clone the repo
git clone <repo-url>
cd Ihute

# Start all services
docker-compose up -d

# Initialize database
docker-compose exec backend npm run migrate

# Access the app
# Frontend: http://localhost:3000
# Backend: http://localhost:3001
```

### Manual Setup

#### Backend
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run build
npm start
```

#### Frontend
```bash
cd client
npm install
npm run dev
```

#### Database
```bash
psql -U ihute_user -d ihute_db -f server/migrations/001_init_schema.sql
```

## Project Structure

```
Ihute/
├── index.html                  # Static homepage
├── client/                     # Next.js frontend
│   ├── src/
│   │   ├── pages/             # Page components
│   │   ├── components/        # Reusable components
│   │   ├── api.ts             # Axios instance
│   │   └── store.ts           # Zustand store
│   ├── public/locales/        # i18n translations (EN, FR, SW, RW)
│   └── next.config.js
├── server/                    # Express backend
│   ├── src/
│   │   ├── routes/            # API route handlers
│   │   ├── auth.ts            # JWT & RBAC middleware
│   │   ├── db.ts              # Database connection
│   │   ├── services.ts        # Business logic
│   │   ├── notifications.ts   # Email & SMS
│   │   └── index.ts           # Express app setup
│   ├── migrations/            # SQL schema
│   └── Dockerfile
└── docker-compose.yml
```

## API Endpoints

### Passenger APIs
- `POST /api/bookings` - Create booking
- `GET /api/trips/search` - Search public trips
- `GET /api/cars/search` - Search private cars
- `POST /api/payments` - Process payment
- `GET /api/bookings/:booking_id` - Get booking details
- `POST /api/bookings/:booking_id/cancel` - Cancel booking

### Admin APIs
- `POST /api/admin/login` - Admin login
- `POST /api/admin/expresses` - Create express
- `POST /api/admin/routes` - Create route
- `POST /api/admin/buses` - Create bus
- `POST /api/admin/trips` - Create trip
- `POST /api/admin/express-routes` - Set pricing
- `GET /api/admin/bookings` - View bookings
- `GET /api/admin/audit-logs` - View audit logs (super admin only)

### Driver APIs
- `POST /api/drivers/register` - Register driver
- `POST /api/drivers/login` - Driver login
- `GET /api/drivers/:driver_id/trips` - Get assigned trips
- `PATCH /api/drivers/trips/:trip_id/status` - Update trip status
- `PATCH /api/drivers/:driver_id/location` - Update driver location

## Database Schema

### Public Transport
```sql
expresses(express_id, name, logo, status)
routes(route_id, from_city, to_city, distance_km)
buses(bus_id, express_id, plate_number, bus_type, seat_count, status)
express_routes(id, express_id, route_id, price)
trips(trip_id, bus_id, route_id, departure_date, departure_time, status)
```

### Private Transport
```sql
drivers(driver_id, name, phone, license, status, lat, lng)
private_cars(car_id, driver_id, plate_number, type, seat_count, status)
```

### Bookings & Payments
```sql
bookings(booking_id, trip_id, car_id, passenger_name, phone, seats, status)
payments(payment_id, booking_id, amount, method, status, transaction_id)
seat_availability(entity_id, total_seats, booked_seats)
```

### Security
```sql
admins(admin_id, name, email, password_hash, role, express_id, permanent_code, status)
audit_logs(log_id, admin_id, action, entity, old_value, new_value, timestamp, ip)
```

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:pass@localhost:5432/ihute_db
JWT_SECRET=your-super-secret-key
PORT=3001
NODE_ENV=production
ALLOWED_ORIGINS=http://localhost:3000

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=noreply@ihute.rw
EMAIL_PASS=your-app-password

# SMS (Twilio or MTN)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE=+250700000000

# Payments
STRIPE_SECRET_KEY=sk_test_...
MOMO_API_KEY=your-key
AIRTEL_API_KEY=your-key

# Maps
GOOGLE_MAPS_API_KEY=your-key
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Business Logic

### Seat Locking
1. User selects seats and initiates booking → Seats are **locked** (reserved for 15 minutes)
2. User completes payment → Locked seats become **booked**
3. Payment fails or expires → Seats are **unlocked** and returned to availability
4. This prevents overbooking and double-bookings

### Booking Cutoff
- Passengers cannot book within 30 minutes of trip departure
- Enforced on the backend for all bookings

### Admin Permissions
- **Super Admin**: Full access across all expresses
- **Express Admin**: Limited to their assigned express (validated with permanent_code)
- **Viewer Admin**: Read-only access
- **Private Admin**: Only manages private vehicles and drivers

### Audit Logging
All admin actions are logged with:
- Admin ID & name
- Action type (CREATE, UPDATE, DELETE)
- Entity type & ID
- Old & new values (JSON)
- IP address & timestamp

## Languages Supported

- 🇬🇧 **English (en)**
- 🇫🇷 **French (fr)**
- 🇹🇿 **Swahili (sw)**
- 🇷🇼 **Kinyarwanda (rw)**

All public-facing content, booking flows, and admin dashboards are fully translated.

## Testing

```bash
# Backend
cd server
npm test

# Frontend
cd client
npm test
```

## Deployment

### Production Checklist
- [ ] Set strong `JWT_SECRET` in .env
- [ ] Configure real email service (Gmail, SendGrid, etc.)
- [ ] Set up actual payment provider (Stripe, MOMO API)
- [ ] Enable HTTPS on all endpoints
- [ ] Use PostgreSQL with automated backups
- [ ] Set `NODE_ENV=production`
- [ ] Configure CORS properly (`ALLOWED_ORIGINS`)
- [ ] Set up monitoring & error tracking
- [ ] Enable audit logging for compliance

### Deploy with Docker
```bash
docker-compose -f docker-compose.yml up -d
```

### Deploy on Heroku/Railway/Render
```bash
# Push Docker images to container registry
# Configure production environment variables
# Deploy from registry
```

## Troubleshooting

### Database Connection Error
```bash
# Check PostgreSQL is running
psql -U ihute_user -d ihute_db -c "SELECT 1"

# Initialize schema if needed
psql -U ihute_user -d ihute_db -f server/migrations/001_init_schema.sql
```

### JWT Token Issues
- Ensure `JWT_SECRET` is set and consistent
- Check token format: `Bearer <token>`
- Verify token hasn't expired (7 days)

### CORS Errors
- Update `ALLOWED_ORIGINS` in backend .env
- Frontend URL must be in the list

## Support & Contribution

For issues, feature requests, or contributions:
1. Create a GitHub issue with detailed description
2. Fork and create a feature branch
3. Submit a pull request

## License

MIT License - See LICENSE file for details

---

**Ready for production.** Built with ❤️ for Rwanda transport.
