import transporter from '../config/nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: options.to,
    subject: options.subject,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};

export const sendVerificationEmail = async (email: string, otp: string): Promise<void> => {
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Welcome to TIMMYLUX!</h2>
      <p>Your verification code is:</p>
      <h1 style="color: #4CAF50; letter-spacing: 5px;">${otp}</h1>
      <p>This code will expire in 10 minutes.</p>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: 'Verify Your Email - TIMMYLUX',
    html,
  });
};

export const sendPasswordResetEmail = async (
  email: string,
  resetToken: string
): Promise<void> => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Password Reset Request</h2>
      <p>Click the button below to reset your password:</p>
      <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: 'Password Reset - TIMMYLUX',
    html,
  });
};

export const sendCustomRequestEmail = async (
  customerEmail: string,
  customerName: string,
  requestDetails: any,
  imageUrls: string[]
): Promise<void> => {
  const imagesHtml = imageUrls.map(url => 
    `<img src="${url}" style="max-width: 200px; margin: 10px;" />`
  ).join('');

  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>New Custom Request from ${customerName}</h2>
      <p><strong>Email:</strong> ${customerEmail}</p>
      <p><strong>Details:</strong></p>
      <pre>${JSON.stringify(requestDetails, null, 2)}</pre>
      ${imagesHtml ? `<h3>Attached Images:</h3>${imagesHtml}` : ''}
    </div>
  `;

  await sendEmail({
    to: process.env.ADMIN_EMAIL!,
    subject: `Custom Request from ${customerName}`,
    html,
  });
};

function escapeHtml(value: unknown): string {
  return String(value ?? "").replace(/[&<>\"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

export const sendOrderConfirmation = async (
  email: string,
  orderDetails: any
): Promise<void> => {
  const madeToOrderItems = (orderDetails.items || []).filter((item: any) => item.isMadeToOrder);
  const buildNotice = madeToOrderItems.length
    ? `<h3>Made-to-order items</h3><ul>${madeToOrderItems.map((item: any) => `<li>${escapeHtml(item.productName)} (quantity: ${item.quantity})</li>`).join("")}</ul><p>These items are currently made to order. Our team will contact you using your order details to confirm the estimated build timeline and next steps before production begins. Payment is not collected until we have confirmed the schedule with you.</p>`
    : "";
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #1f2937;">
      <h2>Order Confirmation</h2>
      <p>Thank you for your order!</p>
      <p><strong>Order ID:</strong> ${escapeHtml(orderDetails.id)}</p>
      <p><strong>Total:</strong> ₦${Number(orderDetails.totalAmount).toLocaleString()}</p>
      ${buildNotice}
      <p>We'll send you another email when your order ships.</p>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: "Order Confirmation - TIMMYLUX",
    html,
  });
};

export const sendMadeToOrderNotification = async (
  customer: { email: string; name: string; phone?: string | null },
  orderDetails: any
): Promise<void> => {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) return;

  const madeToOrderItems = (orderDetails.items || []).filter((item: any) => item.isMadeToOrder);
  if (!madeToOrderItems.length) return;

  const itemsHtml = madeToOrderItems
    .map((item: any) => `<li>${escapeHtml(item.productName)} — quantity ${item.quantity}</li>`)
    .join("");
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #1f2937;">
      <h2>Made-to-order build timeline required</h2>
      <p>Contact this customer to agree on an estimated production schedule before collecting payment or beginning work.</p>
      <p><strong>Order:</strong> ${escapeHtml(orderDetails.id)}</p>
      <p><strong>Customer:</strong> ${escapeHtml(customer.name)} (${escapeHtml(customer.email)})</p>
      <p><strong>Phone:</strong> ${escapeHtml(customer.phone || "Not provided")}</p>
      <h3>Items</h3>
      <ul>${itemsHtml}</ul>
    </div>
  `;

  await sendEmail({
    to: adminEmail,
    subject: `Build timeline needed — order ${escapeHtml(orderDetails.id)}`,
    html,
  });
};