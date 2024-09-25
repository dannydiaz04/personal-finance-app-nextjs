'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ExpenseForm from './ExpenseForm'
import IncomeForm from './IncomeForm'

const FinanceFormsContainer = () => {
  return (
    <div className="container mx-auto p-4 flex items-center justify-center min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-4xl">
        <Card className="w-full flex flex-col bg-gray-800 bg-opacity-50 shadow-2xl backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold text-white">Add Expense</CardTitle>
          </CardHeader>
          <CardContent>
            <ExpenseForm />
          </CardContent>
        </Card>
        <Card className="w-full flex flex-col bg-gray-800 bg-opacity-50 shadow-2xl backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold text-white">Add Income</CardTitle>
          </CardHeader>
          <CardContent>
            <IncomeForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default FinanceFormsContainer