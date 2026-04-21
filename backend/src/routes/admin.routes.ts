import { Router, Request, Response } from 'express';
import { authenticate, authorize } from '@/middleware/auth';
import prisma from '@/config/database';
import { AppError } from '@/middleware/errorHandler';

const router = Router();

// Middleware to check admin access
const requireAdmin = [authenticate, authorize(['ADMIN'])];

// Verify admin token
router.get('/verify', requireAdmin, async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      isAuthenticated: true,
      role: req.user?.role,
      email: req.user?.email,
    },
  });
});

// Get dashboard stats
router.get('/stats', requireAdmin, async (req, res) => {
  try {
    const [
      totalPatients,
      totalDoctors,
      totalAppointments,
      upcomingAppointments,
      totalRevenue,
      pendingOrders,
    ] = await Promise.all([
      prisma.patient.count(),
      prisma.doctor.count(),
      prisma.appointment.count(),
      prisma.appointment.count({ where: { status: 'SCHEDULED' } }),
      prisma.payment.aggregate({
        where: { status: 'PAID' },
        _sum: { amount: true },
      }),
      prisma.pharmacyOrder.count({ where: { orderStatus: 'PENDING' } }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        patients: totalPatients,
        doctors: totalDoctors,
        appointments: {
          total: totalAppointments,
          upcoming: upcomingAppointments,
        },
        revenue: totalRevenue._sum.amount || 0,
        pendingOrders,
      },
    });
  } catch (error) {
    throw new AppError('Failed to fetch dashboard stats', 500);
  }
});

export default router;