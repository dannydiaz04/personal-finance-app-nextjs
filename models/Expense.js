import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  subcategory: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
});

export const Expense = mongoose.models.Expense || mongoose.model('Expense', ExpenseSchema);