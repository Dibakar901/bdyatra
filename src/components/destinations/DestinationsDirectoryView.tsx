import React, { useState } from 'react';
import {
  Compass,
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Sparkles,
  MapPin,
  Clock,
  Star,
  ArrowRight,
  Bookmark,
} from 'lucide-react';
import {
  Destination,
  DestinationFilterState,
  BangladeshDivision,
  DestinationCategory,
} from '../../types/destination';
import { DestinationCard } from './DestinationCard';
import { DestinationFilters } from './DestinationFilters';
import { Button } from '../common/Button';

interface DestinationsDirectoryViewProps {
  destinations: Destination[];
  loading: boolean;
  filters: DestinationFilterState;
  onFilterChange: (filters: DestinationFilterState) => void;
  onSelectDestination: (dest: Destination) => void;
}

export const DestinationsDirectoryView: React.FC<DestinationsDirectoryViewProps> = ({
  destinations,
  loading,
  filters,
  onFilterChange,
  onSelectDestination,
}) => {
  const [layoutMode, setLayoutMode] = useState<'grid' | 'compact'>('grid');

  const featured = destinations.find((d) => d.featured) || destinations[0];

  return (
    <div className="space-y-8">
      {/* Directory Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 tracking-wider uppercase mb-1">
            <Compass className="h-3.5 w-3.5" />
            <span>Curated Directory</span>
            <span aria-hidden="true">·</span>
            <span>All 8 Divisions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Discover Bangladesh Travel Destinations
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Browse authentic rivers, mountain ridges, mangrove deltas, and ancient terracotta
            monasteries with verified logistics and seasonal guidance.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Grid vs Compact List view toggle */}
          <div className="flex items-center p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setLayoutMode('grid')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                layoutMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Grid View"
              aria-label="Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setLayoutMode('compact')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                layoutMode === 'compact'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Compact View"
              aria-label="Compact View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Featured Destination Hero Spotlight (Only shown when not actively searching) */}
      {!filters.searchQuery && filters.division === 'All' && !filters.district && featured && (
        <div
          onClick={() => onSelectDestination(featured)}
          className="group relative rounded-2xl overflow-hidden bg-slate-950 text-white cursor-pointer shadow-md border border-slate-800 transition-all hover:shadow-xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
            <div className="lg:col-span-7 relative aspect-16/9 lg:aspect-auto h-64 lg:h-full overflow-hidden">
              <img
                src={featured.image}
                alt={featured.name}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent lg:hidden" />
            </div>

            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-slate-900/95 lg:border-l border-slate-800">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-2">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span className="uppercase tracking-wider">Featured Outpost Spotlight</span>
                  <span aria-hidden="true">·</span>
                  <span>{featured.division}</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-emerald-300 transition-colors mb-2">
                  {featured.name}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4 line-clamp-3">
                  {featured.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mb-4">
                  <span className="text-white font-medium">{featured.category}</span>
                  {featured.estimatedBudget && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-white font-medium">{featured.estimatedBudget}</span>
                    </>
                  )}
                  <span aria-hidden="true">·</span>
                  <div className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="h-3.5 w-3.5 fill-amber-400" />
                    <span>{featured.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Best season: {featured.bestSeason ? featured.bestSeason.split('(')[0] : 'All Year'}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">
                  <span>View Full Guide</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Component */}
      <DestinationFilters
        filters={filters}
        onChange={onFilterChange}
        totalResults={destinations.length}
      />

      {/* Destination Cards Display */}
      {loading ? (
        <div className="py-24 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-r-transparent" />
          <p className="mt-3 text-xs text-slate-500 font-medium">
            Fetching travel destinations from Supabase cluster...
          </p>
        </div>
      ) : destinations.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-2xl border border-slate-200 p-8 space-y-4">
          <Compass className="h-12 w-12 text-slate-300 mx-auto" />
          <div className="max-w-md mx-auto">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              No Destinations Match Your Filter
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We couldn't find destinations matching your current combination of division,
              district, or search keywords.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              onFilterChange({
                division: 'All',
                district: undefined,
                category: 'All',
                searchQuery: '',
              })
            }
          >
            Clear All Filters
          </Button>
        </div>
      ) : layoutMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {destinations.map((dest) => (
            <DestinationCard
              key={dest.id}
              destination={dest}
              onSelect={onSelectDestination}
            />
          ))}
        </div>
      ) : (
        /* Compact List View */
        <div className="space-y-3">
          {destinations.map((dest) => (
            <div
              key={dest.id}
              onClick={() => onSelectDestination(dest)}
              className="group p-4 bg-white rounded-xl border border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-24 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-xs mb-1">
                    <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                      {dest.division}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500 text-[11px]">{dest.category}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {dest.name}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-1">{dest.tagline}</p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 text-xs text-slate-600 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0">
                <div className="flex items-center gap-1 font-semibold text-slate-900">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span>{dest.rating.toFixed(1)}</span>
                </div>
                {dest.bestSeason && (
                  <div className="flex items-center gap-1 text-slate-500">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{dest.bestSeason.split('(')[0].trim()}</span>
                  </div>
                )}
                {dest.estimatedBudget && (
                  <span className="font-semibold text-slate-900 tabular-nums">
                    {dest.estimatedBudget.split('-')[0].trim()}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 font-bold text-emerald-700 group-hover:translate-x-1 transition-transform">
                  <span>View</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
