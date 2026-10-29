import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Star,
  Calendar,
  Compass,
  ArrowLeft,
  Share2,
  Bookmark,
  Banknote,
  Lightbulb,
  ExternalLink,
  Phone,
  ShieldCheck,
  Check,
  ChevronRight,
  Globe,
  Map,
} from 'lucide-react';
import { Destination } from '../../types/destination';
import { DirectoryListing } from '../../types/directory';
import { Container } from '../common/Container';

interface DestinationDetailPageProps {
  destination: Destination;
  onBack: () => void;
  onContactListing?: (listing: DirectoryListing) => void;
  relatedListings?: DirectoryListing[];
}

export const DestinationDetailPage: React.FC<DestinationDetailPageProps> = ({
  destination,
  onBack,
  onContactListing,
  relatedListings = [],
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const gallery =
    destination.galleryImages && destination.galleryImages.length > 0
      ? destination.galleryImages
      : [destination.image];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      const raw = localStorage.getItem('bdyatra_saved_destinations');
      if (raw) {
        const saved: string[] = JSON.parse(raw);
        setIsSaved(saved.includes(destination.id));
      }
    } catch {
      // Ignore
    }
  }, [destination.id]);

  const handleToggleBookmark = () => {
    try {
      const raw = localStorage.getItem('bdyatra_saved_destinations');
      const saved: string[] = raw ? JSON.parse(raw) : [];
      let updated: string[];
      if (saved.includes(destination.id)) {
        updated = saved.filter((id) => id !== destination.id);
        setIsSaved(false);
      } else {
        updated = [...saved, destination.id];
        setIsSaved(true);
      }
      localStorage.setItem('bdyatra_saved_destinations', JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}${window.location.pathname}#destination=${destination.id}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const matchingListings = relatedListings.filter(
    (l) =>
      l.destinationId === destination.id ||
      l.district.toLowerCase().includes(destination.district.toLowerCase()) ||
      l.division.toLowerCase() === destination.division.toLowerCase()
  );

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-20">
      {/* Sticky Sub-Header Breadcrumb & Action Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-18 z-30 shadow-xs">
        <Container>
          <div className="py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-slate-500 overflow-x-auto whitespace-nowrap">
              <button
                onClick={onBack}
                className="hover:text-slate-900 font-medium cursor-pointer flex items-center gap-1 text-emerald-700"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Destinations Directory</span>
              </button>
              <ChevronRight className="h-3 w-3 text-slate-400 shrink-0" />
              <span>{destination.division} Division</span>
              <ChevronRight className="h-3 w-3 text-slate-400 shrink-0" />
              <span className="font-semibold text-slate-900 truncate max-w-[200px]">
                {destination.name}
              </span>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium transition-colors cursor-pointer"
                title="Copy Destination Link"
              >
                {copiedLink ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-semibold">Link Copied</span>
                  </>
                ) : (
                  <>
                    <Share2 className="h-3.5 w-3.5 text-slate-500" />
                    <span>Share</span>
                  </>
                )}
              </button>

              <button
                onClick={handleToggleBookmark}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                  isSaved
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700 font-medium'
                }`}
              >
                <Bookmark className={`h-3.5 w-3.5 ${isSaved ? 'fill-emerald-600 text-emerald-600' : ''}`} />
                <span>{isSaved ? 'Saved' : 'Save'}</span>
              </button>
            </div>
          </div>
        </Container>
      </div>

      <Container className="pt-8 space-y-10">
        {/* Destination Header Title & Metadata */}
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs mb-2">
            <span className="font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md">
              {destination.division} Division
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="font-semibold text-slate-600">{destination.category}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="flex items-center gap-1 text-slate-600 font-medium">
              <MapPin className="h-3.5 w-3.5 text-slate-400" />
              <span>{destination.district}, Bangladesh</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 mb-2">
            {destination.name}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 font-medium max-w-3xl leading-relaxed">
            {destination.tagline}
          </p>
        </div>

        {/* High-Resolution Photo Gallery */}
        <div className="space-y-3">
          {/* Main Large Display Viewport */}
          <div className="relative aspect-16/9 w-full max-h-[540px] overflow-hidden rounded-2xl bg-slate-950 shadow-md">
            <img
              src={gallery[activeImageIndex]}
              alt={`${destination.name} photo ${activeImageIndex + 1}`}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-end justify-between gap-3 text-white">
              <div className="drop-shadow-sm">
                <span className="text-xs text-white/80 font-medium block">
                  Photo {activeImageIndex + 1} of {gallery.length}
                </span>
                <span className="text-sm font-bold text-white">
                  {destination.name} ({destination.district})
                </span>
              </div>

              <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-semibold">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="tabular-nums text-white">{destination.rating.toFixed(1)}</span>
                <span className="text-white/80">({destination.reviewCount} reviews)</span>
              </div>
            </div>
          </div>

          {/* Thumbnail Gallery Strip */}
          {gallery.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {gallery.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative aspect-16/9 w-28 sm:w-36 rounded-lg overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                    activeImageIndex === idx
                      ? 'border-emerald-600 ring-2 ring-emerald-500/20'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`Thumbnail ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Travel Facts KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-5 bg-white rounded-xl border border-slate-200/90 shadow-xs text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl shrink-0">
              <Calendar className="h-4.5 w-4.5" />
            </div>
            <div>
              <span className="block text-slate-400 uppercase font-bold text-[10px]">
                Best Season
              </span>
              <span className="font-bold text-slate-900 text-sm">
                {destination.bestSeason ? destination.bestSeason.split('(')[0].trim() : 'All Year Round'}
              </span>
            </div>
          </div>

          {destination.estimatedBudget && (
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-100 text-amber-800 rounded-xl shrink-0">
                <Banknote className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="block text-slate-400 uppercase font-bold text-[10px]">
                  Estimated Budget
                </span>
                <span className="font-bold text-slate-900 text-sm tabular-nums">
                  {destination.estimatedBudget}
                </span>
              </div>
            </div>
          )}

          {destination.phone && (
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-100 text-blue-800 rounded-xl shrink-0">
                <Phone className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="block text-slate-400 uppercase font-bold text-[10px]">
                  Direct Contact
                </span>
                <a
                  href={`tel:${destination.phone}`}
                  className="font-bold text-slate-900 hover:text-emerald-700 text-sm"
                >
                  {destination.phone}
                </a>
              </div>
            </div>
          )}
        </div>

        {/* 2-Column Main Content & Side Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main 8-Column Narrative */}
          <div className="lg:col-span-8 space-y-8">
            {/* Overview */}
            <section className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                About {destination.name}
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {destination.description}
              </p>
              {destination.climateOverview && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed">
                  <strong className="text-slate-800 font-semibold block mb-1">
                    Weather & Atmosphere:
                  </strong>
                  {destination.climateOverview}
                </div>
              )}
            </section>

            {/* Location & Contact Direct Links */}
            {(destination.googleMapUrl || destination.phone || destination.website) && (
              <section className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
                <h2 className="text-xl font-bold tracking-tight text-slate-900">
                  Location & Contact Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {destination.googleMapUrl && (
                    <a
                      href={destination.googleMapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 p-3.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl font-semibold text-xs hover:bg-emerald-100 transition-colors"
                    >
                      <Map className="h-4 w-4 text-emerald-600" />
                      <span>Google Map Location</span>
                      <ExternalLink className="h-3 w-3 ml-auto opacity-60" />
                    </a>
                  )}

                  {destination.phone && (
                    <a
                      href={`tel:${destination.phone}`}
                      className="flex items-center justify-center gap-2 p-3.5 bg-slate-50 text-slate-800 border border-slate-200 rounded-xl font-semibold text-xs hover:bg-slate-100 transition-colors"
                    >
                      <Phone className="h-4 w-4 text-emerald-600" />
                      <span>{destination.phone}</span>
                    </a>
                  )}

                  {destination.website && (
                    <a
                      href={destination.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 p-3.5 bg-slate-50 text-slate-800 border border-slate-200 rounded-xl font-semibold text-xs hover:bg-slate-100 transition-colors"
                    >
                      <Globe className="h-4 w-4 text-blue-600" />
                      <span>Official Website</span>
                      <ExternalLink className="h-3 w-3 ml-auto opacity-60" />
                    </a>
                  )}
                </div>
              </section>
            )}

            {/* Local Insider Advice */}
            {destination.localTips && destination.localTips.length > 0 && (
              <section className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-emerald-700">
                  <Lightbulb className="h-5 w-5" />
                  <h2 className="text-lg font-bold tracking-tight text-slate-900">
                    Insider Tips for Exploring {destination.name}
                  </h2>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-700">
                  {destination.localTips.map((tip, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 p-3 rounded-lg bg-emerald-50/50 border border-emerald-100"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 shrink-0 mt-1.5" />
                      <span className="leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Right 4-Column Side Panel: Nearby Stays */}
          <div className="lg:col-span-4 space-y-6">
            {/* Travel Guidance Card */}
            <div className="p-6 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-lg space-y-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-600/30 text-emerald-400 flex items-center justify-center">
                <Compass className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight mb-1">
                  Visiting {destination.name}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Plan your visit to {destination.district}, {destination.division} Division. Discover verified regional stays, dining spots, and local travel listings below.
                </p>
              </div>
            </div>

            {/* Verified Local Stays & Directory Listings */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>Verified Stays & Services</span>
                </div>
                <span className="text-[11px] text-slate-400 font-semibold tabular-nums">
                  {matchingListings.length} Available
                </span>
              </div>

              {matchingListings.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-500">
                  <p>No verified listings currently tied to this location.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {matchingListings.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 transition-colors space-y-2 text-xs"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <span className="font-bold text-slate-900 block line-clamp-1">
                            {item.name}
                          </span>
                          <span className="text-[11px] text-emerald-700 font-semibold">
                            {item.category}
                          </span>
                        </div>
                        <span className="font-mono font-bold text-slate-700 text-[11px]">
                          {item.priceRange}
                        </span>
                      </div>

                      <p className="text-slate-600 text-[11px] line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>

                      <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between">
                        <span className="font-semibold text-slate-900 tabular-nums text-[11px]">
                          {item.priceRate}
                        </span>
                        <a
                          href={`tel:${item.phone}`}
                          className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-semibold text-[11px]"
                        >
                          <Phone className="h-3 w-3" />
                          <span>Call Host</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
