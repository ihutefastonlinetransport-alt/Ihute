# 🧪 LOCAL TESTING & DEPLOYMENT GUIDE

## Overview

Complete guide to test IHUTE locally before deploying to Vercel + Railway. Includes port configuration, multi-company testing, and production deployment.

---

## 📦 PART 1: LOCAL SETUP

### Prerequisites
- Node.js 18+ (`node --version`)
- PostgreSQL 15+ (`psql --version`)
- Git
- Terminal/Command Prompt

### Step 1: Clone Repository
```bash
git clone https://github.com/ihutefastonlinetransport-alt/Ihute.git
cd Ihute
```

### Step 2: Setup Backend

```bash
cd server

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Edit .env (update if needed)
# PORT=3001
# DATABASE_URL=postgresql://user:password@localhost:5432/ihute_db
# NODE_ENV=development
```

### Step 3: Setup Local PostgreSQL

#### Option A: Using PostgreSQL CLI
```bash
# Create database
sudo -u postgres psql
CREATE DATABASE ihute_db;
CREATE USER ihute_user WITH PASSWORD 'SecurePassword123';
ALTER ROLE ihute_user WITH CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE ihute_db TO ihute_user;
\q

# Update .env with:
# DATABASE_URL=postgresql://ihute_user:SecurePassword123@localhost:5432/ihute_db
```

#### Option B: Using Docker (Recommended)
```bash
# Start PostgreSQL in Docker
docker run --name ihute-postgres \
  -e POSTGRES_DB=ihute_db \
  -e POSTGRES_USER=ihute_user \
  -e POSTGRES_PASSWORD=SecurePassword123 \
  -p 5432:5432 \
  -d postgres:15

# Update .env with:
# DATABASE_URL=postgresql://ihute_user:SecurePassword123@localhost:5432/ihute_db
```

### Step 4: Run Database Migrations

```bash
# From server/ directory
npm run migrate

# Output: ✅ Schema initialized
```

### Step 5: Start Backend Server

```bash
npm run dev

# Output:
# ✅ Server running on port 3001
# ✅ Database connected
# ✅ Listening for requests
```

**Verify Backend**:
```bash
curl http://localhost:3001/health
# Response: { "status": "ok" }
```

---

## 📱 PART 2: LOCAL FRONTEND SETUP

### Step 1: Setup Frontend

From **new terminal window**:
```bash
cd client

# Install dependencies
npm install

# Create .env.local
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:3001
EOF

# Or manually: Open .env.local, add:
# NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Step 2: Start Frontend Development Server

```bash
npm run dev

# Output:
# ✅ Ready in 2.3s on http://localhost:3000
```

**Verify Frontend**:
- Open: http://localhost:3000
- ✅ Should see IHUTE homepage with carousel
- ✅ Logo visible in header and footer
- ✅ Contact info visible (ihutefast@gmail.com)

---

## 🔑 PART 3: CREATE TEST DATA

### Create Admin Accounts

From PostgreSQL CLI or Railway dashboard:

```sql
-- Login as ihute_user
psql -U ihute_user -d ihute_db

-- Creates for testing admin login
INSERT INTO expresses VALUES
  (1, 'RITCO Express', 'https://your-domain/ritco-logo.png', 'active', NOW()),
  (2, 'Stella Coach', 'https://your-domain/stella-logo.png', 'active', NOW());

-- Hash passwords using bcrypt (use a hasher or copy hashed values)
-- For testing: password = 'Admin123!' hashed

INSERT INTO admins VALUES
  (1, 1, 'RITCO Admin', 'ritco@ihute.rw', '$2a$10$N9qo8uLOickgx2ZMRZoHyevakyAVXfHxrn7FH.KXjVvXj8Y.B7gPm', 'RITCO123', 'express_admin', 'active', NOW()),
  (2, 2, 'Stella Admin', 'stella@ihute.rw', '$2a$10$N9qo8uLOickgx2ZMRZoHyevakyAVXfHxrn7FH.KXjVvXj8Y.B7gPm', 'STELLA456', 'express_admin', 'active', NOW()),
  (3, NULL, 'Super Admin', 'admin@ihute.rw', '$2a$10$N9qo8uLOickgx2ZMRZoHyevakyAVXfHxrn7FH.KXjVvXj8Y.B7gPm', NULL, 'super_admin', 'active', NOW());

