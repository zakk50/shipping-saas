import mongoose, { Schema, Document, models } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  department: mongoose.Types.ObjectId;
  role: 'admin' | 'employee' | 'gust';
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    role: { type: String, enum: ['admin', 'employee', 'gust'], default: 'employee' },
  },
  { timestamps: true }
);

const User = models.User || mongoose.model<IUser>('User', UserSchema);
export default User;
