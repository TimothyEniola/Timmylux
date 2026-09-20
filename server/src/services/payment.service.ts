import paystackAPI from '../config/paystack';
import crypto from 'crypto';

export const initializePayment = async (
  email: string,
  amount: number, // in Naira
  reference: string
) => {
  const response = await paystackAPI.post('/transaction/initialize', {
    email,
    amount: amount * 100, // Convert to kobo
    reference,
    callback_url: `${process.env.CLIENT_URL}/payment/verify`,
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
  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
    .update(payload)
    .digest('hex');
  
  return hash === signature;
};