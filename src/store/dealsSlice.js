import { createAsyncThunk, createSlice, createSelector } from '@reduxjs/toolkit';
import { dealService } from '@/services/dealService';

const CACHE_TTL = 60_000; // 1 minute

export const initialFilters = {
  search: '', industries: [], risks: [], roiMin: '', roiMax: '', amountMin: '', amountMax: '',
};

/** List query. Results are cached per query key so repeat visits skip the "network". */
export const fetchDeals = createAsyncThunk('deals/fetchDeals', async (params, { getState }) => {
  const key = JSON.stringify(params);
  const cached = getState().deals.cache[key];
  if (cached && Date.now() - cached.ts < CACHE_TTL) return { key, data: cached.data, fromCache: true };
  const data = await dealService.getDeals(params);
  return { key, data, fromCache: false };
});

/** Full catalogue (dashboards, recommendations, saved deals). Fetched once, then reused. */
export const fetchAllDeals = createAsyncThunk(
  'deals/fetchAll',
  () => dealService.getAllDeals(),
  { condition: (_, { getState }) => getState().deals.all.status === 'idle' || getState().deals.all.status === 'failed' },
);

export const fetchFilterOptions = createAsyncThunk(
  'deals/fetchFilterOptions',
  () => dealService.getFilterOptions(),
  { condition: (_, { getState }) => getState().deals.options.status === 'idle' },
);

export const fetchDealById = createAsyncThunk(
  'deals/fetchById',
  (id) => dealService.getDealById(id),
  { condition: (id, { getState }) => !getState().deals.detail.byId[id] },
);

const slice = createSlice({
  name: 'deals',
  initialState: {
    filters: initialFilters,
    sortBy: 'expectedRoi',
    sortDir: 'desc',
    page: 1,
    pageSize: 9,
    list: { items: [], total: 0, totalPages: 1, status: 'idle', error: null, requestId: null, fromCache: false },
    cache: {},
    all: { items: [], status: 'idle', error: null },
    options: { industries: [], risks: [], status: 'idle' },
    detail: { byId: {}, status: 'idle', error: null },
  },
  reducers: {
    setSearch(state, { payload }) { state.filters.search = payload; state.page = 1; },
    toggleIndustry(state, { payload }) {
      const arr = state.filters.industries;
      state.filters.industries = arr.includes(payload) ? arr.filter((i) => i !== payload) : [...arr, payload];
      state.page = 1;
    },
    toggleRisk(state, { payload }) {
      const arr = state.filters.risks;
      state.filters.risks = arr.includes(payload) ? arr.filter((i) => i !== payload) : [...arr, payload];
      state.page = 1;
    },
    setRange(state, { payload: { key, value } }) { state.filters[key] = value; state.page = 1; },
    setSort(state, { payload: { sortBy, sortDir } }) { state.sortBy = sortBy; state.sortDir = sortDir; state.page = 1; },
    setPage(state, { payload }) { state.page = payload; },
    resetFilters(state) { state.filters = initialFilters; state.page = 1; },
    clearCache(state) { state.cache = {}; },
  },
  extraReducers: (b) => {
    b.addCase(fetchDeals.pending, (s, a) => { s.list.status = 'loading'; s.list.error = null; s.list.requestId = a.meta.requestId; })
      .addCase(fetchDeals.fulfilled, (s, a) => {
        if (s.list.requestId !== a.meta.requestId) return; // ignore stale responses
        const { key, data, fromCache } = a.payload;
        Object.assign(s.list, data, { status: 'succeeded', fromCache });
        if (!fromCache) s.cache[key] = { data, ts: Date.now() };
      })
      .addCase(fetchDeals.rejected, (s, a) => {
        if (s.list.requestId !== a.meta.requestId) return;
        s.list.status = 'failed'; s.list.error = a.error.message;
      })
      .addCase(fetchAllDeals.pending, (s) => { s.all.status = 'loading'; s.all.error = null; })
      .addCase(fetchAllDeals.fulfilled, (s, a) => { s.all = { items: a.payload, status: 'succeeded', error: null }; })
      .addCase(fetchAllDeals.rejected, (s, a) => { s.all.status = 'failed'; s.all.error = a.error.message; })
      .addCase(fetchFilterOptions.pending, (s) => { s.options.status = 'loading'; })
      .addCase(fetchFilterOptions.fulfilled, (s, a) => { s.options = { ...a.payload, status: 'succeeded' }; })
      .addCase(fetchFilterOptions.rejected, (s) => { s.options.status = 'idle'; })
      .addCase(fetchDealById.pending, (s) => { s.detail.status = 'loading'; s.detail.error = null; })
      .addCase(fetchDealById.fulfilled, (s, a) => { s.detail.byId[a.meta.arg] = a.payload; s.detail.status = 'succeeded'; })
      .addCase(fetchDealById.rejected, (s, a) => { s.detail.status = 'failed'; s.detail.error = a.error.message; });
  },
});

export const { setSearch, toggleIndustry, toggleRisk, setRange, setSort, setPage, resetFilters, clearCache } = slice.actions;
export default slice.reducer;

// ---- Selectors (memoised so components only re-render when inputs change) ----
const selectDeals = (s) => s.deals;
export const selectQueryParams = createSelector(
  [(s) => s.deals.filters, (s) => s.deals.sortBy, (s) => s.deals.sortDir, (s) => s.deals.page, (s) => s.deals.pageSize],
  (filters, sortBy, sortDir, page, pageSize) => ({ ...filters, sortBy, sortDir, page, pageSize }),
);
export const selectActiveFilterCount = createSelector([(s) => s.deals.filters], (f) =>
  f.industries.length + f.risks.length + ['roiMin', 'roiMax', 'amountMin', 'amountMax'].filter((k) => f[k] !== '').length,
);
export const selectDealList = createSelector([selectDeals], (d) => d.list);
