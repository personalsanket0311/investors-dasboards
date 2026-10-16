'use client';
import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllDeals, fetchFilterOptions } from '@/store/dealsSlice';
import { fetchPortfolio, setPrefs, toggleIndustryPref } from '@/store/investorSlice';
import { rankDeals } from '@/utils/scoring';

export default function useRecommendations() {
  const dispatch = useDispatch();
  const all = useSelector((s) => s.deals.all);
  const industries = useSelector((s) => s.deals.options.industries);
  const { prefs, status: investorStatus } = useSelector((s) => s.investor);

  useEffect(() => {
    dispatch(fetchAllDeals());
    dispatch(fetchPortfolio());
    dispatch(fetchFilterOptions());
  }, [dispatch]);

  // Memoised: re-scores only when the catalogue or the preferences change.
  const ranked = useMemo(() => rankDeals(all.items, prefs), [all.items, prefs]);

  return {
    ranked, prefs, industries,
    status: all.status === 'failed' ? 'failed' : all.status === 'succeeded' && investorStatus !== 'loading' ? 'succeeded' : 'loading',
    error: all.error,
    setRiskAppetite: useCallback((riskAppetite) => dispatch(setPrefs({ riskAppetite })), [dispatch]),
    setBudget: useCallback((budget) => dispatch(setPrefs({ budget })), [dispatch]),
    toggleIndustry: useCallback((i) => dispatch(toggleIndustryPref(i)), [dispatch]),
    retry: () => dispatch(fetchAllDeals()),
  };
}
