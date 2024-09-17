import { NextResponse } from 'next/server';
import dbConnect from '../../lib/dbConnect';
import User from '../../models/User';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
    await dbConnect();

    const { email, password } = await req.json();

    try {
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
            expiresIn: '7d',
        });

        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;

        return NextResponse.json({ token, user: userWithoutPassword });
    } catch (error) {
        console.error('Login error:', error);
    }

}

