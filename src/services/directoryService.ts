import { DirectoryListing, DirectoryFilterState, NewListingSubmission } from '../types/directory';
import { supabase, isSupabaseConfigured } from './supabaseClient';

export interface AdminListingSubmission extends NewListingSubmission {
  id: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  admin_notes?: string;
}

const INITIAL_MOCK_SUBMISSIONS: AdminListingSubmission[] = [];

function mapDbListing(row: any): DirectoryListing {
  return {
    id: row.id,
    name: row.name || 'Untitled Listing',
    category: row.category || 'Eco Resorts & Hotels',
    division: row.division || row.division_id || 'Dhaka',
    district: row.district || row.district_id || 'Dhaka',
    destinationId: row.destination_id || row.destinationId,
    description: row.description || '',
    priceRange: row.price_range || row.priceRange || undefined,
    priceRate: row.price_rate || row.priceRate || undefined,
    rating: Number(row.rating) || 4.8,
    reviewCount: Number(row.review_count || row.reviewCount) || 1,
    verified: row.verified !== undefined ? Boolean(row.verified) : Boolean(row.is_verified ?? true),
    phone: row.phone || '',
    email: row.email || undefined,
    website: row.website || undefined,
    address: row.address || '',
    services: Array.isArray(row.services) ? row.services : (Array.isArray(row.amenities) ? row.amenities : []),
    featured: Boolean(row.is_featured ?? row.featured),
    published: row.is_published !== undefined ? row.is_published : (row.published !== undefined ? row.published : true),
    coverImage: row.cover_image || row.coverImage,
  };
}

export async function getDirectoryListings(filters?: DirectoryFilterState): Promise<DirectoryListing[]> {
  let listings: DirectoryListing[] = [];

  if (isSupabaseConfigured && supabase) {
    try {
      let query = (supabase as any).from('directory_places').select('*');
      if (filters?.category && filters.category !== 'All') {
        query = query.eq('category', filters.category);
      }
      if (filters?.division && filters.division !== 'All') {
        query = query.eq('division_id', filters.division.toLowerCase());
      }
      if (filters?.verifiedOnly) {
        query = query.eq('is_verified', true);
      }

      const { data, error } = await query;

      if (!error && data) {
        listings = data.map(mapDbListing);
      } else if (error) {
        console.warn('[BDYatra Supabase] Directory fetch error:', error.message);
      }
    } catch (err) {
      console.error('[BDYatra Supabase] Directory fetch exception:', err);
    }
  }

  let finalListings = [...listings];

  // Filter application
  if (filters) {
    if (filters.category && filters.category !== 'All') {
      finalListings = finalListings.filter((l) => l.category === filters.category);
    }
    if (filters.division && filters.division !== 'All') {
      finalListings = finalListings.filter((l) => l.division === filters.division);
    }
    if (filters.verifiedOnly) {
      finalListings = finalListings.filter((l) => l.verified);
    }
    if (filters.searchQuery && filters.searchQuery.trim().length > 0) {
      const q = filters.searchQuery.toLowerCase().trim();
      finalListings = finalListings.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.district.toLowerCase().includes(q) ||
          l.division.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q) ||
          l.services.some((s) => s.toLowerCase().includes(q))
      );
    }
  }

  return finalListings;
}

export async function submitNewListing(
  submission: NewListingSubmission
): Promise<{ success: boolean; message: string; listingId: string }> {
  const newId = `listing-sub-${Date.now()}`;

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await (supabase as any).from('listing_submissions').insert({
        id: newId,
        name: submission.name,
        category: submission.category,
        division_id: submission.division.toLowerCase(),
        district: submission.district,
        description: submission.description,
        price_range: submission.priceRange,
        price_rate: submission.priceRate,
        phone: submission.phone,
        email: submission.email,
        website: submission.website,
        address: submission.address,
        services_text: submission.servicesText,
        status: 'pending',
      });

      if (error) throw error;

      return {
        success: true,
        message: 'Listing successfully submitted for editorial verification in Supabase.',
        listingId: newId,
      };
    } catch (err: any) {
      console.error('[BDYatra Supabase] Submission error:', err);
      return { success: false, message: `Submission failed: ${err.message}`, listingId: '' };
    }
  }

  return { success: false, message: 'Database not connected', listingId: '' };
}

/**
 * Admin: Get all user listing submissions (pending, approved, rejected)
 */
export async function getListingSubmissions(): Promise<AdminListingSubmission[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('listing_submissions')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) {
        return data as AdminListingSubmission[];
      }
    } catch (err) {
      console.warn('[BDYatra Supabase] getListingSubmissions error:', err);
    }
  }

  return INITIAL_MOCK_SUBMISSIONS;
}

/**
 * Admin: Update submission status (Approve / Reject)
 * If approved, automatically convert and register into live directory listings!
 */
