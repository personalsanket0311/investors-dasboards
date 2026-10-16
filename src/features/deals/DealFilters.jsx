'use client';
import Chips from '@/components/ui/Chips';
import { inrToLakh, lakhToInr } from '@/utils/format';

const RangeInputs = ({ label, unit, minValue, maxValue, onMin, onMax }) => (
  <fieldset className="field">
    <legend>{label}</legend>
    <div className="range">
      <input type="number" min="0" inputMode="decimal" placeholder={`Min ${unit}`} value={minValue} onChange={(e) => onMin(e.target.value)} aria-label={`${label} minimum`} />
      <span>to</span>
      <input type="number" min="0" inputMode="decimal" placeholder={`Max ${unit}`} value={maxValue} onChange={(e) => onMax(e.target.value)} aria-label={`${label} maximum`} />
    </div>
  </fieldset>
);

export default function DealFilters({ filters, options, activeCount, onIndustry, onRisk, onRange, onReset }) {
  return (
    <aside className="filters" aria-label="Filters">
      <div className="filters__head">
        <h2>Filters {activeCount > 0 && <em>{activeCount}</em>}</h2>
        {activeCount > 0 && <button className="link-btn" onClick={onReset}>Clear all</button>}
      </div>
      <fieldset className="field"><legend>Industry</legend>
        <Chips label="Industry" options={options.industries} selected={filters.industries} onToggle={onIndustry} />
      </fieldset>
      <fieldset className="field"><legend>Risk level</legend>
        <Chips label="Risk level" options={options.risks} selected={filters.risks} onToggle={onRisk} />
      </fieldset>
      <RangeInputs label="Expected ROI" unit="%" minValue={filters.roiMin} maxValue={filters.roiMax}
        onMin={(v) => onRange('roiMin', v)} onMax={(v) => onRange('roiMax', v)} />
      <RangeInputs label="Min. investment" unit="₹ L" minValue={inrToLakh(filters.amountMin)} maxValue={inrToLakh(filters.amountMax)}
        onMin={(v) => onRange('amountMin', lakhToInr(v))} onMax={(v) => onRange('amountMax', lakhToInr(v))} />
    </aside>
  );
}
