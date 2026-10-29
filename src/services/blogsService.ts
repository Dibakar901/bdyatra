import { BlogRow } from '../types/supabase';
import { EnrichedBlogPost } from '../types/blog';
import { supabase, isSupabaseConfigured, handleSupabaseError } from '../lib/supabase';

export const INITIAL_BLOGS: EnrichedBlogPost[] = [];

const LOCAL_BLOGS_KEY = 'bdyatra_custom_blogs';
const LOCAL_DELETED_BLOGS_KEY = 'bdyatra_deleted_blogs';

function getStoredCustomBlogs(): EnrichedBlogPost[] {
  try {
    const raw = localStorage.getItem(LOCAL_BLOGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function getStoredDeletedBlogs(): string[] {
  try {
    const raw = localStorage.getItem(LOCAL_DELETED_BLOGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function mapDbBlog(dbBlog: any): EnrichedBlogPost {
  const matchedSeed = INITIAL_BLOGS.find((b) => b.slug === dbBlog.slug || b.id === dbBlog.id);
  return {
    id: dbBlog.id,
    title: dbBlog.title,
    slug: dbBlog.slug,
    subtitle: dbBlog.subtitle || matchedSeed?.subtitle || dbBlog.excerpt,
    excerpt: dbBlog.excerpt || '',
    content: dbBlog.content || '',
    author_name: dbBlog.author_name || 'BDYatra Editorial Team',
    author_avatar: dbBlog.author_avatar || null,
    authorRole: dbBlog.author_role || dbBlog.authorRole || matchedSeed?.authorRole || 'Senior Field Writer',
    authorBio: dbBlog.author_bio || dbBlog.authorBio || matchedSeed?.authorBio,
    cover_image: dbBlog.cover_image || dbBlog.coverImage || '/src/assets/images/bdyatra_hero_delta_1793169488734.jpg',
    tags: Array.isArray(dbBlog.tags) ? dbBlog.tags : ['Travel Guide'],
    reading_time: dbBlog.reading_time || dbBlog.readingTime || '5 min read',
    destination_id: dbBlog.destination_id || null,
    division_id: dbBlog.division_id || 'Dhaka',
    is_featured: Boolean(dbBlog.is_featured ?? dbBlog.isFeatured),
    is_published: dbBlog.is_published !== undefined ? Boolean(dbBlog.is_published) : (dbBlog.isPublished !== undefined ? Boolean(dbBlog.isPublished) : true),
    published_at: dbBlog.published_at || dbBlog.publishedAt || new Date().toISOString(),
    created_at: dbBlog.created_at || new Date().toISOString(),
    updated_at: dbBlog.updated_at || new Date().toISOString(),
    estimatedBudget: dbBlog.estimated_budget || dbBlog.estimatedBudget || matchedSeed?.estimatedBudget,
    difficulty: dbBlog.difficulty || matchedSeed?.difficulty || 'Easy',
    idealSeason: dbBlog.ideal_season || dbBlog.idealSeason || matchedSeed?.idealSeason,
    tableOfContents: matchedSeed?.tableOfContents,
    sections: matchedSeed?.sections,
    relatedBlogSlugs: matchedSeed?.relatedBlogSlugs,
  };
}

export async function getBlogs(tag?: string, includeUnpublished = false): Promise<EnrichedBlogPost[]> {
  let blogs: EnrichedBlogPost[] = [];
  const deletedIds = getStoredDeletedBlogs();
  const customBlogs = getStoredCustomBlogs();

  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase
        .from('blogs')
        .select('*')
        .order('published_at', { ascending: false });

      if (!includeUnpublished) {
        query = query.eq('is_published', true);
      }

      if (tag && tag !== 'All') {
        query = query.contains('tags', [tag]);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        blogs = data.map(mapDbBlog);
      } else {
        blogs = INITIAL_BLOGS.map(mapDbBlog);
      }
    } catch (err) {
      handleSupabaseError(err, 'getBlogs exception');
      blogs = INITIAL_BLOGS.map(mapDbBlog);
    }
  } else {
    blogs = INITIAL_BLOGS.map(mapDbBlog);
  }

  // Merge custom blogs
  const combinedMap = new Map<string, EnrichedBlogPost>();
  blogs.forEach((b) => combinedMap.set(b.id, b));
  customBlogs.forEach((c) => combinedMap.set(c.id, c));

  let finalBlogs = Array.from(combinedMap.values()).filter(
    (b) => !deletedIds.includes(b.id)
  );

  if (!includeUnpublished) {
    finalBlogs = finalBlogs.filter((b) => b.is_published);
  }

  if (tag && tag !== 'All') {
    finalBlogs = finalBlogs.filter((b) =>
      b.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
    );
  }

  return finalBlogs;
}

export async function getBlogBySlug(slug: string): Promise<EnrichedBlogPost | null> {
  const blogs = await getBlogs('All', true);
  return blogs.find((b) => b.slug === slug || b.id === slug) || null;
}

export async function getRelatedBlogs(currentSlug: string, limit = 3): Promise<EnrichedBlogPost[]> {
  const all = await getBlogs();
  const current = all.find((b) => b.slug === currentSlug);
  if (current?.relatedBlogSlugs && current.relatedBlogSlugs.length > 0) {
    const related = all.filter((b) => current.relatedBlogSlugs?.includes(b.slug));
    if (related.length >= limit) return related.slice(0, limit);
  }

  return all.filter((b) => b.slug !== currentSlug).slice(0, limit);
}

/**
 * Admin: Create new blog post
 */
export async function createBlogPost(
  blogData: Partial<EnrichedBlogPost>
): Promise<{ success: boolean; data: EnrichedBlogPost; message: string }> {
  const newId = blogData.id || `blog-${Date.now()}`;
  const slug =
    blogData.slug ||
    (blogData.title || 'untitled-guide')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  const newBlog: EnrichedBlogPost = {
    id: newId,
    title: blogData.title || 'Untitled Travel Article',
    slug,
    subtitle: blogData.subtitle || blogData.excerpt || 'Field observations from Bangladesh.',
    excerpt:
      blogData.excerpt ||
      'An authentic field guide exploring the natural wonders and cultural heritage of Bangladesh.',
    content: blogData.content || '',
    author_name: blogData.author_name || 'BDYatra Editorial Team',
    author_avatar: blogData.author_avatar || null,
    authorRole: blogData.authorRole || 'Senior Travel Editor',
    authorBio: blogData.authorBio || 'Curating authentic journeys across Bangladesh.',
    cover_image:
      blogData.cover_image ||
      '/src/assets/images/bdyatra_hero_delta_1793169488734.jpg',
    tags: blogData.tags && blogData.tags.length > 0 ? blogData.tags : ['Travel Guide', 'Bangladesh'],
    reading_time: blogData.reading_time || '6 min read',
    destination_id: blogData.destination_id || null,
    division_id: blogData.division_id || 'Dhaka',
    is_featured: Boolean(blogData.is_featured),
    is_published: blogData.is_published !== undefined ? blogData.is_published : true,
    published_at: blogData.published_at || new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    estimatedBudget: blogData.estimatedBudget || '৳6,000 – ৳12,000',
    difficulty: blogData.difficulty || 'Easy',
    idealSeason: blogData.idealSeason || 'October to March',
    sections: blogData.sections || [
      {
        id: 'overview',
        title: 'Editorial Overview',
        content: [blogData.content || 'Comprehensive discovery guide.'],
      },
    ],
  };

  // Attempt Supabase insert
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('blogs').insert({
        id: newId,
        title: newBlog.title,
        slug: newBlog.slug,
        excerpt: newBlog.excerpt,
        content: newBlog.content,
        author_name: newBlog.author_name,
        author_avatar: newBlog.author_avatar,
        cover_image: newBlog.cover_image,
        tags: newBlog.tags,
        reading_time: newBlog.reading_time,
        destination_id: newBlog.destination_id,
        division_id: newBlog.division_id,
        is_featured: newBlog.is_featured,
        is_published: newBlog.is_published,
        published_at: newBlog.published_at,
      });
    } catch (err) {
      console.warn('[BDYatra Supabase] Blog insert error:', err);
    }
  }

  const existing = getStoredCustomBlogs();
  localStorage.setItem(LOCAL_BLOGS_KEY, JSON.stringify([newBlog, ...existing]));

  const deleted = getStoredDeletedBlogs().filter((id) => id !== newId);
  localStorage.setItem(LOCAL_DELETED_BLOGS_KEY, JSON.stringify(deleted));

  return {
    success: true,
    data: newBlog,
    message: `Article "${newBlog.title}" created successfully.`,
  };
}

/**
 * Admin: Update existing blog post
 */
export async function updateBlogPost(
  id: string,
  updates: Partial<EnrichedBlogPost>
): Promise<{ success: boolean; data?: EnrichedBlogPost; message: string }> {
  const all = await getBlogs('All', true);
  const target = all.find((b) => b.id === id);

  if (!target) {
    return { success: false, message: 'Article not found.' };
  }

  const updated: EnrichedBlogPost = {
    ...target,
    ...updates,
    id,
    updated_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase
        .from('blogs')
        .update({
          title: updated.title,
          slug: updated.slug,
          excerpt: updated.excerpt,
          content: updated.content,
          author_name: updated.author_name,
          author_avatar: updated.author_avatar,
          cover_image: updated.cover_image,
          tags: updated.tags,
          reading_time: updated.reading_time,
          is_featured: updated.is_featured,
          is_published: updated.is_published,
          updated_at: updated.updated_at,
        })
        .eq('id', id);
    } catch (err) {
      console.warn('[BDYatra Supabase] Blog update error:', err);
    }
  }

  const existing = getStoredCustomBlogs().filter((b) => b.id !== id);
  localStorage.setItem(LOCAL_BLOGS_KEY, JSON.stringify([updated, ...existing]));

  return {
    success: true,
    data: updated,
    message: `Article "${updated.title}" updated successfully.`,
  };
}

/**
 * Admin: Delete blog post
 */
export async function deleteBlogPost(
  id: string
): Promise<{ success: boolean; message: string }> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('blogs').delete().eq('id', id);
    } catch (err) {
      console.warn('[BDYatra Supabase] Blog delete error:', err);
    }
  }

  const existing = getStoredCustomBlogs().filter((b) => b.id !== id);
  localStorage.setItem(LOCAL_BLOGS_KEY, JSON.stringify(existing));

  const deleted = getStoredDeletedBlogs();
  if (!deleted.includes(id)) {
    deleted.push(id);
    localStorage.setItem(LOCAL_DELETED_BLOGS_KEY, JSON.stringify(deleted));
  }

  return {
    success: true,
    message: 'Article removed successfully.',
  };
}
