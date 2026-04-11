# 🆘 Troubleshooting & FAQ

## Common Issues & Solutions

### 🔴 Server Won't Start

#### "Cannot find module @/..."
```
Error: Cannot find module '@/config/database'
```
**Solution:**
```bash
# Clear build cache
rm -rf dist node_modules
npm install

# Verify tsconfig.json has paths:
# "paths": { "@/*": ["./src/*"] }

# For development:
npm run dev  # Uses vite, handles paths automatically
```

---

#### "Port 3000 already in use"
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solution (Choose one):**
```bash
# Option 1: Use different port
PORT=3001 npm run dev

# Option 2: Kill process on port 3000 (macOS/Linux)
lsof -ti:3000 | xargs kill -9

# Option 3: Kill process (Windows PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force
```

---

#### "NODE_ENV not set"
```
Error: NODE_ENV should be 'development' or 'production'
```
**Solution:**
```bash
# Add to .env
NODE_ENV=development

# Or set before running:
NODE_ENV=development npm run dev
```

---

### 🔴 Database Issues

#### "Cannot connect to PostgreSQL"
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Troubleshooting:**

1. **Check database is running:**
   ```bash
   # Docker method:
   docker-compose up -d postgres
   docker ps  # Verify container is running
   
   # Manual method (macOS):
   brew services start postgresql
   
   # Manual method (Windows):
   # Start PostgreSQL Service from Services app
   ```

2. **Verify connection string:**
   ```bash
   # Check .env
   cat .env | grep DATABASE_URL
   
   # Should be: postgresql://user:password@host:port/dbname
   # Default: postgresql://postgres:postgres@localhost:5432/medicare_db
   ```

3. **Test connection directly:**
   ```bash
   # After installing psql:
   psql postgresql://postgres:postgres@localhost:5432/medicare_db
   
   # If it connects, type: \dt
   # Should show empty (no tables yet)
   ```

4. **Create database if missing:**
   ```bash
   # Connect to default postgres database
   psql postgresql://postgres:postgres@localhost:5432/postgres
   
   # Create database
   CREATE DATABASE medicare_db;
   
   # Exit with \q
   ```

---

#### "Prisma migration failed"
```
Error: migration.lock_hash error
```
**Solution:**
```bash
# Reset database (⚠️ DELETES ALL DATA)
npm run db:reset

# Or manually:
npm run db:push --skip-generate

# Then seed:
npm run db:seed
```

---

#### "Table already exists"
```
Error: relation "users" already exists
```
**Solution:**
```bash
# Option 1: Push updates
npm run db:push

# Option 2: Full reset (dangerous - deletes data)
npm run db:reset

# Option 3: Create new database
createdb medicare_db_fresh
# Update DATABASE_URL in .env
npm run db:push
```

---

### 🔴 Redis Issues

#### "Redis connection refused"
```
Error: connect ECONNREFUSED 127.0.0.1:6379
```
**Solution:**

1. **Start Redis:**
   ```bash
   # Docker method:
   docker-compose up -d redis
   
   # macOS method:
   brew services start redis
   
   # Linux method:
   sudo systemctl start redis-server
   ```

2. **Verify connection:**
   ```bash
   redis-cli ping
   # Should return: PONG
   ```

3. **Check .env:**
   ```bash
   REDIS_HOST=localhost
   REDIS_PORT=6379
   ```

4. **For production (optional, not critical):**
   - Redis connection errors are logged but won't crash the app
   - Other features continue working
   - Caching will be disabled

---

#### "Too many open files" (Redis)
```
Error: Too many open files
```
**Solution:**
```bash
# Check file descriptor limit
ulimit -n

# Increase limit (macOS/Linux)
ulimit -n 4096

# For permanent change, edit /etc/security/limits.conf
```

---

### 🟡 Environment Variables

#### "JWT_SECRET not found"
```
Error: JWT_SECRET is required
```
**Solution:**
```bash
# Copy example
cp .env.example .env

# Add JWT_SECRET (any 32+ character string)
JWT_SECRET="my-super-secret-key-with-min-32-characters"

# Also add JWT_REFRESH_SECRET
JWT_REFRESH_SECRET="my-refresh-secret-also-32-chars"
```

---

