import React from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import {
  BangladeshDivision,
  DestinationCategory,
  DestinationFilterState,
} from '../../types/destination';

interface DestinationFiltersProps {
  filters: DestinationFilterState;
  onChange: (filters: DestinationFilterState) => void;
  totalResults: number;
}

export const DestinationFilters: React.FC<DestinationFiltersProps> = ({
  filters,
  onChange,
  totalResults,
}) => {
  const divisions: (BangladeshDivision | 'All')[] = [
    'All',
    'Chittagong',
    'Sylhet',
    'Khulna',
    'Barishal',
    'Dhaka',
    'Rajshahi',
    'Rangpur',
    'Mymensingh',
  ];

  const categories: (DestinationCategory | 'All')[] = [
    'All',
    'Nature & Wildlife',
    'Beaches & Islands',
    'Hill Tracts',
    'Tea Country',
    'Wetlands & Haor',
    'Heritage & Culture',
  ];

  const handleDivisionChange = (div: BangladeshDivision | 'All') => {
    onChange({ ...filters, division: div, district: undefined });
  };

  const handleCategoryChange = (cat: DestinationCategory | 'All') => {
    onChange({ ...filters, category: cat });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, searchQuery: e.target.value });
  };

  const handleClearSearch = () => {
    onChange({ ...filters, searchQuery: '' });
  };

  const handleResetAll = () => {
    onChange({
      division: 'All',
      district: undefined,
      category: 'All',
      searchQuery: '',
    });
  };

  const hasActiveFilters =
    filters.division !== 'All' ||
    Boolean(filters.district) ||
    filters.category !== 'All' ||
    filters.searchQuery.trim().length > 0;

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-xs mb-8">
      {/* Top Search Bar & Counter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by destination name, district, or attraction (e.g. Inani, Sreemangal, Tiger)..."
            className="w-full pl-10 pr-10 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100 transition-colors"
          />
          {filters.searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-md"
              aria-label="Clear search input"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 text-xs text-slate-500 shrink-0">
          {filters.district && (
            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-md text-xs font-semibold">
              <span>District: {filters.district}</span>
              <button
                onClick={() => onChange({ ...filters, district: undefined })}
                className="hover:text-emerald-950 p-0.5 rounded cursor-pointer"
                title="Clear district filter"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}

          <span className="tabular-nums font-semibold text-slate-800">
            {totalResults} {totalResults === 1 ? 'Destination' : 'Destinations'} Found
          </span>
          {hasActiveFilters && (
            <button
              onClick={handleResetAll}
              className="text-emerald-700 hover:text-emerald-800 font-medium underline underline-offset-2 cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Division Tabs */}
      <div className="pt-3.5">
        <div className="flex items-center gap-2 mb-2">
          <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            Filter by Division:
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {divisions.map((div) => {
            const isActive = filters.division === div;
            return (
              <button
                key={div}
                onClick={() => handleDivisionChange(div)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {div === 'All' ? 'All Divisions' : div}
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="pt-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            Filter by Landscape / Theme:
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => {
            const isActive = filters.category === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer border ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900'
                }`}
              >
                {cat === 'All' ? 'All Landscapes' : cat}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
