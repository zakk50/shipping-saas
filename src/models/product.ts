import mongoose, { Schema, models } from 'mongoose'

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sku: { type: String },
    quantity: { type: Number, default: 1 },
    storageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Storage',
      required: false,
    },
    status: {
      type: String,
      enum: ['QC', 'ok', 'nook', 'exp', 'rework'],
      default: 'QC', // по умолчанию устанавливаем QC
    },
  },
  { timestamps: true }
);

const Product = models.Product || mongoose.model('Product', ProductSchema)

export default Product