"use client"

import { useState, useMemo } from "react"
import { LineChart } from "./LineChart"
import { Filter } from "./Filter"

interface Expense {
  _id: string
  date: string
  amount: number
  category: string
  subcategory: string
  description: string
}

interface DashboardProps {
  expenses: Expense[]
}

export default function Dashboard({ expenses }: DashboardProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All")

  const categories = useMemo(() => {
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
      const date = new Date(expense.date).toISOString().split('T')[0]
      if (!acc[date]) {
        acc[date] = 0
      }
      acc[date] += expense.amount
      return acc
    }, {} as Record<string, number>)

    return Object.entries(groupedData).map(([date, amount]) => ({ date, amount }))
  }, [filteredExpenses])

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Expense Dashboard</h1>
      <div className="grid gap-8 md:grid-cols-2">
        <Filter
          options={categories}
          onFilterChange={setSelectedCategory}
          title="Filter by Category"
        />
        <LineChart
          data={chartData}
          xKey="date"
          yKey="amount"
          title="Expenses Over Time"
        />
      </div>
    </div>
  )
}