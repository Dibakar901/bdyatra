import { DirectoryListing, DirectoryFilterState, NewListingSubmission } from '../types/directory';
import { INITIAL_DIRECTORY_LISTINGS } from '../data/directoryData';
import { supabase, isSupabaseConfigured } from './supabaseClient';

const LOCAL_STORAGE_SUBMISSIONS_KEY = 'bdyatra_directory_submissions';
const LOCAL_STORAGE_DIRECTORY_KEY = 'bdyatra_custom_directory_listings';
const LOCAL_STORAGE_DELETED_LISTINGS_KEY = 'bdyatra_deleted_directory_listings';

export interface AdminListingSubmission extends NewListingSubmission {
  id: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  admin_notes?: string;
}

const INITIAL_MOCK_SUBMISSIONS: AdminListingSubmission[] = [];

function getStoredCustomListings(): DirectoryListing[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_DIRECTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function getStoredDeletedListings(): string[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_DELETED_LISTINGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

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
      let query = supabase.from('hotels').select('*');
      if (filters?.category && filters.category !== 'All') {
        query = query.eq('category', filters.category);
      }
      if (filters?.division && filters.division !== 'All') {
        query = query.eq('division', filters.division);
      }
      if (filters?.verifiedOnly) {
        query = query.eq('verified', true);
      }

      let { data, error } = await query;

      if (error || !data || data.length === 0) {
        let altQuery = supabase.from('directory_listings').select('*');
        if (filters?.category && filters.category !== 'All') {
          altQuery = altQuery.eq('category', filters.category);
        }
        if (filters?.division && filters.division !== 'All') {
          altQuery = altQuery.eq('division', filters.division);
        }
        if (filters?.verifiedOnly) {
          altQuery = altQuery.eq('verified', true);
        }
        const { data: altData, error: altError } = await altQuery;
        if (!altError && altData && altData.length > 0) {
          data = altData;
          error = null;
        }
      }

      if (!error && data && data.length > 0) {
        listings = data.map(mapDbListing);
      } else {
        listings = INITIAL_DIRECTORY_LISTINGS.map((l) => mapDbListing(l));
      }
    } catch {
      listings = INITIAL_DIRECTORY_LISTINGS.map((l) => mapDbListing(l));
    }
  } else {
    listings = INITIAL_DIRECTORY_LISTINGS.map((l) => mapDbListing(l));
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

  const adminSub: AdminListingSubmission = {
    ...submission,
    id: newId,
    status: 'pending',
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('listing_submissions').insert({
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
    } catch {
      // Fallback to local store
    }
  }

  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_SUBMISSIONS_KEY);
    const existing: AdminListingSubmission[] = raw ? JSON.parse(raw) : INITIAL_MOCK_SUBMISSIONS;
    localStorage.setItem(LOCAL_STORAGE_SUBMISSIONS_KEY, JSON.stringify([adminSub, ...existing]));
  } catch {
    // Ignore storage quota
  }

  return {
    success: true,
    message: 'Listing successfully submitted for editorial verification and admin review.',
    listingId: newId,
  };
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
      if (!error && data && data.length > 0) {
        return data as AdminListingSubmission[];
      }
    } catch {
      // Fallback
    }
  }

  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_SUBMISSIONS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // Ignore
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
  const submissions = await getListingSubmissions();
  const target = submissions.find((s) => s.id === id);

  if (!target) {
    return { success: false, message: 'Submission not found.' };
  }

  target.status = status;
  if (notes) target.admin_notes = notes;

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase
        .from('listing_submissions')
        .update({ status })
        .eq('id', id);
    } catch (err) {
      console.warn('[BDYatra Supabase] Submission update error:', err);
    }
  }

  // Save updated submissions list
  localStorage.setItem(LOCAL_STORAGE_SUBMISSIONS_KEY, JSON.stringify(submissions));

  // If approved, create a verified directory listing
  if (status === 'approved') {
    const services = target.servicesText
      ? target.servicesText.split(',').map((s) => s.trim()).filter(Boolean)
      : ['Verified Hospitality'];

    const newListing: DirectoryListing = {
      id: `dir-${Date.now()}`,
      name: target.name,
      category: target.category,
      division: target.division,
      district: target.district,
      description: target.description,
      priceRange: target.priceRange || undefined,
      priceRate: target.priceRate || undefined,
      rating: 5.0,
      reviewCount: 1,
      verified: true,
      phone: target.phone,
      email: target.email || undefined,
      website: target.website || undefined,
      address: target.address,
      services,
      featured: false,
      published: true,
    };

    await createDirectoryListing(newListing);
  }

  return {
    success: true,
    message: `Submission marked as ${status}.`,
  };
}

