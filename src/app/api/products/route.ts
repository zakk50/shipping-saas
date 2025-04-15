// app/api/products/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/product';

export async function GET() {
  await dbConnect()
  const products = await Product.find()
  return NextResponse.json(products)
}

export async function POST(req: Request) {
  await dbConnect()
  const body = await req.json()
  const product = await Product.create(body)
  return NextResponse.json(product)
}