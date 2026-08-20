import Product from '../models/Product.js';
import Transaction from '../models/Transaction.js';

export const getDashboardStats = async (req, res) => {
  try {
    // ==================================================
    // TODAY
    // ==================================================

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);


    // ==================================================
    // PRODUCT COUNTS
    // ==================================================

    const totalProducts = await Product.countDocuments();

    const inStockProducts = await Product.countDocuments({
      status: 'In Stock',
    });

    const soldProducts = await Product.countDocuments({
      status: 'Sold',
    });

    const returnedProducts = await Product.countDocuments({
      status: 'Returned',
    });


    // ==================================================
    // CURRENT INVENTORY WEIGHT
    //
    // IMPORTANT:
    // Only current Product documents are counted.
    //
    // This automatically handles bulk categories:
    //
    // Initial:
    // Earrings = 157.850g
    //
    // After selling 20g:
    // Earrings = 137.850g
    //
    // Dashboard counts 137.850g.
    // ==================================================

    const weightResult = await Product.aggregate([
      {
        $match: {
          status: 'In Stock',
        },
      },

      {
        $group: {
          _id: null,

          gross: {
            $sum: {
              $ifNull: ['$weight.gross', 0],
            },
          },

          stone: {
            $sum: {
              $ifNull: ['$weight.stone', 0],
            },
          },

          tag: {
            $sum: {
              $ifNull: ['$weight.tag', 0],
            },
          },

          net: {
            $sum: {
              $ifNull: ['$weight.net', 0],
            },
          },
        },
      },
    ]);


    // ==================================================
    // DEFAULT WEIGHT VALUES
    // ==================================================

    const weightStats = {
      gross: 0,
      stone: 0,
      tag: 0,
      net: 0,
    };


    if (weightResult.length > 0) {
      weightStats.gross = Number(
        weightResult[0].gross.toFixed(3)
      );

      weightStats.stone = Number(
        weightResult[0].stone.toFixed(3)
      );

      weightStats.tag = Number(
        weightResult[0].tag.toFixed(3)
      );

      weightStats.net = Number(
        weightResult[0].net.toFixed(3)
      );
    }


    // ==================================================
    // TODAY'S TRANSACTIONS
    // ==================================================

    const todayTransactions = await Transaction.find({
      createdAt: {
        $gte: today,
        $lt: tomorrow,
      },
    });


    const todayStockIn = todayTransactions.filter(
      (transaction) =>
        transaction.statusType === 'In Stock'
    ).length;


    const todayStockOut = todayTransactions.filter(
      (transaction) =>
        ['Stock Out', 'Sold'].includes(
          transaction.statusType
        )
    ).length;


    // ==================================================
    // RESPONSE
    // ==================================================

    res.json({
      inventory: {
        totalProducts,
        inStockProducts,
        soldProducts,
        returnedProducts,
      },

      weights: {
        gross: weightStats.gross,
        stone: weightStats.stone,
        tag: weightStats.tag,
        net: weightStats.net,
      },

      today: {
        stockIn: todayStockIn,
        stockOut: todayStockOut,
        transactions: todayTransactions.length,
      },
    });

  } catch (error) {

    console.error(
      'Dashboard Stats Error:',
      error
    );

    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
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

export const getMonthlySales = async (req, res) => {
  try {
    const month = parseInt(req.query.month);
    const year = parseInt(req.query.year);

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const sales = await Transaction.aggregate([
      {
        $match: {
          statusType: "Sold",
          createdAt: {
            $gte: startDate,
            $lt: endDate,
          },
        },
      },
      {
        $group: {
          _id: {
            day: { $dayOfMonth: "$createdAt" },
            category: "$category",
          },
          salesCount: { $sum: 1 },
          totalWeight: { $sum: "$weight.net" },
        },
      },
      {
        $sort: {
          "_id.day": 1,
        },
      },
    ]);

    res.json(sales);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching monthly sales",
      error: error.message,
    });
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
      statusType: { $in: ['Sold', 'Stock Out', 'Returned'] },
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
