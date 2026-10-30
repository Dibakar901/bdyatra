import React, { useState } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  BookOpen,
  Calendar,
  Clock,
  Star,
  X,
  AlertCircle,
  FileText,
  User,
} from 'lucide-react';
import { EnrichedBlogPost } from '../../types/blog';
import { ImageUploader } from './ImageUploader';

interface BlogsCMSProps {
  blogs: EnrichedBlogPost[];
  onSaveBlog: (blog: Partial<EnrichedBlogPost>) => Promise<{ success: boolean; message: string }>;
  onDeleteBlog: (id: string) => Promise<{ success: boolean; message: string }>;
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export const BlogsCMS: React.FC<BlogsCMSProps> = ({
  blogs,
  onSaveBlog,
  onDeleteBlog,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Partial<EnrichedBlogPost> | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [isSlugUserModified, setIsSlugUserModified] = useState(false);

  const [formData, setFormData] = useState<Partial<EnrichedBlogPost>>({
    title: '',
    slug: '',
    subtitle: '',
    excerpt: '',
    content: '',
    author_name: 'BDYatra Editorial Team',
    authorRole: 'Senior Field Writer',
    authorBio: 'Specializes in experiential journeys and cultural heritage of Bangladesh.',
    cover_image: '',
    tags: ['Travel Guide', 'Bangladesh'],
    reading_time: '6 min read',
    estimatedBudget: '৳6,000 – ৳12,000',
    difficulty: 'Easy',
    idealSeason: 'October to March',
    is_featured: false,
    is_published: true,
  });

  const handleOpenNew = () => {
    setFormData({
      title: '',
      slug: '',
      subtitle: '',
      excerpt: '',
      content: '',
      author_name: 'BDYatra Editorial Team',
      authorRole: 'Senior Field Writer',
      authorBio: 'Specializes in experiential journeys and cultural heritage of Bangladesh.',
      cover_image: '/src/assets/images/bdyatra_hero_delta_1793169488734.jpg',
      tags: ['Travel Guide', 'Heritage'],
      reading_time: '6 min read',
      estimatedBudget: '৳8,000 – ৳15,000',
      difficulty: 'Moderate',
      idealSeason: 'November to February',
      is_featured: false,
      is_published: true,
    });
    setEditingBlog(null);
    setTagInput('');
    setIsSlugUserModified(false);
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (blog: EnrichedBlogPost) => {
    setFormData({
      ...blog,
    });
    setEditingBlog(blog);
    setTagInput('');
    setIsSlugUserModified(true); // Preserve existing custom slug
    setIsEditorOpen(true);
  };

  const handleTitleChange = (val: string) => {
    const updated: Partial<EnrichedBlogPost> = {
      ...formData,
      title: val,
    };

    if (!isSlugUserModified) {
      updated.slug = generateSlug(val);
    }

    setFormData(updated);
  };

  const handleSlugChange = (val: string) => {
    setIsSlugUserModified(true);
    setFormData({ ...formData, slug: val });
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    const current = formData.tags || [];
    setFormData({
      ...formData,
      tags: [...current, tagInput.trim()],
    });
    setTagInput('');
  };

  const handleRemoveTag = (index: number) => {
    const current = formData.tags || [];
    setFormData({
      ...formData,
      tags: current.filter((_, i) => i !== index),
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) return;

    setIsSubmitting(true);
    try {
      const payload: Partial<EnrichedBlogPost> = {
        ...formData,
        slug: formData.slug?.trim() || generateSlug(formData.title),
      };
      await onSaveBlog(payload);
      setIsEditorOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePublished = async (blog: EnrichedBlogPost) => {
    await onSaveBlog({
      id: blog.id,
      is_published: !blog.is_published,
    });
  };

  const handleToggleFeatured = async (blog: EnrichedBlogPost) => {
    await onSaveBlog({
      id: blog.id,
      is_featured: !blog.is_featured,
    });
  };

  const filteredBlogs = blogs.filter((b) => {
    const q = searchQuery.toLowerCase();
    return (
      b.title.toLowerCase().includes(q) ||
      b.excerpt.toLowerCase().includes(q) ||
      b.author_name.toLowerCase().includes(q) ||
      b.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search articles by title, author, or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
          />
        </div>

        <button
          onClick={handleOpenNew}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-semibold transition-colors shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="h-4 w-4" />
          Write New Article
        </button>
      </div>

      {/* Blogs Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold text-xs uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Article</th>
                <th className="py-3.5 px-4">Author</th>
                <th className="py-3.5 px-4">Tags</th>
                <th className="py-3.5 px-4">Reading Time</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBlogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={blog.cover_image}
                        alt={blog.title}
                        className="h-11 w-11 rounded-lg object-cover border border-slate-200 shrink-0 bg-slate-100"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            '/src/assets/images/bdyatra_hero_delta_1793169488734.jpg';
                        }}
                      />
                      <div>
                        <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                          {blog.title}
                          {blog.is_featured && (
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.2 rounded">
                              Featured
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 truncate max-w-sm">{blog.excerpt}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-700">
                    <div className="font-medium text-slate-900">{blog.author_name}</div>
                    <div className="text-slate-400">{blog.authorRole || 'Editorial Staff'}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {blog.tags.slice(0, 2).map((t) => (
                        <span key={t} className="text-[11px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                          {t}
                        </span>
                      ))}
                      {blog.tags.length > 2 && (
                        <span className="text-[10px] text-slate-400 self-center">
                          +{blog.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-slate-400" />
                      {blog.reading_time}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => handleTogglePublished(blog)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer border ${
                        blog.is_published
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {blog.is_published ? (
                        <>
                          <Eye className="h-3 w-3" />
                          Published
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3 w-3" />
                          Draft
                        </>
                      )}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => handleToggleFeatured(blog)}
                        title={blog.is_featured ? 'Unfeature' : 'Feature as Lead Story'}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          blog.is_featured
                            ? 'text-amber-500 border-amber-300 bg-amber-50'
                            : 'text-slate-400 border-slate-200 hover:text-slate-700'
                        }`}
                      >
                        <Star className="h-4 w-4 fill-current" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(blog)}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Edit Article"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setIsDeletingId(blog.id)}
                        className="p-1.5 rounded-lg border border-slate-200 text-rose-500 hover:bg-rose-50 hover:border-rose-200 transition-colors cursor-pointer"
                        title="Delete Article"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredBlogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 text-sm">
                    No articles found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editor Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingBlog ? `Edit Article: ${formData.title}` : 'Draft New Editorial Travel Guide'}
                </h3>
                <p className="text-xs text-slate-500">
                  Publish rich articles to BDYatra's travel editorial publication.
                </p>
              </div>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title || ''}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Navigating Sajek Valley: Sleeping Above the Cloud Ocean"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                    <span>URL Slug</span>
                    <span className="text-[10px] text-slate-400 font-normal">Auto-generated live</span>
                  </label>
                  <input
                    type="text"
                    value={formData.slug || ''}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    placeholder="e.g. sajek-valley-cloud-ocean-guide"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Reading Time
                  </label>
                  <input
                    type="text"
                    value={formData.reading_time || ''}
                    onChange={(e) => setFormData({ ...formData, reading_time: e.target.value })}
                    placeholder="e.g. 7 min read"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={formData.subtitle || ''}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="e.g. Essential convoy logistics, timber cottages, and indigenous culinary trails"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Short Excerpt (SEO Meta & Directory Card) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.excerpt || ''}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Concise 1-2 sentence synopsis of the journey..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              {/* Cover Image */}
              <div className="pt-2 border-t border-slate-100">
                <ImageUploader
                  currentImageUrl={formData.cover_image}
                  bucket="blog-covers"
                  onImageUploaded={(url) => setFormData({ ...formData, cover_image: url })}
                  label="Editorial Header Photography"
                  aspectRatioHint="16:9 Ratio"
                  recommendedDimensions="1200 × 675 pixels"
                  helperText="Upload editorial photography in 16:9 ratio (recommended: 1200 × 675 px) for featured article headers and story cards."
                />
              </div>

              {/* Article Content */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Article Body (Markdown supported) *
                </label>
                <textarea
                  rows={6}
                  required
                  value={formData.content || ''}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write the full travel narrative, practical transit guidelines, indigenous traditions..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono text-xs"
                />
              </div>

              {/* Author & Practical Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Author Byline *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.author_name || ''}
                    onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                    placeholder="e.g. Tanvir Hossain"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Estimated Trip Budget (BDT ৳)
                  </label>
                  <input
                    type="text"
                    value={formData.estimatedBudget || ''}
                    onChange={(e) => setFormData({ ...formData, estimatedBudget: e.target.value })}
                    placeholder="e.g. ৳8,000 – ৳14,000"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ideal Travel Season
                  </label>
                  <input
                    type="text"
                    value={formData.idealSeason || ''}
                    onChange={(e) => setFormData({ ...formData, idealSeason: e.target.value })}
                    placeholder="e.g. September – November"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tags</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="e.g. Hill Tracts, Eco Tourism"
                    className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800 cursor-pointer"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(formData.tags || []).map((t, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 text-xs border border-emerald-200"
                    >
                      {t}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(i)}
                        className="text-emerald-700 hover:text-emerald-900 cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-3 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.is_published !== false}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                  />
                  <span>Publish Article (Live for readers)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={Boolean(formData.is_featured)}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="h-4 w-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300"
                  />
                  <span>Feature as Lead Story</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 hover:bg-slate-50 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Saving...' : editingBlog ? 'Update Article' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {isDeletingId && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <AlertCircle className="h-6 w-6" />
              <h3 className="text-lg font-bold text-slate-900">Delete Article?</h3>
            </div>
            <p className="text-sm text-slate-600 mb-6">
              Are you sure you want to remove this editorial post? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setIsDeletingId(null)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await onDeleteBlog(isDeletingId);
                  setIsDeletingId(null);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-sm font-semibold cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
