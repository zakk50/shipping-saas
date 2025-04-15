import mongoose, { Schema, models } from 'mongoose'

const WarehouseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String },
  description: { type: String },
}, { timestamps: true })

const Warehouse = models.Warehouse || mongoose.model('Warehouse', WarehouseSchema)

export default Warehouse
