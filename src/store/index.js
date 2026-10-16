import { configureStore } from '@reduxjs/toolkit';
import deals from './dealsSlice';
import investor from './investorSlice';
import corporate from './corporateSlice';
import interests from './interestsSlice';
import ui from './uiSlice';

export const makeStore = () => configureStore({ reducer: { deals, investor, corporate, interests, ui } });
