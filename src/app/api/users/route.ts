import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export const GET = async () => {
  try {
    await dbConnect();
    const users = await User.find().select('name email').lean();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка получения пользователей' }, { status: 500 });
  }
};
