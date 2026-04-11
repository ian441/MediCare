# 🏥 MediCare Clinic - Backend API

A robust, scalable Node.js + TypeScript backend for the MediCare Clinic multi-specialty healthcare platform.

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- Redis 7+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Update .env with your configuration

# Run database migrations
npm run db:migrate

# Seed initial data
npm run db:seed

# Start development server
npm run dev
```

Server will run on `http://localhost:3000`

---

## 📦 Project Structure

```
src/
├── config/           # Configuration files (database, redis, logger)
├── controllers/      # Request handlers
├── services/         # Business logic
├── repositories/     # Data access layer
├── routes/           # API routes
├── middleware/       # Express middleware
├── utils/            # Utility functions
├── types/            # TypeScript interfaces
├── jobs/             # Background jobs (Bull queues)
├── migrations/       # Database migrations
├── seeds/            # Database seeds
├── app.ts            # Express app setup
└── server.ts         # Entry point

tests/
├── unit/             # Unit tests
├── integration/      # Integration tests
└── e2e/              # End-to-end tests
```

---

## 🔧 Core Technologies

| Technology | Purpose |
|-----------|---------|
| **Express.js** | Web framework |
| **TypeScript** | Type safety |
| **PostgreSQL** | Database |
| **Prisma** | ORM & query builder |
| **Redis** | Caching & sessions |
| **Bull** | Job queue |
| **JWT** | Authentication |
| **Winston** | Logging |

---

## 📋 Available Scripts

```bash
# Development
npm run dev              # Start dev server with hot reload
npm run lint            # Run ESLint
npm run lint:fix        # Fix linting errors

# Build & Production
npm run build           # Compile TypeScript to JavaScript
npm run start           # Run compiled server
npm run start:prod      # Run in production mode

# Testing
npm run test            # Run all tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Generate coverage report

# Database
npm run db:migrate      # Run pending migrations
npm run db:migrate:deploy  # Deploy migrations in production
npm run db:seed         # Seed database with initial data
npm run db:reset        # Reset database (⚠️ destructive)
npm run db:studio       # Open Prisma Studio GUI

# Docker
npm run docker:build    # Build Docker image
npm run docker:run      # Run Docker container
```

---

## 🐳 Docker Setup

### Using Docker Compose (Recommended)

```bash
# Start all services (API, PostgreSQL, Redis)
docker-compose up

# Stop services
docker-compose down

# View logs
docker-compose logs -f backend
```

Services:
- **Backend API:** http://localhost:3000
- **PostgreSQL:** localhost:5432
- **Redis:** localhost:6379

### Manual Docker

```bash
# Build image
npm run docker:build

# Run container with environment
npm run docker:run
```

---

## 🔐 Environment Variables

See `.env.example` for all available variables. Key ones:

```env
# Server
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/medicare_db

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Authentication
JWT_SECRET=your_secret_key_min_32_chars
JWT_EXPIRY=24h

# External Services
SENDGRID_API_KEY=your_key
TWILIO_ACCOUNT_SID=your_sid
PESAPAL_API_KEY=your_key
```

---

## 🗄️ Database Schema

The database includes 24+ tables supporting:
- User management (patients, doctors, admin)
- Appointments & scheduling
- Telemedicine sessions
- Pharmacy & inventory
- Medical records
- Payment processing
- Customer support
- Blog & testimonials

### Migrations

Migrations are managed by Prisma. Update the schema in `prisma/schema.prisma`, then:

```bash
npm run db:migrate
```

---

## 🔐 API Authentication

All protected endpoints require JWT token in Authorization header:

```
Authorization: Bearer <token>
```

### Authentication Flow

1. **Register/Login** → `/auth/register` or `/auth/login`
2. **Get Token** → Response includes `token` and `refresh_token`
3. **Use Token** → Include in all subsequent requests
4. **Refresh Token** → `/auth/refresh` to get new token before expiry

---

## 📚 API Documentation

Interactive API documentation available at `/docs` (Swagger UI - to be implemented).

### Key Endpoints

**Authentication**
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh token

**Patients**
- `GET /api/v1/patients/me` - Get current patient profile
- `PUT /api/v1/patients/me` - Update profile
- `GET /api/v1/patients/:id/records` - Get medical records

**Doctors**
- `GET /api/v1/doctors` - List all doctors
- `GET /api/v1/doctors/:id` - Get doctor profile
- `GET /api/v1/doctors/:id/availability` - Get available slots

**Appointments**
- `POST /api/v1/appointments` - Create appointment
- `GET /api/v1/appointments` - List appointments
- `PUT /api/v1/appointments/:id` - Reschedule
- `DELETE /api/v1/appointments/:id` - Cancel

**Pharmacy**
- `GET /api/v1/medicines` - List medicines
- `POST /api/v1/pharmacy/cart` - Add to cart
- `POST /api/v1/pharmacy/orders` - Create order

For complete API spec, see `BACKEND_ARCHITECTURE.md`

---

## 🧪 Testing

```bash
# Run all tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

Test structure:
- `tests/unit/` - Service & utility tests
- `tests/integration/` - API & database tests
- `tests/e2e/` - Full workflow tests

---

## 🔄 Background Jobs

Background tasks managed by Bull queue:

- Appointment reminders (24h, 2h, 15m before)
- Payment reconciliation
- Email/SMS sending
- Report generation
- Inventory alerts

View queue status in `src/jobs/` or use Bull UI:

```bash
npm run jobs:ui
```

---

## 📊 Monitoring & Logging

### Logging

All activity logged via Winston to console and files:

```
logs/
├── error.log     # Errors only
└── combined.log  # All logs
```

Adjust log level via `LOG_LEVEL` env var.

### Monitoring (Future)

- Prometheus metrics endpoint: `/metrics`
- Health check: `GET /health`
- Performance monitoring via APM (to be configured)

---

## 🚀 Deployment

### Production Checklist

- [ ] Update all `.env` variables for production
- [ ] Generate secure JWT secrets
- [ ] Enable HTTPS (force redirect)
- [ ] Set up RDS for database (multi-AZ)
- [ ] Configure Redis cluster
- [ ] Enable database backups
- [ ] Set up monitoring & alerting
- [ ] Configure CDN & DDoS protection

### Deploy to AWS ECS

```bash
# Build image
npm run docker:build

# Push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account>.dkr.ecr.us-east-1.amazonaws.com
docker tag medicare-backend:latest <account>.dkr.ecr.us-east-1.amazonaws.com/medicare-backend:latest
docker push <account>.dkr.ecr.us-east-1.amazonaws.com/medicare-backend:latest
```

---

## 🐛 Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
- Ensure PostgreSQL is running
- Check DATABASE_URL in `.env`

### Redis Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:6379
```
- Ensure Redis is running
- Check REDIS_HOST and REDIS_PORT in `.env`

### JWT Token Invalid
- Token expired → Use refresh endpoint
- Token malformed → Regenerate
- Wrong secret → Check JWT_SECRET matches

---

## 📖 Additional Resources

- [Express.js Docs](https://expressjs.com/)
- [Prisma Docs](https://www.prisma.io/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Redis Commands](https://redis.io/commands/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

---

## 📄 License

MIT

---

## 👥 Support

For issues, questions, or contributions:
- 📧 Email: tech@medicare.ke
- 🐛 Issues: GitHub Issues
- 📝 Docs: See `BACKEND_ARCHITECTURE.md`

---

**Built with ❤️ for MediCare Clinic**
