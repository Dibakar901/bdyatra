import { DivisionRow, DistrictRow } from '../types/supabase';
import { supabase, isSupabaseConfigured, handleSupabaseError } from '../lib/supabase';

export const INITIAL_DIVISIONS: DivisionRow[] = [
  {
    id: 'chittagong',
    name: 'Chittagong',
    tagline: 'Hills, Valleys & 120km Coastline',
    description:
      'Southeastern gateway home to Cox’s Bazar beach, Sajek Valley cloud ridges, and indigenous hill sanctuaries.',
    cover_image: '/src/assets/images/coxs_bazar_shore_1793169489630.jpg',
    coordinates: { lat: 22.3569, lng: 91.7832 },
    created_at: '2026-10-25T00:00:00Z',
  },
  {
    id: 'sylhet',
    name: 'Sylhet',
    tagline: 'Tea Estates, Rain Forests & Endless Haors',
    description:
      'Northeastern paradise known as the tea capital of Bangladesh, featuring Lawachara National Park and Tanguar Haor.',
    cover_image: '/src/assets/images/srimangal_tea_hills_1793169489776.jpg',
    coordinates: { lat: 24.8949, lng: 91.8687 },
    created_at: '2026-10-25T00:00:00Z',
  },
  {
    id: 'khulna',
    name: 'Khulna',
    tagline: 'World’s Largest Mangrove Delta',
    description:
      'Southwestern delta territory home to the UNESCO World Heritage Sundarbans mangrove forest and Royal Bengal Tigers.',
    cover_image: '/src/assets/images/bdyatra_hero_delta_1793169488734.jpg',
    coordinates: { lat: 22.8456, lng: 89.5403 },
    created_at: '2026-10-25T00:00:00Z',
  },
  {
    id: 'barishal',
    name: 'Barishal',
    tagline: 'The Venice of Bengal & Floating Markets',
    description:
      'Southern riverine network known for tranquil backwaters, floating guava markets, and Kuakata panoramic beach.',
    cover_image: '/src/assets/images/bdyatra_hero_delta_1793169488734.jpg',
    coordinates: { lat: 22.701, lng: 90.3535 },
    created_at: '2026-10-25T00:00:00Z',
  },
  {
    id: 'dhaka',
    name: 'Dhaka',
    tagline: 'Historic Delta Capital & Heritage Trails',
    description:
      'Central division brimming with Mughal forts, ancient merchant quarters of Panam Nagar, and artisan Jamdani villages.',
    cover_image: '/src/assets/images/bdyatra_hero_delta_1793169488734.jpg',
    coordinates: { lat: 23.8103, lng: 90.4125 },
    created_at: '2026-10-25T00:00:00Z',
  },
  {
    id: 'rajshahi',
    name: 'Rajshahi',
    tagline: 'Silk City & Ancient Buddhist Monasteries',
    description:
      'Northwestern historical cradle along the Padma River, featuring 8th-century Somapura Mahavihara at Paharpur.',
    cover_image: '/src/assets/images/srimangal_tea_hills_1793169489776.jpg',
    coordinates: { lat: 24.3636, lng: 88.6241 },
    created_at: '2026-10-25T00:00:00Z',
  },
  {
    id: 'rangpur',
    name: 'Rangpur',
    tagline: 'Northern Palaces & Teesta River Vistas',
    description:
      'Northern agricultural heartland with Tajhat Palace and serene Himalayan foothills atmosphere.',
    cover_image: '/src/assets/images/srimangal_tea_hills_1793169489776.jpg',
    coordinates: { lat: 25.7439, lng: 89.2752 },
    created_at: '2026-10-25T00:00:00Z',
  },
  {
    id: 'mymensingh',
    name: 'Mymensingh',
    tagline: 'Garo Hills & Riverine Heritage',
    description:
      'Scenic border district flanking the Garo Hills, Shusong Durgapur white ceramic clay hills, and Brahmaputra riverbanks.',
    cover_image: '/src/assets/images/sajek_valley_clouds_1793169490136.jpg',
    coordinates: { lat: 24.7471, lng: 90.4203 },
    created_at: '2026-10-25T00:00:00Z',
  },
];

export const INITIAL_DISTRICTS: DistrictRow[] = [
  {
    id: 'coxs-bazar',
    division_id: 'chittagong',
    name: 'Cox’s Bazar',
    popular_for: 'World’s longest continuous sea beach, Marine Drive, and Inani coral shore.',
    created_at: '2026-10-25T00:00:00Z',
  },
  {
    id: 'rangamati',
    division_id: 'chittagong',
    name: 'Rangamati',
    popular_for: 'Kaptai Lake, indigenous Chakma crafts, and Sajek Valley cloud peaks.',
    created_at: '2026-10-25T00:00:00Z',
  },
  {
    id: 'bandarban',
    division_id: 'chittagong',
    name: 'Bandarban',
    popular_for: 'Highest mountain ridges, Nilgiri, Boga Lake, and mountain waterfalls.',
    created_at: '2026-10-25T00:00:00Z',
  },
  {
    id: 'moulvibazar',
    division_id: 'sylhet',
    name: 'Moulvibazar',
    popular_for: 'Sreemangal tea estates, Lawachara rain forest, and Seven-Layer Tea.',
    created_at: '2026-10-25T00:00:00Z',
  },
  {
    id: 'sunamganj',
    division_id: 'sylhet',
    name: 'Sunamganj',
    popular_for: 'Tanguar Haor wetland, living luxury houseboats, and Jadukata River.',
    created_at: '2026-10-25T00:00:00Z',
  },
  {
    id: 'bagerhat',
    division_id: 'khulna',
    name: 'Bagerhat',
    popular_for: 'Sundarbans mangrove entry port and Sixty Dome UNESCO Mosque.',
    created_at: '2026-10-25T00:00:00Z',
  },
  {
    id: 'patuakhali',
    division_id: 'barishal',
    name: 'Patuakhali',
    popular_for: 'Kuakata panoramic beach with dual sunrise and sunset.',
    created_at: '2026-10-25T00:00:00Z',
  },
  {
    id: 'narayanganj',
    division_id: 'dhaka',
    name: 'Narayanganj',
    popular_for: 'Panam Nagar 19th-century merchant ghost city and Sonargaon Folk Art.',
    created_at: '2026-10-25T00:00:00Z',
  },
  {
    id: 'naogaon',
    division_id: 'rajshahi',
    name: 'Naogaon',
    popular_for: 'Somapura Mahavihara 8th-century Buddhist UNESCO monastery.',
    created_at: '2026-10-25T00:00:00Z',
  },
];

export async function getDivisions(): Promise<DivisionRow[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('divisions').select('*').order('name');
      if (!error && data && data.length > 0) {
        return data as DivisionRow[];
      }
      if (error) {
        handleSupabaseError(error, 'getDivisions');
      }
    } catch (err) {
      handleSupabaseError(err, 'getDivisions exception');
    }
  }

  return [...INITIAL_DIVISIONS];
}

export async function getDistricts(divisionId?: string): Promise<DistrictRow[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase.from('districts').select('*').order('name');
      if (divisionId && divisionId !== 'all') {
        query = query.eq('division_id', divisionId.toLowerCase());
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data as DistrictRow[];
      }
      if (error) {
        handleSupabaseError(error, 'getDistricts');
      }
    } catch (err) {
      handleSupabaseError(err, 'getDistricts exception');
    }
  }

  if (divisionId && divisionId !== 'all') {
    return INITIAL_DISTRICTS.filter((d) => d.division_id === divisionId.toLowerCase());
  }
  return [...INITIAL_DISTRICTS];
}
