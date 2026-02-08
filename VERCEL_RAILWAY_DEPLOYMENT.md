# ✅ IHUTE VERCEL + RAILWAY DEPLOYMENT

## 🚀 QUICK SETUP (3 Steps - 15 minutes)

### Prerequisites
- GitHub account (repo: ihutefastonlinetransport-alt/Ihute)
- Vercel account (free)
- Railway account (free tier, ~$5/month for PostgreSQL)

---

## 📋 STEP 1: Deploy Frontend to Vercel

1. **Visit**: https://vercel.com/new
2. **Select**: "Import Git Repository"
3. **Choose**: `ihutefastonlinetransport-alt/Ihute`
4. **Framework Preset**: NextJS (auto-detected)
5. **Configure Project**:
   - Root Directory: `client/`
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

6. **Environment Variables** (Add these):
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```
   (We'll update this after Railway deploys)

7. **Deploy**: Click "Deploy"
   - ✅ Wait 2-3 minutes for deployment
   - ✅ You'll get a URL like: `https://ihute.vercel.app`

---

## 📋 STEP 2: Deploy Backend to Railway

1. **Visit**: https://railway.app
2. **New Project** → **Deploy from GitHub**
3. **Select Repository**: `ihutefastonlinetransport-alt/Ihute`
4. **Project Settings**:
   - Root Directory: `server/`

5. **Add PostgreSQL Database**:
   - Click: **+ Add Service**
   - Select: **PostgreSQL**
   - ✅ Database auto-created
   - ✅ DATABASE_URL auto-set

6. **Configure Environment Variables**:
   - Go to **Variables** tab
   - Add these variables:
   ```
   PORT=3001
   NODE_ENV=production
   JWT_SECRET=your-super-long-random-key-here-minimum-32-chars
   ALLOWED_ORIGINS=https://ihute.vercel.app,http://localhost:3000
   ```

7. **Deploy**:
   - Click **Deploy**
   - ✅ Wait 3-5 minutes
   - Go to **Settings** → **Domains** to get your Railway URL
   - ✅ You'll get a URL like: `https://ihute-api.up.railway.app`

8. **Initialize Database**:
   - Go to Railway **Deployments** tab
   - Click **Latest Deployment**
   - Open **Shell** tab
   - Run: `npm run migrate`
   - ✅ Database tables created

---

## 📋 STEP 3: Link Frontend & Backend

1. **Back to Vercel**:
   - Go to project: **ihute**
   - **Settings** → **Environment Variables**
   
2. **Update Variable**:
   - Find: `NEXT_PUBLIC_API_URL`
   - Change to: `https://your-railway-url.up.railway.app`
   - (Replace with your actual Railway URL from Step 2)

3. **Redeploy**:
   - Go to **Deployments** tab
   - Click **Redeploy** on latest
   - ✅ Wait 2 minutes
   - ✅ Frontend now connected to backend!

---

## 🎯 Final URLs

After deployment, you have:

```
🌐 Frontend (Client):  https://ihute.vercel.app
🔐 API (Backend):      https://your-railway-url.up.railway.app
📧 Contact:            ihutefast@gmail.com
```

---

## 🔧 PORT CONFIGURATION

### Default Ports
- **Frontend**: 3000 (local dev), Vercel (production)
- **Backend**: 3001 (local dev), Railway (production)

### For Local Testing
```bash
# Terminal 1: Frontend
cd client
npm install
npm run dev
# Runs on: http://localhost:3000

# Terminal 2: Backend
cd server
npm install
npm run dev
# Runs on: http://localhost:3001
```

### For Production
- Vercel automatically handles port for frontend
- Railway automatically handles port for backend
- Both use `PORT` environment variable (`3001` for backend)

---

## 👥 MULTI-COMPANY DATA STRUCTURE

Your database is organized so each company (express/bus operator) manages their own data:

### Company Hierarchy
```
EXPRESS/COMPANY (express_id)
├── ADMIN Users (express_admin role, linked to express_id)
├── BUSES (linked to express_id)
│   ├── TRIPS (scheduled journeys)
│   │   └── BOOKINGS (passenger bookings)
│   └── SEAT AVAILABILITY (per trip)
├── ROUTES (company-specific pricing)
└── PAYMENTS (tracked per booking)
```

### How Companies Are Isolated

1. **Admin Users**:
   - Each express has own admin(s)
   - Admins see only their company's data
   - Use `express_id` field to separate

2. **Bookings Visibility**:
   - When admin logs in with Express ID
   - Dashboard shows only their bus bookings
   - Query filters by `express_id` automatically

3. **Pricing**:
   - Each company sets own prices
   - Express-Routes table: `express_id` + `route_id` + `price_rwf`
   - RITCO charges different price than Stella for same route

### Example: Create Two Companies

