import mongoose from 'mongoose';

import Product from '../models/Product.js';
import Transaction from '../models/Transaction.js';
import { calculateNetWeight } from '../utils/helpers.js';

export const getAllProducts = async (req, res) => {
  try {
    const { category, status, search } = req.query;
    let query = {};

    if (category) query.category = category;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { productCode: { $regex: search, $options: 'i' } },
        { barcode: { $regex: search, $options: 'i' } },
        { qrCode: { $regex: search, $options: 'i' } },
      ];
    }

    const products = await Product.find(query)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    res.json({ products, total: products.length });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('createdBy', 'name')
      .populate('lastModifiedBy', 'name');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ product });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getProductByCode = async (req, res) => {
  try {
    const product = await Product.findOne({ productCode: req.params.code })
      .populate('createdBy', 'name');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ product });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getProductByBarcode = async (req, res) => {
  try {
    const { barcode } = req.query;
    const product = await Product.findOne({
      $or: [{ barcode }, { qrCode: barcode }],
    }).populate('createdBy', 'name');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ product });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { productCode, category, weight} = req.body;

    if (!productCode || !category || !weight?.gross) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const existingProduct = await Product.findOne({ productCode });
    if (existingProduct) {
      return res.status(400).json({ message: 'Product code already exists' });
    }

    const product = new Product({
      productCode: productCode.toUpperCase(),
      category,
      weight: {
        gross: weight.gross,
        stone: weight.stone || 0,
        tag: weight.tag || 0,
        net: calculateNetWeight(weight.gross, weight.stone || 0, weight.tag || 0),
      },
      createdBy: req.user.id,
    });

    await product.save();

    await Transaction.create({
      product: product._id,
      productCode: product.productCode,
      category: product.category,

      weight: {
        gross: product.weight.gross,
        stone: product.weight.stone,
        tag: product.weight.tag,
        net: product.weight.net,
      },
    
      statusType: "In Stock",
    
      reason: "In Stock",
    
      user: mongoose.Types.ObjectId.isValid(req.user.id) ? req.user.id : undefined,
    });
 
    res.status(201).json({
      message: 'Product created successfully',
      product,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { weight, ...updates } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Store old data for transaction
    const oldData = product.toObject();

    // Update fields
    Object.assign(product, updates);

    if (weight) {
      product.weight.gross = weight.gross || product.weight.gross;
      product.weight.stone = weight.stone !== undefined ? weight.stone : product.weight.stone;
      product.weight.tag = weight.tag !== undefined ? weight.tag : product.weight.tag;
      product.weight.net = calculateNetWeight(
        product.weight.gross,
        product.weight.stone,
        product.weight.tag
      );
    }

    if (mongoose.Types.ObjectId.isValid(req.user.id)) {
      product.lastModifiedBy = req.user.id;
    }
    await product.save();

    let statusType = 'Edit';

    if (oldData.status !== product.status) {
      switch (product.status) {
        case 'In Stock':
          statusType = 'In Stock';
          break;
      
        case 'Sold':
          statusType = 'Sold';
          break;
      
        case 'Returned':
          statusType = 'Returned';
          break;
      
        default:
          statusType = 'Edit';
      }
    }

    // Log transaction
    await Transaction.create({
      product: product._id,
      productCode: product.productCode,
    
      category: product.category,
    
      weight: {
        gross: product.weight?.gross || 0,
        stone: product.weight?.stone || 0,
        tag: product.weight?.tag || 0,
        net: product.weight?.net || 0,
      },
    
      statusType,
    
      previousStatus: oldData.status,
      newStatus: product.status,
    
      reason: product.reason,
    
      user: mongoose.Types.ObjectId.isValid(req.user.id) ? req.user.id : undefined,
      device: 'Manual Entry',
    
      metadata: {
        oldData,
        newData: product.toObject(),
      },
    });

    res.json({
      message: 'Product updated successfully',
      product,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
