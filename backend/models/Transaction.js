import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },

    productCode: {
      type: String,
      required: true,
      index: true,
    },

    category: {
      type: String,
    },

    barcode: String,

    actionType: {
      type: String,
      enum: ['In Stock', 'Sold', 'Returned', 'Edit'],
      required: true,
      index: true,
    },

    weight: {
      gross: {
        type: Number,
        default: 0,
      },
      stone: {
        type: Number,
        default: 0,
      },
      tag: {
        type: Number,
        default: 0,
      },
      net: {
        type: Number,
        default: 0,
      },
    },

    quantity: {
      type: Number,
      default: 1,
    },

    reason: {
      type: String,
      enum: [
        'In Stock',
        'Customer Sale',
        'Returned to Factory',
        'Other',
      ],
      default: 'Other',
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },

    metadata: {
      oldData: Object,
      newData: Object,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
transactionSchema.index({ productCode: 1 });
transactionSchema.index({ createdAt: -1 });
transactionSchema.index({ actionType: 1 });
transactionSchema.index({ user: 1 });

export default mongoose.model('Transaction', transactionSchema);
