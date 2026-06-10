import Transaction from '../models/Transaction.js';
import Product from '../models/Product.js';

export const getAllTransactions = async (req, res) => {
  try {
    const { actionType, startDate, endDate, limit = 50, skip = 0 } = req.query;
    let query = {};

    if (actionType) query.actionType = actionType;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(query)
      .populate('product', 'productCode category weight')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Transaction.countDocuments(query);
 
    res.json({ transactions, total });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const stockIn = async (req, res) => {
  try {
    const { productId, device = 'Manual Entry', notes } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const oldStatus = product.status;
    product.status = 'In Stock';
    await product.save();

    const transaction = await Transaction.create({
      product: product._id,
      productCode: product.productCode,
      actionType: 'In Stock',
      previousStatus: oldStatus,
      newStatus: 'In Stock',
      weight: {
        gross: product.weight?.gross,
        stone: product.weight?.stone,
        tag: product.weight?.tag,
        net: product.weight?.net,
      },
      user: req.user.id,
      device,
      notes,
    });

    await transaction.populate('product', 'productCode category').populate('user', 'name');

    res.status(201).json({
      message: 'Stock in recorded successfully',
      transaction,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const stockOut = async (req, res) => {
  try {
    const { productId, reason, device = 'Manual Entry', notes } = req.body;

    if (!['Customer Sale', 'Returned to Factory'].includes(reason)) {
      return res.status(400).json({ message: 'Invalid reason' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const oldStatus = product.status;
    product.status = reason === 'Customer Sale' ? 'Sold' : 'Returned';
    await product.save();

    const transaction = await Transaction.create({
      product: product._id,
      productCode: product.productCode,
      actionType: reason === 'Customer Sale' ? 'Sold' : 'Stock Out',
      previousStatus: oldStatus,
      newStatus: product.status,
      weight: {
        gross: product.weight.gross,
        stone: product.weight.stone,
        tag: product.weight.tag,
        net: product.weight.net,
      },
      user: req.user.id,
      device,
      reason,
      notes,
    });

    await transaction.populate('product', 'productCode category').populate('user', 'name');

    res.status(201).json({
      message: 'Stock out recorded successfully',
      transaction,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getDailyTransactions = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const transactions = await Transaction.find({
      createdAt: { $gte: today, $lt: tomorrow },
    })
      .populate('product', 'productCode')
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.json({ transactions });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getTransactionsByProductCode = async (req, res) => {
  try {
    const { productCode } = req.params;

    const transactions = await Transaction.find({ productCode })
      .populate('product')
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.json({ transactions });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
