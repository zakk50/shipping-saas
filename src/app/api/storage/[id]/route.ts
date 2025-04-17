// src/app/api/storage/[id]/route.ts

import { NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import Storage from '@/models/storage'

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await dbConnect()
  const body = await req.json()
  const updated = await Storage.findByIdAndUpdate(params.id, body, { new: true })
  return NextResponse.json(updated)
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await dbConnect()
  await Storage.findByIdAndDelete(params.id)
  return NextResponse.json({ message: 'Deleted' })
}
