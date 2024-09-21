import mongoose from 'mongoose';

const SubCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subCategories: [SubCategorySchema],
  target: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 0,
    get: (v: number) => parseFloat(v.toFixed(2)),
    set: (v: number) => parseFloat(v.toFixed(2))
  }
});

export const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);