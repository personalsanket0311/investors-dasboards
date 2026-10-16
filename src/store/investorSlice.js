import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { investorService } from '@/services/investorService';

export const fetchPortfolio = createAsyncThunk('investor/fetchPortfolio', () => investorService.getPortfolio(), {
  condition: (_, { getState }) => ['idle', 'failed'].includes(getState().investor.status),
});

const slice = createSlice({
  name: 'investor',
  initialState: {
    profile: null,
    holdings: [],
    status: 'idle',
    error: null,
    prefs: { riskAppetite: 'Medium', industries: [], budget: 5000000 },
    prefsCustomised: false, // true once the user edits (or loads saved) preferences
  },
  reducers: {
    setPrefs(state, { payload }) { state.prefs = { ...state.prefs, ...payload }; state.prefsCustomised = true; },
    toggleIndustryPref(state, { payload }) {
      const arr = state.prefs.industries;
      state.prefs.industries = arr.includes(payload) ? arr.filter((i) => i !== payload) : [...arr, payload];
      state.prefsCustomised = true;
    },
    hydratePrefs(state, { payload }) { state.prefs = payload; state.prefsCustomised = true; },
  },
  extraReducers: (b) => {
    b.addCase(fetchPortfolio.pending, (s) => { s.status = 'loading'; s.error = null; })
      .addCase(fetchPortfolio.fulfilled, (s, a) => {
        s.status = 'succeeded';
        s.profile = a.payload.investor;
        s.holdings = a.payload.holdings;
        if (!s.prefsCustomised) {
          const { riskAppetite, preferredIndustries, budget } = a.payload.investor;
          s.prefs = { riskAppetite, industries: preferredIndustries, budget };
        }
      })
      .addCase(fetchPortfolio.rejected, (s, a) => { s.status = 'failed'; s.error = a.error.message; });
  },
});

export const { setPrefs, toggleIndustryPref, hydratePrefs } = slice.actions;
export default slice.reducer;
