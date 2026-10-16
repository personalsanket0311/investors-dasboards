'use client';
import { ResponsiveContainer, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import useChartTheme from '@/hooks/useChartTheme';

/** Line or area chart with one or more series. */
export default function TrendChart({ data, xKey, series, height = 280, yFormatter = (v) => v, area = false, label }) {
  const t = useChartTheme();
  const Chart = area ? AreaChart : LineChart;
  const Series = area ? Area : Line;
  return (
    <div style={{ width: '100%', height }} role="img" aria-label={label}>
      <ResponsiveContainer>
        <Chart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={t.grid} vertical={false} />
          <XAxis dataKey={xKey} tick={{ fill: t.text, fontSize: 12 }} axisLine={{ stroke: t.grid }} tickLine={false} minTickGap={24} />
          <YAxis tick={{ fill: t.text, fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={yFormatter} width={64} />
          <Tooltip {...t.tooltip} formatter={(v) => yFormatter(v)} />
          {series.length > 1 && <Legend wrapperStyle={{ fontSize: 12, color: t.text }} />}
          {series.map((s, i) => (
            <Series key={s.key} type="monotone" dataKey={s.key} name={s.name} stroke={t.series[s.color ?? i]} fill={t.series[s.color ?? i]}
              fillOpacity={area ? 0.12 : 0} strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} animationDuration={900} />
          ))}
        </Chart>
      </ResponsiveContainer>
    </div>
  );
}
