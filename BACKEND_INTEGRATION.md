# Smart Inventory System Frontend - Backend Integration Setup

## ✅ Integration Complete

The frontend has been fully integrated with the backend authentication API. Here's everything that's been configured:

### 🔧 Configuration

**Environment Variables (.env.local):**

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_DEMO_EMAIL=demo@inventory.com
NEXT_PUBLIC_DEMO_PASSWORD=Demo@12345
```

### 📋 What's Been Integrated

1. **Auth Service** (`src/lib/auth-service.ts`)
   - ✅ Login integration → `/auth/login`
   - ✅ Signup integration → `/auth/signup`
   - ✅ OTP verification → `/auth/verify-otp` & `/auth/verify-forgot-password-otp`
   - ✅ Forgot password → `/auth/forgot-password`
   - ✅ Reset password → `/auth/reset-password` with token support
   - ✅ Proper error handling and network resilience

2. **Redux API** (`src/redux/features/auth/authApi.ts`)
   - ✅ Standard login/signup mutations
   - ✅ Demo login endpoint
   - ✅ Password reset flow
   - ✅ Token refresh endpoint
   - ✅ Get profile/me endpoint
   - ✅ Admin functions (approve user, get all users)

3. **Auth Pages** - Token Handling
   - ✅ Login page saves tokens to Redux & localStorage
   - ✅ Verify OTP page passes reset token correctly
   - ✅ Reset password page uses token from URL
   - ✅ All pages handle network errors gracefully

4. **HTTP Client** (`src/redux/api/baseApi.ts`)
   - ✅ Automatic Bearer token injection in Authorization header
   - ✅ Auto token refresh on 401 responses
   - ✅ Proper token retry logic
   - ✅ Session management with error alerts

---

## 🚀 Quick Start

### Step 1: Start Backend Server

Make sure your backend is running at `http://localhost:8000`:

```bash
# Backend should be running with:
npm run dev  # or appropriate start command
```

**Verify backend is running:**

```bash
curl http://localhost:8000/api/v1/auth/demo-login
```

### Step 2: Start Frontend Development Server

```bash
npm run dev --webpack
```

Frontend will be available at `http://localhost:3000`

---

## 🧪 Testing the Authentication Flow

### Option 1: Demo User Login (Quickest)

1. Go to `http://localhost:3000/auth/login`
2. Click **"Pre-fill Demo Credentials"**
3. Click **"Sign In"**
4. Should redirect to dashboard with demo user logged in

**Demo Credentials:**

- Email: `demo@inventory.com`
- Password: `Demo@12345`

---

### Option 2: Complete Signup → Approval → Login Flow

#### Step 1: Signup

1. Go to `http://localhost:3000/auth/signup`
2. Fill in:
   - Name: `Test User`
   - Email: `testuser@example.com`
   - Password: `TestPass@123` (must meet requirements)
3. Click "Create Account"
4. Wait for "Please verify your OTP" message
5. Redirect to OTP verification page

#### Step 2: Verify OTP

1. Enter OTP from the email sent to `testuser@example.com`
2. Click "Verify OTP"
3. Redirect to pending approval page
4. Message: "Your account is pending admin approval"

#### Step 3: Admin Approves (Backend Call)

Run this curl command (requires admin token):

```bash
curl -X POST http://localhost:8000/api/v1/auth/approve/USER_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN"
```

Or use Postman/REST client to approve the user.

#### Step 4: Login

1. Go to `http://localhost:3000/auth/login`
2. Enter: `testuser@example.com` / `TestPass@123`
3. Click "Sign In"
4. Should redirect to dashboard

---

### Option 3: Forgot Password Flow

#### Step 1: Request Reset

1. Go to `http://localhost:3000/auth/forgot-password`
2. Enter email of registered user
3. Click "Send OTP"
4. Check email for OTP

#### Step 2: Verify OTP

1. Enter OTP from email
2. Click "Verify OTP"
3. Redirect to reset password page

#### Step 3: Reset Password

1. Enter new password (must meet requirements)
2. Confirm password
3. Click "Update Password"
4. Redirect to login page
5. Login with new password

---

## 🔑 Password Requirements

All passwords must have:

