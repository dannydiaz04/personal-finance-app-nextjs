"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { LineChart } from "@/app/components/LineChart"
import { ScatterPlot } from "@/app/components/ScatterPlot"
import { Filter } from "@/app/components/Filter"
import { Category } from '@/types/category'
import { isNaN } from 'lodash'
import { BarChart } from '@/app/components/BarChart'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import TankCard from './tank-card'
import { Menu } from "lucide-react"

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

export default function ExpenseDashboard() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [categories, setCategories] = useState<Category[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [categoryRemainingAmounts, setCategoryRemainingAmounts] = useState<any[]>([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isFilterButtonVisible, setIsFilterButtonVisible] = useState(true)

  const { data: session } = useSession()

  useEffect(() => {
    fetchCategories()
    fetchExpenses()
    if (session?.user?.id) {
      console.log('ExpenseDashboard: Session user ID:', (session.user as any).id);
      fetchCategoryRemainingAmounts((session.user as any).id)
    } else {
      console.log('ExpenseDashboard: No user ID available in session');
    }
  }, [session])

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

  const fetchCategoryRemainingAmounts = async (userId: string) => {
    console.log('ExpenseDashboard: Fetching category remaining amounts for user:', userId);
    try {
      const response = await fetch(`/api/expenses/category-remaining?userId=${userId}`)
      console.log('ExpenseDashboard: Fetch response status:', response.status);
      if (!response.ok) throw new Error('Failed to fetch category remaining amounts')
      const data = await response.json()
      console.log('ExpenseDashboard: Fetched category remaining amounts:', data);
      setCategoryRemainingAmounts(data)
    } catch (error) {
      console.error('ExpenseDashboard: Error fetching category remaining amounts', error)
    }
  }

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen)
    setIsFilterButtonVisible(false)
  }

  const handleScroll = useCallback(() => {
    setIsFilterButtonVisible(false)
  }, [])

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!isFilterOpen && event.clientX <= 500) {
      setIsFilterButtonVisible(true);
    }
  }, [isFilterOpen])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [handleScroll, handleMouseMove])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 p-8 space-y-8 relative">
      {!isFilterOpen && isFilterButtonVisible && (
        <Button 
          onClick={toggleFilter} 
          className="fixed top-4 left-4 z-50 transition-opacity duration-300 ease-in-out opacity-0 hover:opacity-100"
          variant="outline"
        >
          <Menu className="h-4 w-4 mr-2" />
          Filters
        </Button>
      )}

      <div 
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 p-4 transform transition-transform duration-300 ease-in-out ${
          isFilterOpen ? 'translate-x-0' : '-translate-x-full'
        } z-40`}
      >
        <h2 className="text-2xl font-bold mb-4">Filters</h2>
        <Filter
          title="Category"
          options={uniqueCategories}
          onFilterChange={handleCategoryChange}
        />
        <Button onClick={() => setIsFilterOpen(false)} className="mt-4">
          Close Filters
        </Button>
      </div>

      <h1 className="text-4xl font-bold mb-8 text-center text-primary">Expense Dashboard</h1>
      
      <div className="flex flex-col gap-8">
        <div className="grid gap-8 md:grid-cols-3">
          {categoryRemainingAmounts.map((category, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{category.category || 'Unknown Category'}</CardTitle>
              </CardHeader>
              <CardContent>
                <TankCard
                  userId={(session?.user as any).id}
                  title={category.category || 'Unknown Category'}
                  value={`$${(category.remainingAmount || 0).toFixed(2)}`}
                  subValue={`$${(category.targetAmount || 0).toFixed(2)}`}
                  subLabel="Target Amount"
                  data={[{ value: category.remainingAmount || 0 }]}
                  color={getRandomColor()}
                  fillPercentage={calculateFillPercentage(category.remainingAmount, category.targetAmount)}
                />
              </CardContent>
            </Card>
          ))}
        </div>
        
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

function getRandomColor() {
  const blue = Math.floor(Math.random() * 128);
  const green = Math.floor(Math.random() * 128);
  return `rgb(0, ${green + 127}, ${blue + 127})`;
}

function calculateFillPercentage(remainingAmount: number | null | undefined, targetAmount: number | null | undefined): number {
  if (typeof remainingAmount !== 'number' || typeof targetAmount !== 'number' || targetAmount === 0) {
    return 0;
  }
  return Math.min(100, Math.max(0, (remainingAmount / targetAmount) * 100));
}