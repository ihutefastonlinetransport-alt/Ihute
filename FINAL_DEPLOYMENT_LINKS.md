# 🚀 IHUTE DEPLOYMENT - QUICK START

## Your Production Links (After Deployment)

### 📱 **Client Website** (Share with Passengers/Users)
```
https://ihute.vercel.app
```
✅ Book buses & private vehicles  
✅ Real-time seat availability  
✅ 4 languages (EN, FR, RW, SW)  
✅ Payment checkout  
✅ Booking confirmations  

---

### 🔐 **Admin Dashboard** (Share with Managers)
```
https://ihute.vercel.app/login
```
✅ View all bookings  
✅ Confirm cash payments  
✅ Manage routes & buses  
✅ Set prices  
✅ Export CSV reports  
✅ Audit logs  

---

## ⚡ 3-STEP DEPLOYMENT (15 minutes)

### STEP 1️⃣ Deploy Frontend (Vercel)
```bash
# Go to: https://vercel.com/new
# 1. Import repo: ihutefastonlinetransport-alt/Ihute
# 2. Set Root Directory: client/
# 3. Add Environment: NEXT_PUBLIC_API_URL=YOUR-RAILWAY-URL (later)
# 4. Deploy → Wait ~2 min
```
✅ Get frontend URL like: `https://ihute.vercel.app`

---

### STEP 2️⃣ Deploy Backend (Railway)
```bash
# Go to: https://railway.app
# 1. New Project → Deploy from GitHub
# 2. Select: ihutefastonlinetransport-alt/Ihute
# 3. Root Directory: server/
# 4. Add PostgreSQL: + Add Service → PostgreSQL
# 5. Set Variables:
#    - JWT_SECRET=random-secret-here
#    - NODE_ENV=production
#    - ALLOWED_ORIGINS=https://ihute.vercel.app,YOUR-RAILWAY-URL
# 6. Deploy & run: npm run migrate
```
✅ Get backend URL like: `https://ihute-api.up.railway.app`

---

### STEP 3️⃣ Link Them Together
```bash
# Go to Vercel Dashboard → ihute project
# Settings → Environment Variables
# Update: NEXT_PUBLIC_API_URL = YOUR-RAILWAY-URL
# Redeploy
```
✅ Done! Both services talking to each other

---

## 📋 What You Get

| Feature | Status |
|---------|--------|
| 🚐 Public Bus Booking | ✅ Ready |
| 🚗 Private Vehicle Booking | ✅ Ready |
| 💳 Payment Gateway (Card/Cash/MoMo) | ✅ Ready |
| 🌍 Multi-Language (4 languages) | ✅ Ready |
| 🔐 Admin Security (JWT + RBAC) | ✅ Ready |
| 📊 Reports & Analytics | ✅ Ready |
| 📧 Email Notifications | ✅ Configured |
| 📱 SMS Alerts | ✅ Configured |
| 🖼️ Image Carousel (Hero) | ✅ Ready |
| 🎨 Professional UI/UX | ✅ Polished |

---

## 🔑 First Admin Setup

Once deployed, you'll need to:

1. **Create Super Admin** (via database insert):
   ```sql
   INSERT INTO admins (name, email, password_hash, role, status)
   VALUES ('Your Name', 'admin@ihute.rw', 'HASHED_PASSWORD', 'super_admin', 'active');
   ```

2. **Login at**: https://ihute.vercel.app/login

3. **Create Express Companies**:
   - RITCO
   - Stella
   - Your local operators

4. **Add Routes**: Kigali → Musanze, Rubavu, etc.

5. **Add Buses**: Assign to operators

6. **Set Prices**: Per route per operator

7. **Schedule Trips**: Day by day

---

## 🌐 Language Switching

Users click the language dropdown (top-right) to switch between:
- 🇬🇧 **English** (en)
- 🇫🇷 **Français** (fr)  
- 🇷🇼 **Kinyarwanda** (rw)
- 🇹🇿 **Swahili** (sw)

Automatically persisted in browser.

---

## 📞 Support Contacts

**Share These Links:**
```
👥 Users/Passengers:  https://ihute.vercel.app
👨‍💼 Admins:           https://ihute.vercel.app/login
📖 Docs:              https://github.com/ihutefastonlinetransport-alt/Ihute/blob/main/DEPLOYMENT.md
```

---

## ✅ Deployment Checklist

- [ ] Vercel deployment complete
- [ ] Vercel shows green checkmark
- [ ] Railway deployment complete  
- [ ] Database migrated (`npm run migrate`)
- [ ] NEXT_PUBLIC_API_URL set in Vercel
- [ ] Both services redeployed
- [ ] Can login at admin page
- [ ] Language switching works
- [ ] Bookings can be made
- [ ] Admins can confirm payments

---

## 🚀 Ready to Launch?

Your site is **production-ready**. Share these links:

```
🌐 https://ihute.vercel.app
🔐 https://ihute.vercel.app/login (admin)
```

Users can book instantly. Admins can manage everything.

---

**Made with ❤️ by GitHub Copilot**  
Generated: February 8, 2026
