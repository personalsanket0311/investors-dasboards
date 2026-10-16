'use client';
import { memo } from 'react';
import Link from 'next/link';
import { RiskBadge, StatusBadge } from '@/components/ui/Badge';
import InterestButton from '@/components/ui/InterestButton';
import { formatINR, formatPercent } from '@/utils/format';

// memo: a card only re-renders when its own deal / saved-state changes, not on every list update
function DealCard({ deal, saved, onToggleSave }) {
  const pct = Math.min(100, Math.round((deal.raised / deal.targetRaise) * 100));
  return (
    <article className="deal">
      <div className="deal__top">
        <div>
          <h3 className="deal__name"><Link href={`/deals/${deal.id}`}>{deal.company}</Link></h3>
          <p className="deal__meta">{deal.industry} · {deal.city}</p>
        </div>
        <InterestButton active={saved} onToggle={() => onToggleSave(deal.id)} />
      </div>
      <p className="deal__desc">{deal.description}</p>
      <dl className="deal__stats">
        <div><dt>Expected ROI</dt><dd className="tone-accent">{formatPercent(deal.expectedRoi)}</dd></div>
        <div><dt>Min. investment</dt><dd>{formatINR(deal.minInvestment)}</dd></div>
        <div><dt>Tenure</dt><dd>{deal.tenureMonths / 12} yrs</dd></div>
      </dl>
      <div className="progress" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Funding progress">
        <span style={{ width: `${pct}%` }} />
      </div>
      <div className="deal__foot">
        <span>{formatINR(deal.raised)} of {formatINR(deal.targetRaise)}</span>
        <span className="deal__badges"><RiskBadge level={deal.riskLevel} /><StatusBadge status={deal.status} /></span>
      </div>
    </article>
  );
}
export default memo(DealCard);
