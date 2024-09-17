'use client'
import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react'
import { AuthProvider } from '../contexts/AuthContext';

export default function RootLayout({ children } : { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <SessionProvider>
                    <AuthProvider>
                        {children}
                    </AuthProvider>
                </SessionProvider>
            </body>
        </html>
    )
}