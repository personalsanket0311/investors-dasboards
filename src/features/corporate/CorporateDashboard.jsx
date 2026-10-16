'use client';
import Link from 'next/link';
import useCorporateAnalytics from '@/hooks/useCorporateAnalytics';
import useChartTheme from '@/hooks/useChartTheme';
import { Card, StatCard, PageHeader } from '@/components/ui/Card';
import { ErrorState, Skeleton } from '@/components/ui/Feedback';
import { TrendChart, BarsChart, DonutChart } from '@/components/charts';
import { formatINR, formatPercent } from '@/utils/format';

export default function CorporateDashboard() {
  const { data, monthly, status, error, retry } = useCorporateAnalytics();
  const t = useChartTheme();
  if (status === 'failed') return <ErrorState message={error} onRetry={retry} />;
  const loading = status !== 'succeeded';
  const k = data?.kpis;
  const sk = <Skeleton height={280} radius={12} />;

  return (
    <>
      <PageHeader title="Corporate view" subtitle="How companies on the platform are raising capital, and how well interest turns into investment." />
      <div className="stats">
        <StatCard loading={loading} label="Total funding raised" value={k && formatINR(k.totalFunding)} hint={k && `${Math.round((k.totalFunding / k.totalTarget) * 100)}% of ${formatINR(k.totalTarget)} targeted`} />
        <StatCard loading={loading} label="Investors on platform" value={k?.investorCount} hint="Registered and active" />
        <StatCard loading={loading} label="Conversion rate" value={k && formatPercent(k.conversionRate)} tone="accent" hint="Profile views that became investors" />
        <StatCard loading={loading} label="Live deals" value={k?.liveDeals} hint="Open or closing" />
      </div>
      <div className="charts">
        <Card title="Funding trend" subtitle="Raised per month and running total" className="span-2">
          {loading ? sk : <TrendChart area data={monthly} xKey="label" yFormatter={(v) => formatINR(v)} label="Funding trend"
            series={[{ key: 'cumulative', name: 'Cumulative', color: 4 }, { key: 'funding', name: 'Monthly', color: 0 }]} />}
        </Card>
        <Card title="Deal status" subtitle="Open vs closing vs funded">
          {loading ? sk : <DonutChart data={data.byStatus} colorMap={t.status} label="Deals by status" />}
        </Card>
        <Card title="Conversion trend" subtitle="Monthly view-to-investor rate">
          {loading ? sk : <TrendChart data={monthly} xKey="label" yFormatter={(v) => `${v}%`} label="Conversion rate trend" series={[{ key: 'conversion', name: 'Conversion', color: 1 }]} />}
        </Card>
        <Card title="Funding by industry" subtitle="Total raised" className="span-2">
          {loading ? sk : <BarsChart horizontal height={340} data={data.byIndustry} categoryKey="industry" valueFormatter={(v) => formatINR(v)} series={[{ key: 'raised', name: 'Raised', color: 0 }]} label="Funding by industry" />}
        </Card>
        <Card title="Top funded deals">
          {loading ? sk : (
            <ol className="toplist">
              {data.topDeals.map((d) => (
                <li key={d.id}>
                  <div><Link href={`/deals/${d.id}`}>{d.company}</Link><small>{d.industry}</small></div>
                  <strong>{formatINR(d.raised)}</strong>
                </li>
              ))}
            </ol>
          )}
        </Card>
      </div>
    </>
  );
}
