import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Task from "@/models/task";

export async function GET(
  req: NextRequest,
  context: { params: { taskId: string } } // ✅ Передаём params через context
) {
  try {
    await dbConnect();

    const { taskId } = context.params; // ✅ Теперь params передаётся корректно

    if (!taskId) {
      return NextResponse.json(
        { message: "taskId отсутствует в параметрах" },
        { status: 400 }
      );
    }

    const task = await Task.findById(taskId).select("transitions");

    if (!task) {
      return NextResponse.json(
        { message: "Задача не найдена" },
        { status: 404 }
      );
    }

    return NextResponse.json(task.transitions);
  } catch (error) {
    console.error("❌ Ошибка получения истории изменений:", error);
    return NextResponse.json(
      { message: "Ошибка сервера" },
      { status: 500 }
    );
  }
}
