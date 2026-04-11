import prisma from '@/config/database';
import { logger } from '@/config/logger';

class UserRepository {
  async findByEmail(email: string) {
    try {
      return await prisma.user.findUnique({
        where: { email },
      });
    } catch (error) {
      logger.error('Error finding user by email:', error);
      throw error;
    }
  }

  async findById(id: string) {
    try {
      return await prisma.user.findUnique({
        where: { id },
      });
    } catch (error) {
      logger.error('Error finding user by id:', error);
      throw error;
    }
  }

  async create(data: {
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    passwordHash: string;
    role: string;
  }) {
    try {
      return await prisma.user.create({
        data,
      });
    } catch (error) {
      logger.error('Error creating user:', error);
      throw error;
    }
  }

  async update(
    id: string,
    data: {
      email?: string;
      firstName?: string;
      lastName?: string;
      phoneNumber?: string;
      passwordHash?: string;
      role?: string;
      status?: string;
      deletedAt?: Date | null;
    },
  ) {
    try {
      return await prisma.user.update({
        where: { id },
        data,
      });
    } catch (error) {
      logger.error('Error updating user:', error);
      throw error;
    }
  }

  async delete(id: string) {
    try {
      return await prisma.user.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
    } catch (error) {
      logger.error('Error deleting user:', error);
      throw error;
    }
  }
}

export default new UserRepository();
