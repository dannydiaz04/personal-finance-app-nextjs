'use client'

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

type FormData = {
    amount: string;
    description: string;
    date: string;
};

type Category = {
    _id: string;
    name: string;
    subCategories?: { _id: string; name: string; }[];
};

const IncomeForm = () => {
    const [formData, setFormData] = useState<FormData>({
        amount: '',
        description: '',
        date: ''
    });
    const [categories, setCategories] = useState<Category[]>([]);
    const { data: session } = useSession();

    useEffect(() => {
        if (session) fetchCategories();
    }, [session]);

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/categories');
            if (!res.ok) throw new Error('Failed to fetch categories');
            const data = await res.json();
            console.log('Fetched categories:', data);
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'amount') {
            // Remove non-numeric characters except for the decimal point
            const numericValue = value.replace(/[^0-9.]/g, '');
            // Ensure only one decimal point
            const parts = numericValue.split('.');
            const formattedValue = parts[0] + (parts.length > 1 ? '.' + parts[1].slice(0, 2) : '');
            setFormData(prev => ({ ...prev, [name]: formattedValue }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const incomeData = {
                amount: parseFloat(formData.amount),
                description: formData.description,
                date: formData.date
            };

            const res = await fetch('/api/incomes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(incomeData),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to submit income');
            }

            const result = await res.json();
            alert('Income submitted successfully');
            setFormData({ amount: '', description: '', date: '' });
        } catch (error) {
            console.error('Error submitting income:', error);
            alert('Error adding income. Please try again.');
        }
    };

    if (!session) return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 p-4">
            <div className="bg-gray-800 bg-opacity-50 p-8 rounded-xl shadow-2xl backdrop-blur-sm">
                <p className="text-white text-center">Please sign in to add income.</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-gray-800 bg-opacity-50 p-8 rounded-xl shadow-2xl backdrop-blur-sm flex flex-col">
                <div className="text-center flex-grow-0">
                    <h2 className="mt-6 text-3xl font-extrabold text-white">Add Income</h2>
                    <p className="mt-2 text-sm text-gray-300">Enter your income details below</p>
                </div>
                <form onSubmit={handleSubmit} className="mt-8 space-y-6 flex-grow flex flex-col justify-between">
                    <div className="rounded-md shadow-sm -space-y-px flex-grow">
                        <div className="relative">
                            <label htmlFor="amount" className="sr-only">Amount</label>
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-400 sm:text-sm">$</span>
                            </div>
                            <input
                                id="amount"
                                name="amount"
                                type="text"
                                inputMode="decimal"
                                pattern="^\d*(\.\d{0,2})?$"
                                required
                                className="appearance-none rounded-none relative block w-full pl-7 px-3 py-2 border border-gray-600 placeholder-gray-400 text-white rounded-t-md focus:outline-none focus:ring-blue-400 focus:border-green-400 focus:z-10 sm:text-sm bg-gray-700 bg-opacity-50"
                                placeholder="0.00"
                                value={formData.amount}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="sr-only">Description</label>
                            <input
                                id="description"
                                name="description"
                                type="text"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-400 text-white focus:outline-none focus:ring-blue-400 focus:border-green-400 focus:z-10 sm:text-sm bg-gray-700 bg-opacity-50"
                                placeholder="Description"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="date" className="sr-only">Date</label>
                            <input
                                id="date"
                                name="date"
                                type="date"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-400 text-white rounded-b-md focus:outline-none focus:ring-blue-400 focus:border-green-400 focus:z-10 sm:text-sm bg-gray-700 bg-opacity-50"
                                value={formData.date}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="flex-grow-0">
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-green-300 hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-400"
                        >
                            Add Income
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default IncomeForm;