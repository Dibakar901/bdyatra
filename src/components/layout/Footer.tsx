import React from 'react';
import { Compass, MapPin, Mail, Phone } from 'lucide-react';
import { Container } from '../common/Container';
import { BangladeshDivision } from '../../types/destination';

export interface FooterProps {
  onSelectDivision: (division: BangladeshDivision) => void;
  onGoHome?: () => void;
  onOpenSEO?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectDivision,
  onGoHome,
  onOpenSEO,
}) => {
  const divisions: BangladeshDivision[] = [
    'Chittagong',
    'Sylhet',
    'Khulna',
    'Barishal',
    'Dhaka',
    'Rajshahi',
    'Rangpur',
    'Mymensingh',
  ];

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1 & 2: Brand & Mission */}
          <div className="lg:col-span-2">
            <button
              onClick={() => {
                if (onGoHome) onGoHome();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2.5 mb-4 text-left cursor-pointer focus-visible:outline-none"
            >
              <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Compass className="h-4.5 w-4.5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                BD<span className="text-emerald-400">Yatra</span>
              </span>
            </button>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed mb-6">
              The premier English-language discovery portal and curated directory for
              tourism in Bangladesh. From ancient mangrove deltas to rolling tea hills and
              untouched mountain ridges, discover authentic journeys with verified operators.
            </p>
            <div className="flex flex-col gap-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Tourism & Heritage Discovery Network, Dhaka, Bangladesh</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>support@bdyatra.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>+880 1800 239287 (BDYATRA)</span>
              </div>
            </div>
          </div>

          {/* Col 3: Explore by Division */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Explore by Division
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              {divisions.slice(0, 5).map((div) => (
                <li key={div}>
                  <button
                    onClick={() => {
                      onSelectDivision(div);
                      window.scrollTo({ top: 500, behavior: 'smooth' });
                    }}
                    className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                  >
                    {div} Division
                  </button>
                </li>
              ))}
              {divisions.slice(5).map((div) => (
                <li key={div}>
                  <button
                    onClick={() => {
                      onSelectDivision(div);
                      window.scrollTo({ top: 500, behavior: 'smooth' });
                    }}
                    className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                  >
                    {div} Division
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Directory & Services */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Directory Services
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <span className="text-emerald-400 font-medium">Verified Regional Directory</span>
              </li>
              <li>
                <span className="hover:text-slate-300">Eco Resorts & Hotels</span>
              </li>
              <li>
                <span className="hover:text-slate-300">Haor Living Houseboats</span>
              </li>
              <li>
                <span className="hover:text-slate-300">Certified Forest Guides</span>
              </li>
              <li>
                <span className="hover:text-slate-300">Hill Tracts 4x4 Chander Gari</span>
              </li>
              <li>
                <span className="hover:text-slate-300">Heritage Inns & Stays</span>
              </li>
            </ul>
          </div>

          {/* Col 5: Travel Tools & Planning */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Planning & Guides
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <span className="text-emerald-400 font-medium">Seasonal Discovery Calendars</span>
              </li>
              <li>
                <span className="hover:text-slate-300">Best Travel Seasons</span>
              </li>
              <li>
                <span className="hover:text-slate-300">Permits for Sajek & Sundarbans</span>
              </li>
              <li>
                <span className="hover:text-slate-300">Railway Express Guide</span>
              </li>
              <li>
                <span className="hover:text-slate-300">Responsible Tourism Code</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} BDYatra Tourism Discovery & Directory. All rights
            reserved. English-only portal.
          </p>
          <div className="flex items-center gap-6">
            {onOpenSEO && (
              <button
                onClick={onOpenSEO}
                className="hover:text-emerald-400 transition-colors cursor-pointer text-left font-medium"
              >
                Sitemap & SEO
              </button>
            )}
            <span>Privacy Policy</span>
            <span aria-hidden="true">·</span>
            <span>Terms of Directory Service</span>
            <span aria-hidden="true">·</span>
            <span>Safety Inquiries</span>
          </div>
        </div>
      </Container>
    </footer>
  );
};
