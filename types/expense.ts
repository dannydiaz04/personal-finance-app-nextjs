import { Types } from 'mongoose';

export interface Expense {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  amount: number;
  category: string;
  subcategory: string;
  description: string;
  date: Date;
}
