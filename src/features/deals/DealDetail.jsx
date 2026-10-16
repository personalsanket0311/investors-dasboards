'use client';
import Link from 'next/link';
import useDealDetail from '@/hooks/useDealDetail';
import { useInterestToggle } from '@/hooks/useInterests';
import { Card } from '@/components/ui/Card';
import { Skeleton, ErrorState } from '@/components/ui/Feedback';
import { RiskBadge, StatusBadge } from '@/components/ui/Badge';
import InterestButton from '@/components/ui/InterestButton';
import Tabs from '@/components/ui/Tabs';
import Accordion from '@/components/ui/Accordion';
import Icon from '@/components/ui/Icon';
import { TrendChart, BarsChart } from '@/components/charts';
import { formatINR, formatPercent } from '@/utils/format';

const Metric = ({ label, value, tone }) => (
  <div className="metric"><dt>{label}</dt><dd className={tone ? `tone-${tone}` : ''}>{value}</dd></div>
);

export default function DealDetail({ id }) {
  const { deal, derived, loading, error, retry } = useDealDetail(id);
  const { isInterested, toggle } = useInterestToggle();

  const back = <Link href="/deals" className="back"><Icon name="back" size={16} /> Back to deals</Link>;
  if (error) return <>{back}<ErrorState message={error} onRetry={retry} /></>;
  if (loading) return <>{back}<Skeleton height={60} width="50%" /><div style={{ height: 16 }} /><Skeleton height={380} radius={16} /></>;

  const last = derived.projection[derived.projection.length - 1];
  const tabs = [
    {
      id: 'overview', label: 'Overview', content: (
        <div className="split">
          <Card title="About the company">
            <p className="prose">{deal.description}</p>
            <dl className="metrics">
              <Metric label="Headquarters" value={deal.city} />
              <Metric label="Founded" value={deal.foundedYear} />
              <Metric label="Team size" value={deal.employees} />
              <Metric label="Stage" value={deal.stage} />
            </dl>
          </Card>
          <Card title="Funding progress" subtitle={`${derived.fundedPct}% of target raised`}>
            <div className="progress progress--lg"><span style={{ width: `${Math.min(100, derived.fundedPct)}%` }} /></div>
            <dl className="metrics">
              <Metric label="Raised" value={formatINR(deal.raised)} />
              <Metric label="Target" value={formatINR(deal.targetRaise)} />
              <Metric label="Investors" value={deal.investorsCount} />
              <Metric label="Profile views" value={deal.views.toLocaleString('en-IN')} />
            </dl>
          </Card>
        </div>
      ),
    },
    {
      id: 'financials', label: 'Financials', content: (
        <Card title="Financial metrics" subtitle="Latest reported figures">
          <dl className="metrics metrics--wide">
            <Metric label="Annual revenue" value={formatINR(deal.revenue)} />
            <Metric label="Revenue growth" value={formatPercent(deal.revenueGrowth, 0)} tone={deal.revenueGrowth >= 0 ? 'good' : 'bad'} />
            <Metric label="Net margin" value={formatPercent(deal.profitMargin, 0)} tone={deal.profitMargin >= 0 ? 'good' : 'bad'} />
            <Metric label="Debt / equity" value={deal.debtRatio} tone={deal.debtRatio > 1 ? 'bad' : undefined} />
            <Metric label="Expected ROI" value={formatPercent(deal.expectedRoi)} tone="accent" />
            <Metric label="Investment tenure" value={`${deal.tenureMonths} months`} />
          </dl>
        </Card>
      ),
    },
    {
      id: 'projection', label: 'ROI projection', content: (
        <Card title="Projected value of ₹1,00,000" subtitle={`After ${deal.tenureMonths} months: ${formatINR(last.conservative)} (conservative) to ${formatINR(last.optimistic)} (optimistic)`}>
          <TrendChart area data={derived.projection} xKey="month" yFormatter={(v) => formatINR(v)} label="ROI projection scenarios"
            series={[{ key: 'conservative', name: 'Conservative', color: 2 }, { key: 'base', name: 'Base case', color: 0 }, { key: 'optimistic', name: 'Optimistic', color: 1 }]} />
        </Card>
      ),
    },
    {
      id: 'risk', label: 'Risk analysis', content: (
        <div className="split">
          <Card title="Risk factors" subtitle="Score out of 10, higher means riskier">
            <BarsChart horizontal max={10} data={derived.riskFactors} categoryKey="name" series={[{ key: 'score', name: 'Risk score', color: 3 }]} height={260} label="Risk factor scores" />
          </Card>
          <Card title="What to know"><Accordion items={derived.riskNotes} /></Card>
        </div>
      ),
    },
  ];

  return (
    <>
      {back}
      <header className="detail-head">
        <div>
          <h1>{deal.company}</h1>
          <p className="deal__meta">{deal.industry} · {deal.city} · {deal.stage}</p>
          <div className="deal__badges"><RiskBadge level={deal.riskLevel} /><StatusBadge status={deal.status} /></div>
        </div>
        <InterestButton withLabel active={isInterested(deal.id)} onToggle={() => toggle(deal.id)} />
      </header>
      <dl className="strip">
        <Metric label="Expected ROI" value={formatPercent(deal.expectedRoi)} tone="accent" />
        <Metric label="Min. investment" value={formatINR(deal.minInvestment)} />
        <Metric label="Tenure" value={`${deal.tenureMonths / 12} years`} />
        <Metric label="Funded" value={`${derived.fundedPct}%`} />
      </dl>
      <Tabs tabs={tabs} />
    </>
  );
}
