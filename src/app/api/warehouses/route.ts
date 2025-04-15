import { NextResponse } from 'next/server';
import connectDB from '@/lib/dbConnect';
import Warehouse from '@/models/warehouse';

export async function GET() {
  await connectDB()
  const warehouses = await Warehouse.find()
  return NextResponse.json(warehouses)
}

export async function POST(req: Request) {
  await connectDB()
  const data = await req.json()
  const warehouse = await Warehouse.create(data)
  return NextResponse.json(warehouse)
}
