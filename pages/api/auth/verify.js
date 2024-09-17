import auth from '../../../middleware/auth';

export default async function verify(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        await auth(req, res);
        res.status(200).json({ message: 'Token is valid', user: req.user });
    } catch (error) {
        console.error('Error verifying token: ', error);
        res.status(401).json({ message: 'Invalid token' })
    }
}