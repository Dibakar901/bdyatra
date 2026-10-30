import { Destination, DestinationFilterState } from '../types/destination';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { Database } from '../types/supabase';

function mapDbDestination(row: any): Destination {
  return {
    id: row.id,
    name: row.title || row.name || 'Untitled Destination',
    slug: row.slug,
    tagline: row.tagline || '',
    description: row.description || '',
    division: ((row.division || row.division_id || 'Dhaka').charAt(0).toUpperCase() + (row.division || row.division_id || 'Dhaka').slice(1)) as any,
    district: row.district || row.district_id || 'Dhaka',
    category: row.category || 'Nature & Wildlife',
    image: row.cover_image || row.image || '/src/assets/images/bdyatra_hero_delta_1793169488734.jpg',
    galleryImages: row.gallery_images || row.galleryImages,
    bestSeason: row.best_season || row.bestSeason || 'November to March',
    estimatedBudget: row.estimated_budget || row.estimatedBudget,
    googleMapUrl: row.google_map_url || row.googleMapUrl,
    phone: row.phone,
    website: row.website,
    rating: Number(row.rating) || 4.8,
    reviewCount: Number(row.review_count || row.reviewCount) || 1,
    featured: Boolean(row.is_featured ?? row.featured),
    published: row.is_published !== undefined ? row.is_published : (row.published !== undefined ? row.published : true),
  };
}

export async function getDestinations(filters?: DestinationFilterState): Promise<Destination[]> {
  let destinations: Destination[] = [];

  if (isSupabaseConfigured && supabase) {
    try {
      let query = (supabase as any).from('destinations').select('*');
      
      // Basic server-side filtering
      if (filters?.division && filters.division !== 'All') {
        query = query.eq('division_id', filters.division.toLowerCase());
      }
      if (filters?.category && filters.category !== 'All') {
        query = query.eq('category', filters.category);
      }

      const { data, error } = await query;
      if (!error && data) {
        destinations = data.map(mapDbDestination);
      } else if (error) {
        console.warn('[BDYatra Supabase] Destination fetch error:', error.message);
        // If DB is empty or fails, we might want to return 0 records instead of mock
        // but for now, we'll keep it empty if Supabase says so.
      }
    } catch (err) {
      console.error('[BDYatra Supabase] Destination fetch exception:', err);
    }
  }

  let finalDestinations = [...destinations];

  // Client-side query filtering (for search and complex overlaps)
  if (filters) {
    if (filters.division && filters.division !== 'All') {
      const targetDiv = filters.division.toLowerCase();
      finalDestinations = finalDestinations.filter((d) => {
        const div = d.division.toLowerCase();
        return div === targetDiv || (targetDiv === 'chittagong' && div === 'chattogram');
      });
    }
    if (filters.district && filters.district !== 'All') {
      const targetDist = filters.district.toLowerCase();
      finalDestinations = finalDestinations.filter((d) =>
        d.district.toLowerCase().includes(targetDist)
      );
    }
    if (filters.category && filters.category !== 'All') {
      finalDestinations = finalDestinations.filter((d) => d.category === filters.category);
    }
    if (filters.searchQuery && filters.searchQuery.trim().length > 0) {
      const q = filters.searchQuery.toLowerCase().trim();
      finalDestinations = finalDestinations.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.tagline.toLowerCase().includes(q) ||
          d.district.toLowerCase().includes(q) ||
          d.division.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q)
      );
    }
  }

  return finalDestinations;
}

export async function getDestinationById(idOrSlug: string): Promise<Destination | null> {
  const all = await getDestinations();
  return (
    all.find((d) => d.id === idOrSlug || d.slug === idOrSlug) || null
  );
}

/**
 * Admin: Create a new destination entry
 */
