import { Router } from 'express';
import * as customController from '../controllers/custom.controller';
import * as academyController from '../controllers/academy.controller';
import * as adminController from '../controllers/admin.controller';
import { upload } from '../middlewares/upload.middleware';

const router = Router();

// Custom requests
router.post(
  '/custom-request',
  upload.array('images', 5),
  customController.submitCustomRequest
);

// Academy application
router.post('/academy/apply', academyController.submitApplication);

// Public events
router.get('/events', adminController.getEvents);

// Public coupon verification
router.get('/coupons/verify/:code', adminController.verifyCoupon);

export default router;