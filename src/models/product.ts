import mongoose, { Schema, models } from 'mongoose'

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, unique: true },
  barcode: { type: String },
  description: { type: String },
  category: { type: String },
  stockByWarehouse: [
    {
      warehouseId: { type: Schema.Types.ObjectId, ref: 'Warehouse' },
      quantity: { type: Number, default: 0 },
    },
  ],
}, { timestamps: true })

const Product = models.Product || mongoose.model('Product', ProductSchema)

export default Product
