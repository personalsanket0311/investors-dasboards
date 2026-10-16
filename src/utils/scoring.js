// Recommendation engine: pure functions, memoised by the calling hook.
export const WEIGHTS = { risk: 30, industry: 25, budget: 25, roi: 20 };
const RISK_TARGET = { Low: 2.5, Medium: 5, High: 8 };
const clamp01 = (n) => Math.min(1, Math.max(0, n));

export function scoreDeal(deal, prefs) {
  const riskFit = clamp01(1 - Math.abs(deal.riskScore - RISK_TARGET[prefs.riskAppetite]) / 9);

  const industryFit = prefs.industries.length === 0 ? 0.5 : prefs.industries.includes(deal.industry) ? 1 : 0.2;

  const ratio = deal.minInvestment / Math.max(prefs.budget, 1);
  // Under budget: reward deals that use capital well. Over budget: penalise steeply.
  const budgetFit = ratio <= 1 ? 0.6 + 0.4 * ratio : clamp01(0.5 - (ratio - 1));

  const roiFit = clamp01((deal.expectedRoi - 8) / 32);

  const breakdown = {
    risk: Math.round(riskFit * WEIGHTS.risk),
    industry: Math.round(industryFit * WEIGHTS.industry),
    budget: Math.round(budgetFit * WEIGHTS.budget),
    roi: Math.round(roiFit * WEIGHTS.roi),
  };
  const score = breakdown.risk + breakdown.industry + breakdown.budget + breakdown.roi;
  return { score, breakdown };
}

/** Score every open deal and sort by match. */
export function rankDeals(deals, prefs) {
  return deals
    .filter((d) => d.status !== 'Funded')
    .map((deal) => ({ deal, ...scoreDeal(deal, prefs) }))
    .sort((a, b) => b.score - a.score);
}
