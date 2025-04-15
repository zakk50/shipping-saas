export interface Executor {
  _id: string;
  name: string;
}

export type Task = {
  _id: string;
  title: string;
  description: string;
  status: 'created' | 'in_progress' | 'completed';
  executors: any[];
  transitions: { from: string; to: string; timestamp: string }[];
  createdAt: string;
  updatedAt?: string; // Сделаем это поле необязательным
  completedAt?: string; // Добавляем поле для времени завершения
  duration?: { hours: number; minutes: number }; // ✅ Добавляем duration
};