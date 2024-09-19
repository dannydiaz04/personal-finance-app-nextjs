"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface FilterProps {
  options: string[]
  onFilterChange: (value: string) => void
  title: string
}

export function Filter({ options, onFilterChange, title }: FilterProps) {
  const [selectedValue, setSelectedValue] = useState<string>(options[0])

  const handleValueChange = (value: string) => {
    setSelectedValue(value)
    onFilterChange(value)
  }

  return (
    <Card className="w-full bg-gray-800 text-white">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Select onValueChange={handleValueChange} defaultValue={selectedValue}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  )
}