export async function createDestination(
  destinationData: Partial<Destination>
): Promise<{ success: boolean; data?: Destination; message: string }> {
  const newId = destinationData.id || `dest-${Date.now()}`;
  const slug =
    destinationData.slug ||
    (destinationData.name || 'destination')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

  const newDestination: Destination = {
    id: newId,
    name: destinationData.name || 'Untitled Destination',
    slug,
    tagline: destinationData.tagline || 'Scenic travel landmark in Bangladesh',
    description: destinationData.description || '',
    division: destinationData.division || 'Dhaka',
    district: destinationData.district || 'Dhaka',
    category: destinationData.category || 'Nature & Wildlife',
    image:
      destinationData.image ||
      '/src/assets/images/bdyatra_hero_delta_1793169488734.jpg',
    galleryImages: destinationData.galleryImages || [
      destinationData.image || '/src/assets/images/bdyatra_hero_delta_1793169488734.jpg',
    ],
    bestSeason: destinationData.bestSeason || 'November to March',
    estimatedBudget: destinationData.estimatedBudget || '৳10,000 - ৳15,000',
    googleMapUrl: destinationData.googleMapUrl || '',
    phone: destinationData.phone || '',
    website: destinationData.website || '',
    rating: destinationData.rating || 4.8,
    reviewCount: destinationData.reviewCount || 1,
    featured: Boolean(destinationData.featured),
    published: destinationData.published !== undefined ? destinationData.published : true,
  };

  // Attempt Supabase insert
  if (isSupabaseConfigured && supabase) {
    const { error } = await (supabase as any).from('destinations').insert({
      id: newId,
      title: newDestination.name,
      slug: newDestination.slug,
      tagline: newDestination.tagline,
      description: newDestination.description,
      division_id: newDestination.division.toLowerCase(),
      district_id: newDestination.district.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      category: newDestination.category,
      cover_image: newDestination.image,
      gallery_images: newDestination.galleryImages,
      highlights: [], // Required by schema
      best_season: newDestination.bestSeason,
      estimated_budget: newDestination.estimatedBudget,
      recommended_days: 2, // Required by schema
      rating: newDestination.rating,
      review_count: newDestination.reviewCount,
      how_to_reach: 'Accessible by road and rail.', // Required by schema
      coordinates: { lat: 23.8103, lng: 90.4125 }, // Required by schema
      is_featured: newDestination.featured,
      is_published: newDestination.published,
    });

    if (error) {
      console.error('[BDYatra Supabase] Destination insert error:', error);
      return {
        success: false,
        message: `Database Error: ${error.message}. (Hint: Ensure Division "${newDestination.division}" exists in Supabase and your user profile has Admin role).`,
      };
    }

    return {
      success: true,
      data: newDestination,
      message: `Destination "${newDestination.name}" created successfully in Supabase.`,
    };
  }

  return {
    success: false,
    message: 'Supabase is not configured. Cannot save destination.',
  };
}

/**
 * Admin: Update an existing destination
 */
export async function updateDestination(
  id: string,
  updates: Partial<Destination>
): Promise<{ success: boolean; data?: Destination; message: string }> {
  // Attempt Supabase update
  if (isSupabaseConfigured && supabase) {
    const { error } = await (supabase as any)
      .from('destinations')
      .update({
        title: updates.name,
        slug: updates.slug,
        tagline: updates.tagline,
        description: updates.description,
        division_id: updates.division?.toLowerCase(),
        district_id: updates.district?.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        category: updates.category,
        cover_image: updates.image,
        gallery_images: updates.galleryImages,
        best_season: updates.bestSeason,
        estimated_budget: updates.estimatedBudget,
        rating: updates.rating,
        review_count: updates.reviewCount,
        is_featured: updates.featured,
        is_published: updates.published,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error('[BDYatra Supabase] Destination update error:', error);
      return {
        success: false,
        message: `Supabase Update Error: ${error.message}`,
      };
    }

    // Fetch updated to return
    const { data: updatedData } = await (supabase as any).from('destinations').select('*').eq('id', id).single();
    
    return {
      success: true,
      data: updatedData ? mapDbDestination(updatedData) : undefined,
      message: `Destination updated successfully in Supabase.`,
    };
  }

  return { success: false, message: 'Database not connected' };
}

/**
 * Admin: Delete destination
 */
export async function deleteDestination(
  id: string
): Promise<{ success: boolean; message: string }> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await (supabase as any).from('destinations').delete().eq('id', id);
    if (error) {
      console.error('[BDYatra Supabase] Destination delete error:', error);
      return {
        success: false,
        message: `Supabase Delete Error: ${error.message}`,
      };
    }
    return {
      success: true,
      message: 'Destination removed successfully from Supabase.',
    };
  }

  return { success: false, message: 'Database not connected' };
}
