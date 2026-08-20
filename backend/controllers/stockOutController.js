import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Transaction from '../models/Transaction.js';
import { calculateNetWeight } from '../utils/helpers.js';

export const stockOutProduct = async (req, res) => {
  try {
    const {
      soldWeight,
      soldStoneWeight,
      soldTagWeight,
      status,
      reason,
    } = req.body;

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
      'Ladies Ring (Without Tag)',
    ];

    const isBulkCategory = bulkCategories.includes(product.category);

    const gross = Number(soldWeight) || 0;
    const stone = Number(soldStoneWeight) || 0;
    const tag = Number(soldTagWeight) || 0;

    // --------------------------------------------------
    // BASIC VALIDATION
    // --------------------------------------------------

    if (gross <= 0) {
      return res.status(400).json({
        message: 'Sold weight must be greater than 0',
      });
    }

    // ==================================================
    // BULK CATEGORY
    // ==================================================

    if (isBulkCategory) {

      // Bulk categories do NOT have sold stone weight
      const remainingGross = Number(
        (product.weight.gross - gross).toFixed(3)
      );

      const remainingTag = Number(
        (product.weight.tag - tag).toFixed(3)
      );

      // -----------------------------------------------
      // Check available stock
      // -----------------------------------------------

      if (remainingGross < 0) {
        return res.status(400).json({
          message: 'Sold weight cannot exceed available gross weight',
        });
      }

      if (remainingTag < 0) {
        return res.status(400).json({
          message: 'Sold tag weight cannot exceed available tag weight',
        });
      }

      // -----------------------------------------------
      // Calculate remaining product net weight
      // -----------------------------------------------

      const remainingNet = calculateNetWeight(
        remainingGross,
        product.weight.stone || 0,
        remainingTag
      );

      product.weight.gross = remainingGross;
      product.weight.tag = remainingTag;
      product.weight.net = remainingNet;

      // -----------------------------------------------
      // Product status
      // -----------------------------------------------

      if (
        remainingGross <= 0.001 &&
        remainingTag <= 0.001
      ) {
        product.weight.gross = 0;
        product.weight.tag = 0;
        product.weight.net = 0;
        product.status = 'Sold';
      } else {
        product.status = 'In Stock';
      }

      await product.save();

      // -----------------------------------------------
      // Sold net weight
      //
      // Bulk category has NO stone weight
      // -----------------------------------------------

      const soldNetWeight = Number(
        (gross - tag).toFixed(3)
      );

      // -----------------------------------------------
      // Create transaction
      // -----------------------------------------------

      await Transaction.create({
        product: product._id,

        productCode: product.productCode,

        category: product.category,

        weight: {
          gross: gross,
          stone: 0,
          tag: tag,
          net: soldNetWeight,
        },

        statusType: 'Sold',

        reason: reason || 'Customer Sale',

        user: mongoose.Types.ObjectId.isValid(req.user.id)
          ? req.user.id
          : undefined,

        metadata: {
          soldWeight: gross,
          soldTagWeight: tag,
          soldNetWeight: soldNetWeight,

          remainingWeight: remainingGross,
          remainingTagWeight: remainingTag,
          remainingNetWeight: remainingNet,
        },
      });

      return res.json({
        message: 'Bulk stock updated successfully',
        product,
      });
    }

    // ==================================================
    // NORMAL / UNIQUE PRODUCT
    // ==================================================

    // Normal products have stone weight
    const remainingGross = Number(
      (product.weight.gross - gross).toFixed(3)
    );

    if (remainingGross < 0) {
      return res.status(400).json({
        message: 'Sold weight cannot exceed available gross weight',
      });
    }

    // -----------------------------------------------
    // Calculate sold net weight
    // -----------------------------------------------

    const soldNetWeight = calculateNetWeight(
      gross,
      stone,
      tag
    );

    // -----------------------------------------------
    // Normally unique product is completely sold
    // -----------------------------------------------

    product.status = status || 'Sold';

    // If your unique products are always completely sold,
    // keep their original weight unchanged for history.
    await product.save();

    // -----------------------------------------------
    // Create transaction
    // -----------------------------------------------

    await Transaction.create({
      product: product._id,

      productCode: product.productCode,

      category: product.category,

      weight: {
        gross: gross,
        stone: stone,
        tag: tag,
        net: soldNetWeight,
      },

      statusType: 'Sold',

      reason: reason || 'Customer Sale',

      user: mongoose.Types.ObjectId.isValid(req.user.id)
        ? req.user.id
        : undefined,
    });

    // IMPORTANT:
    // Removed console.log(user)
    // because "user" was not defined.

    return res.json({
      message: 'Product marked as sold',
      product,
    });

  } catch (error) {

    console.error('Stock Out Error:', error);

    return res.status(500).json({
      message: 'Server Error',
      error: error.message,
    });
  }
};