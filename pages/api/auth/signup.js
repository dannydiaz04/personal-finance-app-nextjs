import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    await dbConnect();

    try {
        const { username, first_name, last_name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create new user from signup
        const user = new User({
            username,
            first_name,
            last_name,
            email,
            password: hashedPassword
        });

        await user.save();
        res.status(201).json({ message: 'User created successfully'});
    } catch (error) {
        console.error('Signup error', error);
        res.status(500).json({ message: `Signup error: ${error.message}` });
    }
}