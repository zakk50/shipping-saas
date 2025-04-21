// src/app/api/storage/route.ts

import { NextRequest } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import Storage from '@/models/storage'

// GET: Получить все ячейки и поиск
export async function GET(req: NextRequest) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const section = searchParams.get("section");
  const level = searchParams.get("level");
  const cell = searchParams.get("cell");

  const filter: any = {};
  if (section) filter.section = section;
  if (level) filter.level = level;
  if (cell) filter.cell = cell;

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

