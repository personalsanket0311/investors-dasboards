const inr = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });
const trim = (n) => (n >= 100 ? n.toFixed(0) : n.toFixed(1)).replace(/\.0$/, '');

/** ₹ amounts in Indian units: ₹45 L, ₹12.4 Cr. */
export function formatINR(value, { compact = true } = {}) {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  if (!compact) return `₹${inr.format(value)}`;
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  if (abs >= 1e7) return `${sign}₹${trim(abs / 1e7)} Cr`;
  if (abs >= 1e5) return `${sign}₹${trim(abs / 1e5)} L`;
  return `${sign}₹${inr.format(abs)}`;
}

export const formatPercent = (v, digits = 1) =>
  v === null || v === undefined ? '—' : `${v >= 0 ? '' : '-'}${Math.abs(v).toFixed(digits).replace(/\.0$/, '')}%`;

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export const formatMonth = (key) => {
  const [y, m] = key.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString('en-IN', { month: 'short', year: '2-digit', timeZone: 'UTC' });
};

// ₹ lakh <-> ₹ helpers for filter inputs
export const lakhToInr = (v) => (v === '' || v === null ? '' : Number(v) * 100000);
export const inrToLakh = (v) => (v === '' || v === null ? '' : Number(v) / 100000);
