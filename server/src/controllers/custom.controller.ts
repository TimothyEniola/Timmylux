import { Request, Response } from 'express';
import { sendCustomRequestEmail } from '../services/email.service';
import { uploadMultipleToCloudinary } from '../services/upload.service';

export const submitCustomRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, phone, message, requestDetails } = req.body;

    if (!name || !email || !message) {
      res.status(400).json({
        success: false,
        message: 'Name, email, and message are required',
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

    const details = {
      name,
      email,
      phone,
      message,
      ...(requestDetails && { additionalDetails: JSON.parse(requestDetails) }),
    };

    // Send email to admin
    await sendCustomRequestEmail(email, name, details, imageUrls);

    res.json({
      success: true,
      message: 'Custom request submitted successfully. We will contact you soon.',
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};