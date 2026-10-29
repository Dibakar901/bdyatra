/**
 * Supabase Database Schema Definition for BDYatra
 * Maps directly to Supabase PostgreSQL tables:
 * - divisions
 * - districts
 * - destinations
 * - directory_places
 * - blogs
 * - user_profiles
 * - listing_submissions
 * - trip_inquiries
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'admin' | 'moderator' | 'traveler';
export type PlaceCategory = 'hotel' | 'resort' | 'restaurant' | 'houseboat' | 'guide' | 'transport';

export interface DivisionRow {
  id: string;
  name: string;
  tagline: string | null;
  description: string | null;
  cover_image: string | null;
  coordinates: { lat: number; lng: number } | null;
  created_at: string;
}

export interface DistrictRow {
  id: string;
  division_id: string;
  name: string;
  popular_for: string | null;
  created_at: string;
}

export interface DestinationRow {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  division_id: string;
  district_id: string | null;
  category: string;
  cover_image: string;
  gallery_images: string[];
  highlights: string[];
  best_season: string;
  estimated_budget: string;
  recommended_days: number;
  rating: number;
  review_count: number;
  how_to_reach: string;
  coordinates: { lat: number; lng: number };
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface DirectoryPlaceRow {
  id: string;
  name: string;
  place_type: PlaceCategory;
  division_id: string;
  district_id: string | null;
  destination_id: string | null;
  description: string;
  price_range: '$' | '$$' | '$$$' | '$$$$';
  price_rate: string;
  rating: number;
  review_count: number;
  is_verified: boolean;
  phone: string;
  email: string | null;
  website: string | null;
  address: string;
  amenities: string[];
  cover_image: string | null;
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface BlogRow {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author_name: string;
  author_avatar: string | null;
  cover_image: string;
  tags: string[];
  reading_time: string;
  destination_id: string | null;
  division_id: string | null;
  is_featured: boolean;
  is_published: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfileRow {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ListingSubmissionRow {
  id: string;
  name: string;
  category: string;
  division_id: string | null;
  district: string;
  description: string;
  price_range: string;
  price_rate: string | null;
  phone: string;
  email: string | null;
  website: string | null;
  address: string | null;
  services_text: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface TripInquiryRow {
  id: string;
  traveler_name: string | null;
  email: string;
  duration_days: number;
  division_focus: string;
  pace: string;
  preferred_category: string;
  notes: string | null;
  status: 'new' | 'contacted' | 'completed';
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      divisions: {
        Row: DivisionRow;
        Insert: Omit<DivisionRow, 'created_at'> & { created_at?: string };
        Update: Partial<DivisionRow>;
        Relationships: [];
      };
      districts: {
        Row: DistrictRow;
        Insert: Omit<DistrictRow, 'created_at'> & { created_at?: string };
        Update: Partial<DistrictRow>;
        Relationships: [
          {
            foreignKeyName: 'districts_division_id_fkey';
            columns: ['division_id'];
            referencedRelation: 'divisions';
            referencedColumns: ['id'];
          }
        ];
      };
      destinations: {
        Row: DestinationRow;
        Insert: Omit<DestinationRow, 'created_at' | 'updated_at'> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<DestinationRow>;
        Relationships: [];
      };
      directory_places: {
        Row: DirectoryPlaceRow;
        Insert: Omit<DirectoryPlaceRow, 'created_at' | 'updated_at'> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<DirectoryPlaceRow>;
        Relationships: [];
      };
      blogs: {
        Row: BlogRow;
        Insert: Omit<BlogRow, 'created_at' | 'updated_at' | 'published_at'> & {
          published_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<BlogRow>;
        Relationships: [];
      };
      user_profiles: {
        Row: UserProfileRow;
        Insert: Omit<UserProfileRow, 'created_at' | 'updated_at'> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<UserProfileRow>;
        Relationships: [];
      };
      listing_submissions: {
        Row: ListingSubmissionRow;
        Insert: Omit<ListingSubmissionRow, 'created_at'> & { created_at?: string };
        Update: Partial<ListingSubmissionRow>;
        Relationships: [];
      };
      trip_inquiries: {
        Row: TripInquiryRow;
        Insert: Omit<TripInquiryRow, 'created_at'> & { created_at?: string };
        Update: Partial<TripInquiryRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: {
      user_role: UserRole;
      place_category: PlaceCategory;
    };
    CompositeTypes: Record<string, never>;
  };
}