- ✅ Minimum 8 characters
- ✅ Maximum 64 characters
- ✅ At least 1 uppercase letter (A-Z)
- ✅ At least 1 lowercase letter (a-z)
- ✅ At least 1 digit (0-9)
- ✅ At least 1 special character (!@#$%^&\*)

**Valid Examples:**

- `SecurePass@123`
- `MyP@ssw0rd!`
- `TestPass@123`

---

## 🔍 Testing with Postman/curl

### Login Test

```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@inventory.com",
    "password": "Demo@12345"
  }'
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "...",
    "email": "demo@inventory.com",
    "name": "Demo Manager",
    "role": "MANAGER"
  },
  "accessToken": "eyJ...",
  "refreshToken": "eyJ..."
}
```

### Use Access Token

```bash
curl -X GET http://localhost:8000/api/v1/auth/me \
  -H "Authorization: Bearer ACCESS_TOKEN_HERE"
```

### Refresh Token

```bash
curl -X POST http://localhost:8000/api/v1/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "REFRESH_TOKEN_HERE"
  }'
```

---

## 🛠️ Troubleshooting

### "Backend unreachable" or "Cannot GET /api/v1"

**Solution:**

- Ensure backend server is running at `http://localhost:8000`
- Check `.env.local` has correct `NEXT_PUBLIC_API_URL`
- Verify backend is listening on port 8000

### "Email already registered"

**Solution:**

- Use a unique email address for signup
- Or use the demo user credentials

### "OTP expired" or "OTP not received"

**Solution:**

- Check email spam/trash folder
- Ensure backend email is configured in `.env`
- Use demo login for quick testing

### "Account pending admin approval"

**Solution:**

- User account created but not approved yet
- Admin must approve the account using the backend API
- Or use demo user which is pre-approved

### Tokens not working or 401 errors

**Solution:**

- Backend may have restarted - login again to get fresh tokens
- Check TokenAuthorization header format: `Bearer TOKEN` (not just `TOKEN`)
- Ensure access token hasn't expired (7 days)

### "Session Expired" alert appears

**Solution:**

- Login again - tokens have expired
- App will automatically try to refresh tokens if within 30-day refresh window

---

## 📱 Frontend Features Confirmed

- ✅ Login page with demo credentials option
- ✅ Signup with email validation
- ✅ OTP verification for both signup and password reset
- ✅ Pending approval status message
- ✅ Forgot password flow
- ✅ Password reset with token handling
- ✅ Automatic token storage in Redux
- ✅ Bearer token injection in all API calls
- ✅ Auto token refresh on 401
- ✅ Logout functionality
- ✅ Session persistence

---

## 📚 API Endpoints Summary

### Public Endpoints (No Auth Required)

| Method | Endpoint                           | Purpose                |
| ------ | ---------------------------------- | ---------------------- |
| POST   | `/auth/signup`                     | User registration      |
| POST   | `/auth/login`                      | User login             |
| POST   | `/auth/verify-otp`                 | Verify signup OTP      |
| POST   | `/auth/forgot-password`            | Request password reset |
| POST   | `/auth/verify-forgot-password-otp` | Verify reset OTP       |
| POST   | `/auth/reset-password`             | Reset password         |
| POST   | `/auth/demo-login`                 | Demo user login        |
| GET    | `/auth/demo-login`                 | Get demo config        |
| POST   | `/auth/refresh-token`              | Refresh access token   |

### Protected Endpoints (Auth Required)

| Method | Endpoint                | Purpose          | Required Role  |
| ------ | ----------------------- | ---------------- | -------------- |
| GET    | `/auth/me`              | Get current user | MANAGER, ADMIN |
| POST   | `/auth/create-account`  | Create account   | MANAGER        |
| GET    | `/auth/`                | Get all users    | ADMIN          |
| POST   | `/auth/approve/:userId` | Approve user     | ADMIN          |

---

## 🎯 Next Steps

1. ✅ Backend running at `http://localhost:8000`
2. ✅ Frontend running at `http://localhost:3000`
3. 🧪 Test demo login
4. 🧪 Test complete signup flow
5. ✨ Build inventory features with authenticated API calls

---

## 📞 Support

For backend API details and additional information, see:

- Backend API documentation in your backend repository
- API Response formats and error codes
- Token expiration times and refresh strategies
