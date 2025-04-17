// src/models/storage.ts

import mongoose from 'mongoose'

const storageSchema = new mongoose.Schema(
  {
    warehouseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Warehouse',
      required: true,
    },
    name: { type: String, required: true },
    barcode: { type: String },
    description: { type: String },
  },
  { timestamps: true }
)

export default mongoose.models.Storage || mongoose.model('Storage', storageSchema)
