import { formatMonth } from './format';

const RISK_ORDER = ['Low', 'Medium', 'High'];

/** All investor-dashboard numbers, derived from raw holdings. Pure function. */
export function computePortfolioStats(holdings = []) {
  const totalInvested = holdings.reduce((s, h) => s + h.amount, 0);
  const currentValue = holdings.reduce((s, h) => s + h.currentValue, 0);
  const roiPct = totalInvested ? ((currentValue - totalInvested) / totalInvested) * 100 : 0;
  const activeDeals = holdings.filter((h) => h.status !== 'Funded').length;
  const avgExpectedRoi = holdings.length ? holdings.reduce((s, h) => s + h.expectedRoi, 0) / holdings.length : 0;

  const riskDistribution = RISK_ORDER.map((name) => ({
    name,
    value: holdings.filter((h) => h.riskLevel === name).length,
  }));

  const industryMap = {};
  holdings.forEach((h) => { industryMap[h.industry] = (industryMap[h.industry] || 0) + h.amount; });
  const industryShare = Object.entries(industryMap).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

  // Cumulative growth by month of investment
  const byMonth = {};
  [...holdings].sort((a, b) => a.date.localeCompare(b.date)).forEach((h) => {
    const key = h.date.slice(0, 7);
    byMonth[key] = byMonth[key] || { invested: 0, value: 0 };
    byMonth[key].invested += h.amount;
    byMonth[key].value += h.currentValue;
  });
  let inv = 0; let val = 0;
  const growth = Object.keys(byMonth).sort().map((key) => {
    inv += byMonth[key].invested; val += byMonth[key].value;
    return { label: formatMonth(key), invested: inv, value: val };
  });

  const riskVsRoi = holdings.map((h) => ({ name: h.company, risk: h.riskScore, roi: h.expectedRoi }));

  return { totalInvested, currentValue, roiPct, activeDeals, avgExpectedRoi, riskDistribution, industryShare, growth, riskVsRoi };
}
