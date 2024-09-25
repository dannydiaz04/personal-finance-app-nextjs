import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '../../lib/dbConnect';
import { Income } from '../../models/Income'; // Import the Income model
import { Types } from 'mongoose'; // Add this import

// Define a custom session type that matches your auth configuration
interface CustomSession {
  user: {
    id: string;
    name?: string;
    email?: string;
  }
}

// GET: Fetch all incomes for the user
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions) as CustomSession | null;
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const incomes = await Income.find({ user_id: new Types.ObjectId(session.user.id) });
    return NextResponse.json(incomes);
  } catch (error) {
    console.error('Error fetching incomes:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Create a new income
export async function POST(request: Request) {
  const session = await getServerSession(authOptions) as CustomSession | null;

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();

    const body = await request.json();
    
    // Validate the required fields
    if (!body.amount || !body.description || !body.date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create the new income object
    const newIncome = new Income({
      user_id: new Types.ObjectId(session.user.id),
      amount: parseFloat(body.amount),
      description: body.description,
      date: new Date(body.date)
    });

    // Save the new income to the database
    await newIncome.save();

    return NextResponse.json({ message: 'Income created successfully', income: newIncome }, { status: 201 });
  } catch (error) {
    console.error('Error creating income:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT: update an existing income
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
      return NextResponse.json({ error: 'Missing Income ID' }, { status: 400 });
    }
    const updatedIncome = await Income.findOneAndUpdate(
      { _id: id, user_id: new Types.ObjectId(session.user.id) },
      updateData,
      { new: true }
    );

    if (!updatedIncome) {
      return NextResponse.json({ error: 'Income not found or unauthorized' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Income updated successfully', income: updatedIncome });
  } catch (error) {
    console.error('Error updating income:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE: Delete an income
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
      return NextResponse.json({ error: 'Missing Income ID' }, { status: 400 });
    }

    const deletedIncome = await Income.findOneAndDelete({
      _id: id,
      user_id: new Types.ObjectId(session.user.id)
    });

    if (!deletedIncome) {
      return NextResponse.json({ error: 'Income not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Income deleted successfully' });
  } catch (error) {
    console.error('Error deleting income:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}