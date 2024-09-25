'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ExpenseForm from './ExpenseForm'
import IncomeForm from './IncomeForm'

const FinanceFormsContainer = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="w-full h-full flex flex-col bg-gray-800 bg-opacity-50 shadow-2xl backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-3xl font-extrabold text-white">Add Expense</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <ExpenseForm />
          </CardContent>
        </Card>
        <Card className="w-full h-full flex flex-col bg-gray-800 bg-opacity-50 shadow-2xl backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-3xl font-extrabold text-white">Add Income</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <IncomeForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default FinanceFormsContainer