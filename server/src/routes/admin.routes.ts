import { Router } from 'express';
import * as adminController from '../controllers/admin.controller';
import * as eventController from '../controllers/event.controller';
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
router.post('/events', eventController.createEvent);
router.get('/events', eventController.getAdminEvents);
router.put('/events/:id', eventController.updateEvent);
router.delete('/events/:id', eventController.deleteEvent);
router.get('/events/:id/tickets', eventController.getEventTickets);
router.post('/events/:id/tickets/branch', eventController.recordBranchTicket);

// Academy Applications
router.get('/academy/applications', adminController.getAcademyApplications);
router.put('/academy/applications/:id/status', adminController.updateApplicationStatus);

export default router;