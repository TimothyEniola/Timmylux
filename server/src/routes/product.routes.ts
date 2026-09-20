import { Router } from 'express';
import * as productController from '../controllers/product.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/rbac.middleware';
import { upload } from '../middlewares/upload.middleware';

const router = Router();

// Public routes
router.get('/', productController.getProducts);
router.get('/:id', productController.getProduct);

// Admin routes
router.post(
  '/',
  authenticate,
  requireRole(['ADMIN', 'SUPERADMIN']),
  upload.array('images', 10),
  productController.createProduct
);

router.put(
  '/:id',
  authenticate,
  requireRole(['ADMIN', 'SUPERADMIN']),
  productController.updateProduct
);

router.delete(
  '/:id',
  authenticate,
  requireRole(['ADMIN', 'SUPERADMIN']),
  productController.deleteProduct
);

export default router;