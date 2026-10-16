'use client';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useDebounce from './useDebounce';
import {
  fetchDeals, fetchFilterOptions, selectQueryParams, selectActiveFilterCount, selectDealList,
  setSearch, toggleIndustry, toggleRisk, setRange, setSort, setPage, resetFilters,
} from '@/store/dealsSlice';

/** Everything the Deal Explorer screen needs; the component stays presentational. */
export default function useDealExplorer() {
  const dispatch = useDispatch();
  const params = useSelector(selectQueryParams);
  const list = useSelector(selectDealList);
  const options = useSelector((s) => s.deals.options);
  const activeFilterCount = useSelector(selectActiveFilterCount);
  const storedSearch = useSelector((s) => s.deals.filters.search);

  // Debounced search: local input state -> store, 400ms after the user stops typing
  const [searchInput, setSearchInput] = useState(storedSearch);
  const debouncedSearch = useDebounce(searchInput, 400);
  useEffect(() => {
    if (debouncedSearch !== storedSearch) dispatch(setSearch(debouncedSearch));
  }, [debouncedSearch, storedSearch, dispatch]);

  useEffect(() => { dispatch(fetchFilterOptions()); }, [dispatch]);
  useEffect(() => { dispatch(fetchDeals(params)); }, [dispatch, params]);

  const retry = useCallback(() => dispatch(fetchDeals(params)), [dispatch, params]);
  const reset = useCallback(() => { setSearchInput(''); dispatch(resetFilters()); }, [dispatch]);

  return {
    params, list, options, activeFilterCount, searchInput, setSearchInput,
    isSearching: searchInput !== debouncedSearch,
    toggleIndustry: useCallback((v) => dispatch(toggleIndustry(v)), [dispatch]),
    toggleRisk: useCallback((v) => dispatch(toggleRisk(v)), [dispatch]),
    setRange: useCallback((key, value) => dispatch(setRange({ key, value })), [dispatch]),
    setSort: useCallback((sortBy, sortDir) => dispatch(setSort({ sortBy, sortDir })), [dispatch]),
    setPage: useCallback((p) => dispatch(setPage(p)), [dispatch]),
    retry, reset,
  };
}
