import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FilterProps {
  options: string[]
  onFilterChange: (value: string) => void
  title: string
}

export function Filter({ options, onFilterChange, title }: FilterProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from( { length: 10 }, (_, index) => currentYear - index);
  const months = Array.from({ length: 12 }, (_, index) => index + 1);
  const days = Array.from({ length: 31 }, (_, index) => index + 1);

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      {/* Category filter */}
      <Select onValueChange={onFilterChange} defaultValue={options[0]}>
        <SelectTrigger className="w-full bg-black text-white border-blue-600">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent className="bg-black text-white  border-blue-600">
          {options.map((option) => (
            <SelectItem key={option} value={option} className="hover:bg-blue-600">
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Year filter */}
      <Select onValueChange={(value) => onFilterChange(`year_${value}`)}>
          <SelectTrigger className="w-full bg-black text-white border-blue-600">
            <SelectValue placeholder="Select a year" />
          </SelectTrigger>
          <SelectContent className="bg-black text-white border-blue-600">
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()} className="hover:bg-blue-600">
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Month filter */}
        <Select onValueChange={(value) => onFilterChange(`month_${value}`)}>
          <SelectTrigger className="w-full bg-black text-white border-blue-600">
            <SelectValue placeholder="Select a month" />
          </SelectTrigger>
          <SelectContent className="bg-black text-white border-blue-600">
            {months.map((month) => (
              <SelectItem key={month} value={month.toString()} className="hover:bg-blue-600">
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Day filter */}
        <Select onValueChange={(value) => onFilterChange(`day_${value}`)}>
          <SelectTrigger className="w-full bg-black text-white border-blue-600">
            <SelectValue placeholder="Select a day" />
          </SelectTrigger>
          <SelectContent className="bg-black text-white border-blue-600">
            {days.map((day) => (
              <SelectItem key={day} value={day.toString()} className="hover:bg-blue-600">
                {day}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
    </div>
  )
}