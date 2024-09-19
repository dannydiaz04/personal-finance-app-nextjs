"use client"

import { useState, useMemo, useEffect } from "react"
import { useSession } from 'next-auth/react'
import { LineChart } from "@/app/components/LineChart"
import { Filter } from "@/app/components/Filter"
import { Category } from '@/types/category'

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
        setExpenses(data)
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
      const date = new Date(expense.date).toISOString().split('T')[0]
      if (!acc[date]) {
        acc[date] = 0
      }
      acc[date] += expense.amount
      return acc
    }, {} as Record<string, number>)

    return Object.entries(groupedData).map(([date, amount]) => ({ date, amount }))
  }, [filteredExpenses])

  useEffect(() => {
    fetchCategories()
  }, [])

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
    <div className="min-h-screen bg-gray-900 text-white p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-8">Expense Dashboard</h1>
      
      <div className="grid gap-8 md:grid-cols-2">
        <Filter
          options={uniqueCategories}
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