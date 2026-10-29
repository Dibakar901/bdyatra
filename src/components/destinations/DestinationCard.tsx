import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Star,
  Calendar,
  ArrowRight,
  Compass,
  Bookmark,
  DollarSign,
  Clock,
} from 'lucide-react';
import { Destination } from '../../types/destination';

interface DestinationCardProps {
  destination: Destination;
  onSelect: (destination: Destination) => void;
  onBookmarkToggle?: (destId: string, isSaved: boolean) => void;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  onSelect,
  onBookmarkToggle,
}) => {
  const [imageError, setImageError] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('bdyatra_saved_destinations');
      if (raw) {
        const savedList: string[] = JSON.parse(raw);
        setIsSaved(savedList.includes(destination.id));
      }
    } catch {
      // Ignore localStorage error
    }
  }, [destination.id]);

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const raw = localStorage.getItem('bdyatra_saved_destinations');
      const savedList: string[] = raw ? JSON.parse(raw) : [];
      let updated: string[];
      if (savedList.includes(destination.id)) {
        updated = savedList.filter((id) => id !== destination.id);
        setIsSaved(false);
      } else {
        updated = [...savedList, destination.id];
        setIsSaved(true);
      }
      localStorage.setItem('bdyatra_saved_destinations', JSON.stringify(updated));
      if (onBookmarkToggle) {
        onBookmarkToggle(destination.id, !isSaved);
      }
    } catch {
      // Ignore
    }
  };

  return (
    <article
      onClick={() => onSelect(destination)}
      className="group relative flex flex-col overflow-hidden rounded-xl bg-white border border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer text-left"
    >
      {/* Visual Asset Container */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100">
        {!imageError ? (
          <img
            src={destination.image}
            alt={`${destination.name}, ${destination.district}, Bangladesh`}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div
            className={`h-full w-full bg-gradient-to-br ${
              destination.fallbackGradient || 'from-emerald-900 to-slate-900'
            } flex flex-col items-center justify-center p-6 text-white`}
          >
            <Compass className="h-10 w-10 text-emerald-300/80 mb-2" />
            <span className="text-sm font-semibold tracking-wide text-center">
              {destination.name}
            </span>
            <span className="text-xs text-white/70">{destination.district}</span>
          </div>
        )}

        {/* Subtle media scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-slate-950/20 pointer-events-none" />

        {/* Top Badges & Bookmark */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="text-[11px] font-bold bg-slate-900/85 backdrop-blur-md text-emerald-300 px-2.5 py-1 rounded-md border border-white/10 shadow-xs">
            {destination.division} Division
          </span>

          <button
            type="button"
            onClick={handleBookmarkClick}
            className={`p-1.5 rounded-lg backdrop-blur-md transition-colors cursor-pointer ${
              isSaved
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-black/40 text-white/80 hover:text-white hover:bg-black/60'
            }`}
            title={isSaved ? 'Remove from Saved' : 'Save Destination'}
            aria-label={isSaved ? 'Remove from Saved' : 'Save Destination'}
          >
            <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Division & District Overlay at Bottom of Photo */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-1 font-medium drop-shadow-xs truncate max-w-[170px]">
            <MapPin className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">
              {destination.district}
            </span>
          </div>
          <div className="flex items-center gap-1 font-semibold tabular-nums drop-shadow-xs shrink-0">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span>{destination.rating.toFixed(1)}</span>
            <span className="text-white/80">({destination.reviewCount})</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-5">
        {/* Unboxed Metadata (Zero-Pill Discipline) */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-2">
          <span className="font-semibold text-emerald-700">{destination.category}</span>
          {destination.bestSeason && (
            <>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 font-medium">
                <Calendar className="h-3 w-3 text-slate-400" />
                <span>{destination.bestSeason.split('(')[0].trim()}</span>
              </span>
            </>
          )}
          {destination.estimatedBudget && (
            <>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums text-slate-600 font-medium">
                {destination.estimatedBudget.split('-')[0].trim()}
              </span>
            </>
          )}
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-900 tracking-tight group-hover:text-emerald-700 transition-colors line-clamp-1 mb-1.5">
          {destination.name}
        </h3>

        {/* Tagline / Brief Description */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
          {destination.description}
        </p>

        {/* Footer Details: Best Season & Estimated Budget */}
        <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-slate-500 truncate max-w-[160px]">
            <Calendar className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <span className="truncate">{destination.bestSeason.split('(')[0].trim()}</span>
          </div>

          <div className="flex items-center gap-1 font-semibold text-slate-900 whitespace-nowrap shrink-0 group-hover:text-emerald-700 transition-colors">
            <span>Explore Guide</span>
            <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </article>
  );
};
