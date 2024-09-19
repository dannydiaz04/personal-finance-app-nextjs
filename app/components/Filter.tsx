import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FilterProps {
  options: string[]
  onFilterChange: (value: string) => void
  title: string
}

export function Filter({ options, onFilterChange, title }: FilterProps) {
  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <Select onValueChange={onFilterChange} defaultValue={options[0]}>
        <SelectTrigger className="w-full bg-blue-700 text-white border-blue-600">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent className="bg-blue-700 text-white border-blue-600">
          {options.map((option) => (
            <SelectItem key={option} value={option} className="hover:bg-blue-600">
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}