'use client'

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

// Update the User interface to match your actual user object structure
export interface User {
    _id: string;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
}

interface AuthContextType {
    auth: { token: string | null; user: User | null };
    login: (token: string, user: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [auth, setAuth] = useState<{ token: string | null; user: User | null }>({ token: null, user: null });

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userString = localStorage.getItem('user');
        if (token && userString) {
            try {
                const user = JSON.parse(userString) as User;
                if (isValidUser(user)) {
                    setAuth({ token, user });
                } else {
                    console.error('Invalid user data in localStorage');
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            } catch (error) {
                console.error('Error parsing user from localStorage', error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
    }, []);

    useEffect(() => {
        if (auth.token && auth.user) {
            localStorage.setItem('token', auth.token);
            localStorage.setItem('user', JSON.stringify(auth.user));
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    }, [auth]);

    const login = (token: string, user: User) => {
        if (!isValidUser(user)) {
            console.error('Invalid user data:', user);
            return;
        }
        console.log('Login called with:', { token, user }); // Debug
        setAuth({ token, user });
    };

    const logout = () => {
        console.log('Logout called'); // Debug
        setAuth({ token: null, user: null });
    };

    // Update the isValidUser function to check for _id instead of id
    const isValidUser = (user: any): user is User => {
        return user &&
            typeof user._id === 'string' &&
            typeof user.username === 'string' &&
            typeof user.email === 'string' &&
            typeof user.first_name === 'string' &&
            typeof user.last_name === 'string';
    }

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return {
        isAuthenticated: !!context.auth.token && !!context.auth.user,
        token: context.auth.token,
        login: context.login,
        logout: context.logout,
        authUser: context.auth.user
    };
};
