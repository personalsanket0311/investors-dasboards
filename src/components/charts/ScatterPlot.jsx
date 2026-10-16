'use client';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import useChartTheme from '@/hooks/useChartTheme';

export default function ScatterPlot({ data, height = 280, xLabel = 'Risk score', yLabel = 'Expected ROI (%)', label }) {
  const t = useChartTheme();
  const axis = { tick: { fill: t.text, fontSize: 12 }, axisLine: { stroke: t.grid }, tickLine: false };
  return (
    <div style={{ width: '100%', height }} role="img" aria-label={label}>
      <ResponsiveContainer>
        <ScatterChart margin={{ top: 8, right: 16, left: 0, bottom: 16 }}>
          <CartesianGrid stroke={t.grid} />
          <XAxis type="number" dataKey="risk" name={xLabel} domain={[0, 10]} {...axis} label={{ value: xLabel, position: 'insideBottom', offset: -8, fill: t.text, fontSize: 12 }} />
          <YAxis type="number" dataKey="roi" name={yLabel} unit="%" {...axis} width={48} />
          <Tooltip {...t.tooltip} cursor={{ strokeDasharray: '3 3', stroke: t.text }}
            content={({ active, payload }) => active && payload?.length ? (
              <div style={{ ...t.tooltip.contentStyle, padding: '8px 12px' }}>
                <strong>{payload[0].payload.name}</strong><br />Risk {payload[0].payload.risk}/10 · ROI {payload[0].payload.roi}%
              </div>
            ) : null} />
          <Scatter data={data} fill={t.series[0]} animationDuration={900} />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
