'use client'

import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit2Icon, TrashIcon, ChevronUpIcon, ChevronDownIcon } from 'lucide-react'

interface Expense {
    _id: string;
    date: string;
    amount: number;
    category: string;
    subcategory: string;
    description: string;
}

interface ExpensesTableProps {
    expenses: Expense[];
    onEdit: (expense: Expense) => void;
    onDelete: (id: string) => void;
    onAddExpense: () => void;
}

type SortKey = keyof Omit<Expense, '_id'>;
type SortOrder = 'asc' | 'desc';

export default function ExpensesTable({ expenses, onEdit, onDelete, onAddExpense }: ExpensesTableProps) {
    const [sortKey, setSortKey] = useState<SortKey>('date');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const sortedExpenses = [...expenses].sort((a, b) => {
        if (a[sortKey] < b[sortKey]) return sortOrder === 'asc' ? -1 : 1;
        if (a[sortKey] > b[sortKey]) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    const handleSort = (key: SortKey) => {
        if (key === sortKey) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortOrder('asc');
        }
    };

    const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
        if (columnKey !== sortKey) return null;
        return sortOrder === 'asc' ? <ChevronUpIcon className="w-4 h-4 inline-block ml-1" /> : <ChevronDownIcon className="w-4 h-4 inline-block ml-1" />;
    };

    return (
        <div className="w-full bg-[#0f1729] text-white p-4">
            <div className="mb-4 flex justify-between items-center">
                <div className="flex-1 max-w-sm">
                    <Select onValueChange={(value) => handleSort(value as SortKey)}>
                        <SelectTrigger className="w-full bg-[#1c2537] text-white border-gray-700">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1c2537] text-white border-gray-700">
                            {(['date', 'amount', 'category', 'subcategory', 'description'] as const).map((key) => (
                                <SelectItem key={key} value={key} className="hover:bg-[#2a3547]">
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Button 
                    className="bg-[#4f46e5] hover:bg-[#4338ca] text-white"
                    onClick={onAddExpense}>
                    Add Expense
                </Button>
            </div>
            <div className="hidden md:block overflow-x-auto">
                <Table className="w-full">
                    <TableHeader>
                        <TableRow className="bg-green-300 opacity-90 hover:bg-green-300 border-b border-gray-700">
                            {(['date', 'amount', 'category', 'subcategory', 'description'] as const).map((key) => (
                                <TableHead 
                                    key={key}
                                    className="text-black font-bold cursor-pointer py-3 px-4 text-[18px] w-1/6 break-words"
                                    onClick={() => handleSort(key)}
                                >
                                    <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                                    <SortIcon columnKey={key} />
                                </TableHead>
                            ))}
                            <TableHead className="text-black text-center font-bold py-3 px-4 text-[18px] w-1/6 break-words">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedExpenses.map((expense, index) => (
                            <TableRow 
                                key={expense._id} 
                                className={`border-b border-gray-700 ${index % 2 === 0 ? 'bg-[#1c2537]' : 'bg-[#0f1729]'}`}
                            >
                                <TableCell className="py-3 px-4 text-[16px] break-words w-1/12">{formatDate(expense.date)}</TableCell>
                                <TableCell className="py-3 px-4 text-green-500 font-bold text-[16px] break-words w-1/12">${expense.amount.toFixed(2)}</TableCell>
                                <TableCell className="py-3 px-4 text-[16px] break-words w-1/12">{expense.category}</TableCell>
                                <TableCell className="py-3 px-4 text-[16px] break-words w-1/12">{expense.subcategory}</TableCell>
                                <TableCell className="py-3 px-4 text-[16px] break-words w-1/3">{expense.description}</TableCell>
                                <TableCell className="py-3 px-4 w-1/6">
                                    <div className="flex space-x-2">
                                        <Button
                                            onClick={() => onEdit(expense)}
                                            className="hover:bg-green-300 text-white hover:text-black"
                                        >
                                            <Edit2Icon className="w-4 h-4 mr-1" />
                                            Edit
                                        </Button>
                                        <Button
                                            onClick={() => onDelete(expense._id)}
                                            variant="destructive"
                                            className="hover:bg-red-700 text-white"
                                        >
                                            <TrashIcon className="w-4 h-4 mr-1" />
                                            Delete
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <div className="md:hidden space-y-4">
                {sortedExpenses.map((expense) => (
                    <Card key={expense._id} className="bg-[#1c2537] text-white border-gray-700">
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>{formatDate(expense.date)}</span>
                                <span className="text-green-500 font-bold">${expense.amount.toFixed(2)}</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p><strong>Category:</strong> {expense.category}</p>
                            <p><strong>Subcategory:</strong> {expense.subcategory}</p>
                            <p><strong>Description:</strong> {expense.description}</p>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button
                                onClick={() => onEdit(expense)}
                                className="hover:bg-green-300 text-white hover:text-black"
                            >
                                <Edit2Icon className="w-4 h-4 mr-1" />
                                Edit
                            </Button>
                            <Button
                                onClick={() => onDelete(expense._id)}
                                variant="destructive"
                                className="hover:bg-red-700 text-white"
                            >
                                <TrashIcon className="w-4 h-4 mr-1" />
                                Delete
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}