import mongoose from 'mongoose';

const MaterialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  visibility: { type: String, enum: ['all', 'department', 'private'], default: 'department',},
}, { timestamps: true });

const Materials = mongoose.models.Materials || mongoose.model('Materials', MaterialSchema);

export default Materials;
