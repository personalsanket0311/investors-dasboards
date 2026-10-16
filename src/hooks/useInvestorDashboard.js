'use client';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPortfolio } from '@/store/investorSlice';
import { computePortfolioStats } from '@/utils/stats';

export default function useInvestorDashboard() {
  const dispatch = useDispatch();
  const { profile, holdings, status, error } = useSelector((s) => s.investor);
  useEffect(() => { dispatch(fetchPortfolio()); }, [dispatch]);
  const stats = useMemo(() => computePortfolioStats(holdings), [holdings]);
  return { profile, holdings, stats, status, error, retry: () => dispatch(fetchPortfolio()) };
}
