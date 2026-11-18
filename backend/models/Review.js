import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userName: { type: String, default: 'Verified Customer' },
  userAvatar: { type: String, default: '' },
  business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Review', ReviewSchema);
