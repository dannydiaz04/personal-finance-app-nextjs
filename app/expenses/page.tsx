'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ExpensesTable from '@/app/components/ExpensesTable'
import Navbar from '@/app/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface Expense {
    _id: string;
    amount: number;
    category: string;
    subcategory: string;
    description: string;
    date: string;
}

interface CustomSession {
    user: {
        first_name?: string;
        last_name?: string;
        username?: string;
        email?: string | null;
    }
}

export default function ExpensesPage() {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
    const { data: session, status } = useSession() as { data: CustomSession | null, status: string };
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (session) {
            fetchExpenses();
        }
    }, [session, status, router]);

    async function fetchExpenses() {
        try {
            const response = await fetch('/api/expenses');
            if (!response.ok) throw new Error('Failed to fetch expenses');
            const data = await response.json();
            setExpenses(data);
        } catch (error) {
            console.error('Error fetching expenses:', error);
        }
    }

    const handleEditExpense = (expense: Expense) => {
        setEditingExpense(expense);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingExpense) return;

        try {
            const response = await fetch(`/api/expenses`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: editingExpense._id,
                    amount: editingExpense.amount,
                    category: editingExpense.category,
                    subcategory: editingExpense.subcategory,
                    description: editingExpense.description,
                    date: editingExpense.date
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update expense');
            }

            const updatedExpense = await response.json();
            setExpenses(expenses.map(exp => exp._id === updatedExpense.expense._id ? updatedExpense.expense : exp));
            setEditingExpense(null);
        } catch (error) {
            console.error('Error updating expense:', error);
            // You might want to show an error message to the user here
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this expense?')) {
            try {
                const response = await fetch(`/api/expenses?id=${id}`, { method: 'DELETE' });
                if (!response.ok) throw new Error('Failed to delete expense');
                fetchExpenses();
            } catch (error) {
                console.error('Error deleting expense:', error);
            }
        }
    };

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
        <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800">
            <Navbar />
            <main className="pt-20 text-white p-8">
                <div className="max-w-6xl mx-auto space-y-8">
                    <div className="text-center space-y-4">
                        <p className="text-xl md:text-2xl text-gray-300">
                            Managing your finances, {session.user.first_name || 'financial wizard'}
                        </p>
                    </div>

                    <Card className="bg-gray-800 bg-opacity-50 shadow-2xl backdrop-blur-sm border border-white">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-center text-black-300">Expense List</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ExpensesTable
                                expenses={expenses}
                                onEdit={handleEditExpense}
                                onDelete={handleDelete}
                            />
                        </CardContent>
                    </Card>

                    <Dialog open={!!editingExpense} onOpenChange={() => setEditingExpense(null)}>
                        <DialogContent className="bg-gray-800 text-white">
                            <DialogHeader>
                                <DialogTitle className="text-blue-300">Edit Expense</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleUpdate} className="space-y-4">
                                <div className="grid w-full items-center gap-1.5">
                                    <Label htmlFor="date" className="text-gray-300">Date</Label>
                                    <Input
                                        type="date"
                                        id="date"
                                        value={editingExpense?.date.split('T')[0]}
                                        onChange={(e) => setEditingExpense({...editingExpense!, date: e.target.value})}
                                        className="bg-gray-700 text-white border-gray-600"
                                    />
                                </div>
                                <div className="grid w-full items-center gap-1.5">
                                    <Label htmlFor="category" className="text-gray-300">Category</Label>
                                    <Input
                                        type="text"
                                        id="category"
                                        value={editingExpense?.category}
                                        onChange={(e) => setEditingExpense({...editingExpense!, category: e.target.value})}
                                        className="bg-gray-700 text-white border-gray-600"
                                    />
                                </div>
                                <div className="grid w-full items-center gap-1.5">
                                    <Label htmlFor="subcategory" className="text-gray-300">Subcategory</Label>
                                    <Input
                                        type="text"
                                        id="subcategory"
                                        value={editingExpense?.subcategory}
                                        onChange={(e) => setEditingExpense({...editingExpense!, subcategory: e.target.value})}
                                        className="bg-gray-700 text-white border-gray-600"
                                    />
                                </div>
                                <div className="grid w-full items-center gap-1.5">
                                    <Label htmlFor="amount" className="text-gray-300">Amount</Label>
                                    <Input
                                        type="number"
                                        id="amount"
                                        value={editingExpense?.amount}
                                        onChange={(e) => setEditingExpense({...editingExpense!, amount: parseFloat(e.target.value)})}
                                        className="bg-gray-700 text-white border-gray-600"
                                    />
                                </div>
                                <div className="grid w-full items-center gap-1.5">
                                    <Label htmlFor="description" className="text-gray-300">Description</Label>
                                    <Input
                                        type="text"
                                        id="description"
                                        value={editingExpense?.description}
                                        onChange={(e) => setEditingExpense({...editingExpense!, description: e.target.value})}
                                        className="bg-gray-700 text-white border-gray-600"
                                    />
                                </div>
                                <DialogFooter>
                                    <Button type="submit" className="bg-blue-500 text-white hover:bg-blue-600">Update</Button>
                                    <Button type="button" variant="outline" onClick={() => setEditingExpense(null)} className="bg-gray-700 text-white hover:bg-gray-600">Cancel</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </main>
        </div>
    );
}