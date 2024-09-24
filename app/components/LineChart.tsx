import { Line, LineChart as RechartsLineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useMemo } from "react"

interface LineChartProps {
  data: any[]
  xKey: string
  yKey: string
  title: string
}

export function LineChart({ data, xKey, yKey, title }: LineChartProps) {
  const processedData = useMemo(() => {
    const monthMap = new Map<string, number>();
    
    data.forEach(item => {
      const date = new Date(item[xKey]);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const amount = Number(item[yKey]) || 0;
      monthMap.set(monthKey, (monthMap.get(monthKey) || 0) + amount);
    });

    const sortedData = Array.from(monthMap.entries())
      .sort(([a], [b]) => a.localeCompare(b));

    let cumulativeSum = 0;
    return sortedData.map(([monthKey, totalAmount]) => {
      cumulativeSum += totalAmount;
      const [year, month] = monthKey.split('-');
      const date = new Date(Number(year), Number(month) - 1);
      return {
        date: date,
        month: date.toLocaleString('default', { month: 'short' }),
        year: year,
        [yKey]: cumulativeSum.toFixed(2)
      };
    });
  }, [data, xKey, yKey]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-blue-800 p-4 rounded shadow-lg border border-blue-600 opacity-80">
          <p className="text-gray-300 font-bold mb-2">Date: <span className="text-white">{`${data.month} ${data.year}`}</span></p>
          <p className="text-gray-300">{yKey} Amount: <span className="text-white">${data[yKey]}</span></p>
        </div>
      );
    }
    return null;
  };

  const maxValue = Math.max(...processedData.map(item => Number(item[yKey])));
  return (
    <div className="w-full">
      {/* <h2 className="text-xl font-bold mb-4" id={`${title.replace(/\s+/g, '-').toLowerCase()}-chart`}>{title}</h2> */}
      <ResponsiveContainer width="100%" height={300}>
        <RechartsLineChart data={processedData} aria-labelledby={`${title.replace(/\s+/g, '-').toLowerCase()}-chart`}>
          <XAxis
            dataKey="date"
            tickFormatter={(date) => `${date.toLocaleString('default', { month: 'short' })}-${date.getFullYear()}`}
            stroke="#cbd5e1"
            strokeWidth={10}
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#cbd5e1"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value: number) => `$${Number(value).toFixed(2)}`}
            domain={[0, maxValue]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey={yKey}
            stroke="#22d3ee"
            strokeWidth={4}
            dot={false}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  )
}