import { NextResponse, NextRequest } from 'next/server';
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

// GET: Fetch all expenses for the user
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions) as CustomSession | null;
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const expenses = await Expense.find({ user_id: new Types.ObjectId(session.user.id) });
    return NextResponse.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Create a new expense
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

// PUT: update an existing expense
export async function PUT(request: Request) {
  const session = await getServerSession(authOptions) as CustomSession | null;
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing Expense ID' }, { status: 400 });
    }
    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: id, user_id: new Types.ObjectId(session.user.id ) },
      updateData,
      { new: true }
    );

    if (!updatedExpense) {
      return NextResponse.json({ error: 'Expense not found or unauthorized' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Expense updated successfully', expense: updatedExpense });
  } catch (error) {
    console.error('Error updating expense:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE: Delete an expense
export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions) as CustomSession | null;
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing Expense ID' }, { status: 400 });
    }

    const deletedExpense = await Expense.findOneAndDelete({
      _id: id,
      user_id: new Types.ObjectId(session.user.id)
    });

    if (!deletedExpense) {
      return NextResponse.json({ error: 'Expense not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}