import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    productCode: {
      type: String,
      required: [true, 'Please provide product code'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      enum: [
        'Earrings',
        'Gents Ring',
        'Ladies Ring',
        'Baby Rings',
        'Couple Ring',
        'God Ring',
        'Bracelets',
        'Other'
      ],
    },
    weight: {
      gross: {
        type: Number,
        required: [true, 'Please provide gross weight'],
        min: 0,
      },
      stone: {
        type: Number,
        default: 0,
        min: 0,
      },
      tag: {
        type: Number,
        default: 0,
        min: 0,
      },
      net: {
        type: Number,
        required: true,
      },
    },
    status: {
      type: String,
      enum: ['In Stock', 'Sold', 'Returned'],
      default: 'In Stock',
    },
    reason: {
      type: String,
      enum: ['In Stock', 'Customer Sale', 'Returned to Factory'],
      default: 'In Stock',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    lastModifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

// Auto-calculate net weight before saving
productSchema.pre('save', function(next) {
  this.weight.net = this.weight.gross - this.weight.stone - this.weight.tag;
  next();
});

// Index for faster searches
productSchema.index({ productCode: 1 });
productSchema.index({ barcode: 1 });
productSchema.index({ qrCode: 1 });
productSchema.index({ category: 1 });
productSchema.index({ status: 1 });

export default mongoose.model('Product', productSchema);
