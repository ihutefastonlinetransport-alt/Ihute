# IHUTE - Deployment Guide

This guide provides step-by-step instructions to deploy the IHUTE website and admin panel to production.

## Overview

- **Frontend**: Vercel (auto-deploys from GitHub)
- **Backend**: Railway.app (with PostgreSQL)
- **Repository**: https://github.com/ihutefastonlinetransport-alt/Ihute

---

## ✅ STEP 1: Deploy Frontend (Vercel) - 5 minutes

### 1.1 Connect GitHub to Vercel

1. Go to https://vercel.com/new
2. Click **Import Git Repository**
3. Select `ihutefastonlinetransport-alt/Ihute`
4. Click **Continue**

### 1.2 Configure Project

1. **Framework Preset**: Leave as auto-detected (Next.js)
2. **Root Directory**: Change to `client/`
3. Click **Continue**

### 1.3 Add Environment Variables

Click **Environment Variables** and add:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | `https://ihute-api.up.railway.app` |

> Note: After Railway deploys, update this URL to your Railway domain

4. Click **Deploy**

### Result:
```
✅ Frontend URL: https://ihute.vercel.app
```

---

## ✅ STEP 2: Deploy Backend (Railway) - 10 minutes

### 2.1 Create Railway Account

1. Go to https://railway.app
2. Sign in with GitHub
3. Create new account if needed

### 2.2 Create New Project

1. Click **+ New Project**
2. Select **Deploy from GitHub repo**
3. Select `ihutefastonlinetransport-alt/Ihute`
4. Click **Import**

### 2.3 Configure Services

1. **Add PostgreSQL Database**
   - Click **+ Add Service**
   - Select **PostgreSQL**
   - Auto-configured ✅

2. **Link Repo as Service**
   - Select repository again
   - **Root Directory**: `server/`
   - Click **Deploy**

### 2.4 Set Environment Variables

In the Railway dashboard, go to **Variables** tab and add:

```
JWT_SECRET=your-long-random-secret-key-here
NODE_ENV=production
ALLOWED_ORIGINS=https://ihute.vercel.app,https://ihute-api.up.railway.app
PORT=3001
```

The `DATABASE_URL` is auto-set by Railway after PostgreSQL is added.

### 2.5 Initialize Database

In Railway terminal:
```bash
npm run migrate
```

### Result:
```
✅ Backend URL: https://ihute-api.up.railway.app
✅ Database: Auto-created
```

---

## ✅ STEP 3: Update Frontend with Backend URL

Once Railway backend is deployed:

1. Go to Vercel Dashboard
2. Select `ihute` project
3. **Settings** → **Environment Variables**
4. Update `NEXT_PUBLIC_API_URL` to your Railway URL:
   ```
   https://ihute-api.up.railway.app
   ```
5. Redeploy (auto-triggers)

---

## ✅ FINAL PRODUCTION LINKS

After deployment completes:

### 🌐 **Client Website** (Users & Passengers)
```
https://ihute.vercel.app
```

**Features:**
- Book public express buses or private vehicles
- Real-time seat availability
- Payment (Card, Cash, Mobile Money)
- Language toggle: English, French, Swahili, Kinyarwanda
- Booking confirmations

---

### 🔐 **Admin Dashboard** (Managers & Admins)
```
https://ihute.vercel.app/login
```

**Admin Credentials Format:**
- Email: `admin@ihute.rw` (or your admin email)
- Password: (as set in database)
- Permanent Code: (for Express Admins)

**Admin Functions:**
- View all bookings in real-time
- Confirm offline/cash payments
- Add routes, buses, and trips
- Set prices per route
- Export daily/monthly CSV reports
- View audit logs (Super Admin only)

---

## 🌍 Language Support

The website automatically supports:
- **English** (en)
- **Français** (fr)
- **Swahili** (sw)
- **Kinyarwanda** (rw)

Users can switch languages using the dropdown in the navbar (top-right).

---

## 📊 API Endpoints

All endpoints prefixed with: `https://ihute-api.up.railway.app`

### Public (Passengers)
```
GET  /api/trips/search              # Search public trips
GET  /api/cars/search               # Search private cars
POST /api/bookings                  # Create booking
POST /api/payments                  # Process payment
```

### Admin
```
POST   /api/admin/login             # Admin login
GET    /api/admin/bookings          # View bookings
POST   /api/admin/bookings/:id/confirm-payment
GET    /api/admin/reports?type=daily|monthly  # CSV export
POST   /api/admin/routes            # Add route
POST   /api/admin/buses             # Add bus
POST   /api/admin/trips             # Schedule trip
POST   /api/admin/express-routes    # Set price
GET    /api/admin/audit-logs        # View audit logs
```

---

## 🔧 Troubleshooting

### "Connection refused" or API errors
- ✅ Check `NEXT_PUBLIC_API_URL` in Vercel matches Railway domain
- ✅ Verify `ALLOWED_ORIGINS` in Railway includes Vercel domain

### Languages not switching
- ✅ Clear browser cache (Ctrl+Shift+Delete)
- ✅ Check localStorage isn't corrupted (DevTools → Application)

### Database errors
- ✅ Verify PostgreSQL is running in Railway
- ✅ Run `npm run migrate` in Railway terminal

### Payments not working
- ✅ Simulated for now—set up Stripe keys in .env for production

---

## 📱 Share with Users

Send your users this link to book:
```
https://ihute.vercel.app
```

Send your admins this link to manage:
```
https://ihute.vercel.app/login
```

---

## 🚀 Next Steps

1. Create admin accounts in the database
2. Add express companies (RITCO, Stella, etc.)
3. Create routes (Kigali → Musanze, etc.)
4. Add buses to expresses
5. Set prices per route
6. Schedule trips
7. Invite drivers (if private vehicles supported)

---

**Questions?** Check the [README.md](../README.md) or file an issue on GitHub.
