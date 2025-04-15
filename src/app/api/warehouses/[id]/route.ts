// app/api/warehouses/[id]/route.ts
import dbConnect from '@/lib/dbConnect';
import Warehouse from '@/models/warehouse';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const body = await req.json();
  const updated = await Warehouse.findByIdAndUpdate(params.id, body, { new: true });
  return Response.json(updated);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  await Warehouse.findByIdAndDelete(params.id);
  return Response.json({ success: true });
}
