import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '../../lib/dbConnect';
import { Expense } from '../../models/Expense'; // You'll need to create this model
import { Types } from 'mongoose'; // Add this import

// Define a custom session type that matches your auth configuration
interface CustomSession {
  user: {
    id: string;
    name?: string;
    email?: string;
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions) as CustomSession | null;

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();

    const body = await request.json();
    
    // Validate the required fields
    if (!body.amount || !body.category || !body.subcategory || !body.date || !body.description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create the new expense object
    const newExpense = new Expense({
      user_id: new Types.ObjectId(session.user.id),
      amount: parseFloat(body.amount),
      category: body.category,
      subcategory: body.subcategory,
      date: new Date(body.date),
      description: body.description
    });

    // Save the new expense to the database
    await newExpense.save();

    return NextResponse.json({ message: 'Expense created successfully', expense: newExpense }, { status: 201 });
  } catch (error) {
    console.error('Error creating expense:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}