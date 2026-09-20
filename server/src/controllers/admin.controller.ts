import { Request, Response } from 'express';
import * as orderService from '../services/order.service';
import prisma from '../config/database';
import { OrderStatus } from '@prisma/client';

export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, paymentStatus } = req.query;

    const orders = await orderService.getAllOrders({
      status: status as OrderStatus,
      paymentStatus: paymentStatus as any,
    });

    res.json({
      success: true,
      data: orders,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      res.status(400).json({
        success: false,
        message: 'Status is required',
      });
      return;
    }

    const order = await orderService.updateOrderStatus(id, status);

    res.json({
      success: true,
      message: 'Order status updated',
      data: order,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    // Total sales
    const totalSales = await prisma.order.aggregate({
      where: { paymentStatus: 'PAID' },
      _sum: { totalAmount: true },
      _count: true,
    });

    // Orders by status
    const ordersByStatus = await prisma.order.groupBy({
      by: ['status'],
      _count: true,
    });

    // Revenue by month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const revenueByMonth = await prisma.order.groupBy({
      by: ['createdAt'],
      where: {
        paymentStatus: 'PAID',
        createdAt: { gte: sixMonthsAgo },
      },
      _sum: { totalAmount: true },
    });

    // Top selling products
    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      _count: true,
      orderBy: {
        _sum: { quantity: 'desc' },
      },
      take: 10,
    });

    // Get product details for top products
    const productIds = topProducts.map(p => p.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true, category: true, price: true },
    });

    const topProductsWithDetails = topProducts.map(tp => {
      const product = products.find(p => p.id === tp.productId);
      return {
        ...product,
        totalSold: tp._sum.quantity,
        orderCount: tp._count,
      };
    });

    // Category breakdown
    const categoryBreakdown = await prisma.product.groupBy({
      by: ['category'],
      _count: true,
    });

    // Recent orders
    const recentOrders = await prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, email: true },
        },
        items: true,
      },
    });

    // User statistics
    const userStats = await prisma.user.groupBy({
      by: ['role'],
      _count: true,
    });

    const totalUsers = await prisma.user.count();
    const verifiedUsers = await prisma.user.count({
      where: { isVerified: true },
    });

    res.json({
      success: true,
      data: {
        sales: {
          total: totalSales._sum.totalAmount || 0,
          orderCount: totalSales._count,
        },
        ordersByStatus,
        revenueByMonth,
        topProducts: topProductsWithDetails,
        categoryBreakdown,
        recentOrders,
        users: {
          total: totalUsers,
          verified: verifiedUsers,
          byRole: userStats,
        },
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        isVerified: true,
        createdAt: true,
        _count: {
          select: {
            orders: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: users,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateUserRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['CUSTOMER', 'ADMIN', 'SUPERADMIN'].includes(role)) {
      res.status(400).json({
        success: false,
        message: 'Invalid role',
      });
      return;
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    res.json({
      success: true,
      message: 'User role updated',
      data: user,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Coupon Management
export const createCoupon = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, discount, type, expiryDate } = req.body;

    if (!code || !discount || !type || !expiryDate) {
      res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
      return;
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        discount: parseFloat(discount),
        type,
        expiryDate: new Date(expiryDate),
      },
    });

    res.status(201).json({
      success: true,
      message: 'Coupon created successfully',
      data: coupon,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCoupons = async (req: Request, res: Response): Promise<void> => {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { expiryDate: 'desc' },
    });

    res.json({
      success: true,
      data: coupons,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyCoupon = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code } = req.params;

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      res.status(404).json({
        success: false,
        message: 'Coupon not found',
      });
      return;
    }

    if (!coupon.active) {
      res.status(400).json({
        success: false,
        message: 'Coupon is inactive',
      });
      return;
    }

    if (coupon.expiryDate < new Date()) {
      res.status(400).json({
        success: false,
        message: 'Coupon has expired',
      });
      return;
    }

    res.json({
      success: true,
      data: coupon,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const toggleCoupon = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const coupon = await prisma.coupon.findUnique({ where: { id } });

    if (!coupon) {
      res.status(404).json({
        success: false,
        message: 'Coupon not found',
      });
      return;
    }

    const updated = await prisma.coupon.update({
      where: { id },
      data: { active: !coupon.active },
    });

    res.json({
      success: true,
      message: 'Coupon status updated',
      data: updated,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Event Management
export const createEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const eventData = {
      ...req.body,
      startDate: req.body.startDate ? new Date(req.body.startDate) : null,
      endDate: req.body.endDate ? new Date(req.body.endDate) : null,
      discountPercentage: req.body.discountPercentage 
        ? parseFloat(req.body.discountPercentage) 
        : null,
      maxAttendees: req.body.maxAttendees 
        ? parseInt(req.body.maxAttendees) 
        : null,
    };

    const event = await prisma.event.create({ data: eventData });

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const { isActive } = req.query;

    const events = await prisma.event.findMany({
      where: isActive !== undefined ? { isActive: isActive === 'true' } : undefined,
      orderBy: { startDate: 'desc' },
    });

    res.json({
      success: true,
      data: events,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const event = await prisma.event.update({
      where: { id },
      data: req.body,
    });

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: event,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.event.delete({ where: { id } });

    res.json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Academy Applications
export const getAcademyApplications = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { status } = req.query;

    const applications = await prisma.academyApplication.findMany({
      where: status ? { status: status as string } : undefined,
      orderBy: { submittedAt: 'desc' },
    });

    res.json({
      success: true,
      data: applications,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateApplicationStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
      return;
    }

    const application = await prisma.academyApplication.update({
      where: { id },
      data: { status },
    });

    res.json({
      success: true,
      message: 'Application status updated',
      data: application,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};