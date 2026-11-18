import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, default: '' },
  avatar: { type: String, default: '' },
  role: { type: String, enum: ['user', 'owner', 'admin'], default: 'user' },
  status: { type: String, enum: ['Active', 'Banned'], default: 'Active' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', UserSchema);
