import bcrypt from 'bcryptjs';
import prisma from '../config/database';
import { generateToken, generateOTP, generateResetToken } from '../utils/jwt';
import { sendVerificationEmail, sendPasswordResetEmail } from './email.service';

export const registerUser = async (
  email: string,
  password: string,
  name: string,
  phone?: string
) => {
  // Check if user exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error('Email already registered');
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 12);

  // Generate OTP
  const otp = generateOTP();
  const resetToken = otp; // Store OTP in resetToken field temporarily
  const resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name,
      phone,
      resetToken,
      resetTokenExpiry,
    },
  });

  // Send verification email
  await sendVerificationEmail(email, otp);

  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
};

export const verifyEmail = async (email: string, otp: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error('User not found');
  }

  if (user.isVerified) {
    throw new Error('Email already verified');
  }

  if (user.resetToken !== otp) {
    throw new Error('Invalid OTP');
  }

  if (user.resetTokenExpiry && user.resetTokenExpiry < new Date()) {
    throw new Error('OTP expired');
  }

  // Update user
  await prisma.user.update({
    where: { id: user.id },
    data: {
      isVerified: true,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });

  return { message: 'Email verified successfully' };
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  if (!user.isVerified) {
    throw new Error('Please verify your email first');
  }

  const token = generateToken({
    userId: user.id,
    role: user.role,
  });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  };
};

export const requestPasswordReset = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    // Don't reveal if user exists
    return { message: 'If the email exists, a reset link has been sent' };
  }

  const resetToken = generateResetToken();
  const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.user.update({
    where: { id: user.id },
    data: { resetToken, resetTokenExpiry },
  });

  await sendPasswordResetEmail(email, resetToken);

  return { message: 'If the email exists, a reset link has been sent' };
};

export const resetPassword = async (token: string, newPassword: string) => {
  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: { gte: new Date() },
    },
  });

  if (!user) {
    throw new Error('Invalid or expired reset token');
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });

  return { message: 'Password reset successful' };
};