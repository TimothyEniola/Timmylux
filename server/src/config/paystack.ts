import axios from 'axios';

const paystackAPI = axios.create({
  baseURL: 'https://api.paystack.co',
  headers: {
    'Content-Type': 'application/json',
  },
});

paystackAPI.interceptors.request.use((config) => {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    throw new Error('Paystack is not configured. Set PAYSTACK_SECRET_KEY on the server.');
  }
  config.headers.Authorization = `Bearer ${secret}`;
  return config;
});

export default paystackAPI;
