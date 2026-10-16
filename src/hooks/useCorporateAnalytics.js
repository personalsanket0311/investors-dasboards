'use client';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCorporate } from '@/store/corporateSlice';
import { formatMonth } from '@/utils/format';

export default function useCorporateAnalytics() {
  const dispatch = useDispatch();
  const { data, status, error } = useSelector((s) => s.corporate);
  useEffect(() => { dispatch(fetchCorporate()); }, [dispatch]);
  const monthly = useMemo(() => (data ? data.monthly.map((m) => ({ ...m, label: formatMonth(m.month) })) : []), [data]);
  return { data, monthly, status, error, retry: () => dispatch(fetchCorporate()) };
}
