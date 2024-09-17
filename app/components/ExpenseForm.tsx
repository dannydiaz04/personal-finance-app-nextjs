'use client'

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

// Define types for our form data and category
type FormData = {
    amount: string;
    category: string;
    subcategory: string;
    date: string;
};

type Category = {
    _id: string;
    name: string;
    subCategories?: { _id: string; name: string; }[];
};

const ExpenseForm = () => {
    const [formData, setFormData] = useState<FormData>({
        amount: '',
        category: '',
        subcategory: '',
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
            console.log('Fetched categories:', data); // Add this line for debugging
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            ...(name === 'category' && { subcategory: '' })
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formData.category || !formData.subcategory) {
            alert('Please select both a category and a subcategory');
            return;
        }
        try {
            const selectedCategory = categories.find(cat => cat._id === formData.category);
            const selectedSubcategory = selectedCategory?.subCategories?.find(sub => sub._id === formData.subcategory);
            if (!selectedCategory || !selectedSubcategory) throw new Error('Invalid category or subcategory');

            const expenseData = {
                ...formData,
                category: selectedCategory.name,
                subcategory: selectedSubcategory.name
            };

            const res = await fetch('/api/expenses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(expenseData),
            });

            if (!res.ok) throw new Error('Failed to submit expense');
            alert('Expense submitted successfully');
            setFormData({ amount: '', category: '', subcategory: '', date: '' });
        } catch (error) {
            console.error('Error submitting expense:', error);
            alert('Error adding expense. Please try again.');
        }
    };

    if (!session) return <div>Please sign in to add expenses.</div>;

    const selectedCategory = categories.find(cat => cat._id === formData.category);

    return (
        <form onSubmit={handleSubmit}>
            <input type="number" name="amount" value={formData.amount} onChange={handleChange} placeholder="Amount" required />
            <select name="category" value={formData.category} onChange={handleChange} required>
                <option value="">Select Category</option>
                {categories.map(category => (
                    <option key={category._id} value={category._id}>{category.name}</option>
                ))}
            </select>
            <select name="subcategory" value={formData.subcategory} onChange={handleChange} required disabled={!formData.category}>
                <option value="">Select Subcategory</option>
                {selectedCategory?.subCategories?.map(subcategory => (
                    <option key={subcategory._id} value={subcategory._id}>{subcategory.name}</option>
                ))}
            </select>
            <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Description" required />
            <input type="date" name="date" value={formData.date} onChange={handleChange} required />
            <button type="submit">Add Expense</button>
        </form>
    );
};

export default ExpenseForm;