# ⚡ Quick Start Guide

Get your MediCare backend running in 5 minutes.

---

## Step 1: Bootstrap Everything (1 minute)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
```

**If you don't have .env.example:**
Create `.env` with these minimum values:
```bash
NODE_ENV=development
PORT=3000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/medicare_db"
JWT_SECRET="your-secret-key-here-min-32-characters-long"
JWT_REFRESH_SECRET="your-refresh-secret-min-32-characters"
REDIS_HOST="localhost"
REDIS_PORT="6379"
CORS_ORIGIN="http://localhost:5173"
```

---

## Step 2: Start Database & Cache (2 minutes - optional)

If you have Docker:
```bash
docker-compose up -d postgres redis
```

Or manually:
- **PostgreSQL:** Create database `medicare_db`
- **Redis:** Start Redis server

---

## Step 3: Set Up Database (1 minute)

```bash
# Create tables from schema
npm run db:push

# (Optional) Seed sample data
npm run db:seed
```

---

## Step 4: Start Server (1 minute)

```bash
npm run dev
```

**Expected output:**
```
🚀 Server running on http://localhost:3000
📝 Request logger initialized
🔗 Database connected
💾 Redis connected
```

---

## Step 5: Test It Works (uses 5 minutes cumulatively)

### In another terminal:

**Register:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "1990-01-15"
  }'
```

**Copy the `token` from response, then Login:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

**Test protected route (replace TOKEN):**
```bash
curl -X GET http://localhost:3000/api/v1 \
  -H "Authorization: Bearer TOKEN"
```

---

## That's It! 🎉

Your backend is now:
- ✅ Running on `http://localhost:3000`
- ✅ Connected to PostgreSQL database
- ✅ Connected to Redis cache
- ✅ Ready to accept API requests
- ✅ Handling JWT authentication

---

## What You Can Do Next

### Option 1: Explore & Test
```bash
# Run integration tests
npm test

# Watch mode for development
npm test -- --watch
```

### Option 2: Build & Deploy
```bash
# Build for production
npm run build

# Run production build
npm start

# Create Docker image
docker build -t medicare-api .
```

### Option 3: Develop New Features
All new controllers/services/repositories follow the same pattern:

1. **Create Controller** - implements HTTP logic
2. **Create Service** - implements business logic
3. **Create Repository** - implements database queries
4. **Create Routes** - define endpoints
5. **Mount in app.ts** - register endpoints

See `BACKEND_ARCHITECTURE.md` for full patterns.

---

## Folder Structure

```
backend/
├── src/
│   ├── app.ts              ← Express setup
│   ├── server.ts           ← Entry point
│   ├── config/             ← Database, Redis, Logger
│   ├── controllers/        ← HTTP handlers (auth done)
│   ├── services/           ← Business logic (auth done)
│   ├── repositories/       ← Database access (user done)
│   ├── routes/             ← API endpoints (auth done)
│   ├── middleware/         ← Auth, validation, errors
│   ├── utils/              ← JWT, password utilities
│   ├── types/              ← TypeScript interfaces
│   ├── data/               ← Constants, enums
│   └── tests/              ← Test files
├── prisma/
│   └── schema.prisma       ← Database schema
├── .env                    ← Environment variables
├── Dockerfile              ← Docker configuration
├── docker-compose.yml      ← Services (Postgres, Redis)
└── package.json            ← Dependencies
```

---

## Common Commands

```bash
# Development
npm run dev                  # Start dev server with hot reload
npm run typecheck           # Check TypeScript errors
npm run lint                # Check code style
npm test                    # Run tests

# Database
npm run db:push             # Create tables
npm run db:seed             # Add sample data
npm run db:studio           # Open database GUI

# Production
npm run build               # Compile to JavaScript
npm start                   # Run compiled server

# Docker
npm run docker:build        # Build Docker image
npm run docker:run          # Run Docker container
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| ❌ "Cannot find module" | Run `npm install` again |
| ❌ "Database connection failed" | Start PostgreSQL, verify DATABASE_URL in .env |
| ❌ "Redis connection refused" | Start Redis server, verify REDIS_HOST/PORT |
| ❌ "Port 3000 already in use" | Change PORT in .env or stop other process |
| ❌ "JWT_SECRET not found" | Add JWT_SECRET to .env |
| ❌ "Type errors" | Run `npm run typecheck` and fix |

---

## Documentation

- 📖 **Architecture Docs:** `BACKEND_ARCHITECTURE.md`
- 📝 **Test Guide:** `TESTING.md`
- 🔧 **Setup Guide:** `SETUP.md`
- 🐛 **Integration Audit:** `INTEGRATION_AUDIT.md`

---

## You're Ready! 🚀

The backend is fully integrated and ready for:
- ✅ Development
- ✅ Testing
- ✅ Frontend integration
- ✅ Deployment

Start by running `npm run dev` and explore the API!
