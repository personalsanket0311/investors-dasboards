'use client';
import useDealExplorer from '@/hooks/useDealExplorer';
import { useInterestToggle } from '@/hooks/useInterests';
import { PageHeader } from '@/components/ui/Card';
import { Skeleton, ErrorState, EmptyState } from '@/components/ui/Feedback';
import Pagination from '@/components/ui/Pagination';
import Icon from '@/components/ui/Icon';
import DealCard from './DealCard';
import DealFilters from './DealFilters';

const SORTS = [
  { id: 'roi-desc', label: 'Highest ROI', sortBy: 'expectedRoi', sortDir: 'desc' },
  { id: 'risk-asc', label: 'Lowest risk', sortBy: 'riskScore', sortDir: 'asc' },
  { id: 'min-asc', label: 'Lowest minimum', sortBy: 'minInvestment', sortDir: 'asc' },
  { id: 'raised-desc', label: 'Most funded', sortBy: 'raised', sortDir: 'desc' },
  { id: 'new-desc', label: 'Newest', sortBy: 'createdAt', sortDir: 'desc' },
  { id: 'name-asc', label: 'Name A–Z', sortBy: 'company', sortDir: 'asc' },
];

export default function DealExplorer() {
  const x = useDealExplorer();
  const { isInterested, toggle } = useInterestToggle();
  const { list, params } = x;
  const loading = list.status === 'loading' || list.status === 'idle';
  const sortId = SORTS.find((s) => s.sortBy === params.sortBy && s.sortDir === params.sortDir)?.id ?? 'roi-desc';

  return (
    <>
      <PageHeader title="Deal explorer" subtitle="Search and filter every open opportunity. Results come from a simulated API with 300–800 ms latency." />
      <div className="explorer">
        <DealFilters filters={params} options={x.options} activeCount={x.activeFilterCount}
          onIndustry={x.toggleIndustry} onRisk={x.toggleRisk} onRange={x.setRange} onReset={x.reset} />

        <div className="explorer__results">
          <div className="toolbar">
            <label className="search">
              <Icon name="search" />
              <input type="search" placeholder="Search company, industry or city" value={x.searchInput} onChange={(e) => x.setSearchInput(e.target.value)} aria-label="Search deals" />
              {x.isSearching && <span className="search__hint">Typing…</span>}
            </label>
            <label className="select">
              <span>Sort by</span>
              <select value={sortId} onChange={(e) => { const s = SORTS.find((o) => o.id === e.target.value); x.setSort(s.sortBy, s.sortDir); }}>
                {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </label>
          </div>

          <p className="count" aria-live="polite">
            {loading && list.items.length === 0 ? 'Loading deals…' : `${list.total} ${list.total === 1 ? 'deal' : 'deals'} found`}
            {list.fromCache && !loading && <span className="count__cache"> · served from cache</span>}
          </p>

          {list.status === 'failed' ? (
            <ErrorState message={list.error} onRetry={x.retry} />
          ) : loading && list.items.length === 0 ? (
            <div className="grid">{Array.from({ length: 6 }, (_, i) => <Skeleton key={i} height={250} radius={16} />)}</div>
          ) : list.items.length === 0 ? (
            <EmptyState title="No deals match these filters" message="Try widening the ROI or investment range, or clear a filter." actionLabel="Clear all filters" onAction={x.reset} />
          ) : (
            <div className={`grid ${loading ? 'is-refreshing' : ''}`}>
              {list.items.map((d) => <DealCard key={d.id} deal={d} saved={isInterested(d.id)} onToggleSave={toggle} />)}
            </div>
          )}
          <Pagination page={list.page} totalPages={list.totalPages} onChange={x.setPage} />
        </div>
      </div>
    </>
  );
}
