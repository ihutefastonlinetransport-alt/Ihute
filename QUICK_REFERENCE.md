# ⚡ IHUTE QUICK REFERENCE CARD

## 🚀 DEPLOY IN 3 STEPS (15 min)

```bash
# Step 1: https://vercel.com/new → Import GitHub → Deploy
# Step 2: https://railway.app → New Project → Deploy  
# Step 3: Update Vercel API URL → Redeploy
```

**Result**: https://ihute.vercel.app (front) + https://api.railway.app (back)

---

## 📋 KEY CONTACTS

| Info | Value |
|------|-------|
| 📧 Email | ihutefast@gmail.com |
| 📱 Phone | +250700000000 |
| 📍 Location | Kigali, Rwanda |
| 🌐 Website | https://ihute.vercel.app |
| 🔗 Repository | github.com/ihutefastonlinetransport-alt/Ihute |

---

## ⚙️ PORTS & URLS

| Service | Local | Production | Port |
|---------|-------|-----------|------|
| **Frontend** | localhost:3000 | ihute.vercel.app | 443/80 |
| **Backend** | localhost:3001 | api.railway.app | 3001 |
| **Database** | localhost:5432 | Railway (tunnel) | Auto |

---

## 🔐 ADMIN CREDENTIALS (LOCAL TESTING)

| Account | Email | Password | Code |
|---------|-------|----------|------|
| RITCO Admin | ritco@ihute.rw | Admin123! | RITCO123 |
| Stella Admin | stella@ihute.rw | Admin123! | STELLA456 |
| Super Admin | admin@ihute.rw | Admin123! | N/A |

---

## 🎨 BRAND COLORS

| Use | Color | Hex |
|-----|-------|-----|
| Primary (Buses) | Orange | `#f57c00` |
| Secondary (Drivers) | Green | `#2e7d32` |
| Body Text | Gray | `#6b7280` |
| Background | Dark Gray | `#1f2937` |

---

## 📁 CRITICAL FILES

| File | Purpose |
|------|---------|
| `client/src/pages/index.tsx` | Homepage (carousel + contact) |
| `client/src/pages/login.tsx` | Admin/Driver login |
| `client/src/pages/booking.tsx` | 5-step booking wizard |
| `client/src/pages/admin.tsx` | Admin dashboard |
| `server/src/index.ts` | Backend entry (port 3001) |
| `server/migrations/001_init_schema.sql` | Database schema |
| `server/src/routes/admin.ts` | Admin API (12 endpoints) |
| `.env.example` | Environment template |

---

## 🎯 FEATURES CHECKLIST

- [x] Auto-scrolling hero carousel (4 images)
- [x] Multi-language support (4 languages)
- [x] 5-step booking wizard
- [x] Admin dashboard
- [x] Payment tracking
- [x] Multi-company isolation
- [x] CSV export
- [x] Security: JWT + role-based access
- [x] Responsive design
- [x] Professional branding

---

## 📸 IMAGES INCLUDED

| File | Usage |
|------|-------|
| logo.png | Header, Footer, Admin (branding) |
| 1769485936552.png | Carousel image 1 |
| 1769486169104.png | Carousel image 2 |
| 1769537119944.png | Carousel image 3 |
| file_00000000b37c71f8b8f07f22ce33cc4c.png | Carousel image 4 |
| 40012-Rwanda-Bus-image-Virunga-Express.jpg | Alternative (available) |
| JV-2013-04-23-003.jpg | Alternative (available) |
| road-trip-to-disney-world-1080x675.webp | Alternative (available) |

---

## 🧪 QUICK TESTING

```bash
# Local Frontend Test
cd client && npm install && npm run dev
# Visit: http://localhost:3000

# Local Backend Test
cd server && npm install && npm run dev
# Check: curl http://localhost:3001/health

# Database Setup
npm run migrate
# Result: Schema created

# Create Test Data
# See: LOCAL_TESTING_GUIDE.md (Step 4)
```

---

## 📚 DOCUMENTATION QUICK LINKS

| Guide | Time | For Who |
|-------|------|---------|
| **VERCEL_RAILWAY_DEPLOYMENT.md** | 15 min | Deploy now |
| **LOCAL_TESTING_GUIDE.md** | 30 min | Test locally |
| **MULTI_COMPANY_VERIFICATION.md** | 15 min | Understand isolation |
| **DOCUMENTATION_INDEX.md** | 5 min | Find guides |
| **DEPLOYMENT_READY.md** | 5 min | Status overview |
| **DEPLOYMENT.md** | 30 min | Full details |
| **OFFICIAL_WEBSITE_GUIDE.md** | 40 min | Complete handbook |

