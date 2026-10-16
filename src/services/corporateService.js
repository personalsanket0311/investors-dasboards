import deals from '@/data/deals.json';
import investors from '@/data/investors.json';
import { simulateRequest } from './simulateApi';

const NOW = new Date('2026-10-01T00:00:00Z');
const monthKey = (d) => `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;

/** Aggregations a real backend would run in SQL. */
function buildAnalytics() {
  // Spread each deal's raised amount / views / investors evenly over the months since it opened.
  const months = new Map();
  for (let i = 23; i >= 0; i--) {
    const d = new Date(Date.UTC(NOW.getUTCFullYear(), NOW.getUTCMonth() - i, 1));
    months.set(monthKey(d), { month: monthKey(d), funding: 0, views: 0, investors: 0 });
  }
  deals.forEach((deal) => {
    const start = new Date(deal.createdAt);
    const span = [...months.keys()].filter((k) => k >= monthKey(start));
    span.forEach((k) => {
      const m = months.get(k);
      m.funding += deal.raised / span.length;
      m.views += deal.views / span.length;
      m.investors += deal.investorsCount / span.length;
    });
  });
  let cumulative = 0;
  const monthly = [...months.values()].map((m) => {
    cumulative += m.funding;
    return {
      month: m.month,
      funding: Math.round(m.funding),
      cumulative: Math.round(cumulative),
      conversion: m.views ? Math.round((m.investors / m.views) * 1000) / 10 : 0,
    };
  });

  const byIndustryMap = {};
  const byStatusMap = {};
  deals.forEach((d) => {
    byIndustryMap[d.industry] = (byIndustryMap[d.industry] || 0) + d.raised;
    byStatusMap[d.status] = (byStatusMap[d.status] || 0) + 1;
  });
  const totalViews = deals.reduce((s, d) => s + d.views, 0);
  const totalInvestorActions = deals.reduce((s, d) => s + d.investorsCount, 0);

  return {
    kpis: {
      totalFunding: deals.reduce((s, d) => s + d.raised, 0),
      totalTarget: deals.reduce((s, d) => s + d.targetRaise, 0),
      investorCount: investors.length,
      conversionRate: Math.round((totalInvestorActions / totalViews) * 1000) / 10,
      liveDeals: deals.filter((d) => d.status !== 'Funded').length,
    },
    monthly,
    byIndustry: Object.entries(byIndustryMap).map(([industry, raised]) => ({ industry, raised })).sort((a, b) => b.raised - a.raised),
    byStatus: Object.entries(byStatusMap).map(([name, value]) => ({ name, value })),
    topDeals: [...deals].sort((a, b) => b.raised - a.raised).slice(0, 5).map(({ id, company, industry, raised, targetRaise }) => ({ id, company, industry, raised, targetRaise })),
  };
}

export const corporateService = {
  getAnalytics: () => simulateRequest(buildAnalytics),
};
