// Deterministic mock-data generator. Run: npm run generate:data
import { writeFileSync, mkdirSync } from 'node:fs';

const REF = new Date('2026-10-01T00:00:00Z');
const DAY = 86400000;

function mulberry32(a) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(3108);
const between = (a, b) => a + rand() * (b - a);
const int = (a, b) => Math.floor(between(a, b + 1));
const pick = (arr) => arr[int(0, arr.length - 1)];
const roundTo = (n, step) => Math.round(n / step) * step;
const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));
const r1 = (n) => Math.round(n * 10) / 10;
const iso = (d) => new Date(d).toISOString().slice(0, 10);

const INDUSTRIES = {
  FinTech: { suffixes: ['Pay', 'Ledger', 'Capital', 'Credit'], blurb: 'digital lending and payments infrastructure for small businesses' },
  HealthTech: { suffixes: ['Health', 'Care', 'Diagnostics', 'Labs'], blurb: 'affordable diagnostics and telehealth for tier-2 cities' },
  AgriTech: { suffixes: ['Agro', 'Kisan', 'Harvest', 'Farms'], blurb: 'supply-chain and yield analytics for farmers' },
  'Clean Energy': { suffixes: ['Solar', 'Energy', 'Power', 'Grid'], blurb: 'rooftop solar and battery storage for industrial parks' },
  EdTech: { suffixes: ['Learn', 'Academy', 'Shala', 'Skills'], blurb: 'vernacular upskilling programmes for job seekers' },
  'E-commerce': { suffixes: ['Bazaar', 'Mart', 'Cart', 'Kart'], blurb: 'a direct-to-consumer marketplace for regional brands' },
  Logistics: { suffixes: ['Logistics', 'Freight', 'Movers', 'Route'], blurb: 'last-mile delivery and warehouse automation' },
  Manufacturing: { suffixes: ['Industries', 'Works', 'Fabrication', 'Tools'], blurb: 'precision components for auto and electronics makers' },
  SaaS: { suffixes: ['Cloud', 'Stack', 'Soft', 'Flow'], blurb: 'workflow software for mid-sized enterprises' },
  Semiconductors: { suffixes: ['Silicon', 'Chip', 'Micro', 'Fab'], blurb: 'chip design and packaging services for Indian electronics makers' },
};
const PREFIX = ['Bharat', 'Nava', 'Surya', 'Tara', 'Veda', 'Kiran', 'Aarav', 'Ganga', 'Prana', 'Indra', 'Vayu', 'Agni', 'Meru', 'Kaveri', 'Shakti', 'Nirmaan', 'Udaan', 'Sagar', 'Himal', 'Aakar', 'Rudra', 'Lotus', 'Zenith', 'Orion'];
const CITIES = ['Pune', 'Bengaluru', 'Hyderabad', 'Mumbai', 'Chennai', 'Delhi NCR', 'Ahmedabad', 'Jaipur'];
const RISK_KEYS = ['market', 'financial', 'regulatory', 'execution', 'liquidity'];

