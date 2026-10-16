'use client';
import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleInterest, clearInterests } from '@/store/interestsSlice';
import { fetchAllDeals } from '@/store/dealsSlice';

export function useInterestToggle() {
  const dispatch = useDispatch();
  const ids = useSelector((s) => s.interests.ids);
  const isInterested = useCallback((id) => ids.includes(id), [ids]);
  const toggle = useCallback((id) => dispatch(toggleInterest(id)), [dispatch]);
  return { ids, isInterested, toggle };
}

export default function useInterests() {
  const dispatch = useDispatch();
  const { ids, toggle } = useInterestToggle();
  const all = useSelector((s) => s.deals.all);
  useEffect(() => { dispatch(fetchAllDeals()); }, [dispatch]);

  const saved = useMemo(() => all.items.filter((d) => ids.includes(d.id)), [all.items, ids]);
  const summary = useMemo(() => ({
    count: saved.length,
    minTotal: saved.reduce((s, d) => s + d.minInvestment, 0),
    avgRoi: saved.length ? saved.reduce((s, d) => s + d.expectedRoi, 0) / saved.length : 0,
  }), [saved]);

  return {
    saved, summary, status: all.status, error: all.error, toggle,
    clear: () => dispatch(clearInterests()),
    retry: () => dispatch(fetchAllDeals()),
  };
}
