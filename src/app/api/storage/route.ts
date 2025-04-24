// src/app/api/storage/route.ts

import { NextRequest } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import Storage from '@/models/storage'

// GET: Получить все ячейки с фильтрацией и поиском
export async function GET(req: NextRequest) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const section = searchParams.get("section");
  const level = searchParams.get("level");
  const cell = searchParams.get("cell");
  const search = searchParams.get("search"); // ➕ Поиск по тексту

  const filter: any = {};

  // Преобразуем строковые значения в числа для фильтрации
  if (section) filter.section = parseInt(section);
  if (level) filter.level = parseInt(level);
  if (cell) filter.cell = parseInt(cell);

  // Если указан поисковый текст
  if (search) {
    filter.$or = [
      { label: { $regex: search, $options: "i" } },
      { barcode: { $regex: search, $options: "i" } },
    ];
  }

  const storages = await Storage.find(filter).sort({ createdAt: -1 });
  return Response.json(storages);
}


// POST: Создать новую ячейку
export async function POST(req: NextRequest) {
  await dbConnect();
  const body = await req.json();
  const created = await Storage.create(body);
  return Response.json(created);
}

