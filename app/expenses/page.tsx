'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import ExpensesTable from '../components/ExpensesTable';

interface Expense {
    _id: string;
    amount: number;
    category: string;
    subcategory: string;
    description: string;
    date: Date;
}

const ExpensesPage = () => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
    const {data: session } = useSession();

    useEffect(() => {
        if (session) {
            fetchExpenses();
        }
    }, [session]);

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
            const response = await fetch('/api/expenses', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify(editingExpense),
        });

        if (!response.ok) throw new Error('Failed to update expense');
        setEditingExpense(null);
        fetchExpenses();
        } catch (error){
            console.error('Error updating expense:', error);
        }    
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this expense?')) {
            try {
                const response = await fetch(`/api/expenses?id=${id}`, {method: 'DELETE'});
                if (!response.ok) throw new Error('Failed to delete expense');
                fetchExpenses();
            } catch (error) {
                console.error('Error deleting expense:', error);
            }
        }
    };

    return (
        <div>
            <h2>Expenses</h2>
            <ExpensesTable
                expenses={expenses}
                onEdit={handleEditExpense}
                onDelete={handleDelete}
            />

            {editingExpense && (
                <form onSubmit={handleUpdate}>
                    <input 
                        type="date"
                        value={editingExpense.date.split('T')[0]}
                        onChange={(e) => setEditingExpense({...editingExpense, date: new Date(e.target.value)}
                            )}
                    />
                    <input 
                        type="text"
                        value={editingExpense.category}
                        onChange={(e) => setEditingExpense({...editingExpense, category: e.target.value })}
                    />
                    <input 
                        type="text"
                        value={editingExpense.subcategory}
                        onChange={(e) => setEditingExpense({...editingExpense, subcategory: e.target.value})}
                    />
                    <input 
                        type="text"
                        value={editingExpense.amount}
                        onChange={(e) => setEditingExpense({...editingExpense, amount: parseFloat(e.target.value)})}
                    />
                    <input 
                        type="text"
                        value={editingExpense.description}
                        onChange={(e) => setEditingExpense({...editingExpense, description: e.target.value})}
                    />

                    <button type="submit">Update</button>
                    <button type="button" onClick={() => setEditingExpense(null)}>Cancel</button>
                </form>
            )}
        </div>
    );
};

export default ExpensesPage;