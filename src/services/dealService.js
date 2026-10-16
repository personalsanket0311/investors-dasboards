import deals from '@/data/deals.json';
import { simulateRequest, ServiceError } from './simulateApi';

const num = (v) => (v === '' || v === null || v === undefined ? null : Number(v));

/** Filtering + sorting + pagination, done where a backend would do it. */
function queryDeals(params = {}) {
  const {
    search = '', industries = [], risks = [], roiMin, roiMax, amountMin, amountMax,
    sortBy = 'expectedRoi', sortDir = 'desc', page = 1, pageSize = 9,
  } = params;

  const q = search.trim().toLowerCase();
  const [rMin, rMax, aMin, aMax] = [num(roiMin), num(roiMax), num(amountMin), num(amountMax)];

  let result = deals.filter((d) => {
    if (q && !`${d.company} ${d.industry} ${d.city} ${d.description}`.toLowerCase().includes(q)) return false;
    if (industries.length && !industries.includes(d.industry)) return false;
    if (risks.length && !risks.includes(d.riskLevel)) return false;
    if (rMin !== null && d.expectedRoi < rMin) return false;
    if (rMax !== null && d.expectedRoi > rMax) return false;
    if (aMin !== null && d.minInvestment < aMin) return false;
    if (aMax !== null && d.minInvestment > aMax) return false;
    return true;
  });

  const dir = sortDir === 'asc' ? 1 : -1;
  result = [...result].sort((a, b) => {
    const [x, y] = [a[sortBy], b[sortBy]];
    return (typeof x === 'string' ? x.localeCompare(y) : x - y) * dir;
  });

  const total = result.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  return { items: result.slice(start, start + pageSize), total, page: safePage, pageSize, totalPages };
}

export const dealService = {
  getDeals: (params) => simulateRequest(() => queryDeals(params)),
  getAllDeals: () => simulateRequest(() => deals),
  getDealById: (id) =>
    simulateRequest(() => {
      const deal = deals.find((d) => d.id === id);
      if (!deal) throw new ServiceError(`Deal "${id}" was not found.`);
      return deal;
    }),
  getFilterOptions: () =>
    simulateRequest(() => ({
      industries: [...new Set(deals.map((d) => d.industry))].sort(),
      risks: ['Low', 'Medium', 'High'],
    })),
};
