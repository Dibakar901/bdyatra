import React from 'react';
import {
  ShieldCheck,
  Star,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  Check,
} from 'lucide-react';
import { DirectoryListing } from '../../types/directory';
import { Button } from '../common/Button';

interface DirectoryCardProps {
  listing: DirectoryListing;
  onContact?: (listing: DirectoryListing) => void;
}

export const DirectoryCard: React.FC<DirectoryCardProps> = ({
  listing,
  onContact,
}) => {
  return (
    <article className="flex flex-col justify-between rounded-xl bg-white border border-slate-200/90 hover:border-slate-300 p-5 shadow-xs hover:shadow-md transition-all duration-200 text-left">
      <div>
        {/* Header row: Category & Verified status */}
        <div className="flex items-center justify-between gap-2 mb-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500">
            <span className="font-semibold text-emerald-700">{listing.category}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums text-slate-700 font-bold">{listing.priceRange}</span>
          </div>

          {listing.verified && (
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Verified Listing</span>
            </div>
          )}
        </div>

        {/* Listing Title */}
        <h3 className="text-base font-bold text-slate-900 tracking-tight mb-1">
          {listing.name}
        </h3>

        {/* Location & Rating */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-3">
          <div className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-slate-400" />
            <span>
              {listing.district}, {listing.division}
            </span>
          </div>
          <span aria-hidden="true">·</span>
          <div className="flex items-center gap-1 font-semibold text-slate-800">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="tabular-nums">{listing.rating.toFixed(1)}</span>
            <span className="text-slate-400">({listing.reviewCount})</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
          {listing.description}
        </p>

        {/* Services & Amenities */}
        <div className="mb-4">
          <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Key Services & Features
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-700">
            {listing.services.slice(0, 4).map((service, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">{service}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Area: Pricing & Direct Actions */}
      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            Rate Guideline
          </span>
          <span className="font-bold text-slate-900 tabular-nums text-sm">
            {listing.priceRate}
          </span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {listing.website && (
            <a
              href={listing.website}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
              title="Official Website"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
          <a
            href={`tel:${listing.phone}`}
            className="flex-1 sm:flex-none"
          >
            <Button
              variant="outline"
              size="sm"
              icon={<Phone className="h-3.5 w-3.5 text-emerald-600" />}
              className="w-full"
            >
              Call
            </Button>
          </a>
          <a
            href={`mailto:${listing.email}?subject=BDYatra Inquiry for ${encodeURIComponent(listing.name)}`}
            className="flex-1 sm:flex-none"
          >
            <Button
              variant="emerald"
              size="sm"
              icon={<Mail className="h-3.5 w-3.5" />}
              className="w-full"
            >
              Inquire
            </Button>
          </a>
        </div>
      </div>
    </article>
  );
};
