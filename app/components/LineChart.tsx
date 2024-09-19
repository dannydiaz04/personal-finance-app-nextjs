import { Line, LineChart as RechartsLineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface LineChartProps {
  data: any[]
  xKey: string
  yKey: string
  title: string
}

export function LineChart({ data, xKey, yKey, title }: LineChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-blue-800 p-4 rounded shadow-lg border border-blue-600">
          <p className="text-white font-bold mb-2">{`Date: ${label}`}</p>
          <p className="text-cyan-300">{`Amount: $${payload[0].value.toFixed(2)}`}</p>
          {payload[0].payload.category && (
            <p className="text-green-300">{`Category: ${payload[0].payload.category}`}</p>
          )}
          {payload[0].payload.count && (
            <p className="text-yellow-300">{`Number of Expenses: ${payload[0].payload.count}`}</p>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4" id={`${title.replace(/\s+/g, '-').toLowerCase()}-chart`}>{title}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <RechartsLineChart data={data} aria-labelledby={`${title.replace(/\s+/g, '-').toLowerCase()}-chart`}>
          <XAxis
            dataKey={xKey}
            stroke="#cbd5e1"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#cbd5e1"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey={yKey}
            stroke="#22d3ee"
            strokeWidth={2}
            dot={false}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  )
}