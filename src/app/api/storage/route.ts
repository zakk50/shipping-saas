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
  // пагинация
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);

  const sortField = searchParams.get("sortField") || "createdAt";
  const sortOrder = searchParams.get("sortOrder") === "desc" ? -1 : 1;

  const filter: any = {};

  if (section) filter.section = section;
  if (level) filter.level = level;
  if (cell) filter.cell = cell;

  if (search) {
    filter.$or = [
      { label: { $regex: search, $options: "i" } },
      { barcode: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (page - 1) * pageSize;

  const [items, totalItems] = await Promise.all([
    Storage.find(filter)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(pageSize),
    Storage.countDocuments(filter),
  ]);

  return Response.json({ items, totalItems });
}


// POST: Создать новую ячейку
export async function POST(req: NextRequest) {
  await dbConnect();
  const body = await req.json();
  const created = await Storage.create(body);
  return Response.json(created);
}

