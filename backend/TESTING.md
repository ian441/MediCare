# 🧪 Backend Testing & Integration Guide

## Overview

After the integration audit and fixes, your backend is now properly configured with:
- ✅ Routes properly mounted
- ✅ MVC pattern correctly implemented
- ✅ JWT authentication working
- ✅ Type safety ensured
- ✅ Error handling comprehensive

This guide walks through testing and verifying each component.

---

## Prerequisites

Before running tests, ensure you have:

1. **Node.js 20+** installed
   ```bash
   node --version
   ```

2. **Dependencies installed**
   ```bash
   cd backend
   npm install
   ```

3. **Environment variables configured**
   - Copy `.env.example` to `.env`
   - Update with your actual values
   - Minimum required: `DATABASE_URL`, `JWT_SECRET`, `NODE_ENV`

4. **Database ready** (Optional for tests, required for full integration)
   ```bash
   docker-compose up -d postgres redis  # Start Docker containers
   npm run db:push  # Create tables from Prisma schema
   ```

---

## Test Files

### 1. Integration Check Script

**Location:** `src/tests/integration-check.ts`

**Purpose:** Verifies all major backend components are working

**Run:**
```bash
npm run test:integration-check
```

**Output:**
```
========================================
🧪 Backend Integration Verification
========================================

✅ PASS
  Logger Configuration
  Winston logger initialized successfully

✅ PASS
  Express App
  Express app initialized with middleware

✅ PASS
  Auth Routes Mounted
  Auth routes imported and ready

...
========================================
Summary: 9 passed, 0 failed
========================================
```

**What it checks:**
- ✅ Logger configuration
- ✅ Express app initialization
- ✅ Route registration
- ✅ Database connection (optional)
- ✅ Redis connection (optional)
- ✅ Service layer integration
- ✅ Middleware registration
- ✅ Utility functions
- ✅ Environment variables

---

### 2. Authentication Tests

**Location:** `src/tests/auth.test.ts`

**Purpose:** Comprehensive testing of authentication flow

**Run:**
```bash
# Run all tests
npm test

# Run only auth tests
npm test -- auth.test.ts

# Run with coverage
npm test -- --coverage

# Run in watch mode (for development)
npm test -- --watch
```

**Test Structure:**

#### POST /api/v1/auth/register
- ✅ Successfully register new user
- ✅ Reject duplicate email (409)
- ✅ Reject invalid email format (422)
- ✅ Reject weak password (422)
- ✅ Reject missing fields (422)

#### POST /api/v1/auth/login
- ✅ Login with correct credentials (200)
- ✅ Reject incorrect password (401)
- ✅ Reject non-existent user (401)
- ✅ Reject invalid email format (422)

#### POST /api/v1/auth/refresh
- ✅ Refresh access token with valid refresh token (200)
- ✅ Reject invalid refresh token (401)
- ✅ Reject missing refresh token (422)

#### Protected Routes
- ✅ Allow access with valid token (200)
- ✅ Reject request without token (401)
- ✅ Reject request with invalid token (401)
- ✅ Reject malformed header (401)

#### POST /api/v1/auth/logout
- ✅ Successfully logout (200)

#### JWT Utilities
- ✅ Generate and verify token
- ✅ Generate and verify refresh token
- ✅ Reject invalid token (throw)
- ✅ Decode token without verification

#### Password Utilities
- ✅ Hash and compare password
- ✅ Reject wrong password
- ✅ Hash consistently (same input, different hash)

---

## Manual Integration Testing

### 1. Start the Development Server

```bash
npm run dev
```

Expected output:
```
🚀 Server running on http://localhost:3000
📝 Request logger initialized
🔗 Database connected
💾 Redis connected
```

---

### 2. Test Registration Endpoint

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "1990-01-15"
  }'
```

**Expected Response (201):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "clx123...",
      "email": "testuser@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "PATIENT",
      "status": "ACTIVE"
    }
  }
}
```

---

### 3. Test Login Endpoint

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "SecurePass123!"
  }'
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "clx123...",
      "email": "testuser@example.com",
      "role": "PATIENT",
      "status": "ACTIVE"
    }
  }
}
```

---

### 4. Test Protected Route (using token)

```bash
# Replace TOKEN with the token from login response
curl -X GET http://localhost:3000/api/v1 \
  -H "Authorization: Bearer TOKEN"
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "API server running"
}
```

---

### 5. Test Refresh Token

```bash
# Replace REFRESH_TOKEN with the refreshToken from login response
curl -X POST http://localhost:3000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "REFRESH_TOKEN"
  }'
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "clx123...",
      "email": "testuser@example.com"
    }
  }
}
```

---

### 6. Test Error Scenarios

#### Missing Token
```bash
curl -X GET http://localhost:3000/api/v1
```
**Expected Response (401):** Missing Authorization header

#### Invalid Token
```bash
curl -X GET http://localhost:3000/api/v1 \
  -H "Authorization: Bearer invalid.token.here"
```
**Expected Response (401):** Invalid token

#### Invalid Email Format
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "not-an-email",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```
**Expected Response (422):** Validation error

---

## Using Postman

Import this collection for easier testing:

1. **Create Collection:** "MediCare API"

