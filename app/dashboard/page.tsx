"use client"

import { useState, useMemo, useEffect } from "react"
import { useSession } from 'next-auth/react'
import { LineChart } from "@/app/components/LineChart"
import { ScatterPlot } from "@/app/components/ScatterPlot"
import { Filter } from "@/app/components/Filter"
import { Category } from '@/types/category'
import Navbar from "@/app/components/Navbar"
import ExpenseDashboard from "@/app/components/ExpenseDashboard"

interface Expense {
  _id: string
  date: string
  amount: number
  category: string
  subcategory: string
  description: string
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
      acc[date] += Number(expense.amount)
      return acc
    }, {} as Record<string, number>)

    return Object.entries(groupedData)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) // Sort by date
  }, [filteredExpenses])

  const scatterData = useMemo(() => {
    return filteredExpenses.map(expense => ({
      ...expense,
      date: new Date(expense.date).getTime(),
      amount: isNaN(Number(expense.amount)) ? 0 : Number(expense.amount)
    }));
  }, [filteredExpenses]);


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
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800">
    <Navbar />
      <div className="min-h-screen bg-blue-900 text-white p-8 pt-20 space-y-8">
        <div>
          <ExpenseDashboard />
        </div>
      </div>
    </div>
  )
}