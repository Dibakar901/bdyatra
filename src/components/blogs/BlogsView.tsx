import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  ArrowRight,
  BookOpen,
  Compass,
  Search,
  Sparkles,
  Share2,
} from 'lucide-react';
import { EnrichedBlogPost } from '../../types/blog';
import { getBlogs } from '../../services/blogsService';
import { Button } from '../common/Button';

interface BlogsViewProps {
  onSelectBlog: (blog: EnrichedBlogPost) => void;
}

export const BlogsView: React.FC<BlogsViewProps> = ({ onSelectBlog }) => {
  const [blogs, setBlogs] = useState<EnrichedBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const tags = [
    'All',
    'Hill Tracts',
    'Wetlands',
    'Tea Country',
    'Wildlife',
    'Heritage',
    'Archaeology',
    'Photography',
  ];

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getBlogs(selectedTag).then((data) => {
      if (mounted) {
        setBlogs(data);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, [selectedTag]);

  const filteredBlogs = blogs.filter((b) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      b.title.toLowerCase().includes(q) ||
      b.excerpt.toLowerCase().includes(q) ||
      (b.subtitle && b.subtitle.toLowerCase().includes(q)) ||
      b.author_name.toLowerCase().includes(q) ||
      b.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  // Featured Lead Story
  const featuredBlog = filteredBlogs.find((b) => b.is_featured) || filteredBlogs[0];
  const standardBlogs = filteredBlogs.filter((b) => b.id !== featuredBlog?.id);

  return (
    <div className="space-y-12 text-left">
      {/* 1. Header & Search Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 tracking-wider uppercase mb-2">
            <span>Editorial Field Journals</span>
            <span aria-hidden="true">·</span>
            <span>Independent Travel Guides</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Field Stories & Practical Travel Guides
          </h2>
          <p className="mt-2 text-sm text-slate-600 max-w-2xl leading-relaxed">
            Authentic expeditions, transport convoy schedules, seasonal weather timing, and
            cultural advice written by seasoned Bangladesh explorers.
          </p>
        </div>

        {/* Live Search */}
        <div className="relative w-full md:w-80 shrink-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guides, convoys, wildlife..."
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 shadow-xs"
          />
        </div>
      </div>

      {/* 2. Topic Filter Tabs (Interactive Segmented Buttons) */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-200/70 rounded-xl">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                selectedTag === tag
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-500 font-medium">
          Showing {filteredBlogs.length} {filteredBlogs.length === 1 ? 'article' : 'articles'}
        </span>
      </div>

      {/* 3. Loading State */}
      {loading ? (
        <div className="py-24 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-r-transparent" />
          <p className="mt-3 text-xs text-slate-500 font-medium">
            Fetching travel articles from Supabase...
          </p>
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
          <BookOpen className="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 mb-1">No Travel Stories Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            Try adjusting your search query or selecting "All" to browse all published field
            guides.
          </p>
          <Button variant="outline" size="sm" onClick={() => setSelectedTag('All')}>
            Reset Topic Filter
          </Button>
        </div>
      ) : (
        <div className="space-y-12">
          {/* 4. Tier 1 Salience: Lead Story Marquee Card */}
          {featuredBlog && !searchQuery.trim() && (
            <article
              onClick={() => onSelectBlog(featuredBlog)}
              className="group relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer grid grid-cols-1 lg:grid-cols-12 gap-0"
            >
              <div className="lg:col-span-7 relative aspect-16/10 lg:aspect-auto w-full overflow-hidden bg-slate-900 min-h-[340px]">
                <img
                  src={featuredBlog.cover_image}
                  alt={featuredBlog.title}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent lg:hidden" />
              </div>

              <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-3">
                    <span>Featured Dispatch</span>
                    <span aria-hidden="true">·</span>
                    <span>{featuredBlog.reading_time}</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors mb-3 leading-snug">
                    {featuredBlog.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed mb-6 line-clamp-3">
                    {featuredBlog.subtitle || featuredBlog.excerpt}
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs text-slate-500">
                    <span className="font-semibold text-slate-800 block">
                      {featuredBlog.author_name}
                    </span>
                    <span>
                      {new Date(featuredBlog.published_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 group-hover:translate-x-1 transition-transform">
                    <span>Read Full Guide</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </article>
          )}

          {/* 5. Secondary Stories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(searchQuery.trim() ? filteredBlogs : standardBlogs).map((blog) => (
              <article
                key={blog.id}
                onClick={() => onSelectBlog(blog)}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <div>
                  <div className="relative aspect-16/9 w-full overflow-hidden bg-slate-900">
                    <img
                      src={blog.cover_image}
                      alt={blog.title}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                    <div className="absolute bottom-2.5 left-3 text-white text-xs font-semibold flex items-center gap-1.5">
                      <Clock className="h-3 w-3 text-emerald-400" />
                      <span>{blog.reading_time}</span>
                    </div>
                  </div>

                  <div className="p-5">
                    {/* Unboxed category & metadata */}
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-2">
                      <span className="text-emerald-700 font-semibold uppercase tracking-wider text-[11px]">
                        {blog.tags[0] || 'Travel Guide'}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>
                        {new Date(blog.published_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors tracking-tight line-clamp-2 mb-2 leading-snug">
                      {blog.title}
                    </h4>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {blog.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="truncate max-w-[140px]">By {blog.author_name}</span>
                  <div className="flex items-center gap-1 font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    <span>Read Article</span>
                    <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
