import { ScatterChart as RechartsScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

interface ScatterPlotProps {
  data: any[]
  xKey: string
  yKey: string
  title: string
}

export function ScatterPlot({ data, xKey, yKey, title }: ScatterPlotProps) {
  // Filter out any data points where the yKey (amount) is NaN
  const validData = data.filter(item => !isNaN(item[yKey]))

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-blue-800 p-4 rounded shadow-lg border border-blue-600">
          <p className="text-white font-bold mb-2">{`Date: ${new Date(data[xKey]).toLocaleDateString()}`}</p>
          <p className="text-cyan-300">{`Amount: $${Number(data[yKey]).toFixed(2)}`}</p>
          {data.category && (
            <p className="text-green-300">{`Category: ${data.category}`}</p>
          )}
          {data.description && (
            <p className="text-yellow-300">{`Description: ${data.description}`}</p>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4" id={`${title.replace(/\s+/g, '-').toLowerCase()}-scatter`}>{title}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <RechartsScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }} aria-labelledby={`${title.replace(/\s+/g, '-').toLowerCase()}-scatter`}>
          <XAxis 
            dataKey={xKey} 
            name="Date" 
            tickFormatter={(unixTime) => new Date(unixTime).toLocaleDateString()} 
            type="number" 
            domain={['dataMin', 'dataMax']}
            stroke="#cbd5e1"
          />
          <YAxis 
            dataKey={yKey} 
            name="Amount" 
            tickFormatter={(value) => `$${Number(value).toFixed(2)}`}
            stroke="#cbd5e1"
          />
          <Tooltip content={<CustomTooltip />} />
          <Scatter name="Expenses" data={validData} fill="#22d3ee" />
        </RechartsScatterChart>
      </ResponsiveContainer>
    </div>
  )
}