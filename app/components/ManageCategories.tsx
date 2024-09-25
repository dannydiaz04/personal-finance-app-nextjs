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
    const [categoryTargets, setCategoryTargets] = useState<{ [key: string]: number }>({});
    const [totalPercentage, setTotalPercentage] = useState(0);

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

            // Initialize category targets with existing targets
            const initialTargets: { [key: string]: number } = {};
            let total = 0;
            data.forEach((category: Category) => {
                const target = category.target || 0;
                initialTargets[category._id.toString()] = target;
                total += target;
            });
            setCategoryTargets(initialTargets);
            setTotalPercentage(total);
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
            if (!response.ok) throw new Error('Failed to add subcategory');
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

    const handleTargetChange = (categoryId: string, newTarget: number) => {
        if (newTarget < 0 || newTarget > 100) {
            alert("Please enter a valid percentage between 0 and 100.");
            return;
        }

        const newTargets = { ...categoryTargets };
        newTargets[categoryId] = Number(newTarget);
        setCategoryTargets(newTargets);

        // Calculate total percentage
        const total = Object.values(newTargets).reduce((sum, value) => sum + value, 0);
        setTotalPercentage(total);
    };

    const handleSubmitTargets = async () => {
        if (totalPercentage !== 100) {
            alert(`The total percentage must equal 100%. Current total: ${totalPercentage.toFixed(2)}%`);
            return;
        }

        try {
            const targetData = Object.keys(categoryTargets).map(id => ({
                categoryId: id,
                target: categoryTargets[id],
            }));

            const response = await fetch('/api/categories/targets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ targets: targetData }),
            });
            if (!response.ok) throw new Error('Failed to update category targets');
            alert('Category targets updated successfully!');
            fetchCategories();
        } catch (error) {
            console.error('Error updating category targets', error);
            alert('Failed to update category targets. Please try again.');
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
                        <Button type="submit" className="bg-green-300 text-black hover:bg-green-400">Add Category</Button>
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
                        <Button type="submit" className="bg-green-300 text-black hover:bg-green-400 transition-colors duration-400">Add Subcategory</Button>
                    </form>
                </CardContent>
            </Card>

            <Card className="bg-gray-800 bg-opacity-50 shadow-2xl backdrop-blur-sm border border-white">
                <CardHeader>
                    <CardTitle className="text-xl font-bold text-white">Current Categories and Subcategories</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className={`mb-4 p-2 rounded ${totalPercentage > 100 ? 'bg-red-600' : 'bg-gray-700'}`}>
                        <p className="text-white">
                            Current total: <span className="font-bold text-green-300">{totalPercentage.toFixed(0)}%</span>
                            {totalPercentage > 100 && " (Exceeds 100%)"}
                        </p>
                    </div>
                    <ul className="space-y-4">
                        {categories.map((category) => (
                            <li key={category._id.toString()} className="bg-gray-700 p-4 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold text-white">{category.name}</span>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-white">Current: <span className="text-green-300">{category.target?.toFixed(0) || '0'}%</span></span>
                                        <Input
                                            type="number"
                                            value={categoryTargets[category._id.toString()] || 0}
                                            onChange={(e) => {
                                                const newValue = parseFloat(e.target.value);
                                                handleTargetChange(category._id.toString(), newValue);
                                            }}
                                            min="0"
                                            max="100"
                                            step="1"
                                            className="w-20 bg-gray-600 text-white border-gray-500"
                                        />
                                        <span className="text-white">%</span>
                                        <Button onClick={() => handleDeleteCategory(category._id.toString())} variant="destructive" size="sm">Delete</Button>
                                    </div>
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
                    <div className="mt-4">
                        <Button onClick={handleSubmitTargets} className="bg-blue-500 text-white hover:bg-blue-600">Submit Targets</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default CategoryManagement;