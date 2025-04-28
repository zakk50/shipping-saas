'use client';

import { useEffect, useState } from 'react';
import { fetchTasks, createTask, updateTaskStatus, deleteTask } from '@/services/tasks';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
import { motion, PanInfo, useAnimation } from 'framer-motion';

type Task = {
  _id: string;
  title: string;
  description: string;
  status: 'created' | 'in_progress' | 'completed';
  executors: any[];
  createdAt: string;
  updatedAt?: string;
  completedAt?: string; // Добавляем completedAt
  isDeleted?: boolean; // Добавим soft delete
  duration?: { hours: number; minutes: number };
};

export default function BoardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [open, setOpen] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null); // id задачи для удаления
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false); // Окно подтверждения удаления
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null); // ID задачи, которая в данный момент перетаскивается

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const data = await fetchTasks();
    setTasks(data);
  };

  const handleDrop = async (taskId: string, newStatus: 'created' | 'in_progress' | 'completed') => {
    try {
      const updatedTask = await updateTaskStatus(taskId, newStatus);
      
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId
            ? { 
                ...task, 
                status: newStatus, 
                completedAt: updatedTask.completedAt ? new Date(updatedTask.completedAt).toISOString() : undefined 
              }
            : task
        )
      );
    } catch (error) {
      console.error('Ошибка обновления статуса:', error);
    }
  };
  
  const handleCreateTask = async () => {
    await createTask({
      ...newTask,
      executors: [],
    });
    setNewTask({ title: '', description: '' });
    setOpen(false);
    loadTasks();
  };

  const handleDeleteTask = async () => {
    if (deleteTaskId) {
      await deleteTask(deleteTaskId); // Делаем soft delete
      setConfirmDeleteOpen(false);
      loadTasks();
    }
  };

  const columns: { status: Task['status']; title: string }[] = [
    { status: 'created', title: 'Не в работе' },
    { status: 'in_progress', title: 'В работе' },
    { status: 'completed', title: 'Завершено' },
  ];

  const countTasks = (status: Task['status']) => {
    return tasks.filter((task) => task.status === status && !task.isDeleted).length;
  };

  const taskVariants = {
    drag: { scale: 1.05 },
    drop: { scale: 1.1 },
  };
  // console.log(tasks)
  return (
    <div className="p-8">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Канбан-доска</h2>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setOpen(true)}>Создать задачу</Button>
          </DialogTrigger>
          <DialogContent aria-describedby={undefined}>
            <DialogTitle>Новая задача</DialogTitle>
            <Input
              className="mb-2"
              placeholder="Название"
              value={newTask.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewTask({ ...newTask, title: e.target.value })} />
            <textarea
              placeholder="Описание"
              value={newTask.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setNewTask({ ...newTask, description: e.target.value })}
              className="mb-4"
            />
            <Button onClick={handleCreateTask}>Создать</Button>
          </DialogContent>
        </Dialog>

        {/* Модальное окно подтверждения удаления */}
        <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
          <DialogContent>
            <DialogTitle>Вы уверены, что хотите удалить задачу?</DialogTitle>
            <Button variant="default" onClick={handleDeleteTask}>
              Удалить
            </Button>
            <Button onClick={() => setConfirmDeleteOpen(false)}>Отменить</Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {columns.map((col) => (
          <div
            key={col.status}
            className="bg-gray-400 p-4 rounded shadow min-h-[500px]"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e: React.DragEvent<HTMLDivElement>) => {
              const taskId = e.dataTransfer.getData('taskId');
              handleDrop(taskId, col.status as Task['status']);
            }}
          >
            <h3 className="font-bold text-lg mb-2">{col.title}</h3>
            <p className="text-sm mb-4">Задачи: {countTasks(col.status)}</p>

            {tasks
              .filter((task) => task.status === col.status && !task.isDeleted)
              .map((task) => (
                <motion.div
                  key={task._id}
                  className={`bg-white p-3 rounded shadow mb-2 cursor-move ${
                    draggingTaskId === task._id ? 'opacity-50' : ''
                  } ${task.status === 'completed' ? 'bg-green-100' : ''}`} // Подсвечиваем завершенные задачи
                  draggable
                  variants={taskVariants}
                  initial="drop"
                  whileDrag="drag"
                  animate={task._id === draggingTaskId ? { scale: 1.1 } : { scale: 1 }}
                  onDragStart={(e: React.DragEvent<HTMLDivElement>) => {
                    e.dataTransfer.setData('taskId', task._id);
                    setDraggingTaskId(task._id);
                  }}
                  onDragEnd={() => setDraggingTaskId(null)}
                >
                  <h4 className="font-semibold">{task.title}</h4>
                  <p className="text-sm text-gray-600">{task.description.slice(0, 50)}...</p>
                  <p className="text-xs text-gray-400 mt-1">Создано: {new Date(task.createdAt).toLocaleDateString()}</p>

                  {/* Если задача завершена, показываем дату завершения */}
                  {task.status === 'completed' && task.completedAt && (
                    <div className="text-xs text-green-700 font-semibold">
                      <p>Завершено: {new Date(task.completedAt).toLocaleString()}</p>
                      {task.duration && (
                        <p>Время выполнения: {task.duration.hours} ч {task.duration.minutes} мин</p>
                      )}
                    </div>
                  )}

                  <Button
                    variant="default"
                    onClick={() => {
                      setDeleteTaskId(task._id);
                      setConfirmDeleteOpen(true);
                    }}
                  >
                    Удалить
                  </Button>
                </motion.div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
