import mongoose from 'mongoose';

// Схема отдела
const DepartmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  // Вложенные разделы
  // sections: [SectionSchema] 
}, { timestamps: true });

const Department = mongoose.models.Department || mongoose.model('Department', DepartmentSchema);

export default Department;
