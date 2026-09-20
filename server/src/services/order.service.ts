import prisma from '../config/database';
import { PaymentStatus, OrderStatus } from '@prisma/client';

export const createOrder = async (
  userId: string,
  paymentMethod: string,
  paystackRef?: string
) => {
  // Get cart items
  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: {
      product: true,
      variation: true,
    },
  });

  if (cartItems.length === 0) {
    throw new Error('Cart is empty');
  }

  // Calculate total from DB (never trust frontend)
  let totalAmount = 0;
  const orderItems = cartItems.map(item => {
    const price = item.variation?.price || item.product.price;
    totalAmount += price * item.quantity;

    return {
      productId: item.productId,
      variationId: item.variationId,
      quantity: item.quantity,
      priceAtBuy: price,
    };
  });

  // Create order
  const order = await prisma.order.create({
    data: {
      userId,
      totalAmount,
      paymentMethod,
      paystackRef,
      items: {
        create: orderItems,
      },
    },
    include: {
      items: true,
      user: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
  });

  // Clear cart
  await prisma.cartItem.deleteMany({
    where: { userId },
  });

  return order;
};

export const getUserOrders = async (userId: string) => {
  return prisma.order.findMany({
    where: { userId },
    include: {
      items: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const getOrderById = async (id: string, userId?: string) => {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
        },
      },
    },
  });

  if (!order) {
    throw new Error('Order not found');
  }

  // If userId provided, verify ownership
  if (userId && order.userId !== userId) {
    throw new Error('Unauthorized');
  }

  return order;
};

export const updateOrderStatus = async (
  id: string,
  status: OrderStatus
) => {
  return prisma.order.update({
    where: { id },
    data: { status },
    include: {
      items: true,
      user: true,
    },
  });
};

export const updatePaymentStatus = async (
  paystackRef: string,
  paymentStatus: PaymentStatus
) => {
  return prisma.order.update({
    where: { paystackRef },
    data: { paymentStatus },
  });
};

export const getAllOrders = async (filters?: {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
}) => {
  return prisma.order.findMany({
    where: {
      ...(filters?.status && { status: filters.status }),
      ...(filters?.paymentStatus && { paymentStatus: filters.paymentStatus }),
    },
    include: {
      items: true,
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};