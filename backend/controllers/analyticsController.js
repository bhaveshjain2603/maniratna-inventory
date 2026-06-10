import Product from '../models/Product.js';
import Transaction from '../models/Transaction.js';

export const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Product counts
    const totalProducts = await Product.countDocuments();
    const inStockProducts = await Product.countDocuments({ status: 'In Stock' });
    const soldProducts = await Product.countDocuments({ status: 'Sold' });
    const returnedProducts = await Product.countDocuments({ status: 'Returned' });

    // Weight totals
    const products = await Product.find({ status: 'In Stock' });
    const inStockProductsData = await Product.find({ status: 'In Stock' });
    const weightStats = products.reduce(
      (acc, p) => ({
        gross: acc.gross + (p.weight?.gross || 0),
        net: acc.net + (p.weight?.net || 0),
        stone: acc.stone + (p.weight?.stone || 0),
        tag: acc.tag + (p.weight?.tag || 0),
      }),
      { gross: 0, net: 0, stone: 0, tag: 0 }
    );

    // Today's activities
    const todayTransactions = await Transaction.find({
      createdAt: { $gte: today, $lt: tomorrow },
    });

    const todayStockIn = todayTransactions.filter(
      t => t.actionType === 'In Stock'
    ).length;

    const todayStockOut = todayTransactions.filter(
      t => ['Stock Out', 'Sold'].includes(t.actionType)
    ).length;

    res.json({
      inventory: {
        totalProducts,
        inStockProducts,
        soldProducts,
        returnedProducts,
      },
      weights: weightStats,
      today: {
        stockIn: todayStockIn,
        stockOut: todayStockOut,
        transactions: todayTransactions.length,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getCategoryDistribution = async (req, res) => {
  try {
    const distribution = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalGrossWeight: { $sum: '$weight.gross' },
          totalNetWeight: { $sum: '$weight.net' },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.json({ distribution });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getStatusDistribution = async (req, res) => {
  try {
    const distribution = await Product.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalWeight: { $sum: '$weight.gross' },
        },
      },
    ]);

    res.json({ distribution });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getMonthlyMovement = async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const movement = await Transaction.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
          actionType: { $in: ['Stock In', 'Stock Out', 'Sold'] },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            action: '$actionType',
          },
          count: { $sum: 1 },
          totalWeight: { $sum: '$weight.gross' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    res.json({ movement });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getWeightTrends = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const trends = await Transaction.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
          },
          grossWeight: { $sum: '$weight.gross' },
          netWeight: { $sum: '$weight.net' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
    ]);

    res.json({ trends });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getDeadStock = async (req, res) => {
  try {
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    // Find products with no transactions in last 90 days
    const recentlyMovedProducts = await Transaction.distinct('product', {
      actionType: { $in: ['Sold', 'Stock Out', 'Returned'] },
      createdAt: { $gte: ninetyDaysAgo },
    });

    const deadStock = await Product.find({
      _id: { $nin: recentlyMovedProducts },
      status: 'In Stock',
      createdAt: { $lt: ninetyDaysAgo },
    }).sort({ updatedAt: 1 });

    res.json({ deadStock, count: deadStock.length });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getStockAging = async (req, res) => {
  try {
    const today = new Date();

    const products = await Product.find({
      status: 'In Stock',
    }).sort({ createdAt: 1 });

    const stockAging = products.map((product) => {
      const daysInStock = Math.floor(
        (today - new Date(product.createdAt)) /
          (1000 * 60 * 60 * 24)
      );

      return {
        _id: product._id,
        productCode: product.productCode,
        category: product.category,
        grossWeight: product.weight?.gross || 0,
        netWeight: product.weight?.net || 0,
        daysInStock,
      };
    });

    stockAging.sort(
      (a, b) => b.daysInStock - a.daysInStock
    );

    res.json({
      stockAging,
      count: stockAging.length,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};
