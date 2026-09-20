import cron from 'node-cron';
import prisma from '../config/database';

export const initializeScheduledJobs = () => {
  // Featured Products Expiry Check - Every hour
  cron.schedule('0 * * * *', async () => {
    try {
      console.log('🔄 Running featured products expiry check...');

      const result = await prisma.product.updateMany({
        where: {
          featured: true,
          featuredExpiry: {
            lt: new Date(),
          },
        },
        data: {
          featured: false,
        },
      });

      if (result.count > 0) {
        console.log(`✅ Expired ${result.count} featured products`);
      }
    } catch (error) {
      console.error('❌ Featured products expiry job failed:', error);
    }
  });

  // Coupon Expiry Check - Daily at midnight
  cron.schedule('0 0 * * *', async () => {
    try {
      console.log('🔄 Running coupon expiry check...');

      const result = await prisma.coupon.updateMany({
        where: {
          active: true,
          expiryDate: {
            lt: new Date(),
          },
        },
        data: {
          active: false,
        },
      });

      if (result.count > 0) {
        console.log(`✅ Expired ${result.count} coupons`);
      }
    } catch (error) {
      console.error('❌ Coupon expiry job failed:', error);
    }
  });

  // Event Expiry Check - Daily at midnight
  cron.schedule('0 0 * * *', async () => {
    try {
      console.log('🔄 Running event expiry check...');

      const result = await prisma.event.updateMany({
        where: {
          isActive: true,
          endDate: {
            lt: new Date(),
          },
        },
        data: {
          isActive: false,
        },
      });

      if (result.count > 0) {
        console.log(`✅ Deactivated ${result.count} expired events`);
      }
    } catch (error) {
      console.error('❌ Event expiry job failed:', error);
    }
  });

  // Cleanup old verification tokens - Daily at 2 AM
  cron.schedule('0 2 * * *', async () => {
    try {
      console.log('🔄 Running token cleanup...');

      const result = await prisma.user.updateMany({
        where: {
          resetTokenExpiry: {
            lt: new Date(),
          },
          resetToken: {
            not: null,
          },
        },
        data: {
          resetToken: null,
          resetTokenExpiry: null,
        },
      });

      if (result.count > 0) {
        console.log(`✅ Cleaned up ${result.count} expired tokens`);
      }
    } catch (error) {
      console.error('❌ Token cleanup job failed:', error);
    }
  });

  console.log('✅ All scheduled jobs initialized');
};