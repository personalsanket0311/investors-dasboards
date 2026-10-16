'use client';
import { memo, useState } from 'react';
import Link from 'next/link';
import useRecommendations from '@/hooks/useRecommendations';
import { useInterestToggle } from '@/hooks/useInterests';
import { PageHeader, Card } from '@/components/ui/Card';
import { Skeleton, ErrorState } from '@/components/ui/Feedback';
import { RiskBadge } from '@/components/ui/Badge';
import Chips from '@/components/ui/Chips';
import InterestButton from '@/components/ui/InterestButton';
import { WEIGHTS } from '@/utils/scoring';
import { formatINR, formatPercent, inrToLakh, lakhToInr } from '@/utils/format';

const LABELS = { risk: 'Risk match', industry: 'Industry match', budget: 'Budget fit', roi: 'ROI appeal' };

const MatchCard = memo(function MatchCard({ rank, item, saved, onToggle }) {
  const { deal, score, breakdown } = item;
  return (
    <article className="match">
      <div className="match__score" aria-label={`Match score ${score} out of 100`}>
        <strong>{score}</strong><small>/100</small>
      </div>
      <div className="match__body">
        <div className="match__top">
          <div>
            <h3 className="deal__name"><span className="match__rank">#{rank}</span> <Link href={`/deals/${deal.id}`}>{deal.company}</Link></h3>
            <p className="deal__meta">{deal.industry} · {formatPercent(deal.expectedRoi)} ROI · min {formatINR(deal.minInvestment)}</p>
          </div>
          <span className="match__actions"><RiskBadge level={deal.riskLevel} /><InterestButton active={saved} onToggle={() => onToggle(deal.id)} /></span>
        </div>
        <div className="breakdown">
          {Object.keys(LABELS).map((k) => (
            <div key={k} title={`${LABELS[k]}: ${breakdown[k]} of ${WEIGHTS[k]}`}>
              <span>{LABELS[k]}</span>
              <div className="progress progress--sm"><span style={{ width: `${(breakdown[k] / WEIGHTS[k]) * 100}%` }} /></div>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
});

export default function Recommendations() {
  const r = useRecommendations();
  const { isInterested, toggle } = useInterestToggle();
  const [limit, setLimit] = useState(10);

  return (
    <>
      <PageHeader title="Recommended for you" subtitle="Open deals ranked by how well they fit your risk appetite, industries, budget and return goals." />
      <div className="reco">
        <Card title="Your preferences" subtitle="Changing these re-ranks instantly" className="reco__prefs">
          <fieldset className="field"><legend>Risk appetite</legend>
            <div className="segmented" role="radiogroup" aria-label="Risk appetite">
              {['Low', 'Medium', 'High'].map((l) => (
                <button key={l} role="radio" aria-checked={r.prefs.riskAppetite === l} className={r.prefs.riskAppetite === l ? 'is-on' : ''} onClick={() => r.setRiskAppetite(l)}>{l}</button>
              ))}
            </div>
          </fieldset>
          <fieldset className="field"><legend>Budget per deal (₹ lakh)</legend>
            <input className="input" type="number" min="1" value={inrToLakh(r.prefs.budget)} onChange={(e) => r.setBudget(lakhToInr(e.target.value || 1))} aria-label="Budget in lakh rupees" />
          </fieldset>
          <fieldset className="field"><legend>Industries you like</legend>
            <Chips label="Preferred industries" options={r.industries} selected={r.prefs.industries} onToggle={r.toggleIndustry} />
          </fieldset>
          <p className="hint">Score = risk {WEIGHTS.risk} + industry {WEIGHTS.industry} + budget {WEIGHTS.budget} + ROI {WEIGHTS.roi}.</p>
        </Card>

        <div className="reco__list">
          {r.status === 'failed' ? <ErrorState message={r.error} onRetry={r.retry} />
            : r.status === 'loading' ? Array.from({ length: 5 }, (_, i) => <Skeleton key={i} height={110} radius={16} />)
            : (
              <>
                {r.ranked.slice(0, limit).map((item, i) => (
                  <MatchCard key={item.deal.id} rank={i + 1} item={item} saved={isInterested(item.deal.id)} onToggle={toggle} />
                ))}
                {limit < r.ranked.length && <button className="btn" onClick={() => setLimit((l) => l + 10)}>Show more ({r.ranked.length - limit} left)</button>}
              </>
            )}
        </div>
      </div>
    </>
  );
}
