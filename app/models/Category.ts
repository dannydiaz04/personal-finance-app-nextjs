import mongoose from 'mongoose';

const SubCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subCategories: [SubCategorySchema]
});

export const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);