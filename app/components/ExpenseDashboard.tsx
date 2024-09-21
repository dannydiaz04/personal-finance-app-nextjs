"use client"

import { useState, useMemo, useEffect } from "react"
import { useSession } from "next-auth/react"
import { LineChart } from "@/app/components/LineChart"
import { ScatterPlot } from "@/app/components/ScatterPlot"
import { Filter } from "@/app/components/Filter"
import { Category } from '@/types/category'
import { isNaN } from 'lodash'
import { BarChart } from '@/app/components/BarChart'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Expense {
  _id: string
  date: string
  amount: number
  category: string
  subcategory: string
  description: string
}

function validateExpenseAmount(expense: Expense): Expense {
  return {
    ...expense,
    amount: isNaN(Number(expense.amount)) ? 0 : Number(expense.amount),
    date: new Date(expense.date).toISOString().split('T')[0],
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

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

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
      const amount = Number(expense.amount);
      acc[date].amount += isNaN(amount) ? 0 : amount;
      acc[date].categories.add(expense.category);
      acc[date].count += 1;
      return acc;
    }, {} as Record<string, { amount: number; categories: Set<string>; count: number }>);

    return Object.entries(groupedData)
      .map(([date, data]) => ({
        date : new Date(date),
        amount: Number(data.amount.toFixed(2)),
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 p-8 space-y-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-primary">Expense Dashboard</h1>
      
      <div className="flex flex-col gap-8">
        {/* <Card className="w-full md:w-1/3 mx-auto">
          <CardHeader>
            <CardTitle>Filter by Category</CardTitle>
          </CardHeader> 
          <CardContent> */}
            <div className="w-1/4 mx-auto">
              <Filter
                title="Filters"
                options={uniqueCategories}
                onFilterChange={handleCategoryChange}
              />
            </div>
          {/* </CardContent>
        </Card> */}
        
        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Expenses by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart
                title="Expenses by Category"
                data={barData}
                xKey="category"
                yKey="amount"
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Expenses Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart
                title="Expenses Over Time"
                data={chartData}
                xKey="date"
                yKey="amount"
                currentDate="date"
              />
            </CardContent>
          </Card>
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Individual Expense Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ScatterPlot
                title="Individual Expense Distribution"
                data={scatterData}
                xKey="date"
                yKey="amount"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}