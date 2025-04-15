import { useDrag } from 'react-dnd';
import { motion } from 'framer-motion';
import { Task } from '@/types';

interface TaskCardProps {
  task: Task;
  onDelete: (taskId: string) => void;
}

export const TaskCard = ({ task, onDelete }: TaskCardProps) => {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: 'TASK',
    item: { id: task._id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return dragRef(
    <motion.div
      className={`rounded-2xl bg-white p-4 shadow-sm ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-lg font-medium">{task.title}</h4>
        <button
          onClick={() => onDelete(task._id)}
          className="text-sm text-red-500 hover:text-red-700"
        >
          Удалить
        </button>
      </div>
      <p className="text-sm text-gray-600">{task.description}</p>
    </motion.div>
  );
};
