'use client'

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import FinanceFormsContainer from '../components/FinanceFormsContainer';
import { Session } from 'next-auth';

interface CustomSession extends Session {
  user: {
    first_name?: string;
    last_name?: string;
    username?: string;
    email?: string | null;
  }
}

const Home = () => {
    const { data: session, status } = useSession() as { data: CustomSession | null, status: string };
    const router = useRouter();
    const [greeting, setGreeting] = useState('');
    const [emoji, setEmoji] = useState('');

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }

        const greetings = [
            "Welcome to YOUR Money, Not the Banks'!",
            "Ready to Outsmart Your Wallet?",
            "Financial Wizardry Awaits!",
            "Time to Make Your Money Dance!",
            "Let's Turn Pennies into Prosperity!"
        ];
        const emojis = ['💰', '🚀', '🧙‍♂️', '💃', '✨'];
        
        setGreeting(greetings[Math.floor(Math.random() * greetings.length)]);
        setEmoji(emojis[Math.floor(Math.random() * emojis.length)]);
    }, [status, router]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800">
                <div className="text-white text-2xl animate-pulse">Loading your financial universe...</div>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800">
                <div className="text-white text-2xl">No user data available. Please log in again.</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800">
            <Navbar />
            <div className="pt-16 text-white p-8">
                <div className="max-w-6xl mx-auto space-y-8">
                    <div className="text-center space-y-4"> {/* Increased height to 48 (12rem) */}
                        <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 animate-pulse mb-12 z-50 relative h-42">
                            {greeting} <span className="text-white">{emoji}</span>
                        </h1>
                        <p className="text-3xl md:text-4xl text-gray-300 mb-8">
                            Hello, {session?.user?.first_name || 'User'}, you financial mastermind, you!
                        </p>
                    </div>
                    <FinanceFormsContainer />
                </div>
            </div>
        </div>
    );
}

export default Home;