import React, { useState, useEffect } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './dialog';
import { Textarea } from './textarea';
import { Button } from '@/components/ui/button';
import { createTask } from '@/services/tasks';
import { getUsers } from '@/services/users';
import Select from 'react-select';

const AddTaskModal = ({ onTaskCreated }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [executors, setExecutors] = useState([]);
  const [users, setUsers] = useState([]);

 // Загрузка пользователей при открытии модалки
useEffect(() => {
  const fetchUsers = async () => {
    try {
      const res = await getUsers(); // Тут уже данные
      // console.log('✅ Пользователи получены:', res);

      setUsers(Array.isArray(res) ? res : []);
    } catch (error) {
      // console.error('Ошибка при получении списка пользователей:', error);
      setUsers([]);
    }
  };

  if (open) {
    fetchUsers();
  }
}, [open]);

  

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!title || executors.length === 0) {
    alert('Заполните обязательные поля!');
    return;
  }

  const executorsIds = executors.map(executor => executor.value);

  const newTask = {
    title,
    description,
    executors: executorsIds,
    status: "created"
  };

  try {
    await createTask(newTask);
    onTaskCreated(); // ✅ Фетчим задачи заново
    setOpen(false);
    // Сбросить поля формы после создания
    setTitle('');
    setDescription('');
    setExecutors([]);
  } catch (error) {
    console.error("Ошибка при создании задачи:", error);
  }
};




  const userOptions = Array.isArray(users)
    ? users.map((user) => ({
        value: user._id,
        label: user.name, // можно заменить на user.fullName если есть
      }))
    : [];

  // console.log('userOptions:', userOptions); 

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button>Добавить задачу</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Новая задача</DialogTitle>
          <DialogDescription>Заполните форму, чтобы добавить новую задачу на склад.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Название задачи"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="border p-2 rounded-md"
          />

          <Textarea
            placeholder="Описание задачи"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="executors" className="text-right">Исполнители</label>
            <div className="col-span-3">
              <Select
                inputId="executors"
                isMulti
                name="executors"
                options={userOptions}
                value={executors}
                onChange={(selected) => setExecutors(selected)}
                placeholder="Выбрать исполнителей"
                noOptionsMessage={() => 'Нет доступных пользователей'}
              />
            </div>
          </div>

          <Button type="submit">Создать</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskModal;
