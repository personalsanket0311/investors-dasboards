import deals from '@/data/deals.json';
import investors from '@/data/investors.json';
import investments from '@/data/investments.json';
import { simulateRequest } from './simulateApi';

const CURRENT_INVESTOR_ID = 'inv-001'; 
const dealMap = new Map(deals.map((d) => [d.id, d]));

export const investorService = {
  /** Investor profile + their holdings joined with deal data. */
  getPortfolio: (investorId = CURRENT_INVESTOR_ID) =>
    simulateRequest(() => {
      const investor = investors.find((i) => i.id === investorId);
      const holdings = investments
        .filter((t) => t.investorId === investorId)
        .map((t) => {
          const d = dealMap.get(t.dealId);
          return {
            ...t,
            company: d.company, industry: d.industry, riskLevel: d.riskLevel,
            riskScore: d.riskScore, expectedRoi: d.expectedRoi, status: d.status,
          };
        })
        .sort((a, b) => a.date.localeCompare(b.date));
      return { investor, holdings };
    }),
  getInvestors: () => simulateRequest(() => investors),
};
