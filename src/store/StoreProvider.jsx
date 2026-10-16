'use client';
import { useEffect, useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore } from './index';
import { hydrateInterests } from './interestsSlice';
import { hydratePrefs } from './investorSlice';
import { setTheme } from './uiSlice';

const KEYS = { interests: 'dealdash:interests', prefs: 'dealdash:prefs' };
const read = (key) => { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } };
const write = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage unavailable */ } };

export default function StoreProvider({ children }) {
  const storeRef = useRef(null);
  if (!storeRef.current) storeRef.current = makeStore();

  useEffect(() => {
    const store = storeRef.current;
    // Hydrate saved state after mount (avoids SSR/client mismatch)
    const ids = read(KEYS.interests);
    if (Array.isArray(ids)) store.dispatch(hydrateInterests(ids));
    const prefs = read(KEYS.prefs);
    if (prefs) store.dispatch(hydratePrefs(prefs));
    store.dispatch(setTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'));

    // Persist only when the relevant slices actually change
    let last = store.getState();
    return store.subscribe(() => {
      const next = store.getState();
      if (next.interests.ids !== last.interests.ids) write(KEYS.interests, next.interests.ids);
      if (next.investor.prefs !== last.investor.prefs && next.investor.prefsCustomised) write(KEYS.prefs, next.investor.prefs);
      last = next;
    });
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
