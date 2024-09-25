import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '../../../lib/dbConnect';
import { Expense } from '@/app/models/Expense'
import mongoose from 'mongoose'

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const categoryRemainingAmounts = await Expense.getCategoryRemainingAmounts(new mongoose.Types.ObjectId(userId))

    return NextResponse.json(categoryRemainingAmounts)
  } catch (error) {
    console.error('Error fetching category remaining amounts:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}