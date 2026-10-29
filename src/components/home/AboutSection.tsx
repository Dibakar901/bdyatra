import React from 'react';
import { Compass, ShieldCheck, Globe, Sparkles } from 'lucide-react';
import { Container } from '../common/Container';

export const AboutSection: React.FC = () => {
  return (
    <section className="py-20 bg-white border-t border-slate-200">
      <Container>
        <div className="max-w-3xl mx-auto text-center mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 tracking-wider uppercase mb-2">
            <span>About BDYatra</span>
            <span aria-hidden="true">·</span>
            <span>Tourism Discovery & Directory</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            A Modern, English-First Gateway to Bangladesh
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            BDYatra is strictly a premier Bangladesh Travel Discovery & Directory Portal. We do not operate tours, book packages, or provide third-party guided excursions. Instead, we serve as a centralized, high-quality information directory for discovering destinations, verified local hotels, resorts, restaurants, and travel guides across Bangladesh.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 text-left">
            <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
              <Globe className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Comprehensive Directory
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Curated information on tourist spots, administrative divisions, and districts across Bangladesh, providing reliable travel facts and destination guides in English.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 text-left">
            <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center mb-4">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Verified Hospitality & Stays
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Accurate directory listings for hotels, resorts, and dining options without booking or operating claims, helping travelers find reliable local hospitality.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 text-left">
            <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
              <Compass className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Authentic & Verified Content
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Focusing on accurate tourist spots, verified locations, and trusted travel guides across Bangladesh to ensure every traveler explores with accurate information.
            </p>
          </div>
        </div>

        {/* Curated Editorial Portal Card */}
        <div className="rounded-2xl bg-slate-900 text-white p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 text-left">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
              <Sparkles className="h-4 w-4" />
              <span>Independent & Curated</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight mb-2">
              Curated Travel Discovery for Explorers
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              BDYatra focuses purely on verified destination guides, seasonal advice, and curated directories. Discover authentic outposts across Bangladesh with confidence.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
};