2. **Add Requests:**

   **Register**
   - Method: POST
   - URL: `http://localhost:3000/api/v1/auth/register`
   - Body (JSON):
     ```json
     {
       "email": "testuser@example.com",
       "password": "SecurePass123!",
       "firstName": "John",
       "lastName": "Doe",
       "dateOfBirth": "1990-01-15"
     }
     ```

   **Login**
   - Method: POST
   - URL: `http://localhost:3000/api/v1/auth/login`
   - Body (JSON):
     ```json
     {
       "email": "testuser@example.com",
       "password": "SecurePass123!"
     }
     ```

   **Protected Route (with token)**
   - Method: GET
   - URL: `http://localhost:3000/api/v1`
   - Headers:
     - Key: `Authorization`
     - Value: `Bearer <paste-token-here>`

3. **Save token in environment variable:**
   - In Postman, after login response, right-click token value
   - Select "Set: Collection Variables"
   - Variable name: `token`
   - Then use `{{token}}` in Authorization header

---

## Common Issues & Solutions

### ❌ "Cannot find module @/..." Error

**Problem:** Path aliases not resolving

**Solution:**
```bash
# Make sure tsconfig.json has paths configured
# And TypeScript is building correctly
npm run build

# For development, ensure paths are correct in vite.config.ts
```

---

### ❌ "Database connection failed"

**Problem:** PostgreSQL not running

**Solution:**
```bash
# Start Docker containers
docker-compose up -d postgres

# Or use local PostgreSQL
# Create database:
createdb medicare_db

# Update DATABASE_URL in .env:
DATABASE_URL="postgresql://user:password@localhost:5432/medicare_db"

# Create tables:
npm run db:push
```

---

### ❌ "Redis connection refused"

**Problem:** Redis not running

**Solution:**
```bash
# Start Redis in Docker
docker-compose up -d redis

# Or use local Redis
redis-server

# Check Redis is running:
redis-cli ping
# Should return: PONG
```

---

### ❌ "JWT_SECRET not found"

**Problem:** Missing environment variable

**Solution:**
```bash
# Copy example environment file
cp .env.example .env

# Add your secret (any random string, min 32 chars)
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
```

---

### ❌ "Type error in auth.controller.ts"

**Problem:** TypeScript strict mode issues

**Solution:**
- Make sure `tsconfig.json` has:
  ```json
  {
    "compilerOptions": {
      "noUnusedParameters": false,
      "noUnusedLocals": false
    }
  }
  ```
- Run: `npm run typecheck`

---

## Performance & Load Testing

### Basic Load Test

```bash
# Install Apache Bench (comes with Apache)
ab -n 1000 -c 10 http://localhost:3000/api/v1

# Or use wrk (cross-platform)
wrk -t4 -c100 -d30s http://localhost:3000/api/v1
```

### Rate Limiting Test

Default rate limit is 100 requests per 15 minutes:

```bash
# This should succeed
for i in {1..50}; do
  curl -s http://localhost:3000/api/v1 \
    -H "Authorization: Bearer TOKEN" \
    -o /dev/null -w "%{http_code}\n"
done

# After 100 requests, should get 429 (Too Many Requests)
```

---

## Debugging Tips

### Enable Debug Logging

Set environment variable:
```bash
DEBUG=* npm run dev
```

Or increase log level in `.env`:
```bash
LOG_LEVEL=debug
```

### Use Node Inspector

```bash
# Start with inspector
node --inspect-brk ./dist/server.js

# Open in Chrome DevTools: chrome://inspect
```

### Check Database State

```bash
# Open Prisma Studio (database GUI)
npx prisma studio

# Or query directly
npm run db:shell
```

---

## Next Steps After Testing

Once all tests pass:

1. ✅ **Database Setup**
   ```bash
   npm run db:push
   npm run db:seed  # Add sample data
   ```

2. ✅ **Create Additional Endpoints**
   - Follow the same pattern as auth:
   - Controller → Service → Repository

3. ✅ **Add Request Validation**
   - Create Joi schemas for each endpoint
   - Apply validation middleware

4. ✅ **Set Up CI/CD**
   - GitHub Actions workflow
   - Automated testing on commit

5. ✅ **Deploy**
   - Docker image: `docker build -t medicare-api .`
   - Push to registry
   - Deploy to hosting (Render, Railway, AWS, etc.)

---

## Test Commands Summary

```bash
# Install dependencies
npm install

# Run type checking
npm run typecheck

# Run all tests
npm test

# Run specific test file
npm test -- auth.test.ts

# Run with coverage report
npm test -- --coverage

# Run integration checks
npm run test:integration-check

# Run linter
npm run lint

# Build for production
npm run build

# Start development server
npm run dev

# Start production server
npm start

# Database operations
npm run db:generate  # Generate Prisma client
npm run db:push      # Create tables
npm run db:migrate   # Run migrations
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed data
npm run db:shell     # Interactive database shell
```

---

## Success Indicators

✅ **You know the integration is working when:**

1. All tests pass: `npm test` returns 0 failures
2. Server starts: `npm run dev` shows no errors
3. Registration works: POST /auth/register returns 201
4. Login works: POST /auth/login returns token
5. Protected route works: GET with Bearer token returns 200
6. Database connected: Tables created and queryable
7. Redis connected: Cache operations work
8. Logs appear: Request logs show in console

Once all of these are confirmed, your backend integration is complete! 🎉

---

## Questions or Issues?

Refer to:
- `INTEGRATION_AUDIT.md` - Detailed integration issues and fixes
- `BACKEND_ARCHITECTURE.md` - Complete architecture overview
- `SETUP.md` - Detailed setup instructions
- `src/` folder structure - Code organization reference
