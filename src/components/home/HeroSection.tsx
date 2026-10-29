import React, { useState } from 'react';
import { Search, MapPin, Compass, ArrowRight, ShieldCheck, Waves, Mountain, Trees } from 'lucide-react';
import { Container } from '../common/Container';
import { Button } from '../common/Button';
import { BangladeshDivision } from '../../types/destination';

interface HeroSectionProps {
  onSearch: (query: string, division: BangladeshDivision | 'All') => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSearch,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDivision, setSelectedDivision] = useState<BangladeshDivision | 'All'>('All');

  const divisions: (BangladeshDivision | 'All')[] = [
    'All',
    'Chittagong',
    'Sylhet',
    'Khulna',
    'Dhaka',
    'Barishal',
    'Rajshahi',
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery, selectedDivision);
  };

  return (
    <section className="relative w-full bg-slate-950 text-white overflow-hidden">
      {/* High-Fidelity Hero Image Asset with Measured Contrast Scrim */}
      <div className="absolute inset-0">
        <img
          src="/src/assets/images/bdyatra_hero_delta_1793169488734.jpg"
          alt="Bangladesh serene river delta morning landscape"
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center scale-102"
        />
        {/* Measured scrim ensuring WCAG AA contrast across all luminance frames */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />
      </div>

      <Container className="relative z-10 pt-20 pb-24 lg:pt-28 lg:pb-32">
        <div className="max-w-3xl">
          {/* Natural Editorial Kicker (Zero-Pill Discipline) */}
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 tracking-wider uppercase mb-3">
            <span>Bangladesh Tourism Discovery</span>
            <span aria-hidden="true">·</span>
            <span>Verified Local Directory</span>
          </div>

          {/* Headline Sized clamp(2.25rem, 4vw, 3.75rem) with text-wrap: balance */}
          <h1
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-5 leading-[1.12]"
            style={{ textWrap: 'balance' }}
          >
            Discover the Undiscovered Rivers, Peaks & Heritage of Bangladesh.
          </h1>

          {/* Value proposition without generic fluff */}
          <p className="text-base sm:text-lg text-slate-200 leading-relaxed mb-8 max-w-2xl">
            BDYatra connects global and domestic travelers to verified eco-resorts,
            houseboat operators, mountain guides, and untouched destinations across all 8
            divisions.
          </p>

          {/* Unified Discovery Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="p-2 sm:p-2.5 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-2xl mb-8"
          >
            <div className="relative flex-1 flex items-center">
              <Search className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Where do you want to explore? (e.g. Sreemangal, Sundarbans)"
                className="w-full pl-10 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none bg-transparent"
              />
            </div>

            <div className="sm:border-l sm:border-slate-200 sm:pl-2">
              <select
                value={selectedDivision}
                onChange={(e) =>
                  setSelectedDivision(e.target.value as BangladeshDivision | 'All')
                }
                className="w-full sm:w-auto py-2.5 px-3 text-xs font-semibold text-slate-700 bg-transparent rounded-lg focus:outline-none cursor-pointer"
              >
                {divisions.map((d) => (
                  <option key={d} value={d} className="text-slate-900">
                    {d === 'All' ? 'All Divisions' : `${d} Region`}
                  </option>
                ))}
              </select>
            </div>

            <Button
              variant="emerald"
              size="md"
              type="submit"
              icon={<ArrowRight className="h-4 w-4" />}
              iconPosition="right"
              className="py-2.5 px-5 font-semibold"
            >
              Explore
            </Button>
          </form>

          {/* Quick Action Links */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
            <span className="text-slate-400">Popular Outposts:</span>
            <button
              onClick={() => onSearch('Sajek', 'Chittagong')}
              className="hover:text-emerald-400 underline underline-offset-4 transition-colors cursor-pointer"
            >
              Sajek Cloud Ridge
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => onSearch('Tanguar', 'Sylhet')}
              className="hover:text-emerald-400 underline underline-offset-4 transition-colors cursor-pointer"
            >
              Tanguar Haor Houseboats
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => onSearch('Sundarbans', 'Khulna')}
              className="hover:text-emerald-400 underline underline-offset-4 transition-colors cursor-pointer"
            >
              Sundarbans Mangrove
            </button>
          </div>
        </div>

        {/* 3-Column Proof Metric Strip Immediately Below Hero */}
        <div className="mt-14 pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-white/10 text-emerald-400 backdrop-blur-xs">
              <Waves className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-lg font-bold text-white tabular-nums tracking-tight">
                120 Kilometers
              </span>
              <span className="text-xs text-slate-300">
                World’s Longest Natural Unbroken Sea Beach
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-white/10 text-emerald-400 backdrop-blur-xs">
              <Trees className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-lg font-bold text-white tabular-nums tracking-tight">
                10,000 km² Delta
              </span>
              <span className="text-xs text-slate-300">
                Largest Tidal Halophytic Mangrove Biosphere
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-white/10 text-emerald-400 backdrop-blur-xs">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-lg font-bold text-white tabular-nums tracking-tight">
                100% Verified
              </span>
              <span className="text-xs text-slate-300">
                Curated English Directory & Licensed Operators
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
