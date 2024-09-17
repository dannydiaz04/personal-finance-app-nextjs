'use client'

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

// Define types for our form data and category
type FormData = {
    amount: string;
    category: string;
    subcategory: string;
    description: string;
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
        description: '',
        date: ''
    });
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { token } = useAuth();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get('/api/categories', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setCategories(response.data);
        } catch (err) {
            setError('Failed to fetch categories');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'category') {
            setFormData(prev => ({ ...prev, subcategory: '' }));
        }
    };

    const handleSubmitExpense = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formData.category || !formData.subcategory) {
            alert('Please select both a category and a subcategory');
            return;
        }
        try {
            const selectedCategory = categories.find(cat => cat._id === formData.category);
            if (!selectedCategory) {
                throw new Error('Invalid category not found');
            }

            const selectedSubcategory = selectedCategory.subCategories
                ? selectedCategory.subCategories.find(sub => sub._id === formData.subcategory) 
                : null;
            if (!selectedSubcategory) {
                throw new Error('Selected subcategory not found');
            }

            const expenseData = {
                ...formData,
                category: selectedCategory.name,
                subcategory: selectedSubcategory.name
            };

            console.log('Submitting expense:', expenseData);

            await axios.post('/api/expenses', expenseData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            alert('Expense submitted successfully');
            // Reset form or redirect to another page
        } catch (error) {
            console.error('Error submitting expense', error);
            alert('Error adding expense. Please try again.');
        }
            
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const selectedCategory = categories.find(cat => cat._id === formData.category);

    return (
        <form onSubmit={handleSubmitExpense}>
            <input
                type="number"
                name="amount"
                value={formData.amount}
                placeholder="Amount"
                required
            />
            <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
            >
                <option value="">Select Category</option>
                {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                        {category.name}
                    </option>
                ))}
            </select>
            <select
                name="subcategory"
                value={formData.subcategory}
                onChange={handleInputChange}
                required
                disabled={!formData.category}
            >
                <option value="">Select Subcategory</option>
                {selectedCategory && selectedCategory.subCategories &&
                selectedCategory.subCategories.map((subcategory) => (
                    <option key={subcategory._id} value={subcategory._id}>
                        {subcategory.name}
                    </option>
                ))}
            </select>
            <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
            />
            <button type="submit">Add Expense</button>
        </form>
    );
};

export default ExpenseForm;