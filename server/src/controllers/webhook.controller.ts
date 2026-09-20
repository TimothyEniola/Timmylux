import { Request, Response } from 'express';
import { verifyPaystackSignature } from '../services/payment.service';
import * as orderService from '../services/order.service';

export const paystackWebhook = async (req: Request, res: Response): Promise<void> => {
  try {
    const signature = req.headers['x-paystack-signature'] as string;

    if (!signature) {
      res.status(400).json({ success: false, message: 'No signature' });
      return;
    }

    const payload = JSON.stringify(req.body);
    const isValid = verifyPaystackSignature(payload, signature);

    if (!isValid) {
      res.status(400).json({ success: false, message: 'Invalid signature' });
      return;
    }

    const event = req.body;

    // Handle charge success
    if (event.event === 'charge.success') {
      const reference = event.data.reference;

      await orderService.updatePaymentStatus(reference, 'PAID');

      console.log(`✅ Payment confirmed for order: ${reference}`);
    }

    res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};