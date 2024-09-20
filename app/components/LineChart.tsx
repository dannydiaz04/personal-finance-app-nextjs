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
      const value = payload[0].value;
      const amount = isNaN(Number(value)) ? 0 : Number(value);
      return (
        <div className="bg-blue-800 p-4 rounded shadow-lg border border-blue-600">
          <p className="text-gray-300 font-bold mb-2">Date: <span className="text-white">{new Date(label).toLocaleDateString()}</span></p>
          <p className="text-gray-300">Amount: <span className="text-white">${amount.toFixed(2)}</span></p>
          {payload[0].payload.category && (
            <p className="text-gray-300">Category: <span className="text-white">{payload[0].payload.category}</span></p>
          )}
          {payload[0].payload.count && (
            <p className="text-gray-300">Number of Expenses: <span className="text-white">{Number(payload[0].payload.count) || 0}</span></p>
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
            tickFormatter={(unixTime) => new Date(unixTime).toLocaleDateString()}
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