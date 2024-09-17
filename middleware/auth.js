import jwt from 'jsonwebtoken';

export default function auth(req, res) {
    return new Promise((resolve, reject) => {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            reject(new Error('No token authorized denied'));
            return;
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            resolve();
        } catch(err) {
            reject(new Error('Token is not valid'));
        }
    })
}