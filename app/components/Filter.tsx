import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

interface FilterProps {
  options: string[]
  onFilterChange: (type: string, value: string) => void
  title: string
}

export function Filter({ options, onFilterChange, title }: FilterProps) {
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 10 }, (_, index) => currentYear - index)
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]
  const days = Array.from({ length: 31 }, (_, index) => index + 1)

  const [selectedCategory, setSelectedCategory] = useState<string>(options[0])
  const [selectedYear, setSelectedYear] = useState<string>(currentYear.toString())
  const [selectedMonth, setSelectedMonth] = useState<string>("")
  const [selectedDay, setSelectedDay] = useState<string>("")

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value)
    onFilterChange("category", value)
  }

  const handleYearChange = (value: string) => {
    setSelectedYear(value)
    onFilterChange("year", value)
  }

  const handleMonthChange = (value: string) => {
    setSelectedMonth(value)
    onFilterChange("month", value)
  }

  const handleDayChange = (value: string) => {
    setSelectedDay(value)
    onFilterChange("day", value)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select onValueChange={handleCategoryChange} value={selectedCategory}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent className="bg-gray-400 bg-opacity-90">
              {options.map((option) => (
                <SelectItem 
                  key={option} 
                  value={option} 
                  className="text-gray-600 hover:bg-black transition-colors duration-200">
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <Select onValueChange={handleYearChange} value={selectedYear}>
            <SelectTrigger id="year">
              <SelectValue placeholder="Select a year" />
            </SelectTrigger>
            <SelectContent className="bg-gray-300">
              {years.map((year) => (
                <SelectItem 
                  key={year} 
                  value={year.toString()} 
                  className="text-white hover:bg-gray-400 transition-colors duration-200"
                >
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="month">Month</Label>
          <Select onValueChange={handleMonthChange} value={selectedMonth}>
            <SelectTrigger id="month">
              <SelectValue placeholder="Select a month" />
            </SelectTrigger>
            <SelectContent className="bg-gray-300 bg-opacity-80">
              {months.map((month, index) => (
                <SelectItem 
                  key={month} 
                  value={(index + 1).toString()} 
                  className="text-white hover:bg-gray-400 transition-colors duration-200"
                >
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="day">Day</Label>
          <Select onValueChange={handleDayChange} value={selectedDay}>
            <SelectTrigger id="day">
              <SelectValue placeholder="Select a day" />
            </SelectTrigger>
            <SelectContent className="bg-gray-300 bg-opacity-80">
              {days.map((day) => (
                <SelectItem 
                  key={day} 
                  value={day.toString()} 
                  className="text-white hover:bg-gray-400 transition-colors duration-200"
                >
                  {day}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}