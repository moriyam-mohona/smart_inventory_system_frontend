# Integration Verification Checklist

## ✅ Environment Setup

```bash
# 1. Verify .env.local exists with correct values
cat .env.local

# Expected output:
# NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
# NEXT_PUBLIC_DEMO_EMAIL=demo@inventory.com
# NEXT_PUBLIC_DEMO_PASSWORD=Demo@12345
```

---

## 🚀 Backend Server

```bash
# 1. Ensure backend is running
curl http://localhost:8000/api/v1/auth/demo-login

# Expected: 200 OK with demo config or similar response
```

---

## 🧪 Frontend Development Server

```bash
# 1. Install dependencies (if not already done)
npm install

# 2. Start frontend dev server
npm run dev --webpack

# 3. Navigate to http://localhost:3000
# Should see homepage without errors
```

---

## 🔐 Test Demo Login

1. **Navigate to:** `http://localhost:3000/auth/login`
2. **Click:** "Pre-fill Demo Credentials" button
3. **Expected:**
   - Email field: `demo@inventory.com`
   - Password field: `Demo@12345`
4. **Click:** "Sign In" button
5. **Expected:**
   - Loading state: "Authenticating..."
   - Toast/alert with success message
   - Redirects to `/dashboard`
6. **Verify Dashboard:**
   - Should see dashboard content
   - User info displayed (Demo Manager)

---

## 🔄 Test Complete Auth Flow (Optional)

### Signup

1. Go to `/auth/signup`
2. Fill form with:
   - Name: `John Doe`
   - Email: `john@example.com`
   - Password: `SecurePass@123`
3. Click "Create Account"
4. **Expected:** Redirects to OTP verification page

### OTP Verification

1. Check email for 6-digit OTP
2. Enter OTP on `/auth/verify-otp?type=signup&email=john@example.com`
3. Click "Verify OTP"
4. **Expected:** Redirects to pending approval page

### Admin Approval (Backend)

Using curl or Postman:

```bash
curl -X POST http://localhost:8000/api/v1/auth/approve/USER_ID \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### Login

1. Go to `/auth/login`
2. Enter: `john@example.com` / `SecurePass@123`
3. Click "Sign In"
4. **Expected:** Redirects to dashboard

---

## 🔑 Browser Console Verification

Open browser DevTools (F12) and check:

### 1. Check Redux Store

```javascript
// In browser console
// Look for auth state with tokens
console.log(localStorage.getItem("persist:root"));
```

Should contain: `access_token`, `refresh_token`, `user`

### 2. Check Network Requests

```
// Open Network tab in DevTools
// Look for requests to:
// http://localhost:8000/api/v1/auth/*

// Check response bodies for:
// - accessToken
// - refreshToken
// - user object
```

### 3. Check Authorization Headers

```
// In Network tab, click on auth request
// Go to Request Headers
// Should see: Authorization: Bearer eyJ...
```

---

## 🐛 Common Issues & Fixes

### Issue: "Cannot GET /api/v1"

**Fix:**

```bash
# Ensure backend is running
npm run dev  # Run this in backend directory
# Should see: Server running on port 8000
```

### Issue: "Cannot POST /auth/login"

**Fix:**

```bash
# Check .env.local
# Ensure NEXT_PUBLIC_API_URL is correct:
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
# Restart frontend: npm run dev --webpack
```

### Issue: "Network Error" or timeout

**Fix:**

```bash
# Test backend directly
curl -I http://localhost:8000/api/v1/auth/demo-login

# If fails, start backend server
# If passes, check firewall/CORS settings
```

### Issue: Redirect loop or "Session Expired"

**Fix:**

```bash
# Clear browser localStorage
localStorage.clear()

# Restart frontend dev server
# npm run dev --webpack

# Try login again
```

### Issue: Tokens not being saved

**Fix:**

```javascript
// In browser console, check Redux store after login
window.store.getState().auth;
// Should have: access_token, refresh_token, user

// If empty, check Network tab for login response
// Should contain: accessToken, refreshToken
```

---

## 📊 Integration Status

| Component      | Status | Notes                          |
| -------------- | ------ | ------------------------------ |
| Environment    | ✅     | `.env.local` configured        |
| Auth Service   | ✅     | API calls integrated           |
| Redux API      | ✅     | Endpoints updated              |
| Auth Pages     | ✅     | Token handling added           |
| Bearer Tokens  | ✅     | Header format fixed            |
| Login Flow     | ✅     | Redux state management working |
| Signup Flow    | ✅     | OTP verification integrated    |
| Password Reset | ✅     | Token handling implemented     |
| Demo User      | ✅     | Available for testing          |
| Error Handling | ✅     | Network errors handled         |

---

## 📝 Files Modified

1. ✅ **Created:** `.env.local`
2. ✅ **Modified:** `src/lib/auth-service.ts`
3. ✅ **Modified:** `src/redux/features/auth/authApi.ts`
4. ✅ **Modified:** `src/types/auth.ts`
5. ✅ **Modified:** `src/redux/api/baseApi.ts`
6. ✅ **Modified:** `src/app/auth/login/page.tsx`
7. ✅ **Modified:** `src/app/auth/verify-otp/page.tsx`
8. ✅ **Modified:** `src/app/auth/reset-password/page.tsx`
9. ✅ **Created:** `BACKEND_INTEGRATION.md`
10. ✅ **Created:** `INTEGRATION_CHECKLIST.md`

---

## 🎯 Quick Commands

```bash
# Start backend (in backend directory)
npm run dev

# Start frontend (in this directory)
npm run dev --webpack

# Test backend API
curl http://localhost:8000/api/v1/auth/demo-login

# Clear browser cache
# DevTools > Application > LocalStorage > Clear All

# Run linter
npm run lint

# Build for production
npm run build
npm start
```

---

## ✨ You're All Set!

The frontend is now fully integrated with the backend authentication API. Follow the testing steps above to verify everything works correctly.

**Next steps:**

1. Start the backend server on port 8000
2. Start the frontend dev server on port 3000
3. Test demo login at http://localhost:3000/auth/login
4. Build inventory features with authenticated API calls

Good luck! 🚀
