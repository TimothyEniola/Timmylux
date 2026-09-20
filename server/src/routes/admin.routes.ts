import { Router } from 'express';
import * as adminController from '../controllers/admin.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/rbac.middleware';

const router = Router();

// All admin routes require authentication and admin/superadmin role
router.use(authenticate);
router.use(requireRole(['ADMIN', 'SUPERADMIN']));

// Orders
router.get('/orders', adminController.getAllOrders);
router.put('/orders/:id/status', adminController.updateOrderStatus);

// Analytics
router.get('/analytics', adminController.getAnalytics);

// Users
router.get('/users', adminController.getAllUsers);
router.put('/users/:id/role', requireRole(['SUPERADMIN']), adminController.updateUserRole);

// Coupons
router.post('/coupons', adminController.createCoupon);
router.get('/coupons', adminController.getCoupons);
router.get('/coupons/verify/:code', adminController.verifyCoupon);
router.patch('/coupons/:id/toggle', adminController.toggleCoupon);

// Events
router.post('/events', adminController.createEvent);
router.get('/events', adminController.getEvents);
router.put('/events/:id', adminController.updateEvent);
router.delete('/events/:id', adminController.deleteEvent);

// Academy Applications
router.get('/academy/applications', adminController.getAcademyApplications);
router.put('/academy/applications/:id/status', adminController.updateApplicationStatus);

export default router;