#### "CORS origin not allowed"
```
Error: Access to XMLHttpRequest blocked by CORS policy
```
**Solution:**
```bash
# Check .env
CORS_ORIGIN=http://localhost:5173

# For multiple origins:
CORS_ORIGIN=http://localhost:5173,http://localhost:3000

# For development (not production):
CORS_ORIGIN=*
```

---

#### "Some env vars are missing"
**Required minimum vars:**
```bash
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
REDIS_HOST=localhost
REDIS_PORT=6379
CORS_ORIGIN=http://localhost:5173
```

**Get all available vars:**
```bash
cat .env.example | grep "=" | cut -d= -f1 | sort
```

---

### 🟡 Authentication Issues

#### "Invalid token / JWT malformed"
```
Error: jwt malformed
```
**Causes & Solutions:**
```bash
# 1. Token is missing "Bearer " prefix
# Wrong: Authorization: eyJhbGci...
# Right: Authorization: Bearer eyJhbGci...

# 2. Token is expired
# Check token expiry:
echo "eyJhbGci..." | jq .exp

# 3. JWT_SECRET changed
# Tokens signed with old secret won't work with new secret
# Solution: Re-login to get new token with new secret

# 4. Token is corrupted
# Copy full token from login response and try again
```

---

#### "401 Unauthorized"
```
Response: 401 Unauthorized
```
**Troubleshooting:**
```bash
# 1. Check token is in Authorization header
curl -H "Authorization: Bearer TOKEN" http://localhost:3000/api/v1

# 2. Verify token isn't expired
# Check server logs for token expiry info

# 3. Get new token with refresh
curl -X POST http://localhost:3000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken": "REFRESH_TOKEN"}'

# 4. Re-login if all else fails
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password"}'
```

---

#### "409 Conflict - Email already exists"
```
Error: User with this email already exists
```
**Solution:**
```bash
# Database might have duplicate email from previous test
# Option 1: Delete user manually
# Connect to database and delete user

# Option 2: Use different email
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newemail@example.com",
    ...
  }'

# Option 3: Reset database
npm run db:reset
```

---

### 🟡 Type & Compilation Issues

#### "Type error in TypeScript"
```
Error: Property 'user' does not exist on type 'Request'
```
**Solution:**
```bash
# Run type check
npm run typecheck

# Fix reported errors in source files

# For middleware issues:
# Make sure tsconfig.json has:
{
  "compilerOptions": {
    "noUnusedParameters": false
  }
}
```

---

#### "Cannot find name 'AppError'"
```
Error: Cannot find name 'AppError'
```
**Solution:**
```bash
# Verify AppError is exported from error utils
grep -r "export.*AppError" src/

# If not found, check imports
# Should be: import { AppError } from '@/utils/errors'

# Or create if missing
# See src/utils/errors.ts
```

---

### 🟡 Testing Issues

#### "Tests won't run / vitest not found"
```
Error: Cannot find module 'vitest'
```
**Solution:**
```bash
# Install dev dependencies
npm install

# Run tests
npm test

# Watch mode
npm test -- --watch

# Specific test file
npm test -- auth.test.ts
```

---

#### "Database not found during tests"
```
Error: Database not found (during tests)
```
**Solution:**
Tests create their own test database:
```bash
# Set TEST_DATABASE_URL in .env
TEST_DATABASE_URL="postgresql://postgres:postgres@localhost:5432/medicare_test"

# Or tests skip DB connections and use mocks
# (Current setup uses optional database)
```

---

#### "Test timeouts"
```
Error: Test timeout exceeded
```
**Solution:**
```bash
# Increase timeout for slow database operations
// In test file:
afterAll(async () => {
  // Add timeout
}, 10000)  // 10 second timeout

// Or run with global timeout:
npm test -- --testTimeout=10000
```

---

### 🟡 Docker Issues

#### "Docker image won't build"
```
Error: failed to resolve base image 'node'
```
**Solution:**
```bash
# Update Docker
docker pull node:20-alpine

# Then build
npm run docker:build

# Or manually:
docker build -t medicare-api .
```

---

#### "Container exits immediately"
```
Error: Container exited with code 1
```
**Check logs:**
```bash
# See what went wrong
docker logs <container-id>

# Run with interactive terminal
docker run -it medicare-api

# Check Dockerfile
cat Dockerfile  # See execution order
```

---

## Useful Debugging Commands

### Check Server Status
```bash
# Is server running?
curl http://localhost:3000/api/v1

# Response indicates server is up

# Get response time
time curl -s http://localhost:3000/api/v1 > /dev/null
```

