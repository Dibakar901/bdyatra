import React, { useState } from 'react';
import {
  MapPin,
  Star,
  Calendar,
  Compass,
  CheckCircle2,
  ExternalLink,
  Phone,
  Globe,
  Map,
} from 'lucide-react';
import { Destination } from '../../types/destination';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

interface DestinationDetailModalProps {
  destination: Destination | null;
  isOpen: boolean;
  onClose: () => void;
  onPlanTripForDestination: (destination: Destination) => void;
  onViewDirectoryForDestination: (destination: Destination) => void;
}

export const DestinationDetailModal: React.FC<DestinationDetailModalProps> = ({
  destination,
  isOpen,
  onClose,
  onPlanTripForDestination,
  onViewDirectoryForDestination,
}) => {
  const [imageError, setImageError] = useState(false);

  if (!destination) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="4xl"
      title={destination.name}
      subtitle={`${destination.district}, ${destination.division} Division, Bangladesh`}
    >
      <div className="space-y-6">
        {/* Banner Image */}
        <div className="relative aspect-16/9 w-full overflow-hidden rounded-xl bg-slate-900 shadow-inner">
          {!imageError ? (
            <img
              src={destination.image}
              alt={destination.name}
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className="h-full w-full object-cover"
            />
          ) : (
            <div
              className={`h-full w-full bg-gradient-to-br ${
                destination.fallbackGradient || 'from-emerald-950 to-slate-900'
              } flex flex-col items-center justify-center p-6 text-white`}
            >
              <Compass className="h-12 w-12 text-emerald-300 mb-2" />
              <span className="text-lg font-bold">{destination.name}</span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-end justify-between gap-2 text-white">
            <div>
              <p className="text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-1">
                {destination.category}
              </p>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-sm">
                {destination.name}
              </h2>
            </div>
            <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-semibold">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="tabular-nums text-white">{destination.rating.toFixed(1)}</span>
              <span className="text-slate-300">({destination.reviewCount} reviews)</span>
            </div>
          </div>
        </div>

        {/* Quick Facts Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg shrink-0">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <span className="block text-slate-400 uppercase font-bold text-[10px]">
                Best Season
              </span>
              <span className="font-semibold text-slate-800">
                {destination.bestSeason || 'All Year Round'}
              </span>
            </div>
          </div>

          {destination.estimatedBudget && (
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 text-amber-800 rounded-lg shrink-0">
                <Compass className="h-4 w-4" />
              </div>
              <div>
                <span className="block text-slate-400 uppercase font-bold text-[10px]">
                  Estimated Budget
                </span>
                <span className="font-semibold text-slate-800 tabular-nums">
                  {destination.estimatedBudget}
                </span>
              </div>
            </div>
          )}

          {destination.phone && (
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 text-blue-800 rounded-lg shrink-0">
                <Phone className="h-4 w-4" />
              </div>
              <div>
                <span className="block text-slate-400 uppercase font-bold text-[10px]">
                  Contact Phone
                </span>
                <a
                  href={`tel:${destination.phone}`}
                  className="font-semibold text-slate-800 hover:text-emerald-700"
                >
                  {destination.phone}
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Description & Overview */}
        <div>
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
            Destination Overview
          </h4>
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            {destination.description}
          </p>
        </div>

        {/* Location & Map Links */}
        {(destination.googleMapUrl || destination.website) && (
          <div className="flex flex-wrap gap-3 pt-2">
            {destination.googleMapUrl && (
              <a
                href={destination.googleMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-semibold border border-emerald-200 hover:bg-emerald-100 transition-colors"
              >
                <Map className="h-4 w-4 text-emerald-600" />
                <span>View Google Map</span>
                <ExternalLink className="h-3 w-3 opacity-60" />
              </a>
            )}

            {destination.website && (
              <a
                href={destination.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-800 rounded-lg text-xs font-semibold border border-slate-200 hover:bg-slate-100 transition-colors"
              >
                <Globe className="h-4 w-4 text-blue-600" />
                <span>Visit Official Website</span>
                <ExternalLink className="h-3 w-3 opacity-60" />
              </a>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={() => {
              onClose();
              onViewDirectoryForDestination(destination);
            }}
            icon={<ExternalLink className="h-4 w-4" />}
            className="w-full sm:w-auto"
          >
            Find Local Resorts & Guides
          </Button>

          <Button
            variant="emerald"
            size="md"
            onClick={() => {
              onClose();
              onPlanTripForDestination(destination);
            }}
            icon={<Compass className="h-4 w-4" />}
            className="w-full sm:w-auto"
          >
            Explore Directory Listings
          </Button>
        </div>
      </div>
    </Modal>
  );
};
