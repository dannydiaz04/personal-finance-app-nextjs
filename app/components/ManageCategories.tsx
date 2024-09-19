'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Category } from '@/types/category';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CategoryManagement = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [newCategory, setNewCategory] = useState('');
    const [newSubCategory, setNewSubCategory] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    
    const { data: session } = useSession();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/categories');
            if (!response.ok) throw new Error('Failed to fetch categories');
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories', error);
        }
    };

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newCategory }),
            });
            if (!response.ok) throw new Error('Failed to add category');
            setNewCategory('');
            fetchCategories();
        } catch (error) {
            console.error('Error adding category', error);
        }
    };

    const handleAddSubcategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCategory) return;
        try {
            const response = await fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ categoryId: selectedCategory, name: newSubCategory }),
            });
            if (!response.ok) throw new Error('Failed to add subcategory');;
            fetchCategories();
            setNewSubCategory('');
            setSelectedCategory('');
        } catch (error) {
            console.error('Error adding subcategory:', error);
        }
    };

    const handleDeleteCategory = async (categoryId: string) => {
        try {
            const response = await fetch(`/api/categories?categoryId=${categoryId}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete category');
            fetchCategories();
        } catch (error) {
            console.error('Error deleting category: ', error);
        }
    };

    const handleDeleteSubcategory = async (categoryId: string, subcategoryId: string) => {
        try {
            const response = await fetch(`/api/categories?categoryId=${categoryId}&subcategoryId=${subcategoryId}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete subcategory');
            fetchCategories();
        } catch (error) {
            console.error('Error deleting subcategory:', error);
        }
    };

    return (
        <div className="space-y-8">
            <Card className="bg-gray-800 bg-opacity-50 shadow-2xl backdrop-blur-sm border border-white">
                <CardHeader>
                    <CardTitle className="text-xl font-bold text-white">Add New Category</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAddCategory} className="space-y-4">
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="newCategory" className="text-gray-300">Category Name</Label>
                            <Input
                                id="newCategory"
                                type="text"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                placeholder="New Category"
                                className="bg-gray-700 text-white border-gray-600"
                            />
                        </div>
                        <Button type="submit" className="bg-blue-500 text-white hover:bg-blue-600">Add Category</Button>
                    </form>
                </CardContent>
            </Card>

            <Card className="bg-gray-800 bg-opacity-50 shadow-2xl backdrop-blur-sm border border-white">
                <CardHeader>
                    <CardTitle className="text-xl font-bold text-white">Add New Subcategory</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAddSubcategory} className="space-y-4">
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="categorySelect" className="text-gray-300">Select Category</Label>
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger className="bg-gray-700 text-white border-gray-600">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-700 text-white">
                                    {categories.map((category) => (
                                        <SelectItem key={category._id.toString()} value={category._id.toString()}>{category.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="newSubCategory" className="text-gray-300">Subcategory Name</Label>
                            <Input
                                id="newSubCategory"
                                type="text"
                                value={newSubCategory}
                                onChange={(e) => setNewSubCategory(e.target.value)}
                                placeholder="New Subcategory"
                                className="bg-gray-700 text-white border-gray-600"
                            />
                        </div>
                        <Button type="submit" className="bg-blue-500 text-white hover:bg-blue-600">Add Subcategory</Button>
                    </form>
                </CardContent>
            </Card>

            <Card className="bg-gray-800 bg-opacity-50 shadow-2xl backdrop-blur-sm border border-white">
                <CardHeader>
                    <CardTitle className="text-xl font-bold text-white">Current Categories and Subcategories</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                        {categories.map((category) => (
                            <li key={category._id.toString()} className="bg-gray-700 p-4 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold text-white">{category.name}</span>
                                    <Button onClick={() => handleDeleteCategory(category._id.toString())} variant="destructive" size="sm">Delete</Button>
                                </div>
                                <ul className="mt-2 space-y-2">
                                    {Array.isArray(category.subCategories) && category.subCategories.length > 0 ? (
                                        category.subCategories.map((subcategory) => (
                                            <li key={subcategory._id.toString()} className="flex justify-between items-center bg-gray-600 p-2 rounded">
                                                <span className="text-white">{subcategory.name}</span>
                                                <Button onClick={() => handleDeleteSubcategory(category._id.toString(), subcategory._id.toString())} variant="destructive" size="sm">Delete</Button>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-gray-400">No subcategories for this category. Add some!</li>
                                    )}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
};

export default CategoryManagement;