import { Card, CardContent } from "@/components/ui/card"
import { LineChart, Line } from 'recharts'
import { useEffect, useState } from 'react'
import { Expense } from '@/app/models/Expense'

interface DataPoint {
  value: number
}

interface MetricData {
  title: string
  value: string
  subValue?: string
  subLabel?: string
  data: DataPoint[]
  color: string
  fillPercentage: number
}

interface MetricCardProps {
  userId: string
  title: string
  value: string
  subValue?: string
  subLabel?: string
  data: { value: number }[]
  color: string
  fillPercentage: number
}

function MetricCard({ userId, title, value, subValue, subLabel, data, color, fillPercentage }: MetricCardProps) {
  const gradientId = `gradient-${title.replace(/\s+/g, '-').toLowerCase()}`
  const maskId = `mask-${title.replace(/\s+/g, '-').toLowerCase()}`

  return (
    <Card className="w-full overflow-hidden">
      <div className="relative h-full">
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id={gradientId} x1="0" x2="0" y1="1" y2="0">
              <stop offset="0%" stopColor={color} />
              <stop offset="100%" stopColor={`${color}99`} />
            </linearGradient>
            <mask id={maskId}>
              <rect width="100%" height="100%" fill="white" />
              <rect 
                width="100%" 
                height={`${100 - fillPercentage}%`} 
                fill="black" 
              />
              <path 
                d={`M0,${100 - fillPercentage} C150,${100 - fillPercentage - 10} 350,${100 - fillPercentage + 10} 500,${100 - fillPercentage} V100 H0 Z`}
                fill="white"
                className="animate-wave"
              />
              <path 
                d={`M0,${100 - fillPercentage + 5} C200,${100 - fillPercentage - 15} 300,${100 - fillPercentage + 15} 500,${100 - fillPercentage - 5} V100 H0 Z`}
                fill="white"
                className="animate-wave-reverse"
              />
            </mask>
          </defs>
          <rect 
            width="100%" 
            height="100%" 
            fill={`url(#${gradientId})`} 
            mask={`url(#${maskId})`}
          />
        </svg>
        <CardContent className="relative z-10 p-6">
          <h3 className="text-sm font-medium text-white/80 mb-2">{title}</h3>
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-3xl font-bold text-white">{value}</p>
              {subValue && subLabel && (
                <p className="text-sm text-white/80">
                  {subLabel}: {subValue}
                </p>
              )}
            </div>
            <LineChart width={100} height={40} data={data}>
              <Line type="monotone" dataKey="value" stroke="white" strokeWidth={2} dot={false} />
            </LineChart>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}

export default MetricCard