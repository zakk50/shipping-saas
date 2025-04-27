// app/api/products/route.ts
import { NextRequest } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/product';

export async function GET(req: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const storageId = searchParams.get('storageId');
  const search = searchParams.get('search'); // добавили поддержку поиска

  const filter: any = {};
  if (storageId) filter.storageId = storageId;

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { sku: { $regex: search, $options: 'i' } },
    ];
  }

  const products = await Product.find(filter).populate('storageId');
  return Response.json(products);
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const body = await req.json();
  const created = await Product.create(body);
  return Response.json(created);
}