// ---------- Deals ----------
const industryNames = Object.keys(INDUSTRIES);
const usedNames = new Set();
const deals = [];
for (let i = 1; i <= 72; i++) {
  const industry = industryNames[(i - 1) % industryNames.length];
  let company;
  do { company = `${pick(PREFIX)} ${pick(INDUSTRIES[industry].suffixes)}`; } while (usedNames.has(company));
  usedNames.add(company);

  const riskScore = r1(between(1.5, 9));
  const riskLevel = riskScore <= 3.5 ? 'Low' : riskScore <= 6.5 ? 'Medium' : 'High';
  const expectedRoi = r1(7 + riskScore * 2.6 + between(-3, 5));
  const targetRaise = roundTo(between(10e6, 250e6), 1e6);
  const fraction = between(0.08, 1.08);
  const raised = Math.min(targetRaise, roundTo(targetRaise * fraction, 1e5));
  const status = raised >= targetRaise ? 'Funded' : raised / targetRaise >= 0.85 ? 'Closing' : 'Open';
  const views = int(150, 2600);
  const riskFactors = Object.fromEntries(RISK_KEYS.map((k) => [k, clamp(Math.round(riskScore + between(-2.5, 2.5)), 1, 10)]));

  deals.push({
    id: `deal-${String(i).padStart(3, '0')}`,
    company,
    industry,
    description: `${company} builds ${INDUSTRIES[industry].blurb}.`,
    city: pick(CITIES),
    foundedYear: int(2012, 2023),
    employees: int(12, 480),
    stage: targetRaise < 40e6 ? 'Seed' : targetRaise < 100e6 ? 'Series A' : targetRaise < 180e6 ? 'Series B' : 'Series C',
    riskScore,
    riskLevel,
    riskFactors,
    expectedRoi,
    tenureMonths: pick([24, 36, 48, 60]),
    minInvestment: roundTo(between(50000, 2000000), 10000),
    targetRaise,
    raised,
    status,
    revenue: roundTo(between(5e6, 400e6), 1e5),
    revenueGrowth: int(-5, 95),
    profitMargin: int(-25, 28),
    debtRatio: Math.round(between(0.05, 1.6) * 100) / 100,
    views,
    investorsCount: Math.max(2, Math.round(views * between(0.01, 0.06))),
    createdAt: iso(REF.getTime() - between(30, 720) * DAY),
  });
}

// ---------- Investors ----------
const NAMES = ['Aarav Mehta', 'Diya Kulkarni', 'Rohan Iyer', 'Meera Nair', 'Kabir Singh', 'Ananya Desai', 'Vikram Rao', 'Ishita Shah', 'Arjun Patil', 'Sneha Joshi', 'Nikhil Verma', 'Pooja Reddy', 'Siddharth Jain', 'Tanvi Bhatt'];
const TYPES = ['Angel', 'Venture Fund', 'Family Office', 'Corporate'];
const APPETITES = ['Low', 'Medium', 'High'];
const investors = NAMES.map((name, idx) => {
  const prefs = [...industryNames].sort(() => rand() - 0.5).slice(0, 3);
  return {
    id: `inv-${String(idx + 1).padStart(3, '0')}`,
    name,
    type: pick(TYPES),
    riskAppetite: pick(APPETITES),
    preferredIndustries: prefs,
    budget: roundTo(between(5e5, 5e7), 1e5),
    joinedAt: iso(REF.getTime() - between(60, 900) * DAY),
  };
});
// Investor #1 is the demo "logged-in" persona.
Object.assign(investors[0], { type: 'Angel', riskAppetite: 'Medium', preferredIndustries: ['FinTech', 'SaaS', 'Semiconductors'], budget: 5000000 });

// ---------- Investments ----------
const investments = [];
investors.forEach((inv, idx) => {
  const count = idx === 0 ? 10 : int(3, 8);
  const chosen = [...deals].sort(() => rand() - 0.5).slice(0, count);
  chosen.forEach((deal) => {
    const amount = roundTo(deal.minInvestment * between(1, 3.5), 10000);
    const start = new Date(deal.createdAt).getTime();
    const date = start + rand() * (REF.getTime() - start);
    const elapsedYears = (REF.getTime() - date) / (365 * DAY);
    const perf = between(deal.riskScore > 6 ? -0.4 : 0.2, 1.3);
    investments.push({
      id: `inv-tx-${investments.length + 1}`,
      investorId: inv.id,
      dealId: deal.id,
      amount,
      date: iso(date),
      currentValue: Math.round(amount * (1 + (deal.expectedRoi / 100) * elapsedYears * perf)),
    });
  });
});

mkdirSync(new URL('../src/data/', import.meta.url), { recursive: true });
const write = (name, data) => writeFileSync(new URL(`../src/data/${name}.json`, import.meta.url), JSON.stringify(data, null, 1));
write('deals', deals);
write('investors', investors);
write('investments', investments);
console.log(`Generated ${deals.length} deals, ${investors.length} investors, ${investments.length} investments`);
