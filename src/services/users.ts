import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export const fetchUsers = async () => {
  await dbConnect();
  const users = await User.find().select('name email role').lean();
  return users;
};
