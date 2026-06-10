import express from 'express';
import {
  getAllTransactions,
  stockIn,
  stockOut,
  getDailyTransactions,
  getTransactionsByProductCode,
} from '../controllers/transactionController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, getAllTransactions);
router.get('/daily', authenticate, getDailyTransactions);
router.get('/product/:productCode', authenticate, getTransactionsByProductCode);
router.post('/stock-in', authenticate, stockIn);
router.post('/stock-out', authenticate, stockOut);

export default router;
