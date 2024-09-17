import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '../../lib/dbConnect';
import { Category } from '../../models/Category';
import { Types } from 'mongoose'; // Add this import

// Define a more specific session type
interface CustomSession {
  user?: {
    id?: string;
    name?: string;
    email?: string;
  };
}

export async function GET() {
  const session = await getServerSession(authOptions) as CustomSession | null;

  console.log('Session:', session);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!session.user?.id) {
    console.log('No user ID in session');
    return NextResponse.json({ error: 'User ID not found' }, { status: 400 });
  }

  try {
    await dbConnect();
    console.log('Database connected successfully');

    const userId = new Types.ObjectId(session.user.id); // Convert string to ObjectId
    console.log('Searching for categories with userId:', userId);

    const userCategories = await Category.find({ user: userId });
    console.log('Categories found for user:', userCategories);

    return NextResponse.json(userCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
