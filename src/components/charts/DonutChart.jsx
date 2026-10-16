'use client';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import useChartTheme from '@/hooks/useChartTheme';

/** Pie/donut. Pass `colorMap` ({name: color}) for semantic colours (risk, status). */
export default function DonutChart({ data, height = 280, valueFormatter = (v) => v, colorMap, label }) {
  const t = useChartTheme();
  return (
    <div style={{ width: '100%', height }} role="img" aria-label={label}>
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius="55%" outerRadius="82%" paddingAngle={2} stroke="none" animationDuration={900}>
            {data.map((d, i) => <Cell key={d.name} fill={colorMap?.[d.name] ?? t.series[i % t.series.length]} />)}
          </Pie>
          <Tooltip {...t.tooltip} formatter={(v) => valueFormatter(v)} />
          <Legend wrapperStyle={{ fontSize: 12, color: t.text }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