/**
 * Admin: Create directory listing
 */
export async function createDirectoryListing(
  listingData: Partial<DirectoryListing>
): Promise<{ success: boolean; data: DirectoryListing; message: string }> {
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
      division: newListing.division,
      district: newListing.district,
      description: newListing.description,
      price_range: newListing.priceRange || null,
      price_rate: newListing.priceRate || null,
      rating: newListing.rating,
      review_count: newListing.reviewCount,
      verified: newListing.verified,
      phone: newListing.phone,
      email: newListing.email || null,
      website: newListing.website || null,
      address: newListing.address,
      services: newListing.services,
      featured: newListing.featured,
      published: newListing.published,
      cover_image: newListing.coverImage || null,
    };

    try {
      await supabase.from('hotels').insert(payload);
    } catch (err) {
      console.warn('[BDYatra Supabase] Hotels insert message:', err);
    }
    try {
      await supabase.from('directory_listings').insert(payload);
    } catch {
      // backup sync
    }
  }

  const existing = getStoredCustomListings();
  localStorage.setItem(LOCAL_STORAGE_DIRECTORY_KEY, JSON.stringify([newListing, ...existing]));

  const deleted = getStoredDeletedListings().filter((id) => id !== newId);
  localStorage.setItem(LOCAL_STORAGE_DELETED_LISTINGS_KEY, JSON.stringify(deleted));

  return {
    success: true,
    data: newListing,
    message: `Listing "${newListing.name}" created successfully.`,
  };
}

/**
 * Admin: Update directory listing
 */
export async function updateDirectoryListing(
  id: string,
  updates: Partial<DirectoryListing>
): Promise<{ success: boolean; data?: DirectoryListing; message: string }> {
  const all = await getDirectoryListings();
  const target = all.find((l) => l.id === id);

  if (!target) {
    return { success: false, message: 'Listing not found.' };
  }

  const updated: DirectoryListing = {
    ...target,
    ...updates,
    id,
  };

  if (isSupabaseConfigured && supabase) {
    const payload = {
      name: updated.name,
      category: updated.category,
      division: updated.division,
      district: updated.district,
      description: updated.description,
      price_range: updated.priceRange || null,
      price_rate: updated.priceRate || null,
      rating: updated.rating,
      review_count: updated.reviewCount,
      verified: updated.verified,
      phone: updated.phone,
      email: updated.email || null,
      website: updated.website || null,
      address: updated.address,
      services: updated.services,
      featured: updated.featured,
      published: updated.published ?? true,
      cover_image: updated.coverImage || null,
    };

    try {
      await supabase.from('hotels').update(payload).eq('id', id);
    } catch (err) {
      console.warn('[BDYatra Supabase] Hotels update message:', err);
    }
    try {
      await supabase.from('directory_listings').update(payload).eq('id', id);
    } catch {
      // backup sync
    }
  }

  const existing = getStoredCustomListings().filter((l) => l.id !== id);
  localStorage.setItem(LOCAL_STORAGE_DIRECTORY_KEY, JSON.stringify([updated, ...existing]));

  return {
    success: true,
    data: updated,
    message: `Listing "${updated.name}" updated successfully.`,
  };
}

/**
 * Admin: Delete directory listing
 */
export async function deleteDirectoryListing(
  id: string
): Promise<{ success: boolean; message: string }> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('hotels').delete().eq('id', id);
    } catch (err) {
      console.warn('[BDYatra Supabase] Hotels delete message:', err);
    }
    try {
      await supabase.from('directory_listings').delete().eq('id', id);
    } catch {
      // backup sync
    }
  }

  const existing = getStoredCustomListings().filter((l) => l.id !== id);
  localStorage.setItem(LOCAL_STORAGE_DIRECTORY_KEY, JSON.stringify(existing));

  const deleted = getStoredDeletedListings();
  if (!deleted.includes(id)) {
    deleted.push(id);
    localStorage.setItem(LOCAL_STORAGE_DELETED_LISTINGS_KEY, JSON.stringify(deleted));
  }

  return {
    success: true,
    message: 'Listing removed successfully.',
  };
}
