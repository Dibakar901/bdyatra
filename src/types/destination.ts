export type BangladeshDivision =
  | 'Chittagong'
  | 'Chattogram'
  | 'Sylhet'
  | 'Khulna'
  | 'Barishal'
  | 'Dhaka'
  | 'Rajshahi'
  | 'Rangpur'
  | 'Mymensingh';

export type DestinationCategory =
  | 'Nature & Wildlife'
  | 'Beaches & Islands'
  | 'Hill Tracts'
  | 'Tea Country'
  | 'Wetlands & Haor'
  | 'Heritage & Culture'
  | 'Riverine & Delta';

export interface DestinationTransportInfo {
  air?: string;
  train?: string;
  road?: string;
  waterways?: string;
}

export interface Destination {
  id: string;
  name: string;
  slug?: string;
  tagline: string;
  description: string; // Short Description
  division: BangladeshDivision;
  district: string;
  category: DestinationCategory;
  image: string;
  galleryImages?: string[];
  fallbackGradient?: string;
  bestSeason: string;
  bestMonths?: string[];
  estimatedBudget?: string; // Optional
  googleMapUrl?: string; // Replaces lat/lng
  phone?: string; // Phone number
  website?: string; // Optional website
  rating: number;
  reviewCount: number;
  climateOverview?: string;
  localTips?: string[];
  featured: boolean;
  published?: boolean;

  // Legacy/Optional fields
  recommendedDays?: number;
  highlights?: string[];
  howToReach?: string;
  transportLogistics?: DestinationTransportInfo;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface DestinationFilterState {
  division: BangladeshDivision | 'All';
  district?: string;
  category: DestinationCategory | 'All';
  searchQuery: string;
}
