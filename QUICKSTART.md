## IHUTE Quick Start Guide

### ⚡ 5-Minute Setup

#### Option 1: Docker (Recommended)
```bash
cd /workspaces/Ihute
docker-compose up -d
```
- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- Database: PostgreSQL on port 5432

#### Option 2: Manual Setup

**1. Setup Backend**
```bash
cd server
npm install
cp .env.example .env
# Edit .env - set DATABASE_URL to your PostgreSQL
npm run build
npm start
# Backend runs on http://localhost:3001
```

**2. Setup Database**
```bash
# Create database
createdb -U postgres ihute_db

# Run migrations
psql -U postgres -d ihute_db -f migrations/001_init_schema.sql
```

**3. Setup Frontend**
```bash
cd client
npm install
npm run dev
# Frontend runs on http://localhost:3000
```

### 📱 Test the App

**As a Passenger:**
1. Go to http://localhost:3000
2. Click "Book Now"
3. Search for trips (Kigali → Musanze)
4. Fill passenger info
5. Proceed to payment (mock payment)

**As an Admin:**
1. Go to http://localhost:3000/login
2. Select "Admin"
3. Use test credentials (set up in database)
4. View bookings and manage trips

**As a Driver:**
1. Click "Login" → "Register here"
2. Register as a driver
3. View your assigned trips
4. Update trip status

### 🗄️ Database Setup

PostgreSQL must be running. If using Docker:
```bash
docker-compose exec postgres psql -U ihute_user -d ihute_db
```

Sample data is auto-seeded with:
- 3 Express companies (RITCO, Stella, Muhima)
- 4 Routes (Kigali to various cities)
- 3 Sample buses

### 🔐 Test Admin Accounts

Create via backend API or directly in DB:
```sql
INSERT INTO admins (name, email, password_hash, role, permanent_code, status) 
VALUES ('Super Admin', 'admin@ihute.rw', '<bcrypt_hash>', 'super_admin', '', 'active');
```

Password hashing:
```bash
node -e "require('bcryptjs').hash('password123', 10).then(h => console.log(h))"
```

### 🌐 Languages

The app supports 4 languages (switchable in navbar):
- 🇬🇧 English (default)
- 🇫🇷 Français
- 🇹🇿 Kiswahili
- 🇷🇼 Kinyarwanda

All content is automatically translated via i18n.

### 📡 API Testing

Use Postman or cURL:

```bash
# Search trips
curl "http://localhost:3001/api/trips/search?from_city=Kigali&to_city=Musanze&departure_date=2024-02-10"

# Create booking
curl -X POST http://localhost:3001/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"trip_id":1,"passenger_name":"John Doe","passenger_phone":"+250700000000","num_seats":2}'

# Process payment
curl -X POST http://localhost:3001/api/payments \
  -H "Content-Type: application/json" \
  -d '{"booking_id":1,"amount_rwf":10000,"method":"momo"}'
```

### 🐛 Troubleshooting

**Port Already in Use:**
```bash
# Kill process using port 3000 or 3001
lsof -i :3000  # Find process
kill -9 <PID>
```

**Database Connection Error:**
```bash
# Test connection
psql -U ihute_user -d ihute_db -c "SELECT 1"

# Reset database
dropdb ihute_db
createdb ihute_db
psql -U ihute_db -f server/migrations/001_init_schema.sql
```

**Dependencies Issue:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### 📝 Important Files

- `index.html` - Static homepage
- `client/src/pages/` - Next.js page components
- `server/src/routes/` - API endpoints
- `server/migrations/001_init_schema.sql` - Database schema
- `.env` files - Configuration (never commit!)

### ✅ Production Checklist

Before deploying:
- [ ] Set strong JWT_SECRET
- [ ] Configure real email service
- [ ] Set up actual payment provider
- [ ] Enable HTTPS
- [ ] Change default DB credentials
- [ ] Configure proper CORS origins
- [ ] Set NODE_ENV=production
- [ ] Enable audit logging
- [ ] Test all user flows

### 📚 Documentation

See README.md for:
- Full API documentation
- Database schema
- Deployment guides
- Feature list

---

**Questions?** Check the README.md or review the API endpoints in `server/src/routes/`.
