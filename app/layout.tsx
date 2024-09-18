'use client'
import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react'
import { AuthProvider } from '../contexts/AuthContext';
import { Quicksand } from 'next/font/google';

const quicksand = Quicksand({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    variable: '--font-quicksand',
});

export default function RootLayout({ 
    children 
} : { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={`${quicksand.variable} font-sans`}>
                <SessionProvider>
                    <AuthProvider>
                        {children}
                    </AuthProvider>
                </SessionProvider>
            </body>
        </html>
    )
}