import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface CostTrendProps {
  trend: number[];
  positive?: boolean;
}

export default function CostTrend({ trend, positive = false }: CostTrendProps) {
  const color = positive ? '#22c55e' : '#ef4444';
  const data = trend.map((value, index) => ({ index, value }));

  return (
    <div style={{ width: '80px', height: '28px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.5}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
