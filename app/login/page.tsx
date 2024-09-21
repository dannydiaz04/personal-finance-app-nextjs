// import the login component to render the login page route
'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import Login from '../components/Login';

const login =() => {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated) {
            console.log('Authentication State from the login page: ', isAuthenticated);
            router.push('/home');
        }
    }, [isAuthenticated, router]);

    if (isAuthenticated) {
        return null; // Render nothing while redirecting
    }
    
    return (
        <div>
            <Login />
        </div>
    )
}

export default login;