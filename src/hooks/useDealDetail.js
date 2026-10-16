'use client';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDealById } from '@/store/dealsSlice';
import { buildRoiProjection, buildRiskFactors, buildRiskNotes } from '@/utils/dealInsights';

export default function useDealDetail(id) {
  const dispatch = useDispatch();
  const deal = useSelector((s) => s.deals.detail.byId[id]);
  const { status, error } = useSelector((s) => s.deals.detail);

  useEffect(() => { dispatch(fetchDealById(id)); }, [dispatch, id]);

  const derived = useMemo(() => {
    if (!deal) return null;
    return {
      projection: buildRoiProjection(deal),
      riskFactors: buildRiskFactors(deal),
      riskNotes: buildRiskNotes(deal),
      fundedPct: Math.round((deal.raised / deal.targetRaise) * 100),
    };
  }, [deal]);

  return {
    deal, derived,
    loading: !deal && status !== 'failed',
    error: !deal && status === 'failed' ? error : null,
    retry: () => dispatch(fetchDealById(id)),
  };
}
