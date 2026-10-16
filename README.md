# 3D Bharat Deal Desk

A frontend-only investment dashboard for **investors** and **corporates**, built with Next.js, Redux Toolkit and Recharts. There is no backend: a service layer simulates one with Promises, latency (300-800 ms), filtering, sorting, pagination and optional random failures.

## Run it

```bash
npm install
npm run dev             # http://localhost:3000
npm run build && npm start
npm run generate:data   # optional: regenerate the mock JSON (deterministic)
```

Deploy: push to GitHub, import the repo in Vercel, keep the defaults.

## What is built

| Area | Route | Highlights |
|---|---|---|
| Investor dashboard | `/` | 4 summary cards, growth (area), industry (donut), risk vs ROI (scatter), holdings table |
| Deal explorer | `/deals` | Debounced search, industry/risk/ROI/amount filters, 6 sorts, pagination, skeleton/error/empty states, cache indicator |
| Deal details | `/deals/[id]` | Tabs (overview, financials, ROI projection, risk), accordion, scenario chart |
| Recommendations | `/recommendations` | Match score out of 100 with breakdown, editable preferences, memoised ranking |
| My interests | `/interests` | Save/remove deals, persisted in `localStorage` |
| Corporate view | `/corporate` | Total funding, investors, conversion rate, trend/bar/donut charts, top deals |
| UI | everywhere | Dark mode (no flash), responsive layout, "Simulate API errors" switch |

## Architecture

```
src/
  app/            Next.js routes: thin server components that render a feature
  features/       One folder per feature: screen components (presentational only)
    deals/ investor/ recommendations/ interests/ corporate/
  components/     Reusable UI: ui/ (cards, tabs, badges...), charts/, layout/
  hooks/          All screen logic: data fetching, derived data, debouncing
  store/          Redux Toolkit slices + StoreProvider (hydration & persistence)
  services/       Simulated backend (dealService, investorService, corporateService)
  utils/          Pure functions: scoring, stats, projections, formatting
  data/           Mock JSON: 72 deals, 14 investors, 82 investments
```

Rule of the codebase: **components render, hooks orchestrate, utils compute, services fetch.** Feature components contain no filtering, scoring or aggregation logic.

## Data flow

```
Component ──> hook ──> dispatch(thunk) ──> service (Promise + delay + errors)
    ^                         |                          |
    |                         v                          v
    └──── selectors <──── slice (loading / error / data / cache) <── mock JSON
```

1. A screen calls a hook (e.g. `useDealExplorer`).
2. The hook dispatches a thunk with the current query (filters, sort, page).
3. The thunk checks the **cache** (keyed by the serialised query, 60 s TTL). On a miss it calls the service.
4. The service waits 300-800 ms, optionally throws a simulated error, then filters, sorts and paginates the JSON as a real API would.
5. The slice stores `status` (`idle | loading | succeeded | failed`), `error`, results and cache. Components render loading, error, empty or data states from it.

## Optimisation strategies

- **Debounced search** (400 ms) so typing does not fire a request per keystroke.
- **Stale-response protection**: each list request stores its `requestId`; late responses from older queries are ignored.
- **Redux caching**: repeat queries within 60 s resolve instantly ("served from cache" is shown). The full catalogue and filter options are fetched once and reused (`condition` guards on the thunks).
- **Memoisation**: `createSelector` for query params and filter counts; `useMemo` for portfolio stats, ranked recommendations and ROI projections; `useCallback` for handlers; `React.memo` on `DealCard`, `MatchCard` and `InterestButton`.
- **Paginated rendering**: only 9 deals are rendered at a time, so the list stays fast as the dataset grows.
- **Lazy loading**: all Recharts components load through `next/dynamic` (client only), so chart code is downloaded only on pages that draw charts.
- **No layout flash**: the theme is applied by an inline script before first paint; saved interests hydrate after mount to avoid SSR mismatches.

## Recommendation engine

`utils/scoring.js` gives each open deal a score out of 100:

- Risk match (30): distance between the deal's risk score and the investor's appetite
- Industry match (25): preferred industries score highest
- Budget fit (25): rewards deals that use the budget well, penalises deals above it
- ROI appeal (20): expected ROI normalised between 8% and 40%

## Trade-offs and next steps

- The demo investor (`inv-001`) stands in for authentication.
- Numeric filter inputs are not debounced (the cache and stale-response guard keep this safe).
- Next steps: virtualised list (`react-window`) or infinite scroll, unit tests for `utils/`, compare-deals view, role switch between investor and corporate.
