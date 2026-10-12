import paystackAPI from '../config/paystack';
import crypto from 'crypto';

export const initializePayment = async (
  email: string,
  amount: number, // in Naira
  reference: string,
  callbackUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/payment/verify`
) => {
  if (!process.env.PAYSTACK_SECRET_KEY) {
    throw new Error('Paystack is not configured. Set PAYSTACK_SECRET_KEY on the server.');
  }
  const response = await paystackAPI.post('/transaction/initialize', {
    email,
    amount: Math.round(amount * 100), // Convert Naira to kobo without float rounding drift
    reference,
    callback_url: callbackUrl,
  });

  return response.data.data;
};

export const verifyPayment = async (reference: string) => {
  const response = await paystackAPI.get(`/transaction/verify/${reference}`);
  return response.data.data;
};

export const verifyPaystackSignature = (
  payload: string,
  signature: string
): boolean => {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return false;
  const expected = crypto
    .createHmac('sha512', secret)
    .update(payload)
    .digest();
  const received = Buffer.from(signature, 'hex');
  return received.length === expected.length && crypto.timingSafeEqual(received, expected);
};