// src/app/api/storage/route.ts

import { NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import Storage from '@/models/storage'

export async function GET() {
  await dbConnect()
  const items = await Storage.find().populate('warehouseId')
  return NextResponse.json(items)
}

export async function POST(req: Request) {
  await dbConnect()
  const body = await req.json()
  const created = await Storage.create(body)
  return NextResponse.json(created)
}
