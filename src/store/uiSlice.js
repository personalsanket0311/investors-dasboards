import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'ui',
  initialState: { theme: 'light', simulateErrors: false },
  reducers: {
    setTheme(state, { payload }) { state.theme = payload; },
    setSimulateErrors(state, { payload }) { state.simulateErrors = payload; },
  },
});
export const { setTheme, setSimulateErrors } = slice.actions;
export default slice.reducer;
