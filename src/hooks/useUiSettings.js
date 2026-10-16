'use client';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme, setSimulateErrors } from '@/store/uiSlice';
import { serviceConfig } from '@/services/simulateApi';
import { clearCache } from '@/store/dealsSlice';

export default function useUiSettings() {
  const dispatch = useDispatch();
  const { theme, simulateErrors } = useSelector((s) => s.ui);

  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);
  useEffect(() => { serviceConfig.errorRate = simulateErrors ? 0.35 : 0; }, [simulateErrors]);

  const toggleTheme = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('dealdash:theme', next); } catch { /* ignore */ }
    dispatch(setTheme(next));
  }, [theme, dispatch]);

  const toggleErrors = useCallback(() => {
    dispatch(setSimulateErrors(!simulateErrors));
    dispatch(clearCache());
  }, [simulateErrors, dispatch]);

  return { theme, toggleTheme, simulateErrors, toggleErrors };
}