export async function updateListingSubmissionStatus(
  id: string,
  status: 'approved' | 'rejected',
  notes?: string
): Promise<{ success: boolean; message: string }> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await (supabase as any)
        .from('listing_submissions')
        .update({ status, admin_notes: notes })
        .eq('id', id);

      if (error) throw error;

      // If approved, create a verified directory listing
      if (status === 'approved') {
        // Fetch submission details to convert
        const { data: sub } = await (supabase as any).from('listing_submissions').select('*').eq('id', id).single();
        if (sub) {
          const services = sub.services_text
            ? sub.services_text.split(',').map((s: string) => s.trim()).filter(Boolean)
            : ['Verified Hospitality'];

          await createDirectoryListing({
            name: sub.name,
            category: sub.category,
            division: sub.division_id,
            district: sub.district,
            description: sub.description,
            priceRange: sub.price_range,
            priceRate: sub.price_rate,
            verified: true,
            phone: sub.phone,
            email: sub.email,
            website: sub.website,
            address: sub.address,
            services,
            published: true,
          });
        }
      }

      return {
        success: true,
        message: `Submission marked as ${status} in Supabase.`,
      };
    } catch (err: any) {
      console.error('[BDYatra Supabase] Submission update error:', err);
      return { success: false, message: `Update failed: ${err.message}` };
    }
  }

  return { success: false, message: 'Database not connected' };
}

/**
 * Admin: Create directory listing
 */
export async function createDirectoryListing(
  listingData: Partial<DirectoryListing>
): Promise<{ success: boolean; data?: DirectoryListing; message: string }> {
  const newId = listingData.id || `dir-${Date.now()}`;
  const newListing: DirectoryListing = {
    id: newId,
    name: listingData.name || 'Untitled Hospitality Provider',
    category: listingData.category || 'Eco Resorts & Hotels',
    division: listingData.division || 'Dhaka',
    district: listingData.district || 'Dhaka',
    description: listingData.description || '',
    priceRange: listingData.priceRange || undefined,
    priceRate: listingData.priceRate || undefined,
    rating: listingData.rating || 4.9,
    reviewCount: listingData.reviewCount || 1,
    verified: listingData.verified !== undefined ? listingData.verified : true,
    phone: listingData.phone || '',
    email: listingData.email || undefined,
    website: listingData.website || undefined,
    address: listingData.address || 'Bangladesh',
    services: listingData.services && listingData.services.length > 0 ? listingData.services : ['Hospitality'],
    featured: Boolean(listingData.featured),
    published: listingData.published !== undefined ? listingData.published : true,
    coverImage: listingData.coverImage,
  };

  if (isSupabaseConfigured && supabase) {
    const payload = {
      id: newId,
      name: newListing.name,
      category: newListing.category,
      division_id: newListing.division.toLowerCase(),
      district_id: newListing.district.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      description: newListing.description,
      price_range: newListing.priceRange || null,
      price_rate: newListing.priceRate || null,
      rating: newListing.rating,
      review_count: newListing.reviewCount,
      is_verified: newListing.verified,
      phone: newListing.phone,
      email: newListing.email || null,
      website: newListing.website || null,
      address: newListing.address,
      amenities: newListing.services,
      is_featured: newListing.featured,
      is_published: newListing.published,
      cover_image: newListing.coverImage || null,
    };

    const { error } = await (supabase as any).from('directory_places').insert(payload);
    
    if (error) {
      console.error('[BDYatra Supabase] Directory place insert error:', error);
      return {
        success: false,
        message: `Database Error: ${error.message}`,
      };
    }

    return {
      success: true,
      data: newListing,
      message: `Listing "${newListing.name}" created successfully in Supabase.`,
    };
  }

  return { success: false, message: 'Database not connected' };
}

/**
 * Admin: Update directory listing
 */
export async function updateDirectoryListing(
  id: string,
  updates: Partial<DirectoryListing>
): Promise<{ success: boolean; data?: DirectoryListing; message: string }> {
  if (isSupabaseConfigured && supabase) {
    const payload = {
      name: updates.name,
      category: updates.category,
      division_id: updates.division?.toLowerCase(),
      district_id: updates.district?.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      description: updates.description,
      price_range: updates.priceRange || null,
      price_rate: updates.priceRate || null,
      rating: updates.rating,
      review_count: updates.reviewCount,
      is_verified: updates.verified,
      phone: updates.phone,
      email: updates.email || null,
      website: updates.website || null,
      address: updates.address,
      amenities: updates.services,
      is_featured: updates.featured,
      is_published: updates.published,
      cover_image: updates.coverImage || null,
      updated_at: new Date().toISOString()
    };

    const { error } = await (supabase as any).from('directory_places').update(payload).eq('id', id);
    
    if (error) {
      console.error('[BDYatra Supabase] Directory place update error:', error);
      return {
        success: false,
        message: `Database Update Error: ${error.message}`,
      };
    }

    return {
      success: true,
      message: `Listing updated successfully in Supabase.`,
    };
  }

  return { success: false, message: 'Database not connected' };
}

/**
 * Admin: Delete directory listing
 */
export async function deleteDirectoryListing(
  id: string
): Promise<{ success: boolean; message: string }> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await (supabase as any).from('directory_places').delete().eq('id', id);
    if (error) {
      console.error('[BDYatra Supabase] Directory place delete error:', error);
      return {
        success: false,
        message: `Database Delete Error: ${error.message}`,
      };
    }
    return {
      success: true,
      message: 'Listing removed successfully from Supabase.',
    };
  }

  return { success: false, message: 'Database not connected' };
}
