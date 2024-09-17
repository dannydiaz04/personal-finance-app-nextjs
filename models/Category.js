import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  subCategories: [{ name: { type: String, required: true } }]
});

export const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);