// src/app/api/storage/[id]/route.ts

import { NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Storage from "@/models/storage";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const storage = await Storage.findById(params.id);
  if (!storage) return new Response("Ячейка не найдена", { status: 404 });
  return Response.json(storage);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const body = await req.json();
  const updated = await Storage.findByIdAndUpdate(params.id, body, { new: true });
  if (!updated) return new Response("Ячейка не найдена для обновления", { status: 404 });
  return Response.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const deleted = await Storage.findByIdAndDelete(params.id);
  if (!deleted) return new Response("Ячейка не найдена для удаления", { status: 404 });
  return Response.json({ message: "Удалено" });
}
