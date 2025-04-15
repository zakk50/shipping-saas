import mongoose, { Schema, Document, models } from 'mongoose';

// Интерфейс для TypeScript (если используешь)
export interface ITask extends Document {
  title: string;
  description: string;
  status: 'created' | 'in_progress' | 'completed';
  executors: mongoose.Types.ObjectId[];
  transitions: { from: string; to: string; timestamp: Date }[];
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;  // Здесь добавляем completedAt
  duration: {hours: number, minutes: number}; // Добавляем поле для хранения времени выполнения
}

const TaskSchema: Schema<ITask> = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ['created', 'in_progress', 'completed'],
      default: 'created',
    },
    executors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    transitions: [
      {
        from: String,
        to: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
    completedAt: { type: Date },  // Здесь добавляем поле completedAt
    duration: { 
      hours: { type: Number, default: 0 }, 
      minutes: { type: Number, default: 0 } 
    } // ✅ Добавляем поле duration
  },
  { timestamps: true } // <-- автоматическое добавление createdAt и updatedAt
);

// Экспорт модели
const Task = models.Task || mongoose.model<ITask>('Task', TaskSchema);

export default Task;
