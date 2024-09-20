"use client"

import { useState, useMemo, useEffect } from "react";
import { useSession } from "next-auth/react";
import { LineChart } from "@/app/components/LineChart";
import { ScatterPlot } from "@/app/components/ScatterPlot";
import { Filter } from "@/app/components/Filter";
import { Category } from '@/types/category';
import { isNaN } from 'lodash';
import { BarChart } from '@/app/components/BarChart';

interface Expense {
  _id: string
  date: string
  amount: number
  category: string
  subcategory: string
  description: string
}

// validator function to check if the amount is a number
function validateExpenseAmount(expense: Expense): Expense {
  return {
    ...expense,
    amount: isNaN(Number(expense.amount)) ? 0 : Number(expense.amount),
    date: new Date(expense.date).toISOString().split('T')[0], // Ensure date is a valid date
  }
}

export default function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [categories, setCategories] = useState<Category[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])

  const { data: session } = useSession()

  useEffect(() => {
    fetchCategories()
    fetchExpenses()
  }, [])

  const fetchExpenses = async () => {
    try {
      const response = await fetch('/api/expenses')
      if (!response.ok) throw new Error('Failed to fetch expenses')
      const data = await response.json()
      setExpenses(data.map(validateExpenseAmount))
    } catch (error) {
      console.error('Error fetching expenses', error)
    }
  }

  const uniqueCategories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(expenses.map((expense) => expense.category)))
    return ["All", ...uniqueCategories]
  }, [expenses])

  const filteredExpenses = useMemo(() => {
    if (selectedCategory === "All") {
      return expenses
    }
    return expenses.filter((expense) => expense.category === selectedCategory)
  }, [expenses, selectedCategory])

  const chartData = useMemo(() => {
    const groupedData = filteredExpenses.reduce((acc, expense) => {
      const date = new Date(expense.date).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { amount: 0, categories: new Set(), count: 0 };
      }
      // Ensure amount is a number
      const amount = Number(expense.amount);
      acc[date].amount += isNaN(amount) ? 0 : amount;
      acc[date].categories.add(expense.category);
      acc[date].count += 1;
      return acc;
    }, {} as Record<string, { amount: number; categories: Set<string>; count: number }>);

    return Object.entries(groupedData)
      .map(([date, data]) => ({
        date,
        amount: Number(data.amount.toFixed(2)), // Round to 2 decimal places
        category: Array.from(data.categories).join(', '),
        count: Number(data.count)
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [filteredExpenses])

  const scatterData = useMemo(() => {
    return filteredExpenses.map(expense => ({
      ...expense,
      date: new Date(expense.date).getTime(),
      amount: isNaN(Number(expense.amount)) ? 0 : Number(expense.amount)
    }));
  }, [filteredExpenses]);

  const barData = useMemo(() => {
    return filteredExpenses.map(expense => {
      return {
        category: expense.category,
        amount: expense.amount,
      }
    })
  }, [filteredExpenses])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (!response.ok) throw new Error('Failed to fetch categories')
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories', error)
    }
  }

  return (
    <div className="min-h-screen bg-blue-900 text-white p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Expense Dashboard</h1>
      
      <div className="flex flex-col gap-8">
        <div className="bg-black rounded-lg p-4 shadow-2xl font-bold w-1/4">
          <Filter
            options={uniqueCategories}
            onFilterChange={setSelectedCategory}
            title="Filter by Category"
          />
        </div>
        
        <div className="grid gap-8 md:grid-cols-2">
          <div className="bg-black rounded-lg p-4 shadow-2xl font-bold">
            <BarChart
              data={barData}
              xKey="category"
              yKey="amount"
              title="Expenses by Category"
            />
          </div>
          <div className="bg-black rounded-lg p-4 shadow-2xl font-bold">
            <LineChart
              data={chartData}
              xKey="date"
              yKey="amount"
              title="Expenses Over Time"
            />
          </div>
          <div className="bg-black rounded-lg p-4 shadow-2xl font-bold md:col-span-2">
            <ScatterPlot
              data={scatterData}
              xKey="date"
              yKey="amount"
              title="Individual Expense Distribution"
            />
          </div>
        </div>
      </div>
    </div>
  )
}