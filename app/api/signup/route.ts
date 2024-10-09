import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../lib/dbConnect';
import User from '../../models/User';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        const { username, first_name, last_name, email, password } = await req.json();

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email or username already exists'},
                { status: 400 }
            );
        }

        // Create new user
        const newUser = new User({
            username,
            first_name,
            last_name,
            email,
            password,
        });

        await newUser.save();

        // Return success response without sending password
        return NextResponse.json({
            message: 'User created successfully',
            user : {
                id: newUser._id,
                username: newUser.username,
                first_name: newUser.first_name,
                last_name: newUser.last_name,
                email: newUser.email,
            },
        },
        { status: 201 }
    );
    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}