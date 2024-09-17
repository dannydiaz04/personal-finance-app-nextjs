require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/categories');
const expenseRoutes = require('./routes/expenses');

nextApp.prepare().then(() => {
    const app = express();

    app.use(cors());
    app.use(express.json());

    mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

    //auth for login
    app.use('/api/auth', authRoutes);

    //category routes
    app.use('/api/categories', categoryRoutes);

    //expense routes
    app.use('/api/expenses', expenseRoutes);

    // handle all other routes with next.js
    app.all('*', (req, res) => {
        return handle(req, res);
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
});