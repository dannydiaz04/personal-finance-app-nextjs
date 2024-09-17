'use client'

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

interface AuthContextType {
    auth: { token: string | null; user: any | null };
    login: (token: string, user: any) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children } : {children: ReactNode }) => {
    const [auth, setAuth] = useState<{ token: string | null; user: any | null }>({ token: null, user: null});

    useEffect(() => {
        // Access localStorage only on the client side
        const token = localStorage.getItem('token');
        const userString = localStorage.getItem('user');
        if ( token && userString ) {
            try {
                const user = JSON.parse(userString);
                setAuth({ token, user });
            } catch (error) {
                console.error('Error parsing user data from localStorage ', error);
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

    const login = (token: string, user: any) => {
        console.log('Login called with: ', { token, user }); // Debug
        setAuth({ token, user });
    };

    const logout = () => {
        console.log('Logout called'); // Debug
        setAuth({ token: null, user: null });
    };

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
        isAuthenticated: !!context.auth.token,
        token: context.auth.token,
        login: context.login,
        logout: context.logout,
        authUser: context.auth.user,
    };
};
