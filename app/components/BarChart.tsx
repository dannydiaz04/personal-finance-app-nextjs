import { Bar, BarChart as RechartsBarChart, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList, Cell } from "recharts";
import { useMemo } from "react";

interface BarChartProps {
    data: any[]
    xKey: string
    yKey: string
    title: string
}

interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{ payload: { category: string; cumulativeAmount: number } }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-blue-800 p-4 rounded shadow-lg border border-blue-600 bg-opacity-90 shadow-lg">
                <p className="text-gray-300 font bold mb-2"><span className="text-white">{`Category: ${data.category}`}</span></p>
                <p className="text-gray-300"><span className="text-white">{`Total Amount: $${payload[0].value}`}</span></p> {/* the value is the value of the dictionary { category: cumulativeAmount } the */}
            </div>
        )
    }
    return null;
}

export function BarChart({ data, xKey, yKey, title }: BarChartProps ) {
    const processedData = useMemo(() => {
        const categoryMap = new Map<string, number>();
        data.forEach(item => {
            const category = item[xKey];
            const amount = Number(item[yKey]) || 0;
            categoryMap.set(category, (categoryMap.get(category) || 0) + amount);
        });
        // Convert the Map to an array of objects
        const sortedData = Array.from(categoryMap.entries())
            .sort(([a], [b]) => a.localeCompare(b));
            let cumulativeAmount = 0;
            return sortedData.map(([category, totalAmount]) => {
                cumulativeAmount += totalAmount;
                return { 
                    [xKey]: category, 
                    [yKey]: cumulativeAmount.toFixed(2) 
                } // the yKey is the totalAmount. To set the yKey, we explicitly set it to totalAmount. To stay consistent with the data, we use the xKey to set the category explicitly
            })
    }, [data, xKey, yKey]);
    console.log('processedData from the BarChart component', processedData)
    console.log('yKey from BarChart component', yKey)
    const maxValue = Math.max(...processedData.map(item => Number(item[yKey])));
    return (
        <div className="w-full">
        <h2 className="text-xl font-bold mb-4" id={`${title.replace(/\s+/g, '-').toLowerCase()}-bar`}>{title}</h2>
        <ResponsiveContainer width="100%" height={300}>
          <RechartsBarChart data={processedData} aria-labelledby={`${title.replace(/\s+/g, '-').toLowerCase()}-bar`}>
            <XAxis 
              dataKey={xKey}
              stroke="#cbd5e1"
            />
            <YAxis 
              tickFormatter={(value) => `$${Number(value).toFixed(2)}`} 
              stroke="#cbd5e1"
              domain={[0, maxValue]} // Set the domain to the max value to ensure that the bars are not cut off
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey={yKey} fill="#22d3ee">
                <LabelList 
                    position="center" 
                    dataKey={yKey} 
                    formatter={(value: number) => `$${Number(value).toFixed(2)}`} 
                    fill="black" 
                    fontSize={11} // Adjust font size if necessary
                    style={{ fontFamily: 'Inter, sans-serif' }}
                />
            </Bar>
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    )
}