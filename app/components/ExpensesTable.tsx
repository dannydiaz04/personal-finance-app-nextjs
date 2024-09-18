import React from 'react';

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

const ExpensesTable: React.FC<ExpensesTableProps> = ({ expenses, onEdit, onDelete}) => {
    return (
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Category</th>
                    <th>Subcategory</th>
                    <th>Description</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {expenses.map((expense) => (
                    <tr key={expense._id}>
                        <td>{expense.date}</td>
                        <td>{expense.amount}</td>
                        <td>{expense.category}</td>
                        <td>{expense.subcategory}</td>
                        <td>{expense.description}</td>
                        <td>
                            <button onClick={() => onEdit(expense)}>Edit</button>
                            <button onClick={() => onDelete(expense._id)}>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default ExpensesTable;