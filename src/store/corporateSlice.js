import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { corporateService } from '@/services/corporateService';

export const fetchCorporate = createAsyncThunk('corporate/fetch', () => corporateService.getAnalytics(), {
  condition: (_, { getState }) => ['idle', 'failed'].includes(getState().corporate.status),
});

const slice = createSlice({
  name: 'corporate',
  initialState: { data: null, status: 'idle', error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchCorporate.pending, (s) => { s.status = 'loading'; s.error = null; })
      .addCase(fetchCorporate.fulfilled, (s, a) => { s.status = 'succeeded'; s.data = a.payload; })
      .addCase(fetchCorporate.rejected, (s, a) => { s.status = 'failed'; s.error = a.error.message; });
  },
});
export default slice.reducer;
