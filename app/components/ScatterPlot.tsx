import {
  ScatterChart as RechartsScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
} from 'recharts';
import { useState } from 'react';

interface ScatterPlotProps {
  data: any[];
  xKey: string;
  yKey: string;
  title: string;
}

export function ScatterPlot({ data, xKey, yKey, title }: ScatterPlotProps) {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  // Convert xKey values to timestamps and filter out invalid data
  const validData = data
    .filter(
      (item) =>
        !isNaN(item[yKey]) && !isNaN(new Date(item[xKey]).getTime())
    )
    .map((item) => {
      const date = new Date(item[xKey]);
      return {
        ...item,
        [xKey]: date.getTime(), // Convert date to timestamp
      };
    });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const amount = isNaN(Number(data[yKey])) ? 0 : Number(data[yKey]);
      const date = new Date(data[xKey]); // Convert timestamp back to Date
      return (
        <div className="bg-blue-800 p-4 rounded shadow-lg border border-blue-600 opacity-80">
          <p className="text-gray-300 font-bold mb-2">
            <span className="text-white">{date.toLocaleDateString()}</span>
          </p>
          <p className="text-gray-300">
            <span className="text-white">{`Amount: $${Number(
              amount
            ).toFixed(2)}`}</span>
          </p>
          {data.category && (
            <p className="text-gray-300">
              <span className="text-white">{`Category: ${data.category}`}</span>
            </p>
          )}
          {data.description && (
            <p className="text-gray-300">
              <span className="text-white">{`Description: ${data.description}`}</span>
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Define the custom shape for each data point
  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    const id = payload._id;
    const isHovered = hoveredPoint === id;

    return (
      <circle
        cx={cx}
        cy={cy}
        r={6}
        fill={isHovered ? '#1809ed' : '#86EFAC'}
        stroke="#000"
        strokeWidth={isHovered ? 2 : 1}
        style={{
          zIndex: isHovered ? 1000 : 1,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={() => setHoveredPoint(id)}
        onMouseLeave={() => setHoveredPoint(null)}
      />
    );
  };

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={300}>
        <RechartsScatterChart
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          aria-labelledby={`${title.replace(/\s+/g, '-').toLowerCase()}-scatter`}
        >
          <XAxis
            dataKey={xKey}
            name="Date"
            tickFormatter={(timestamp: number) => {
              const date = new Date(timestamp);
              return `${date.toLocaleString('default', {
                month: 'short',
              })}-${date.getFullYear()}`;
            }}
            type="number"
            domain={['dataMin', 'dataMax']}
            fontSize={14}
            stroke="#86EFAC"
            // strokeWidth={10}
            tickLine={true}
            axisLine={true}
          />
          <YAxis
            dataKey={yKey}
            name="Amount"
            fontSize={14}
            tickFormatter={(value) => `$${Number(value).toFixed(0)}`}
            stroke="#86EFAC"
            tickLine={true}
            axisLine={true}
          />
          <ZAxis type="number" range={[100, 100]} />
          <Tooltip content={<CustomTooltip />} />
          <Scatter
            name="Expenses"
            data={validData}
            fill="#86EFAC"
            shape={(props: any) => <CustomDot {...props} />}
          />
        </RechartsScatterChart>
      </ResponsiveContainer>
    </div>
  );
}