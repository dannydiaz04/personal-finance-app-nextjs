import dbConnect from '../../../../app/lib/dbConnect';
import User from '../../../../app/models/User';
import auth from '../../../../middleware/auth';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    await dbConnect();

    try {
        await auth(req, res);

        const { id } = req.query;
        console.log('User ID: ', id);
        const user = await User.findById(id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found'})
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user in the API[id]: ', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}
