'use client';
// Charts are lazy-loaded: Recharts is only downloaded when a page that draws one renders.
import dynamic from 'next/dynamic';
import { Skeleton } from '../ui/Feedback';

const loading = () => <Skeleton height={260} radius={12} />;
export const TrendChart = dynamic(() => import('./TrendChart'), { ssr: false, loading });
export const BarsChart = dynamic(() => import('./BarsChart'), { ssr: false, loading });
export const DonutChart = dynamic(() => import('./DonutChart'), { ssr: false, loading });
export const ScatterPlot = dynamic(() => import('./ScatterPlot'), { ssr: false, loading });
