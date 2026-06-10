import express from 'express';
import {
  getDashboardStats,
  getCategoryDistribution,
  getStatusDistribution,
  getMonthlyMovement,
  getWeightTrends,
  getDeadStock,
  getStockAging,
} from '../controllers/analyticsController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard', authenticate, getDashboardStats);
router.get('/category', authenticate, getCategoryDistribution);
router.get('/status', authenticate, getStatusDistribution);
router.get('/monthly', authenticate, getMonthlyMovement);
router.get('/weight', authenticate, getWeightTrends);
router.get('/dead-stock', authenticate, getDeadStock);
router.get('/stock-aging', authenticate, getStockAging);


export default router;
