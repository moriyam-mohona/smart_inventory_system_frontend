# 🚀 Quick Start Guide - Backend Integration

## ⚡ 30-Second Setup

### Prerequisites

- Backend running on `http://localhost:8000`
- Node.js/npm installed

### Commands

```bash
# 1. Install frontend dependencies (if needed)
npm install

# 2. Start frontend dev server
npm run dev --webpack

# 3. Open browser
open http://localhost:3000/auth/login
```

---

## 🎯 Test Immediately

### Option A: Demo User (30 seconds) ⭐ FASTEST

1. Go to `http://localhost:3000/auth/login`
2. Click **"Pre-fill Demo Credentials"** button
3. Click **"Sign In"**
4. ✅ Redirects to dashboard

### Option B: Full Signup Flow (5 minutes)

1. Go to `/auth/signup`
2. Fill form & create account
3. Verify OTP from email
4. Wait for admin approval
5. Login with new account

---

## 📝 Environment

File: `.env.local`

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_DEMO_EMAIL=demo@inventory.com
NEXT_PUBLIC_DEMO_PASSWORD=Demo@12345
```

✅ Already created!

---

## 🔑 Demo Credentials

```
Email: demo@inventory.com
Password: Demo@12345
```

---

## 🔍 Verify It's Working

### Check Backend is Running

```bash
curl http://localhost:8000/api/v1/auth/demo-login
```

Expected: HTTP 200 with response

### Check Frontend Toast Messages

- After login: "Welcome back. Redirecting to dashboard..."
- If error: Check console (F12) for details

### Check Redux DevTools

- Open DevTools > Application > LocalStorage
- Look for `persist:root`
- Should contain auth tokens

---

## 🛠️ Troubleshooting

| Issue                      | Solution                                        |
| -------------------------- | ----------------------------------------------- |
| "Backend unreachable"      | Ensure backend runs on port 8000: `npm run dev` |
| "API_URL is empty"         | Check `.env.local` file exists and is correct   |
| "Login fails silently"     | Check browser console (F12) for errors          |
| "No redirect to dashboard" | Check localStorage - tokens should be saved     |

---

## 📁 Files You Created/Modified

**Configuration:**

- ✅ `.env.local`

**Documentation:**

- 📖 `BACKEND_INTEGRATION.md` - Full setup guide
- 📖 `INTEGRATION_CHECKLIST.md` - Testing checklist
- 📖 `INTEGRATION_SUMMARY.md` - Project summary
- 📖 `QUICK_START.md` - This file!

**Code:**

- ✅ Auth service, Redux API, auth pages updated
- ✅ All lint errors fixed
- ✅ Types properly aligned

---

## ✨ Status

✅ **READY** - Frontend fully integrated with backend API

Start developing inventory features on top of this auth foundation!

---

## 📚 Documentation Index

- **THIS FILE** ← You are here (Quick Start)
- `BACKEND_INTEGRATION.md` - Complete setup & testing guide
- `INTEGRATION_CHECKLIST.md` - Step-by-step verification
- `INTEGRATION_SUMMARY.md` - Technical overview

---

## 🎉 You're All Set!

```
Backend   → [localhost:8000/api/v1]
            ↓
Frontend  → [localhost:3000]
            ↓
Auth Flow ✅ Fully Integrated
```

**Next:** Test demo login, then build features! 🚀
