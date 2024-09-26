import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '../../../lib/dbConnect';
import { Expense } from '@/app/models/Expense'
import mongoose from 'mongoose'

interface ExpenseModel extends mongoose.Model<any> {
  getCategoryRemainingAmounts: (userId: string) => Promise<any>;
}

const ExpenseModel = Expense as ExpenseModel;

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    console.log('API route: Fetching category remaining amounts for user:', userId);

    if (!userId) {
      console.log('API route: User ID is missing');
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    console.log('API route: About to call getCategoryRemainingAmounts');
    console.log('API route: Expense model:', Expense);
    console.log('API route: getCategoryRemainingAmounts function:', ExpenseModel.getCategoryRemainingAmounts);

    const categoryRemainingAmounts = await ExpenseModel.getCategoryRemainingAmounts(userId)
    try {
      console.log('API route: getCategoryRemainingAmounts returned:', JSON.stringify(categoryRemainingAmounts, null, 2));
    } catch (error) {
      console.error('Error in getCategoryRemainingAmounts:', error);
    }

    return NextResponse.json(categoryRemainingAmounts)
  } catch (error) {
    console.error('API route: Error fetching category remaining amounts:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}