import { Request, Response } from 'express';
import * as orderService from '../services/order.service';
import * as paymentService from '../services/payment.service';
import { sendOrderConfirmation } from '../services/email.service';
import prisma from '../config/database';

export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { paymentMethod } = req.body;

    if (!paymentMethod || !['PAYSTACK', 'BANK_TRANSFER'].includes(paymentMethod)) {
      res.status(400).json({
        success: false,
        message: 'Valid payment method is required',
      });
      return;
    }

    // Generate unique reference
    const reference = `TML-${Date.now()}-${userId.substring(0, 8)}`;

    // Create order
    const order = await orderService.createOrder(userId, paymentMethod, reference);

    // If Paystack, initialize payment
    if (paymentMethod === 'PAYSTACK') {
      const paymentData = await paymentService.initializePayment(
        order.user.email,
        order.totalAmount,
        reference
      );

      res.json({
        success: true,
        message: 'Order created successfully',
        data: {
          order,
          paymentUrl: paymentData.authorization_url,
          reference: paymentData.reference,
        },
      });
    } else {
      // Bank transfer
      res.json({
        success: true,
        message: 'Order created successfully. Please proceed with bank transfer.',
        data: { order },
      });
    }

    // Send confirmation email (async)
    sendOrderConfirmation(order.user.email, order).catch(console.error);
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const orders = await orderService.getUserOrders(userId);

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

export const getOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    const order = await orderService.getOrderById(id, userId);

    res.json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { reference } = req.params;

    const paymentData = await paymentService.verifyPayment(reference);

    if (paymentData.status === 'success') {
      await orderService.updatePaymentStatus(reference, 'PAID');
    }

    res.json({
      success: true,
      data: paymentData,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};