### Database Debugging
```bash
# Connect to database
psql postgresql://postgres:postgres@localhost:5432/medicare_db

# List tables
\dt

# Show schema
\d users

# Run query
SELECT * FROM users LIMIT 5;

# Exit
\q
```

### Redis Debugging
```bash
# Test connection
redis-cli ping
# Should return: PONG

# View keys
redis-cli KEYS '*'

# Get value
redis-cli GET key_name

# Clear all
redis-cli FLUSHALL
```

### View Logs
```bash
# Check application logs
tail -f logs/combined.log      # All logs
tail -f logs/error.log         # Errors only

# Real-time logs with grep
tail -f logs/combined.log | grep "ERROR"
```

### Network Debugging
```bash
# See what ports are listening
netstat -tuln | grep LISTEN    # macOS/Linux
Get-NetTCPConnection -State Listen | Format-Table LocalPort  # Windows

# Check specific port
lsof -i :3000                  # What's on port 3000?
```

---

## FAQ

### Q: Can I use MySQL instead of PostgreSQL?
**A:** The Prisma schema uses PostgreSQL syntax. You would need to:
1. Update `provider = "postgresql"` to `provider = "mysql"` in prisma/schema.prisma
2. Adjust some data types (e.g., `Uuid` → `String`)
3. Retest and migrate

Not recommended for production conversion.

---

### Q: Should I use the frontend and backend together?
**A:** Yes:
1. Start backend: `npm run dev` (port 3000)
2. In new terminal, start frontend: `cd frontend && npm run dev` (port 5173)
3. Frontend connects to http://localhost:3000/api/v1
4. Ensure CORS_ORIGIN includes frontend URL

---

### Q: How do I add new endpoints?
**A:** Follow the pattern:
1. Create `UserController` in `src/controllers/user.controller.ts`
2. Create `UserService` in `src/services/user.service.ts`
3. Create `UserRepository` in `src/repositories/user.repository.ts`
4. Create `UserRoutes` in `src/routes/user.routes.ts`
5. Mount in `src/app.ts`: `app.use('/api/v1/users', userRoutes)`

---

### Q: How do I debug middleware?
**A:** Add console logs in middleware:
```typescript
export const authenticate = async (req, res, next) => {
  console.log('🔐 Auth check:', req.headers.authorization?.substring(0, 20));
  // ...
  next();
};
```

Enable debug mode:
```bash
DEBUG=* npm run dev
```

---

### Q: How do I test with Postman?
**A:** 
1. Create collection "MediCare API"
2. Add request: POST `/api/v1/auth/register`
3. Set Body to JSON with test data
4. After login, copy token to Authorization header
5. Use `{{token}}` environment variable for other requests

---

### Q: How do I deploy to production?
**A:**
1. Build: `npm run build`
2. Create Docker image: `docker build -t medicare-api .`
3. Push to registry: `docker push your-registry/medicare-api`
4. Deploy to hosting (Render, Railway, AWS, etc.)
5. Set production env vars
6. Run migrations: `npm run db:migrate`

---

### Q: How do I migrate data from existing system?
**A:** Use Prisma migrations:
```bash
# Create migration
npx prisma migrate dev --name add_new_table

# Apply migration
npm run db:migrate

# Create data migration script
# Use prisma client to transform data
```

---

## Performance Optimization Tips

1. **Database Queries**
   - Use `.select()` to limit fields
   - Use `.skip().take()` for pagination
   - Add indexes to frequently queried columns

2. **Caching**
   - Store JWT verification results in Redis
   - Cache frequently accessed data (doctors, services)
   - Set TTL on cache keys

3. **Rate Limiting**
   - Increase for authenticated users
   - Decrease for suspicious activity

4. **Compression**
   - Already enabled with Helmet
   - Reduces response payload by 70%+

5. **Connection Pooling**
   - Prisma default: 5-20 connections
   - Adjust based on load testing

---

## Getting Help

If issues persist:

1. **Check logs:** `logs/error.log` or console output
2. **Review docs:** See TESTING.md, BACKEND_ARCHITECTURE.md
3. **Enable debug:** `DEBUG=* npm run dev`
4. **Search:** Most issues have StackOverflow solutions
5. **GitHub:** Check issue tracker for Express, Prisma, TypeScript

---

**Keep these solutions handy!** Most issues are one of these common problems. 🎯
