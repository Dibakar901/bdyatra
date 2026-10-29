import React from 'react';
import { CloudRain, Sun, Wind, Flower2, ArrowRight } from 'lucide-react';
import { Container } from '../common/Container';

interface TravelGuideHighlightsProps {
  onExploreSeason: (keyword: string) => void;
}

export const TravelGuideHighlights: React.FC<TravelGuideHighlightsProps> = ({
  onExploreSeason,
}) => {
  const seasons = [
    {
      title: 'Monsoon Inland Sea (June – September)',
      subtitle: 'Tanguar Haor & Delta Wetlands',
      icon: CloudRain,
      description:
        'Endless freshwater haors expand beneath the Meghalaya hills. Board wooden living houseboats to drift across crystal waters beneath dramatic monsoon cloudscapes.',
      highlight: 'Houseboat Cruising & Water Lilies',
      keyword: 'Tanguar',
    },
    {
      title: 'Autumn Cloud Oceans (October – November)',
      subtitle: 'Sajek Valley & Bandarban Peaks',
      icon: Wind,
      description:
        'Crisp morning inversions create dramatic seas of fluffy white clouds beneath timber cliff balconies in the Chittagong Hill Tracts. Ideal for 4x4 safaris.',
      highlight: 'Cliff Balconies & Stargazing',
      keyword: 'Sajek',
    },
    {
      title: 'Winter Mild Sanctuary (December – February)',
      subtitle: 'Sreemangal Tea Country & Sundarbans',
      icon: Sun,
      description:
        'Mild, pleasant temperatures averaging 18°C–24°C. Perfect for tea garden cycling in Moulvibazar and deep mangrove wildlife safaris in the Sundarbans.',
      highlight: 'Siberian Migratory Birds & Tea Walks',
      keyword: 'Sreemangal',
    },
    {
      title: 'Spring Heritage Trails (March – May)',
      subtitle: 'Sonargaon, Panam & UNESCO Sites',
      icon: Flower2,
      description:
        'Dry, bright skies ideal for exploring terracotta Buddhist monasteries at Paharpur, merchant ghost cities at Panam, and coastal Marine Drive drives.',
      highlight: 'Terracotta Monasteries & Coastal Drives',
      keyword: 'Panam',
    },
  ];

  return (
    <section className="py-20 bg-slate-900 text-white">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 tracking-wider uppercase mb-2">
              <span>Seasonal Guide</span>
              <span aria-hidden="true">·</span>
              <span>When to Travel</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Seasonal Travel Windows in Bangladesh
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {seasons.map((s, idx) => {
            const IconComponent = s.icon;
            return (
              <div
                key={idx}
                className="flex flex-col justify-between rounded-xl bg-slate-800/80 border border-slate-700/80 p-5 hover:border-emerald-500/50 transition-colors"
              >
                <div>
                  <div className="h-10 w-10 rounded-lg bg-emerald-950 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-4">
                    <IconComponent className="h-5 w-5" />
                  </div>

                  <h3 className="text-sm font-bold text-white mb-1">{s.title}</h3>
                  <p className="text-xs font-medium text-emerald-300 mb-3">{s.subtitle}</p>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {s.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-700">
                  <span className="block text-[11px] font-semibold text-slate-400 mb-2">
                    Key Highlight: <span className="text-slate-200">{s.highlight}</span>
                  </span>
                  <button
                    onClick={() => onExploreSeason(s.keyword)}
                    className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>View Destinations</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
