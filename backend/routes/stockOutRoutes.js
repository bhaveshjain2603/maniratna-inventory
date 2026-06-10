import express from 'express';
import { stockOutProduct } from '../controllers/stockOutController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.put('/:id', authenticate, stockOutProduct);

export default router;