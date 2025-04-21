import mongoose from "mongoose";

const StorageSchema = new mongoose.Schema(
  {
    label: { type: String, required: true }, // Название/метка ячейки
    section: String,                         // Секция/ряд
    level: { type: String, required: true }, // Уровень
    cell: { type: String, required: true },  // ячейка
    barcode: String,                         // Штрихкод
  },
  { timestamps: true }
);

export default mongoose.models.Storage || mongoose.model("Storage", StorageSchema);
