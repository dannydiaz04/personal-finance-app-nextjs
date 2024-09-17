import dbConnect from '../../../lib/dbConnect'
import User from '../../../models/User'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    await dbConnect();

    try {
        const { email, password } = req.body;

        // find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // compare password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email},
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        const userData = {
            id: user._id.toString(),
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
        };

        res.status(200).json({ token, user: userData });
    } catch (error) {
        console.error('Error during login: ', error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
}
