/** ROI projection for ₹1,00,000 invested: conservative / base / optimistic scenarios. */
export function buildRoiProjection(deal, principal = 100000) {
  const base = deal.expectedRoi / 100;
  const conservative = base * (1 - deal.riskScore * 0.07);
  const optimistic = base * (1 + deal.riskScore * 0.05);
  const points = [];
  for (let m = 0; m <= deal.tenureMonths; m += 6) {
    const f = (r) => Math.round(principal * Math.pow(1 + r, m / 12));
    points.push({ month: `${m}m`, conservative: f(conservative), base: f(base), optimistic: f(optimistic) });
  }
  return points;
}

export const buildRiskFactors = (deal) =>
  Object.entries(deal.riskFactors).map(([name, score]) => ({ name: name[0].toUpperCase() + name.slice(1), score }));

/** Plain-language risk notes shown in the Risk tab accordion. */
export function buildRiskNotes(deal) {
  const notes = [];
  notes.push({
    title: `Overall: ${deal.riskLevel} risk (${deal.riskScore}/10)`,
    body: deal.riskLevel === 'Low'
      ? 'Stable fundamentals and predictable returns. Expect a lower ROI ceiling.'
      : deal.riskLevel === 'Medium'
        ? 'Balanced profile. Returns depend on hitting growth targets over the tenure.'
        : 'High return potential, but meaningful chance of loss. Size the position carefully.',
  });
  notes.push({
    title: deal.profitMargin >= 0 ? 'Profitable operations' : 'Currently loss-making',
    body: `Net margin is ${deal.profitMargin}% with revenue growing ${deal.revenueGrowth}% year on year.`,
  });
  notes.push({
    title: deal.debtRatio > 1 ? 'High leverage' : 'Manageable leverage',
    body: `Debt-to-equity is ${deal.debtRatio}. ${deal.debtRatio > 1 ? 'Debt exceeds equity, so cash flow stress is a concern.' : 'Debt is below equity, giving some cushion.'}`,
  });
  const worst = Object.entries(deal.riskFactors).sort((a, b) => b[1] - a[1])[0];
  notes.push({ title: `Biggest exposure: ${worst[0]}`, body: `${worst[0]} risk scores ${worst[1]}/10, the highest of the five factors assessed.` });
  return notes;
}
