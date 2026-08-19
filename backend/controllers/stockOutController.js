import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Transaction from '../models/Transaction.js';
import { calculateNetWeight } from '../utils/helpers.js';

export const stockOutProduct = async (req, res) => {
  try {
    const { soldWeight, soldTagWeight, status, reason } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: 'Product not found',
      });
    }

    const bulkCategories = [
      'Earrings',
      'Baby Rings',
      'Bracelets',
      'Gents Ring (Without Tag)',
      'Ladies Ring (Without Tag)'
    ];

    // ----------------------------------
    // BULK STOCK PRODUCTS
    // ----------------------------------

    if (bulkCategories.includes(product.category)) {
      const remainingGross = Number(
        (product.weight.gross - soldWeight).toFixed(3)
      );
      const remainingTag = Number(
        (product.weight.tag - soldTagWeight).toFixed(3)
      );

      if (remainingGross < 0 || remainingTag < 0) {
        return res.status(400).json({
          message: 'Sold weight cannot exceed available stock',
        });
      }

      product.weight.gross = remainingGross;
      product.weight.tag = remainingTag;

      product.weight.net = calculateNetWeight(
        remainingGross,
        product.weight.stone || 0,
        remainingTag
      );

      // Sold only when stock becomes zero
      if (remainingGross <= 0.001 && remainingTag <= 0.001) {
        product.weight.gross = 0;
        product.weight.tag = 0;
        product.weight.net = 0;
        product.status = 'Sold';
      } else {
        product.status = 'In Stock';
      }

      await product.save();

      await Transaction.create({
        product: product._id,
        productCode: product.productCode,
        category: product.category,

        weight: {
          gross: soldWeight,
          stone: 0,
          tag: soldTagWeight,
          net: soldWeight,
        },

        statusType:
          status === 'Returned'
            ? 'Returned'
            : 'Sold',

        reason: reason || 'Customer Sale',

        user: mongoose.Types.ObjectId.isValid(req.user.id) ? req.user.id : undefined,

        metadata: {
          soldWeight,
          remainingWeight: remainingGross,
        },
      });

      return res.json({
        message: 'Stock updated successfully',
        product,
      });
    }

    // ----------------------------------
    // NORMAL UNIQUE PRODUCTS
    // ----------------------------------

    product.status = status || 'Sold';

    await product.save();

    await Transaction.create({
      product: product._id,
      productCode: product.productCode,
      category: product.category,

      weight: {
        gross: soldWeight,
        tag: soldTagWeight,
        net: product.weight.net,
      },

      statusType: 'Sold',

      reason: reason || 'Customer Sale',

      user: mongoose.Types.ObjectId.isValid(req.user.id) ? req.user.id : undefined,
    });

    console.log(user);

    res.json({
      message: 'Product marked as sold',
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      error: error.message,
    });
  }
};