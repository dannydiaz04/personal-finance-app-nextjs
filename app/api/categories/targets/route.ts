import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '../../../lib/dbConnect';
import { Category } from '../../../models/Category';
import { Types } from 'mongoose';

// Define a more specific session type
interface CustomSession {
  user?: {
    id?: string;
    name?: string;
    email?: string;
  };
}

// POST to update category targets
export async function POST(request: Request) {
  const session = await getServerSession(authOptions) as CustomSession | null;

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const { targets } = await request.json();
    const userId = new Types.ObjectId(session.user.id);

    // Validate the targets array
    if (!Array.isArray(targets) || targets.length === 0) {
      return NextResponse.json({ error: 'Invalid targets array' }, { status: 400 });
    }

    // Calculate the total sum of targets
    const totalTarget = targets.reduce((sum, item) => sum + item.target, 0);

    // Allow a small margin of error due to floating-point precision
    if (Math.abs(totalTarget - 100) > 0.01) {
      return NextResponse.json(
        { error: 'Sum of target percentages must equal 100%' },
        { status: 400 }
      );
    }

    // Prepare bulk update operations
    const bulkOps = targets.map(({ categoryId, target }: { categoryId: string; target: number }) => {
      if (!Types.ObjectId.isValid(categoryId) || typeof target !== 'number') {
        throw new Error('Invalid category ID or target value');
      }

      return {
        updateOne: {
          filter: { _id: new Types.ObjectId(categoryId), userId: userId },
          update: { $set: { target } },
        },
      };
    });

    // Execute the bulk update operation
    await Category.bulkWrite(bulkOps);

    return NextResponse.json({ message: 'Category targets updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating category targets:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}