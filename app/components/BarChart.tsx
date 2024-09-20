import { Bar, BarChart as RechartsBarChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface BarChartProps {
    data: any[]
    xKey: string
    yKey: string
    title: string
}

export function BarChart({ data, xKey, yKey, title }: BarChartProps ) {
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            const amount = isNaN(Number(data[yKey])) ? 0 : Number(data[yKey]);
            return (
                <div className="bg-blue-800 p-4 rounded shadow-lg border border-blue-600">
                <p className="text-white font-bold mb-2">{`Date: ${new Date(data[xKey]).toLocaleDateString()}`}</p>
                <p className="text-cyan-300">{`Amount: $${Number(amount).toFixed(2)}`}</p>
                {data.category && (
                    <p className="text-gray-300">{`Category: ${data.category}`}</p>
                )}
            </div>
            )
        }
        return null;
    }

    return (
        <div className="w-full">
        <h2 className="text-xl font-bold mb-4" id={`${title.replace(/\s+/g, '-').toLowerCase()}-bar`}>{title}</h2>
        <ResponsiveContainer width="100%" height={300}>
          <RechartsBarChart data={data} aria-labelledby={`${title.replace(/\s+/g, '-').toLowerCase()}-bar`}>
            <XAxis 
              dataKey={xKey} 
              tickFormatter={(unixTime) => new Date(unixTime).toLocaleDateString()} 
              stroke="#cbd5e1"
            />
            <YAxis 
              tickFormatter={(value) => `$${value}`} 
              stroke="#cbd5e1"
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey={yKey} fill="#22d3ee" />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    )
}