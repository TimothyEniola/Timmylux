import { Request, Response } from 'express';
import { sendCustomRequestEmail } from '../services/email.service';
import { uploadMultipleToCloudinary } from '../services/upload.service';
import prisma from '../config/database';

export const submitCustomRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, phone, message, requestDetails } = req.body;
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const customerName = String(name || '').trim();
    const description = String(message || '').trim();

    if (!customerName || !/^\S+@\S+\.\S+$/.test(normalizedEmail) || !phone || !description) {
      res.status(400).json({
        success: false,
        message: 'Name, valid email, phone, and request description are required.',
      });
      return;
    }

    let imageUrls: string[] = [];

    // Upload images if provided
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      imageUrls = await uploadMultipleToCloudinary(
        req.files as Express.Multer.File[],
        'timmylux/custom-requests'
      );
    }

    const additionalDetails = requestDetails ? JSON.parse(requestDetails) : {};
    const request = await prisma.customRequestSubmission.create({
      data: {
        name: customerName,
        email: normalizedEmail,
        phone: String(phone).trim(),
        roomType: additionalDetails.roomType || null,
        topic: additionalDetails.topic || null,
        address: additionalDetails.address || null,
        description,
        budget: additionalDetails.budget || null,
        imageUrls,
      },
    });

    const details = {
      requestId: request.id,
      phone: request.phone,
      roomType: request.roomType,
      topic: request.topic,
      address: request.address,
      description: request.description,
      budget: request.budget,
    };

    sendCustomRequestEmail(normalizedEmail, customerName, details, imageUrls)
      .catch((error) => console.error('Custom request admin email failed:', error));

    res.status(201).json({
      success: true,
      message: 'Request submitted successfully. We will contact you soon.',
      data: { id: request.id },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};