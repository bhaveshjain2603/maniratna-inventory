import express from 'express';
import {
  getAllProducts,
  getProductById,
  getProductByCode,
  getProductByBarcode,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, getAllProducts);
router.get('/search', authenticate, getProductByBarcode);
router.get('/:id', authenticate, getProductById);
router.get('/code/:code', authenticate, getProductByCode);
router.post('/', authenticate, createProduct);
router.put('/:id', authenticate, updateProduct);
router.delete('/:id', authenticate, deleteProduct);

export default router;
