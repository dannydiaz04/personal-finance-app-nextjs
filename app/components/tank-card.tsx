import { Card, CardContent } from "@/components/ui/card"

interface TankCardProps {
  totalAmount: number
  amountLeft: number
  label: string
}

export default function TankCard({ totalAmount, amountLeft, label }: TankCardProps) {
  const percentage = Math.round((amountLeft / totalAmount) * 100)

  return (
    <Card className="w-full max-w-sm">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-2">{label}</h3>
        <div className="relative h-48 w-32 mx-auto border-4 border-blue-400 rounded-b-3xl overflow-hidden">
          <div 
            className="absolute bottom-0 left-0 right-0 bg-green-300 transition-all duration-500 ease-in-out"
            style={{ height: `${percentage}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-blue-600 bg-white bg-opacity-70 px-2 py-1 rounded">
              {amountLeft}
            </span>
          </div>
        </div>
        <p className="text-center mt-4 text-sm text-gray-600">
          {percentage}% remaining
        </p>
      </CardContent>
    </Card>
  )
}