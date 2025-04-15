'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@radix-ui/react-dialog';
// import { Dialog, DialogTrigger, DialogContent,} from '@/components/ui/dialog';
// import { DialogTitle } from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';
import axios from 'axios';

const AddTaskModal = ({ onTaskCreated }: { onTaskCreated: () => void }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedExecutors, setSelectedExecutors] = useState<string[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await axios.get('/api/users');
      setUsers(res.data);
    };
    fetchUsers();
  }, []);

  const handleSubmit = async () => {
    await axios.post('/api/tasks', {
      title,
      description,
      executors: selectedExecutors,
    });
    onTaskCreated();
    setOpen(false);
  };


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger >
        <Button variant="default">Добавить задачу</Button>
      </DialogTrigger>

      <DialogContent>
        <div className='bg-gray-500'>
        {/* <h2 className="text-xl font-bold  mb-4">Создать задачу</h2> */}
        <DialogTitle className="text-lg font-semibold mb-4">Новая задача</DialogTitle>
        <input
          className="w-full p-2 border rounded mb-2"
          placeholder="Название задачи"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="w-full p-2 border rounded mb-2"
          placeholder="Описание"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="mb-4">
          <label>Выбрать исполнителей:</label>
          <select
            multiple
            className="w-full p-2 border rounded"
            value={selectedExecutors}
            onChange={(e) =>
              setSelectedExecutors(Array.from(e.target.selectedOptions, (opt) => opt.value))
            }
          >
            {users.map((user: any) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <Button onClick={handleSubmit}>Создать</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskModal;
