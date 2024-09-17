'use client'

import React, { createContext, useContext, ReactNode } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { User } from '@/types/user';

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const { data: session, status } = useSession();
  
    const login = async (email: string, password: string) => {
        console.log('Login attempt with:', { email, password: password ? password : undefined });
        
        if (!email || !password) {
            console.error('Login attempted with missing email or password');
            throw new Error('Email and password are required');
        }

        try {
            const result = await signIn('credentials', { 
                redirect: false, 
                email, 
                password 
            });

            console.log('SignIn result:', JSON.stringify(result, null, 2));

            if (result?.error) {
                console.error('SignIn error:', result.error);
                throw new Error(result.error);
            }

            if (!result?.ok) {
                console.error('SignIn failed but no error was provided');
                throw new Error('Sign in failed');
            }

            // If successful, you might want to refresh the session here
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const logout = async () => {
        await signOut({ redirect: false });
    };

    const user = session?.user as User | null;

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
