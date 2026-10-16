'use client';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import useChartTheme from '@/hooks/useChartTheme';

/** Vertical or horizontal bars. `max` fixes the value axis (e.g. 10 for risk scores). */
export default function BarsChart({ data, categoryKey, series, height = 280, valueFormatter = (v) => v, horizontal = false, max, label }) {
  const t = useChartTheme();
  const axis = { tick: { fill: t.text, fontSize: 12 }, axisLine: false, tickLine: false };
  return (
    <div style={{ width: '100%', height }} role="img" aria-label={label}>
      <ResponsiveContainer>
        <BarChart data={data} layout={horizontal ? 'vertical' : 'horizontal'} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={t.grid} horizontal={!horizontal} vertical={horizontal} />
          {horizontal ? (
            <>
              <XAxis type="number" {...axis} tickFormatter={valueFormatter} domain={[0, max ?? 'auto']} />
              <YAxis type="category" dataKey={categoryKey} {...axis} width={96} />
            </>
          ) : (
            <>
              <XAxis dataKey={categoryKey} {...axis} />
              <YAxis {...axis} tickFormatter={valueFormatter} width={64} domain={[0, max ?? 'auto']} />
            </>
          )}
          <Tooltip {...t.tooltip} cursor={{ fill: t.grid, opacity: 0.4 }} formatter={(v) => valueFormatter(v)} />
          {series.length > 1 && <Legend wrapperStyle={{ fontSize: 12, color: t.text }} />}
          {series.map((s, i) => (
            <Bar key={s.key} dataKey={s.key} name={s.name} fill={t.series[s.color ?? i]} radius={[4, 4, 4, 4]} maxBarSize={28} animationDuration={800} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
