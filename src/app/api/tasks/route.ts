import { NextResponse } from 'next/server';
import Task from '@/models/task'; // или '@/models/Task' в зависимости от твоего импорта
import dbConnect from '@/lib/dbConnect';
import moment from 'moment';

// Получить все задачи
export async function GET() {
  try {
    await dbConnect(); // Подключение к базе данных
    const tasks = await Task.find(); // Запрос всех задач
    return NextResponse.json(tasks); // Отправка ответа
  } catch (error) {
    console.error('Ошибка при получении задач', error);
    return NextResponse.error();
  }
}

// Создать новую задачу
export async function POST(req: Request) {
  try {
    const taskData = await req.json(); // Получение данных задачи
    const newTask = new Task(taskData);
    await newTask.save();
    return NextResponse.json(newTask, { status: 201 }); // Возврат сохраненной задачи
  } catch (error) {
    console.error('Ошибка при создании задачи', error);
    return NextResponse.error();
  }
}

// PATCH запрос на обновление статуса задачи
export async function PATCH(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get('taskId');

    if (!taskId) {
      return NextResponse.json({ message: 'taskId не указан' }, { status: 400 });
    }

    const { status } = await req.json();

    if (!status) {
      return NextResponse.json({ message: 'status не указан' }, { status: 400 });
    }

    await dbConnect();
    const task = await Task.findById(taskId);

    if (!task) {
      return NextResponse.json({ message: 'Задача не найдена' }, { status: 404 });
    }

    let updateData: any = { status };

    if (status === 'completed' && !task.completedAt) {
      const completedAt = new Date();
      const durationTime = calculateWorkingHours(task.createdAt, completedAt);

      updateData.completedAt = completedAt;
      updateData.duration = durationTime;
    }

    // Если статус изменился, фиксируем историю
    if (status !== task.status) {
      const transition = {
        from: task.status,
        to: status,
        timestamp: new Date(),
      };

      updateData.$push = { transitions: transition }; // Добавляем историю изменений
    }    

    const updatedTask = await Task.findByIdAndUpdate(taskId, updateData, { new: true });

    if (!updatedTask) {
      return NextResponse.json({ message: 'Ошибка при обновлении' }, { status: 500 });
    }

    console.log('✅ Обновлено:', updatedTask);
    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error('❌ Ошибка обновления задачи:', error);
    return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
  }
}


// Функция расчёта рабочего времени (возвращает часы и минуты)
function calculateWorkingHours(createdAt: Date | string, completedAt: Date | string) {
  let totalMinutes = 0;
  let current = moment(createdAt);
  const end = moment(completedAt);

  while (current.isBefore(end)) {
    const hour = current.hour();
    const isWorkingHour = hour >= 8 && hour < 20; // Рабочие часы с 8:00 до 20:00

    if (isWorkingHour) {
      totalMinutes += 1; // Считаем в минутах
    }
    current.add(1, 'minute');
  }

  return {
    hours: Math.floor(totalMinutes / 60),
    minutes: totalMinutes % 60
  };
}



// Удалить задачу
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get('taskId');

    if (!taskId) {
      return NextResponse.json({ message: 'taskId не указан' }, { status: 400 });
    }

    await dbConnect();

    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return NextResponse.json({ message: 'Задача не найдена' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Задача удалена успешно', deletedTask });
  } catch (error) {
    console.error('Ошибка при удалении задачи:', error);
    return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
  }
}