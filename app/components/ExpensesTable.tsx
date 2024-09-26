import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
}

type SortKey = keyof Omit<Expense, '_id'>;
type SortOrder = 'asc' | 'desc';

export default function ExpensesTable({ expenses, onEdit, onDelete, onAddExpense }: ExpensesTableProps) {
    const [sortKey, setSortKey] = useState<SortKey>('date');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
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
                    onClick={() => onAddExpense()}>
                    Add Expense
                </Button>
            </div>
            <div className="overflow-x-auto">
                <Table className="w-full">
                    <TableHeader>
                        <TableRow className="bg-green-300 opacity-90 hover:bg-green-300 border-b border-gray-700">
                            {(['date', 'amount', 'category', 'subcategory', 'description'] as const).map((key) => (
                                <TableHead 
                                    key={key}
                                    className="text-black font-semibold cursor-pointer py-3 px-4"
                                    onClick={() => handleSort(key)}
                                >
                                    <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                                    <SortIcon columnKey={key} />
                                </TableHead>
                            ))}
                            <TableHead className="text-black font-semibold py-3 px-4">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedExpenses.map((expense, index) => (
                            <TableRow 
                                key={expense._id} 
                                className={`border-b border-gray-700 ${index % 2 === 0 ? 'bg-[#1c2537]' : 'bg-[#0f1729]'}`}
                            >
                                <TableCell className="py-3 px-4">{formatDate(expense.date)}</TableCell>
                                <TableCell className="py-3 px-4">${expense.amount.toFixed(2)}</TableCell>
                                <TableCell className="py-3 px-4">{expense.category}</TableCell>
                                <TableCell className="py-3 px-4">{expense.subcategory}</TableCell>
                                <TableCell className="py-3 px-4">{expense.description}</TableCell>
                                <TableCell className="py-3 px-4">
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
        </div>
    );
}