-- Create buses
INSERT INTO buses VALUES
  (1, 1, 'AA-001-AA', 60, 'active', NOW()),
  (2, 2, 'KN-002-BB', 50, 'active', NOW());

-- Create routes
INSERT INTO routes VALUES
  (1, 'Kigali', 'Huye', 150, NOW()),
  (2, 'Kigali', 'Butare', 160, NOW()),
  (3, 'Kigali', 'Gitarama', 30, NOW());

-- Create pricing (express_routes)
INSERT INTO express_routes VALUES
  (1, 1, 1, 5000, 'active', NOW()),
  (2, 1, 2, 5500, 'active', NOW()),
  (3, 2, 1, 4500, 'active', NOW()),
  (4, 2, 2, 5000, 'active', NOW());

-- Create sample trips
INSERT INTO trips VALUES
  (1, 1, 1, '2025-02-01 08:00:00', 45, 'scheduled', NOW()),
  (2, 1, 2, '2025-02-01 10:00:00', 50, 'scheduled', NOW()),
  (3, 2, 1, '2025-02-01 08:30:00', 35, 'scheduled', NOW()),
  (4, 2, 2, '2025-02-01 09:00:00', 40, 'scheduled', NOW());

-- Verify data
SELECT * FROM expresses;
SELECT * FROM admins WHERE role='express_admin';
SELECT * FROM buses;
SELECT * FROM trips;
```

**For Password Hashing** (Optional - above hash is 'Admin123!'):

Generate bcrypt hashes online: https://bcrypt-generator.com
- Password: `Admin123!`
- Rounds: 10

---

## 🧪 PART 4: LOCAL TESTING CHECKLIST

### Test 1: Frontend Loads
- [ ] Visit http://localhost:3000
- [ ] ✅ IHUTE logo visible
- [ ] ✅ Hero carousel auto-plays (4 sec interval)
- [ ] ✅ Languages work (EN, FR, RW, SW)
- [ ] ✅ Footer displays contact info
- [ ] ✅ Mobile responsive (open DevTools, check responsive)

### Test 2: Booking System
- [ ] Click "Book Now" button
- [ ] Select transport type: "Public Express"
- [ ] Select from: "Kigali", to: "Huye"
- [ ] Select date: tomorrow
- [ ] Select seats: 2
- [ ] ✅ Should show available trips
- [ ] ✅ Should show prices (5,000 RWF per seat = 10,000 total)
- [ ] Click trip
- [ ] Enter passenger details
- [ ] Select payment method
- [ ] ✅ Confirm booking (success message)

### Test 3: Express Admin #1 (RITCO)
- [ ] Visit http://localhost:3000/login
- [ ] Click "Express Admin" tab (🚌)
- [ ] Login:
  - Email: `ritco@ihute.rw`
  - Password: `Admin123!`
  - Permanent Code: `RITCO123` (optional)
- [ ] ✅ Redirected to admin dashboard
- [ ] ✅ See only RITCO's bookings
- [ ] ✅ See only RITCO's buses (AA-001-AA)
- [ ] ✅ Can confirm payment
- [ ] ✅ Can export CSV report

### Test 4: Express Admin #2 (Stella)
- [ ] Open **new private/incognito window**
- [ ] Visit http://localhost:3000/login
- [ ] Click "Express Admin" tab (🚌)
- [ ] Login:
  - Email: `stella@ihute.rw`
  - Password: `Admin123!`
  - Permanent Code: `STELLA456` (optional)
- [ ] ✅ Redirected to admin dashboard
- [ ] ✅ See only Stella's bookings
- [ ] ✅ See only Stella's buses (KN-002-BB)
- [ ] ✅ DO NOT see RITCO's bookings
- [ ] ✅ DO NOT see RITCO's buses
- [ ] ✅ Can export CSV (only Stella's data)

### Test 5: Multi-Tenant Isolation
- [ ] Create booking under RITCO
- [ ] Create booking under Stella
- [ ] Login as RITCO admin
- [ ] ✅ Dashboard shows only RITCO booking
- [ ] ✅ Dashboard does NOT show Stella booking
- [ ] Login as Stella admin
- [ ] ✅ Dashboard shows only Stella booking
- [ ] ✅ Dashboard does NOT show RITCO booking

### Test 6: Private Driver Login
- [ ] Visit http://localhost:3000/login
- [ ] Click "Private Driver" tab (🚗)
- [ ] ✅ Form changes (no permanent code field)
- [ ] ✅ Email/Password fields present
- [ ] Note: Feature not yet implemented (stub)

### Test 7: Responsive Design
- [ ] Open DevTools (F12)
- [ ] Mobile view (375px width)
- [ ] ✅ Logo visible
- [ ] ✅ Navigation menu collapses/hamburger
- [ ] ✅ Carousel visible
- [ ] ✅ Footer text readable
- [ ] ✅ Forms properly spaced
- [ ] Tablet view (768px width)
- [ ] ✅ 2-column layout appears
- [ ] Desktop view (1920px width)
- [ ] ✅ Full layout visible

### Test 8: Language Persistence
- [ ] Change language to French
- [ ] Reload page (F5)
- [ ] ✅ Should still be French
- [ ] Close tab completely
- [ ] Open http://localhost:3000 again
- [ ] ✅ Should still be French (localStorage)
- [ ] Change to Kinyarwanda
- [ ] ✅ Interface updates to RW
- [ ] Reload
- [ ] ✅ Still Kinyarwanda

### Test 9: Error Handling
- [ ] Stop backend server (Ctrl+C)
- [ ] Try to book on frontend
- [ ] ✅ Should show error: "Unable to connect to server"
- [ ] Restart backend
- [ ] ✅ Booking works again

### Test 10: Database Connection
- [ ] Check backend logs for: `✅ Database connected`
- [ ] Verify admin queries return data
- [ ] Check trip search returns trips
- [ ] ✅ No SQL errors in console

---

## 🚀 PART 5: DEPLOY TO VERCEL + RAILWAY

### 5A: Deploy Frontend to Vercel

1. Push code to GitHub (main branch)
   ```bash
   git add .
   git commit -m "Ready for production"
   git push origin main
   ```

2. Go to https://vercel.com/new
3. Import Git repository: `ihutefastonlinetransport-alt/Ihute`
4. Configure:
   - Root Directory: `client/`
   - Framework: Next.js
   - Build command: `npm run build`
   - Install command: `npm install`

5. Add Environment Variable:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```
   (We'll update after Railway deploys)

6. Deploy
7. ✅ Get Vercel URL: https://ihute.vercel.app (example)

### 5B: Deploy Backend to Railway

1. Go to https://railway.app
2. New Project → Deploy from GitHub → Select `Ihute`
3. Configure:
   - Root Directory: `server/`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

4. Add PostgreSQL:
   - Click +Add Service
   - Select PostgreSQL
   - ✅ Auto-creates DATABASE_URL

5. Environment Variables:
   ```
   PORT=3001
   NODE_ENV=production
   JWT_SECRET=your-random-secret-minimum-32-characters-long
   ALLOWED_ORIGINS=https://ihute.vercel.app
   DATABASE_URL=(auto-set by Railway)
   ```

6. Deploy
7. ✅ Get Railway URL: https://ihute-api.up.railway.app (example)
8. Run migrations:
   - Click Deployments → Latest
   - Open Shell
   - Run: `npm run migrate`

### 5C: Link Frontend & Backend

1. Back to Vercel, go to Settings → Environment Variables
2. Update `NEXT_PUBLIC_API_URL` to: `https://ihute-api.up.railway.app`
3. Redeploy (Redeploy button)
4. ✅ Frontend now talks to Railway backend

### 5D: Verify Production

- [ ] Visit https://ihute.vercel.app
- [ ] ✅ Loads (no 503 errors)
- [ ] ✅ Carousel plays
- [ ] ✅ Logo visible
- [ ] ✅ Can click Book Now
- [ ] ✅ Can search trips
- [ ] ✅ Can login as admin
- [ ] ✅ Admin dashboard works
- [ ] ✅ Can confirm payment
- [ ] ✅ Multi-tenant isolation works

---

## ⚙️ PORT CONFIGURATION REFERENCE

| Environment | Port | Service | Notes |
|------------|------|---------|-------|
| **Local Development** | | | |
| Frontend | 3000 | Next.js dev server | http://localhost:3000 |
| Backend | 3001 | Express.js | http://localhost:3001 |
| PostgreSQL | 5432 | Database | localhost (default) |
| | | | |
| **Production (Vercel)** | | | |
| Frontend | 443/80 | Vercel CDN | https://ihute.vercel.app |
| Backend | 443 | Railway | https://ihute-api.up.railway.app |
| PostgreSQL | 5432 | Railway DB | Encrypted tunnel |

### Environment Variables by Stage

**Local (.env or .env.local)**:
```
NEXT_PUBLIC_API_URL=http://localhost:3001
DATABASE_URL=postgresql://ihute_user:SecurePassword123@localhost:5432/ihute_db
PORT=3001
NODE_ENV=development
JWT_SECRET=dev-secret-key-not-secure
```

**Production (Vercel + Railway)**:
```
# Vercel (NEXT_PUBLIC_* are exposed to client)
NEXT_PUBLIC_API_URL=https://ihute-api.up.railway.app

# Railway (backend server)
DATABASE_URL=postgresql://...railway...
PORT=3001
NODE_ENV=production
JWT_SECRET=super-long-random-secret-minimum-32-chars
ALLOWED_ORIGINS=https://ihute.vercel.app
```

---

## 🆘 TROUBLESHOOTING

### "Error: connect ECONNREFUSED 127.0.0.1:5432"
**Problem**: PostgreSQL not running
**Solution**:
```bash
# Start PostgreSQL
docker start ihute-postgres
# OR
sudo service postgresql start
```

### "Error: connect ECONNREFUSED 127.0.0.1:3001"
**Problem**: Backend not running
**Solution**:
```bash
cd server
npm run dev
```

### "Bookings not appearing in admin dashboard"
**Problem**: Admin can't see multi-tenant data
**Solution**:
1. Check admin's `express_id` in database:
   ```sql
   SELECT admin_id, express_id, email FROM admins;
   ```
2. Create sample trip under that express:
   ```sql
   SELECT * FROM trips WHERE bus_id IN 
     (SELECT bus_id FROM buses WHERE express_id = 1);
   ```

### "Language changes not persisting"
**Problem**: localStorage not working
**Solution**:
1. Check localStorage is enabled (not in private mode)
2. Clear browser cache: Ctrl+Shift+Delete
3. Reload page

### "Vercel says 'Cannot find module'"
**Problem**: Dependencies not installed
**Solution**:
1. Check package.json has all imports
2. Run locally: `npm install && npm run build`
3. Verify no errors before pushing

### "Railway database connection fails"
**Problem**: DATABASE_URL not set correctly
**Solution**:
1. Copy DATABASE_URL from Railway dashboard
2. Paste into Railway Variables
3. Restart deployment
4. Check backend logs for connection success

---

## ✅ FINAL CHECKLIST BEFORE GOING LIVE

- [ ] Local tests pass (all 10 test sections above)
- [ ] GitHub main branch is up to date
- [ ] .env.example has all required variables documented
- [ ] Vercel project created and deployed
- [ ] Railway backend deployed
- [ ] Railway PostgreSQL created and migrations run
- [ ] Frontend NEXT_PUBLIC_API_URL points to Railway
- [ ] Backend ALLOWED_ORIGINS includes Vercel domain
- [ ] Can login as Express Admin #1
- [ ] Can login as Express Admin #2
- [ ] Multi-tenant isolation verified
- [ ] Bookings appear in admin dashboard
- [ ] Payments can be confirmed
- [ ] CSV export works
- [ ] All 4 languages work
- [ ] Images load (carousel, logo, footer)
- [ ] Contact info visible
- [ ] Mobile responsive
- [ ] No console errors
- [ ] No database warnings

---

## 📞 SUPPORT

**Issues?** Email: ihutefast@gmail.com

---

**You're ready to launch IHUTE to production! 🚀**
