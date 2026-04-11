import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import app from '@/app';
import prisma from '@/config/database';
import * as passwordUtils from '@/utils/password';
import * as jwtUtils from '@/utils/jwt';

/**
 * AUTH SERVICE TESTS
 * Tests the complete authentication flow
 */

describe('Authentication System', () => {
  const testUser = {
    email: 'test@example.com',
    password: 'TestPassword123!',
    firstName: 'Test',
    lastName: 'User',
    dateOfBirth: '1990-01-01',
  };

  let accessToken: string;
  let refreshToken: string;

  // Setup: Clean database before tests
  beforeAll(async () => {
    // Optional: Clean up test data
  });

  // Teardown: Clean up test data
  afterAll(async () => {
    // Clean up test user if exists
    try {
      await prisma.user.deleteMany({
        where: { email: testUser.email },
      });
    } catch (error) {
      // Suppress error if table doesn't exist (DB not set up)
    }
    await prisma.$disconnect();
  });

  describe('POST /api/v1/auth/register', () => {
    it('should successfully register a new user', async () => {
      const response = await request(app).post('/api/v1/auth/register').send({
        email: testUser.email,
        password: testUser.password,
        firstName: testUser.firstName,
        lastName: testUser.lastName,
        dateOfBirth: testUser.dateOfBirth,
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('refreshToken');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user.email).toBe(testUser.email);

      // Store tokens for next tests
      accessToken = response.body.data.token;
      refreshToken = response.body.data.refreshToken;
    });

    it('should reject duplicate email', async () => {
      const response = await request(app).post('/api/v1/auth/register').send({
        email: testUser.email,
        password: testUser.password,
        firstName: testUser.firstName,
        lastName: testUser.lastName,
        dateOfBirth: testUser.dateOfBirth,
      });

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should reject invalid email format', async () => {
      const response = await request(app).post('/api/v1/auth/register').send({
        email: 'invalid-email',
        password: testUser.password,
        firstName: testUser.firstName,
        lastName: testUser.lastName,
        dateOfBirth: testUser.dateOfBirth,
      });

      expect(response.status).toBe(422);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should reject weak password', async () => {
      const response = await request(app).post('/api/v1/auth/register').send({
        email: 'newuser@example.com',
        password: '123',
        firstName: testUser.firstName,
        lastName: testUser.lastName,
        dateOfBirth: testUser.dateOfBirth,
      });

      expect(response.status).toBe(422);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should reject missing fields', async () => {
      const response = await request(app).post('/api/v1/auth/register').send({
        email: 'another@example.com',
        // Missing other fields
      });

      expect(response.status).toBe(422);
      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should successfully login with correct credentials', async () => {
      const response = await request(app).post('/api/v1/auth/login').send({
        email: testUser.email,
        password: testUser.password,
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('refreshToken');
      expect(response.body.data).toHaveProperty('user');

      // Update tokens
      accessToken = response.body.data.token;
      refreshToken = response.body.data.refreshToken;
    });

    it('should reject incorrect password', async () => {
      const response = await request(app).post('/api/v1/auth/login').send({
        email: testUser.email,
        password: 'WrongPassword123!',
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should reject non-existent user', async () => {
      const response = await request(app).post('/api/v1/auth/login').send({
        email: 'nonexistent@example.com',
        password: testUser.password,
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should reject invalid email format', async () => {
      const response = await request(app).post('/api/v1/auth/login').send({
        email: 'invalid',
        password: testUser.password,
      });

      expect(response.status).toBe(422);
      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('POST /api/v1/auth/refresh', () => {
    it('should successfully refresh access token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/refresh')
        .send({
          refreshToken,
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('refreshToken');

      // New tokens should be different (but same user)
      accessToken = response.body.data.token;
    });

    it('should reject invalid refresh token', async () => {
      const response = await request(app).post('/api/v1/auth/refresh').send({
        refreshToken: 'invalid.token.here',
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should reject missing refresh token', async () => {
      const response = await request(app).post('/api/v1/auth/refresh').send({});

      expect(response.status).toBe(422);
      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('Protected Routes', () => {
    it('should allow access with valid token', async () => {
      const response = await request(app)
        .get('/api/v1')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
    });

    it('should reject request without token', async () => {
      const response = await request(app).get('/api/v1');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should reject request with invalid token', async () => {
      const response = await request(app)
        .get('/api/v1')
        .set('Authorization', 'Bearer invalid.token.here');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should reject request with malformed header', async () => {
      const response = await request(app)
        .get('/api/v1')
        .set('Authorization', 'InvalidHeader token');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('POST /api/v1/auth/logout', () => {
    it('should successfully logout', async () => {
      const response = await request(app)
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({});

      // Should return 200 or 204
      expect([200, 204]).toContain(response.status);
      expect(response.body).toHaveProperty('success', true);
    });
  });
});

/**
 * UTILITY FUNCTION TESTS
 */
describe('JWT Utilities', () => {
  const testPayload = { id: 'user-123', email: 'test@example.com' };

  it('should generate and verify token', async () => {
    const token = jwtUtils.generateToken(testPayload, '24h');
    const decoded = jwtUtils.verifyToken(token);

    expect(decoded).toBeDefined();
    expect(decoded.id).toBe(testPayload.id);
    expect(decoded.email).toBe(testPayload.email);
  });

  it('should generate and verify refresh token', async () => {
    const token = jwtUtils.generateRefreshToken(testPayload, '7d');
    const decoded = jwtUtils.verifyRefreshToken(token);

    expect(decoded).toBeDefined();
    expect(decoded.id).toBe(testPayload.id);
  });

  it('should reject invalid token', () => {
    expect(() => {
      jwtUtils.verifyToken('invalid.token.here');
    }).toThrow();
  });

  it('should decode token without verification', () => {
    const token = jwtUtils.generateToken(testPayload, '24h');
    const decoded = jwtUtils.decodeToken(token);

    expect(decoded).toBeDefined();
    expect(decoded.id).toBe(testPayload.id);
  });
});

describe('Password Utilities', () => {
  const testPassword = 'MySecurePassword123!';

  it('should hash and compare password', async () => {
    const hashed = await passwordUtils.hashPassword(testPassword);

    expect(hashed).not.toBe(testPassword);
    expect(hashed.length).toBeGreaterThan(0);

    const isMatch = await passwordUtils.comparePassword(
      testPassword,
      hashed,
    );
    expect(isMatch).toBe(true);
  });

  it('should reject wrong password', async () => {
    const hashed = await passwordUtils.hashPassword(testPassword);
    const isMatch = await passwordUtils.comparePassword(
      'WrongPassword123!',
      hashed,
    );

    expect(isMatch).toBe(false);
  });

  it('should hash consistently (same input, different hash)', async () => {
    const hash1 = await passwordUtils.hashPassword(testPassword);
    const hash2 = await passwordUtils.hashPassword(testPassword);

    expect(hash1).not.toBe(hash2);

    // But both should match the original
    expect(await passwordUtils.comparePassword(testPassword, hash1)).toBe(true);
    expect(await passwordUtils.comparePassword(testPassword, hash2)).toBe(true);
  });
});