```sql
-- Company 1: RITCO
INSERT INTO expresses (name, logo_url, status)
VALUES ('RITCO Express', 'https://...ritco-logo.png', 'active');

-- Create admin for RITCO
INSERT INTO admins (name, email, password_hash, role, express_id, status)
VALUES ('RITCO Manager', 'ritco@ihute.rw', 'HASHED_PASS', 'express_admin', 1, 'active');

-- Company 2: Stella
INSERT INTO expresses (name, logo_url, status)
VALUES ('Stella Coach', 'https://...stella-logo.png', 'active');

-- Create admin for Stella
INSERT INTO admins (name, email, password_hash, role, express_id, status)
VALUES ('Stella Manager', 'stella@ihute.rw', 'HASHED_PASS', 'express_admin', 2, 'active');
```

### Result
- RITCO admin sees only RITCO's buses/bookings
- Stella admin sees only Stella's buses/bookings
- Different IDs (`express_id`), same company name possible if needed
- Super admin sees everything

---

## 🗄️ DATABASE TABLES & RELATIONSHIPS

| Table | Purpose | Multi-Tenant Key |
|-------|---------|------------------|
| `expresses` | Bus companies | `express_id` |
| `admins` | Staff accounts | `express_id` |
| `buses` | Vehicles | `express_id` |
| `routes` | City pairs | None (shared) |
| `express_routes` | Pricing per company | `express_id` + `route_id` |
| `trips` | Scheduled journeys | Via `bus_id.express_id` |
| `bookings` | Passenger reservations | Via `trip_id.bus_id.express_id` |
| `payments` | Transaction records | Via `booking_id` |

---

## 🔐 ADMIN ROLES

**Express Admin** (`express_admin`):
- Manage only their company's data
- Add buses, routes, trips
- View bookings for their company
- Confirm cash payments
- Export reports
- Use permanent code (optional)

**Super Admin** (`super_admin`):
- Manage all companies
- Create new admins
- View all bookings
- Global reports
- System settings

**Private Admin** (`private_admin`):
- Manage private drivers
- Assign cars

**Viewer Admin** (`viewer_admin`):
- Read-only access
- Cannot modify data

---

## 🗂️ FILE ORGANIZATION

```
📦 IHUTE
├── 📁 client/           ← Frontend (Vercel)
│   ├── vercel.json      ← Vercel config
│   ├── package.json
│   └── src/
│       └── pages/
│           ├── index.tsx (Home with carousel)
│           ├── login.tsx (Express Admin / Private Driver)
│           ├── booking.tsx (Passenger booking)
│           └── admin.tsx (Dashboard)
│
├── 📁 server/           ← Backend (Railway)
│   ├── railway.json     ← Railway config
│   ├── Procfile         ← Heroku/Deploy config
│   ├── package.json
│   ├── .env.example
│   ├── src/
│   │   ├── index.ts     ← Entry point (PORT: 3001)
│   │   ├── db.ts        ← Database connection
│   │   └── routes/
│   │       ├── admin.ts
│   │       ├── passengers.ts
│   │       ├── drivers.ts
│   │       └── payments.ts
│   └── migrations/
│       └── 001_init_schema.sql
│
└── 📁 images/           ← All hero carousel images
    ├── logo.png
    ├── 1769485936552.png
    └── ... (provided images)
```

---

## ✅ VERIFICATION CHECKLIST

After deployment:

- [ ] Frontend loads at `https://ihute.vercel.app`
- [ ] Backend health check: `https://your-railway-url/health`
- [ ] Can access login page
- [ ] Language switcher works (EN, FR, RW, SW)
- [ ] Logo displays on all pages
- [ ] Can login as Express Admin
- [ ] Can login as Private Driver
- [ ] Footer shows contact: `ihutefast@gmail.com`
- [ ] Database connected (no errors)
- [ ] Can create booking
- [ ] Can confirm payment in admin

---

## 🆘 TROUBLESHOOTING

### "Connection Refused" / "API Error"
```
✅ Check NEXT_PUBLIC_API_URL in Vercel matches Railway URL
✅ Verify ALLOWED_ORIGINS includes your Vercel URL
✅ Restart Railway deployment
```

### "Database Connection Failed"
```
✅ Verify DATABASE_URL set in Railway Variables
✅ Run: npm run migrate (in Railway shell)
✅ Check PostgreSQL is running
```

### "Not Found / 404"
```
✅ Check route exists in backend
✅ Verify Express ALLOWED_ORIGINS CORS config
✅ Check API URL is correct
```

### "Languages Not Working"
```
✅ Clear browser cache (Ctrl+Shift+Delete)
✅ Check locales JSON files exist
✅ Verify i18n configuration
```

---

## 📞 SUPPORT

**Email**: ihutefast@gmail.com  
**GitHub**: https://github.com/ihutefastonlinetransport-alt/Ihute  
**Deploy Time**: 15 minutes  
**Cost**: Free (Vercel) + ~$5/month (Railway)  

---

**Your IHUTE platform is ready to serve Rwanda's transport needs! 🚀**
