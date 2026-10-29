import { BangladeshDivision } from './destination';

export type DirectoryCategory =
  | 'Eco Resorts & Hotels'
  | 'Houseboats & Cruisers'
  | 'Licensed Tour Guides'
  | 'Transport & Chander Gari'
  | 'Heritage Stays';

export type PriceTier = '৳' | '৳৳' | '৳৳৳' | '৳৳৳৳' | '$' | '$$' | '$$$' | '$$$$';

export interface DirectoryListing {
  id: string;
  name: string;
  category: DirectoryCategory;
  division: BangladeshDivision;
  district: string;
  destinationId?: string;
  description: string;
  priceRange?: PriceTier | '';
  priceRate?: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  phone: string;
  email?: string;
  website?: string;
  address: string;
  services: string[];
  featured: boolean;
  published?: boolean;
  coverImage?: string;
}

export interface DirectoryFilterState {
  category: DirectoryCategory | 'All';
  division: BangladeshDivision | 'All';
  searchQuery: string;
  verifiedOnly: boolean;
}

export interface NewListingSubmission {
  name: string;
  category: DirectoryCategory;
  division: BangladeshDivision;
  district: string;
  description: string;
  priceRange?: PriceTier | '';
  priceRate?: string;
  phone: string;
  email?: string;
  website?: string;
  address: string;
  servicesText: string;
}
