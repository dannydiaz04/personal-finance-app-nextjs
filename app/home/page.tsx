'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import ExpenseForm from '../components/ExpenseForm';
import Link from 'next/link';
import axios from 'axios';

const Home = () => {
    const { isAuthenticated, token, authUser, logout } = useAuth();
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log('Authentication State:', { isAuthenticated, authUser, token });

        if (isAuthenticated && authUser && token) {
            verifyTokenAndFetchUser();
        } else {
            setLoading(false);
        }
    }, [isAuthenticated, authUser, token]);

    const verifyTokenAndFetchUser = async () => {
        setLoading(true);
        setError(null);

        if (!isAuthenticated || !authUser || !token) {
            logout();
            router.push('/login');
            return;
        }

        try {
            // Verify token
            await axios.get('/api/auth/verify', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Fetch user data
            const response = await axios.get(`/api/auth/user/${authUser.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(response.data);
        } catch (error) {
            console.error('Error during token verification or fetching user data:', error);
            setError('Failed to load user data. Please try logging in again.');
            logout();
            router.push('/login');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!authUser) {
        return <div>No user data available. Please log in again.</div>;
    }

    return (
        <div>
            <h1>Welcome To YOUR Money AND NOT THE BANKSSS</h1>
            <p>Hello, {authUser.first_name} {authUser.last_name}</p>
            <p>Username: {authUser.username}</p>
            <p>Email: {authUser.email}</p>
            <button onClick={handleLogout}>Logout</button>

            <Link href="/manage-categories">Manage Categories</Link>
            
            <h2>Add New Expense</h2>
            <ExpenseForm />
        </div>
    );
};

export default Home;
