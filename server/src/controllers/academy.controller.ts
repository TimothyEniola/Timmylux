import { Request, Response } from 'express';
import prisma from '../config/database';
import { sendEmail } from '../services/email.service';

export const submitApplication = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { fullName, email, phone, experience, motivation, availability } = req.body;

    if (!fullName || !email || !phone || !motivation || !availability) {
      res.status(400).json({
        success: false,
        message: 'All required fields must be provided',
      });
      return;
    }

    const application = await prisma.academyApplication.create({
      data: {
        fullName,
        email,
        phone,
        experience,
        motivation,
        availability,
      },
    });

    // Send confirmation email to applicant
    const confirmationHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Application Received</h2>
        <p>Dear ${fullName},</p>
        <p>Thank you for applying to TIMMYLUX Academy. We have received your application and will review it shortly.</p>
        <p>We will contact you at ${email} or ${phone} with our decision.</p>
        <br/>
        <p>Best regards,<br/>TIMMYLUX Academy Team</p>
      </div>
    `;

    await sendEmail({
      to: email,
      subject: 'Academy Application Received - TIMMYLUX',
      html: confirmationHtml,
    });

    // Notify admin
    const adminHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>New Academy Application</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Experience:</strong> ${experience || 'N/A'}</p>
        <p><strong>Motivation:</strong> ${motivation}</p>
        <p><strong>Availability:</strong> ${availability}</p>
      </div>
    `;

    await sendEmail({
      to: process.env.ADMIN_EMAIL!,
      subject: `New Academy Application from ${fullName}`,
      html: adminHtml,
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: application,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};