# Backend Setup & Installation Guide

## 📋 Prerequisites

Before starting, ensure you have:

- **Node.js 20+** → [Download](https://nodejs.org/)
- **PostgreSQL 15+** → [Download](https://www.postgresql.org/download/)
- **Redis 7+** → [Download](https://redis.io/download) or use [Docker](https://hub.docker.com/_/redis)
- **npm** or **yarn** → Comes with Node.js
- **Git** → [Download](https://git-scm.com/)

### Verify Installation

```bash
node --version    # Should be v20.x+
npm --version     # Should be 10.x+
psql --version    # Should be 15.x+
redis-cli --version  # Should be 7.x+
```

---

## 🚀 Quick Setup (5 minutes)

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

This will install all packages defined in `package.json`.

### 3. Configure Environment Variables

```bash
# Copy example env file
cp .env.example .env

# Edit .env with your settings (VS Code or any editor)
code .env  # or nano .env / vim .env
```

**Key variables to update:**

```env
DATABASE_URL=postgresql://postgres:Retry4x@localhost:5432/medicare_db
JWT_SECRET=your_very_secure_long_secret_key_here_min_32_chars
REDIS_HOST=localhost
REDIS_PORT=6379
```

### 4. Set Up Database

```bash
# Run migrations
npm run db:migrate

# Seed initial data (optional)
npm run db:seed
```

### 5. Start Development Server

```bash
npm run dev
```

✅ Server should now run at http://localhost:3000

---

## 🐳 Docker Setup (Recommended)

### Using Docker Compose (Easiest)

```bash
# From project root (above backend folder)
docker-compose -f backend/docker-compose.yml up -d

# View logs
docker-compose -f backend/docker-compose.yml logs -f

# Stop services
docker-compose -f backend/docker-compose.yml down
```

**Services Started:**
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`
- Backend API: `http://localhost:3000`

### Build Custom Docker Image

```bash
cd backend

# Build image
docker build -t medicare-backend:latest .

# Run with environment
docker run -p 3000:3000 \
  --env-file .env \
  --name medicare-api \
  medicare-backend:latest
```

---

## 📊 Database Setup

### PostgreSQL Installation

#### **Windows**
1. Download PostgreSQL installer from [postgresql.org](https://www.postgresql.org/download/windows/)
2. Run installer, set password: `Retry4x`
3. Accept default port `5432`
4. Open SQL Shell or pgAdmin

#### **macOS** (Homebrew)
```bash
brew install postgresql
brew services start postgresql
createdb medicare_db
```

#### **Linux** (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo -u postgres createdb medicare_db
```

### Verify Connection

```bash
# Test PostgreSQL connection
psql -U postgres -h localhost -d medicare_db

# Should show: medicare_db=#
```

### Initialize Database Schema

From `backend/` directory:

```bash
# Create all tables
npm run db:migrate

# Verify tables created
psql -U postgres -d medicare_db -c "\dt"
```

---

## 🔴 Redis Setup

### Installation Options

#### **Option 1: Docker** (Easiest)
```bash
docker run -d -p 6379:6379 --name redis redis:7-alpine
```

#### **Option 2: Homebrew** (macOS)
```bash
brew install redis
brew services start redis
```

#### **Option 3: Docker Desktop**
```bash
# If using Docker Desktop, simply:
docker run -d -p 6379:6379 redis:7-alpine
```

#### **Option 4: Windows Subsystem for Linux (WSL)**
```bash
wsl
sudo apt update && sudo apt install redis-server
redis-server
```

### Verify Connection

```bash
redis-cli ping
# Should return: PONG
```

---

## 🔐 Environment Variables Explained

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Runtime environment | `development`, `production` |
| `PORT` | Server port | `3000` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | Secret for signing tokens | Min 32 random characters |
| `REDIS_HOST` | Redis server hostname | `localhost` |
| `REDIS_PORT` | Redis server port | `6379` |
| `SENDGRID_API_KEY` | Email service API key | From SendGrid dashboard |
| `TWILIO_ACCOUNT_SID` | Telemedicine provider | From Twilio console |

---

## 🧪 Running Tests

```bash
# Run all tests
npm run test

# Run in watch mode (re-run on file changes)
npm run test:watch

# Generate coverage report
npm run test:coverage
```

Test files should be in:
- `tests/unit/` - Service tests
- `tests/integration/` - API tests
- `tests/e2e/` - Full workflows

---

## 📝 Development Workflow

### Start Development

```bash
npm run dev
```

This uses `nodemon` to auto-restart on file changes.

### Check Code Quality

```bash
# Lint code
npm run lint

# Auto-fix common issues
npm run lint:fix

# Format code (Prettier)
npx prettier --write src/
```

### Database Management

```bash
# Create new migration
npm run db:migrate -- --name add_new_feature

# View Prisma Studio GUI
npm run db:studio

# Reset database (⚠️ DESTRUCTIVE)
npm run db:reset
```

---

## 🚨 Common Issues & Fixes

### ❌ "Cannot find module" Error

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### ❌ Database Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Fix:**
1. Check PostgreSQL is running: `psql --version`
2. Start PostgreSQL (macOS): `brew services start postgresql`
3. Verify DATABASE_URL in `.env`
4. Check credentials: `psql -U postgres`

### ❌ Redis Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:6379
```

**Fix:**
1. Start Redis: `redis-server` or `docker run -d -p 6379:6379 redis:7`
2. Verify connection: `redis-cli ping`
3. Check REDIS_HOST and REDIS_PORT in `.env`

### ❌ TypeScript Compilation Error

**Solution:**
```bash
npm run build
# Check dist/server.js is generated
```

### ❌ Port Already in Use

```
Error: listen EADDRINUSE :::3000
```

**Fix:**
```bash
# Find process using port 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows

# Or use different port
PORT=3001 npm run dev
```

---

## 🔄 Production Deployment

### Build for Production

```bash
npm run build
npm run start:prod
```

### Environment Setup

```bash
# Copy production env
cp .env.example .env.production

# Update critical values:
# - DATABASE_URL (RDS endpoint)
# - JWT_SECRET (strong random key)
# - Redis (cluster endpoint)
# - All external service keys
```

### Docker Push to Registry

```bash
# Build
docker build -t medicare-backend:1.0.0 .

# Tag for registry
docker tag medicare-backend:1.0.0 <registry>/medicare-backend:1.0.0

# Push
docker push <registry>/medicare-backend:1.0.0
```

---

## 📚 Next Steps

1. **Start backend server:** `npm run dev`
2. **Test API:** Open http://localhost:3000/health
3. **Explore database:** `npm run db:studio`
4. **Review API docs:** See `BACKEND_ARCHITECTURE.md`
5. **Build features:** Start implementing controllers & services

---

## 🆘 Need Help?

- **Backend Architecture Details:** See `BACKEND_ARCHITECTURE.md`
- **API Documentation:** Check endpoint specs in the architecture doc
- **Code Examples:** Look at `src/controllers/auth.controller.ts`
- **Logs:** Check `logs/` folder for detailed error traces

---

**Happy coding! 🎉**
