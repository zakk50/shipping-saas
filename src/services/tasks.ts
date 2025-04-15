// src/services/tasks.ts

import axios from 'axios';
import { ITask } from '@/models/task'; // Импортируем интерфейс задачи (если ещё нет, допиши его)
import { Task } from '@/types/index'; // Импортируем тип задачи для фронтенда

export const fetchTasks = async (): Promise<Task[]> => {
  const res = await axios.get('/api/tasks');
  const data: ITask[] = res.data;

  return data.map((task: ITask) => ({
    _id: String(task._id), // Преобразуем _id в строку
    title: task.title,
    description: task.description,
    status: task.status,
    executors: task.executors || [],
    createdAt: task.createdAt.toString(), // Преобразуем Date в строку
    updatedAt: task.updatedAt ? task.updatedAt.toString() : '', // Преобразуем Date в строку, если есть
    completedAt: task.completedAt ? task.completedAt.toString(): '', // Добавляем completedAt
    transitions: task.transitions
      ? task.transitions.map(t => ({
          from: t.from,
          to: t.to,
          timestamp: new Date(t.timestamp).toISOString(), // Преобразуем Date в строку
        }))
      : [], // Добавляем transitions (пустой массив по умолчанию)
      duration: task.duration || null, // ✅ Добавляем duration
  }));
};

type CreateTaskData = {
  title: string;
  description: string;
  executors: string[]; // массив id пользователей
};

export const createTask = async (taskData: CreateTaskData): Promise<ITask> => {
  const res = await axios.post('/api/tasks', taskData);
  return res.data;
};

export const updateTaskStatus = async (
  taskId: string,
  status: "created" | "in_progress" | "completed"
): Promise<ITask> => {
  const res = await axios.patch(`/api/tasks?taskId=${taskId}`, {
    status,
    completedAt: status === "completed" ? new Date().toISOString() : null, // Добавляем дату завершения
  });
  // console.log('Обновлённая задача:', res.data); // ✅ Проверяем, есть ли duration в ответе
  return res.data;
};

export const deleteTask = async (taskId: string): Promise<{ message: string }> => {
  const res = await axios.delete(`/api/tasks?taskId=${taskId}`);
  return res.data;
};
