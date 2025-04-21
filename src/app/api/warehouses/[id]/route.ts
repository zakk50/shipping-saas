import { NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Warehouse from "@/models/warehouse";

// ✅ GET: Получить конкретный склад по ID
export async function GET(req: NextRequest) {
  await dbConnect();

  const id = req.nextUrl.pathname.split("/").pop(); // <-- получаем ID из URL
  const warehouse = await Warehouse.findById(id);

  if (!warehouse) {
    return new Response("Склад не найден", { status: 404 });
  }

  return Response.json(warehouse);
}

// ✅ PUT: Обновить склад по ID
export async function PUT(req: NextRequest) {
  await dbConnect();

  const id = req.nextUrl.pathname.split("/").pop(); // <-- получаем ID из URL
  const body = await req.json();
  const updated = await Warehouse.findByIdAndUpdate(id, body, {
    new: true,
  });

  if (!updated) {
    return new Response("Склад не найден для обновления", { status: 404 });
  }

  return Response.json(updated);
}

// ✅ DELETE: Удалить склад по ID
export async function DELETE(req: NextRequest) {
  await dbConnect();

  const id = req.nextUrl.pathname.split("/").pop(); // <-- получаем ID из URL
  const deleted = await Warehouse.findByIdAndDelete(id);

  if (!deleted) {
    return new Response("Склад не найден для удаления", { status: 404 });
  }

  return Response.json({ message: "Склад успешно удалён" });
}
