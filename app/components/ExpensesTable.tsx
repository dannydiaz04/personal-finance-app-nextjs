import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

export default function ExpensesTable({ expenses, onEdit, onDelete }: ExpensesTableProps) {
    const [sortKey, setSortKey] = useState<SortKey>('date');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // This will format the date as YYYY-MM-DD
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
        <div className="w-full">
            <style jsx global>{`
                :root {
                    --neon-blue: #00f3ff;
                }
            `}</style>
            <div className="mb-4 md:hidden">
                <Select onValueChange={(value) => handleSort(value as SortKey)}>
                    <SelectTrigger className="w-full bg-gray-800 text-white border-gray-700">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 text-white border-gray-700">
                        {(['date', 'amount', 'category', 'subcategory', 'description'] as const).map((key) => (
                            <SelectItem key={key} value={key} className="hover:bg-gray-700">
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="hidden md:block overflow-auto">
                <Table className="w-full border-collapse bg-black text-white">
                    <TableHeader>
                        <TableRow className="border-b border-neon-blue">
                            {(['date', 'amount', 'category', 'subcategory', 'description'] as const).map((key) => (
                                <TableHead 
                                    key={key}
                                    className="text-neon-blue font-bold cursor-pointer"
                                    onClick={() => handleSort(key)}
                                >
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                    <SortIcon columnKey={key} />
                                </TableHead>
                            ))}
                            <TableHead className="text-neon-blue font-bold">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedExpenses.map((expense, index) => (
                            <TableRow 
                                key={expense._id} 
                                className={`border-b border-gray-800 ${index % 2 === 0 ? 'bg-gray-900' : 'bg-black'} hover:bg-gray-800 transition-colors duration-200`}
                            >
                                <TableCell className="py-4">{formatDate(expense.date)}</TableCell>
                                <TableCell className="py-4">${expense.amount.toFixed(2)}</TableCell>
                                <TableCell className="py-4">{expense.category}</TableCell>
                                <TableCell className="py-4">{expense.subcategory}</TableCell>
                                <TableCell className="py-4">{expense.description}</TableCell>
                                <TableCell className="py-4">
                                    <div className="flex space-x-2">
                                        <Button
                                            onClick={() => onEdit(expense)}
                                            className="bg-neon-blue text-white hover:bg-white hover:text-neon-blue transition-colors duration-200"
                                        >
                                            <Edit2Icon className="w-4 h-4 mr-1" />
                                            Edit
                                        </Button>
                                        <Button
                                            onClick={() => onDelete(expense._id)}
                                            variant="destructive"
                                            className="bg-red-600 text-white hover:bg-white hover:text-red-600 transition-colors duration-200"
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
                    <Card key={expense._id} className="bg-gray-800 text-white border-gray-700">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-neon-blue">
                                {formatDate(expense.date)} - ${expense.amount.toFixed(2)}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p><span className="font-semibold">Category:</span> {expense.category}</p>
                            <p><span className="font-semibold">Subcategory:</span> {expense.subcategory}</p>
                            <p><span className="font-semibold">Description:</span> {expense.description}</p>
                            <div className="mt-4 flex space-x-2">
                                <Button
                                    onClick={() => onEdit(expense)}
                                    className="bg-neon-blue text-white hover:bg-white hover:text-neon-blue transition-colors duration-200"
                                >
                                    <Edit2Icon className="w-4 h-4 mr-1" />
                                    Edit
                                </Button>
                                <Button
                                    onClick={() => onDelete(expense._id)}
                                    variant="destructive"
                                    className="bg-red-600 text-white hover:bg-white hover:text-red-600 transition-colors duration-200"
                                >
                                    <TrashIcon className="w-4 h-4 mr-1" />
                                    Delete
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}