import React from 'react';
import { Search, X, CheckSquare, Square } from 'lucide-react';
import {
  DirectoryCategory,
  DirectoryFilterState,
} from '../../types/directory';
import { BangladeshDivision } from '../../types/destination';

interface DirectoryFiltersProps {
  filters: DirectoryFilterState;
  onChange: (filters: DirectoryFilterState) => void;
  totalResults: number;
}

export const DirectoryFilters: React.FC<DirectoryFiltersProps> = ({
  filters,
  onChange,
  totalResults,
}) => {
  const categories: (DirectoryCategory | 'All')[] = [
    'All',
    'Eco Resorts & Hotels',
    'Houseboats & Cruisers',
    'Licensed Tour Guides',
    'Transport & Chander Gari',
    'Heritage Stays',
  ];

  const divisions: (BangladeshDivision | 'All')[] = [
    'All',
    'Chittagong',
    'Sylhet',
    'Khulna',
    'Dhaka',
    'Barishal',
    'Rajshahi',
  ];

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-xs mb-8">
      {/* Search Bar Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onChange({ ...filters, searchQuery: e.target.value })}
            placeholder="Search verified resorts, houseboat names, guides, or transport..."
            className="w-full pl-10 pr-10 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100 transition-colors"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onChange({ ...filters, searchQuery: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-md"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Verified toggle & count */}
        <div className="flex items-center justify-between sm:justify-end gap-4 text-xs">
          <button
            onClick={() => onChange({ ...filters, verifiedOnly: !filters.verifiedOnly })}
            className="flex items-center gap-1.5 text-slate-700 hover:text-slate-900 cursor-pointer font-medium select-none"
          >
            {filters.verifiedOnly ? (
              <CheckSquare className="h-4 w-4 text-emerald-600" />
            ) : (
              <Square className="h-4 w-4 text-slate-400" />
            )}
            <span>Verified Only</span>
          </button>

          <span className="tabular-nums font-semibold text-slate-800">
            {totalResults} {totalResults === 1 ? 'Listing' : 'Listings'}
          </span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="pt-3.5">
        <span className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
          Service Category:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => {
            const isActive = filters.category === cat;
            return (
              <button
                key={cat}
                onClick={() => onChange({ ...filters, category: cat })}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {cat === 'All' ? 'All Services' : cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Division Tabs */}
      <div className="pt-3">
        <span className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
          Division Location:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {divisions.map((div) => {
            const isActive = filters.division === div;
            return (
              <button
                key={div}
                onClick={() => onChange({ ...filters, division: div })}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer border ${
                  isActive
                    ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900'
                }`}
              >
                {div}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
