'use client';
import useInterests from '@/hooks/useInterests';
import { PageHeader } from '@/components/ui/Card';
import { Skeleton, ErrorState, EmptyState } from '@/components/ui/Feedback';
import DealCard from '@/features/deals/DealCard';
import { formatINR, formatPercent } from '@/utils/format';

export default function MyInterests() {
  const { saved, summary, status, error, toggle, clear, retry } = useInterests();
  const loading = status === 'idle' || status === 'loading';

  return (
    <>
      <PageHeader title="My interests" subtitle="Deals you saved. They stay on this device even after you close the tab.">
        {saved.length > 0 && <button className="btn" onClick={clear}>Clear all</button>}
      </PageHeader>
      {status === 'failed' ? <ErrorState message={error} onRetry={retry} />
        : loading ? <div className="grid">{Array.from({ length: 3 }, (_, i) => <Skeleton key={i} height={250} radius={16} />)}</div>
        : saved.length === 0 ? <EmptyState title="Nothing saved yet" message="Tap the heart on any deal to keep it here." actionLabel="Browse deals" href="/deals" />
        : (
          <>
            <dl className="strip">
              <div className="metric"><dt>Saved deals</dt><dd>{summary.count}</dd></div>
              <div className="metric"><dt>Minimum capital needed</dt><dd>{formatINR(summary.minTotal)}</dd></div>
              <div className="metric"><dt>Average expected ROI</dt><dd className="tone-accent">{formatPercent(summary.avgRoi)}</dd></div>
            </dl>
            <div className="grid">{saved.map((d) => <DealCard key={d.id} deal={d} saved onToggleSave={toggle} />)}</div>
          </>
        )}
    </>
  );
}