---

## 🔍 API ENDPOINTS (22 total)

### Admin Routes (12)
- `POST /api/admin/login` - Login
- `POST /api/admin/expresses` - Create company
- `POST /api/admin/routes` - Create route
- `POST /api/admin/buses` - Add bus
- `POST /api/admin/trips` - Schedule trip
- `POST /api/admin/express-routes` - Set pricing
- `GET /api/admin/bookings` - View bookings
- `GET /api/admin/reports` - Export CSV
- `POST /api/admin/bookings/:id/confirm-payment` - Confirm payment
- ... (3 more)

### Passenger Routes (5)
- `GET /api/trips/search` - Search trips
- `GET /api/cars/search` - Search cars
- `POST /api/bookings` - Create booking
- `GET /api/bookings/:id` - Get booking details
- `POST /api/bookings/:id/cancel` - Cancel booking

### Driver Routes (3)
- ...

### Payment Routes (2)
- `POST /api/payments` - Process payment
- `GET /api/payments/:id` - Get payment status

---

## 🆘 COMMON ISSUES & FIXES

### "Connection Refused"
→ Check backend is running on port 3001
→ Verify NEXT_PUBLIC_API_URL in Vercel

### "Database Error"
→ Run migrations: `npm run migrate`
→ Verify DATABASE_URL is set correctly
→ Check PostgreSQL is running (or on Railway)

### "Admin Can't See Data"
→ Verify admin's express_id in database
→ Check company is created with INSERT
→ Decode JWT token to see included express_id

### "Images Not Loading"
→ Verify public/ folder exists
→ Check image filenames match routes
→ Ensure /images/ folder is deployed

---

## 📊 DATABASE STRUCTURE (8 Tables)

```
expresses
├── express_id (PK)
├── name (UNIQUE)
├── logo_url
└── status

admins
├── admin_id (PK)
├── express_id (FK)
├── role
└── email (UNIQUE)

buses
├── bus_id (PK)
├── express_id (FK)
├── registration_number
└── seats

routes
├── route_id (PK)
├── from_city
└── to_city

express_routes
├── express_route_id (PK)
├── express_id (FK)
├── route_id (FK)
└── price_rwf

trips
├── trip_id (PK)
├── bus_id (FK)
├── route_id (FK)
├── scheduled_time
└── available_seats

bookings
├── booking_id (PK)
├── trip_id (FK)
├── passenger_name
└── status

payments
├── payment_id (PK)
├── booking_id (FK)
├── amount_rwf
└── method
```

---

## ✅ PRE-DEPLOYMENT CHECKLIST

- [ ] Frontend code pushed to GitHub main
- [ ] Backend code pushed to GitHub main
- [ ] Portfolio.json has correct root directory
- [ ] server/.env.example documented
- [ ] All tests pass locally
- [ ] Images are in /images/ folder
- [ ] Contact info verified (email, phone)
- [ ] Brand colors applied (#f57c00, #2e7d32)
- [ ] Languages working (EN, FR, RW, SW)
- [ ] Database schema ready (migrations prepared)
- [ ] JWT_SECRET is strong (32+ characters)
- [ ] GitHub default branch is "main"

---

## 🎓 BUILD & RUN COMMANDS

**Frontend**:
```bash
npm install
npm run dev           # Development (port 3000)
npm run build         # Build (Vercel)
npm run start         # Production
```

**Backend**:
```bash
npm install
npm run dev           # Development (port 3001)
npm run build         # Build
npm run start         # Production
npm run migrate       # Create database schema
```

---

## 🏆 DEPLOYMENT SUCCESS INDICATORS

✅ Vercel shows "Ready" (green checkmark)
✅ Railway shows "Success" (green checkmark)
✅ Frontend loads without errors (F12 console)
✅ Backend health check passes: `curl https://api.railway.app/health`
✅ Can login with test admin credentials
✅ Admin dashboard shows bookings
✅ Language switching works
✅ Carousel auto-plays
✅ Contact info visible
✅ Logo displays correctly

---

## 📞 SUPPORT CONTACTS

**Primary**: ihutefast@gmail.com
**GitHub Issues**: github.com/ihutefastonlinetransport-alt/Ihute/issues
**Documentation**: All guides in project root

---

**Status**: ✅ PRODUCTION READY
**Version**: 1.0
**Last Updated**: January 2025

**🚀 Ready to deploy? Start with VERCEL_RAILWAY_DEPLOYMENT.md**
