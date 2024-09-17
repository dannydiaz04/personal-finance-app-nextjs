'use client'

import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ExpenseForm from '../components/ExpenseForm';
import Link from 'next/link';

const Home = () => {
    const { data: session, status } = useSession();
    const router = useRouter();

    React.useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (!session) {
        return <div>No user data available. Please log in again.</div>;
    }

    return (
        <div>
            <h1>Welcome To YOUR Money AND NOT THE BANKSSS</h1>
            <p>Hello, {session.user.name}</p>
            <p>Email: {session.user.email}</p>
            <Link href="/api/auth/signout">
                <button>Logout</button>
            </Link>

            <Link href="/manage-categories">Manage Categories</Link>
            
            <h2>Add New Expense</h2>
            <ExpenseForm />
        </div>
    );
};

export default Home;
