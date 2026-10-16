'use client';
import Link from 'next/link';
import useInvestorDashboard from '@/hooks/useInvestorDashboard';
import useChartTheme from '@/hooks/useChartTheme';
import { Card, StatCard, PageHeader } from '@/components/ui/Card';
import { ErrorState, Skeleton } from '@/components/ui/Feedback';
import { RiskBadge } from '@/components/ui/Badge';
import { TrendChart, DonutChart, ScatterPlot } from '@/components/charts';
import { formatINR, formatPercent, formatDate } from '@/utils/format';

export default function InvestorDashboard() {
  const { profile, holdings, stats, status, error, retry } = useInvestorDashboard();
  const t = useChartTheme();
  if (status === 'failed') return <ErrorState message={error} onRetry={retry} />;
  const loading = status !== 'succeeded';
  const riskTotal = stats.riskDistribution.reduce((s, r) => s + r.value, 0) || 1;

  return (
    <>
      <PageHeader title={loading ? 'Your portfolio' : `Welcome back, ${profile.name.split(' ')[0]}`} subtitle="Where your money is, how it is performing, and how risky it is." />

      <div className="stats">
        <StatCard loading={loading} label="Total investments" value={formatINR(stats.totalInvested)} hint={`Across ${holdings.length} deals`} />
        <StatCard loading={loading} label="Active deals" value={stats.activeDeals} hint={`${holdings.length - stats.activeDeals} fully funded`} />
        <StatCard loading={loading} label="ROI overview" value={formatPercent(stats.roiPct)} tone={stats.roiPct >= 0 ? 'good' : 'bad'} hint={`Portfolio value ${formatINR(stats.currentValue)}`} />
        <StatCard loading={loading} label="Risk distribution" value={`${stats.riskDistribution[2].value} high-risk`} hint={`${stats.riskDistribution[0].value} low · ${stats.riskDistribution[1].value} medium`}>
          <div className="riskbar" aria-hidden="true">
            {stats.riskDistribution.map((r) => <span key={r.name} style={{ width: `${(r.value / riskTotal) * 100}%`, background: t.risk[r.name] }} />)}
          </div>
        </StatCard>
      </div>

      <div className="charts">
        <Card title="Investment growth" subtitle="Cumulative amount invested vs current value" className="span-2">
          {loading ? <Skeleton height={280} radius={12} /> : (
            <TrendChart area data={stats.growth} xKey="label" yFormatter={(v) => formatINR(v)} label="Investment growth over time"
              series={[{ key: 'invested', name: 'Invested', color: 4 }, { key: 'value', name: 'Current value', color: 0 }]} />
          )}
        </Card>
        <Card title="Industry distribution" subtitle="Share of capital invested">
          {loading ? <Skeleton height={280} radius={12} /> : <DonutChart data={stats.industryShare} valueFormatter={(v) => formatINR(v)} label="Industry distribution" />}
        </Card>
        <Card title="Risk vs ROI" subtitle="Each dot is one of your deals">
          {loading ? <Skeleton height={280} radius={12} /> : <ScatterPlot data={stats.riskVsRoi} label="Risk versus ROI" />}
        </Card>
        <Card title="Your holdings" subtitle="Most recent first" className="span-2">
          {loading ? <Skeleton height={200} radius={12} /> : (
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>Company</th><th>Invested on</th><th className="num">Amount</th><th className="num">Value now</th><th className="num">Return</th><th>Risk</th></tr></thead>
                <tbody>
                  {[...holdings].reverse().slice(0, 6).map((h) => {
                    const gain = ((h.currentValue - h.amount) / h.amount) * 100;
                    return (
                      <tr key={h.id}>
                        <td><Link href={`/deals/${h.dealId}`}>{h.company}</Link><small>{h.industry}</small></td>
                        <td>{formatDate(h.date)}</td>
                        <td className="num">{formatINR(h.amount)}</td>
                        <td className="num">{formatINR(h.currentValue)}</td>
                        <td className={`num ${gain >= 0 ? 'tone-good' : 'tone-bad'}`}>{formatPercent(gain)}</td>
                        <td><RiskBadge level={h.riskLevel} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
