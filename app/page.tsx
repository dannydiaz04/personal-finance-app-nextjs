'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import Login from './components/Login';

export default function Page() {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated) {
            console.log('Authenticaton State: ', isAuthenticated);
            // Redirect to /pages/home if the user is authenticated
            // router.push('/home');
        }
    }, [isAuthenticated, router]);

    // If not authenticated, show a login form or a welcome message
    return (
        <div>
            <h1>{`Authentication state ${isAuthenticated}`}</h1>
            <Login />
        </div>
    );
}
