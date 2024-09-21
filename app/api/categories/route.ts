import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '../../lib/dbConnect';
import { Category } from '../../models/Category';
import { Types } from 'mongoose';

// Define a more specific session type
interface CustomSession {
  user?: {
    id?: string;
    name?: string;
    email?: string;
  };
}

// GET all categories
export async function GET() {
  const session = await getServerSession(authOptions) as CustomSession | null;

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const userId = new Types.ObjectId(session.user.id);
    const userCategories = await Category.find({ userId : userId });
    const categories = userCategories.map(category => category.toObject());
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST new category/subcategory
export async function POST(request: Request) {
  const session = await getServerSession(authOptions) as CustomSession | null;

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const { name, categoryId, target } = await request.json();
    const userId = new Types.ObjectId(session.user.id);

    if (categoryId) {
      // Adding a subcategory
      const category = await Category.findOne({ _id: categoryId, userId: userId });

      if (!category) {
        return NextResponse.json({ error: 'Category not found' }, { status: 404 });
      }
      category.subCategories.push({ name, _id: new Types.ObjectId() });
      await category.save();
      return NextResponse.json(category.toObject(), { status: 201 });
    } else {

      const newCategory = new Category({ 
        name, 
        userId: userId, 
        subCategories: [],
        target: target ? Number(target) : 0
      });
      await newCategory.save();
      return NextResponse.json(newCategory, { status: 201 });
    }
  } catch (error) {
    console.error('Error creating category/subcategory:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE category/subcategory
export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions) as CustomSession | null;

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const url = new URL(request.url);
    const categoryId = url.searchParams.get('categoryId');
    const subcategoryId = url.searchParams.get('subcategoryId');
    const userId = new Types.ObjectId(session.user.id);

    if (subcategoryId) {
      // Deleting a subcategory
      const category = await Category.findOne({ _id: categoryId, userId: userId });
      if (!category) {
        return NextResponse.json({ error: 'Category not found' }, { status: 404 });
      }
      category.subCategories = category.subCategories.filter(
        (sub: any) => sub._id.toString() !== subcategoryId
      );
      await category.save();
      return NextResponse.json({ message: 'Subcategory deleted successfully' });
    } else {
      // Deleting a category
      const deletedCategory = await Category.findOneAndDelete({ _id: categoryId, userId: userId });
      if (!deletedCategory) {
        return NextResponse.json({ error: 'Category not found' }, { status: 404 });
      }
      return NextResponse.json({ message: 'Category deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting category/subcategory:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT (update) category
export async function PUT(request: Request) {
  const session = await getServerSession(authOptions) as CustomSession | null;

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const { id, name, target } = await request.json();
    const userId = new Types.ObjectId(session.user.id);
    const updateData: { name?: string; target?: number } = {};
    if (name !== undefined) updateData.name = name;
    if (target !== undefined) {
      const targetPercentage = Number(target);
      if (isNaN(targetPercentage) || targetPercentage < 0 || targetPercentage > 100) {
        return NextResponse.json({ error: 'Invalid target percentage' }, { status: 400 });
      }
      updateData.target = targetPercentage;
    }

    const updatedCategory = await Category.findOneAndUpdate(
      { _id: id, userId: userId },
      updateData,
      { new: true }
    );
    if (!updatedCategory) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PATCH (bulk update) category targets. Update all the inputs for category targets at once
export async function PATCH(request: Request) {
  const session = (await getServerSession(authOptions)) as CustomSession | null;

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401});
  }

  try {
    await dbConnect();
    const { targets } = await request.json();
    const userId = new Types.ObjectId(session.user.id);

    // Validate the targets array
    if (!Array.isArray(targets) || targets.length === 0) {
      return NextResponse.json({ error: 'Invalid targets array' }, { status: 400});
    }

    // Calculate the total sum of targets
    const totalTarget = targets.reduce((sum, item) => sum + item.target, 0);

    // Allow a small margin of error due to floating-point precision
    if (Math.abs(totalTarget - 100) > 0.01) {
      return NextResponse.json(
        { error: 'Targets of target percentages must sum up to 100%' },
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
          filter: { _id: new Types.ObjectId(categoryId), userId: userId},
          update: { $set: { target } },
        },
      };
    });

    // Execute the bulk update operation
    if (bulkOps.length === 0) {
      await Category.bulkWrite(bulkOps);
    }

    return NextResponse.json({ message: 'Category targets updated successfully' }, { status: 200});
  } catch (error) {
    console.error('Error updating category targets:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500});
  }
}