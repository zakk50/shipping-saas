// app/api/products/[id]/route.ts
import { NextRequest } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/product';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const body = await req.json();

  const updated = await Product.findByIdAndUpdate(
    params.id,
    { storageId: body.storageId },
    { new: true }
  );

  if (!updated) {
    return new Response('Товар не найден', { status: 404 });
  }

  return Response.json(updated);
}
