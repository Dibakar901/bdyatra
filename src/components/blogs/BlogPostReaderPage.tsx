import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Share2,
  Bookmark,
  Check,
  Compass,
  MapPin,
  ChevronRight,
  BookOpen,
  ArrowRight,
  DollarSign,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { EnrichedBlogPost } from '../../types/blog';
import { Container } from '../common/Container';
import { Button } from '../common/Button';
import { getRelatedBlogs } from '../../services/blogsService';

interface BlogPostReaderPageProps {
  blog: EnrichedBlogPost;
  onBack: () => void;
  onSelectBlog: (slug: string) => void;
  onExploreDestination?: (destId: string) => void;
}

export const BlogPostReaderPage: React.FC<BlogPostReaderPageProps> = ({
  blog,
  onBack,
  onSelectBlog,
  onExploreDestination,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [relatedArticles, setRelatedArticles] = useState<EnrichedBlogPost[]>([]);
  const [activeSection, setActiveSection] = useState<string>('');

  // Scroll reading progress indicator
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check saved bookmarks in localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('bdyatra_saved_blogs');
      if (saved) {
        const list = JSON.parse(saved);
        setIsBookmarked(list.includes(blog.slug));
      }
    } catch {
      // ignore localstorage errors
    }

    getRelatedBlogs(blog.slug, 3).then(setRelatedArticles);
  }, [blog.slug]);

  const toggleBookmark = () => {
    try {
      const saved = localStorage.getItem('bdyatra_saved_blogs');
      let list: string[] = saved ? JSON.parse(saved) : [];
      if (list.includes(blog.slug)) {
        list = list.filter((s) => s !== blog.slug);
        setIsBookmarked(false);
      } else {
        list.push(blog.slug);
        setIsBookmarked(true);
      }
      localStorage.setItem('bdyatra_saved_blogs', JSON.stringify(list));
    } catch {
      // ignore
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      });
    }
  };

  const formattedDate = new Date(blog.published_at).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      {/* 1. Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-200/80 z-50">
        <div
          className="h-full bg-emerald-600 transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* 2. Top Sticky Editorial Sub-Bar */}
      <div className="sticky top-18 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 py-2.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500 overflow-hidden">
            <button
              onClick={onBack}
              className="flex items-center gap-1 font-semibold text-slate-700 hover:text-emerald-700 transition-colors shrink-0 cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Travel Journals</span>
            </button>
            <span aria-hidden="true" className="text-slate-300">/</span>
            <span className="truncate font-medium text-slate-500 hidden sm:inline">
              {blog.title}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={toggleBookmark}
              aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark article'}
              className={`p-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                isBookmarked
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Bookmark className={`h-3.5 w-3.5 ${isBookmarked ? 'fill-emerald-700 text-emerald-700' : ''}`} />
              <span className="hidden md:inline">{isBookmarked ? 'Saved' : 'Save'}</span>
            </button>

            <button
              onClick={handleShare}
              className="p-1.5 px-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="h-3.5 w-3.5 text-slate-500" />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <article className="pt-8 sm:pt-12">
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* 3. Article Editorial Header */}
            <header className="mb-10 text-left">
              {/* Clean unboxed metadata with separators (Strict Zero-Pill) */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-3">
                <span>Field Dispatch</span>
                <span aria-hidden="true">·</span>
                <span>{blog.division_id ? `${blog.division_id.toUpperCase()} REGION` : 'BANGLADESH'}</span>
                <span aria-hidden="true">·</span>
                <span>{blog.reading_time}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-950 leading-[1.15] mb-4 text-balance">
                {blog.title}
              </h1>

              {blog.subtitle && (
                <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed mb-6">
                  {blog.subtitle}
                </p>
              )}

              {/* Byline & Date strip */}
              <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-200/90 text-xs text-slate-600">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center font-bold text-sm">
                    {blog.author_name.charAt(0)}
                  </div>
                  <div>
                    <span className="block font-bold text-slate-900 text-sm">
                      {blog.author_name}
                    </span>
                    <span className="text-slate-500 text-[11px]">
                      {blog.authorRole || 'BDYatra Contributing Field Writer'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-slate-500 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span>Published {formattedDate}</span>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    <span>{blog.reading_time}</span>
                  </span>
                </div>
              </div>
            </header>

            {/* 4. Dominant Hero Imagery */}
            <figure className="mb-12">
              <div className="relative aspect-16/9 w-full overflow-hidden rounded-2xl bg-slate-900 shadow-md">
                <img
                  src={blog.cover_image}
                  alt={blog.title}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
              </div>
              <figcaption className="text-xs text-slate-500 italic mt-2.5 px-1">
                Fig. 1 — Field observation document: {blog.title}. Photographed on location in Bangladesh.
              </figcaption>
            </figure>

            {/* 5. Field Intelligence & Quick Metrics Ribbon */}
            <div className="mb-12 p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900 mb-4 pb-2 border-b border-slate-100">
                <Compass className="h-4 w-4 text-emerald-600" />
                <span>Field Intelligence & Expedition Data</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
                <div>
                  <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Optimal Season
                  </span>
                  <span className="text-sm font-bold text-slate-900">
                    {blog.idealSeason || 'Autumn & Winter Months'}
                  </span>
                </div>

                <div>
                  <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Estimated Budget
                  </span>
                  <span className="text-sm font-bold text-slate-900">
                    {blog.estimatedBudget || '$50 – $100 USD'}
                  </span>
                </div>

                <div>
                  <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Trail Difficulty
                  </span>
                  <span className="text-sm font-bold text-emerald-700">
                    {blog.difficulty || 'Moderate Expedition'}
                  </span>
                </div>
              </div>

              {blog.destination_id && onExploreDestination && (
                <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <p className="text-xs text-slate-600">
                    Planning a trip to this location? View verified transport maps and local stays.
                  </p>
                  <Button
                    variant="emerald"
                    size="sm"
                    onClick={() => onExploreDestination(blog.destination_id!)}
                    icon={<Compass className="h-3.5 w-3.5" />}
                    className="shrink-0"
                  >
                    Open Destination Guide
                  </Button>
                </div>
              )}
            </div>

            {/* 6. Two-Column Asymmetric Reading Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 text-left">
              {/* Left Column: Table of Contents & Sticky Rail (Hidden on small viewports) */}
              {blog.tableOfContents && blog.tableOfContents.length > 0 && (
                <aside className="hidden lg:block lg:col-span-4">
                  <div className="sticky top-32 space-y-6 p-5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                    <span className="block text-xs font-bold uppercase tracking-wider text-slate-800 pb-2 border-b border-slate-100">
                      Table of Contents
                    </span>
                    <nav className="space-y-2">
                      {blog.tableOfContents.map((item, idx) => (
                        <a
                          key={item.id}
                          href={`#${item.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                            setActiveSection(item.id);
                          }}
                          className={`block text-xs leading-snug transition-colors py-1 cursor-pointer ${
                            activeSection === item.id
                              ? 'text-emerald-700 font-bold'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <span className="text-slate-400 font-mono mr-1.5">0{idx + 1}.</span>
                          {item.title}
                        </a>
                      ))}
                    </nav>

                    <div className="pt-4 border-t border-slate-100">
                      <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                        Topics Covered
                      </span>
                      <div className="flex flex-wrap gap-1.5 text-xs text-slate-600">
                        {blog.tags.map((tag) => (
                          <span key={tag} className="text-xs text-emerald-800 font-medium">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </aside>
              )}

              {/* Main Reading Column */}
              <div
                className={`space-y-10 ${
                  blog.tableOfContents && blog.tableOfContents.length > 0
                    ? 'lg:col-span-8'
                    : 'lg:col-span-12'
                }`}
              >
                {/* Opening Lead with Drop Cap */}
                <div className="text-base sm:text-lg text-slate-700 leading-relaxed font-sans first-letter:text-5xl first-letter:font-serif first-letter:font-extrabold first-letter:float-left first-letter:mr-3.5 first-letter:mt-1 first-letter:text-slate-900">
                  {blog.excerpt}
                </div>

                {/* Structured Sections */}
                {blog.sections && blog.sections.length > 0 ? (
                  blog.sections.map((sec, idx) => (
                    <section key={sec.id} id={sec.id} className="scroll-mt-32 space-y-4">
                      <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 pt-3">
                        <span className="text-emerald-700 font-mono text-sm mr-2 font-normal">
                          0{idx + 1}.
                        </span>
                        {sec.title}
                      </h2>

                      {sec.content.map((p, pIdx) => (
                        <p key={pIdx} className="text-sm sm:text-base text-slate-700 leading-relaxed">
                          {p}
                        </p>
                      ))}

                      {/* Wide Italic Serif Pull Quote */}
                      {sec.quote && (
                        <blockquote className="my-6 py-6 border-y border-slate-200/90 text-center">
                          <p className="text-lg sm:text-xl font-serif italic text-slate-900 leading-relaxed max-w-xl mx-auto">
                            "{sec.quote}"
                          </p>
                        </blockquote>
                      )}

                      {/* Section Figure Image */}
                      {sec.image && (
                        <figure className="my-6">
                          <div className="relative aspect-16/9 w-full overflow-hidden rounded-xl bg-slate-900">
                            <img
                              src={sec.image}
                              alt={sec.title}
                              referrerPolicy="no-referrer"
                              className="h-full w-full object-cover"
                            />
                          </div>
                          {sec.imageCaption && (
                            <figcaption className="text-xs text-slate-500 italic mt-2 px-1">
                              {sec.imageCaption}
                            </figcaption>
                          )}
                        </figure>
                      )}

                      {/* Practical Pro Tip Callout Box */}
                      {sec.proTip && (
                        <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-emerald-950 flex items-start gap-3">
                          <AlertCircle className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                          <div className="text-xs sm:text-sm leading-relaxed">
                            <strong className="font-bold text-emerald-900 mr-1.5">
                              Field Guideline:
                            </strong>
                            <span>{sec.proTip}</span>
                          </div>
                        </div>
                      )}
                    </section>
                  ))
                ) : (
                  /* Fallback when structured sections are not parsed */
                  <div className="prose prose-slate max-w-none text-base text-slate-700 leading-relaxed space-y-4">
                    {blog.content.split('\n\n').map((paragraph, idx) => {
                      if (paragraph.startsWith('### ')) {
                        return (
                          <h3 key={idx} className="text-xl font-bold text-slate-900 pt-4">
                            {paragraph.replace('### ', '')}
                          </h3>
                        );
                      }
                      return <p key={idx}>{paragraph}</p>;
                    })}
                  </div>
                )}

                {/* 7. Author Bio Box */}
                <div className="pt-8 border-t border-slate-200/90">
                  <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                    <div className="h-14 w-14 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-lg shrink-0">
                      {blog.author_name.charAt(0)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                        <h4 className="text-base font-bold text-slate-900">{blog.author_name}</h4>
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          {blog.authorRole || 'Contributing Writer'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {blog.authorBio ||
                          'Documenting conservation trails, indigenous landscapes, and cultural heritage across Bangladesh.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 8. Reader Navigation & Sharing Bar */}
                <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <Button
                    variant="outline"
                    size="md"
                    onClick={onBack}
                    icon={<ArrowLeft className="h-4 w-4" />}
                  >
                    Back to All Travel Journals
                  </Button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleShare}
                      className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                      <span>{copiedLink ? 'Link Copied!' : 'Share This Story'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 9. Related Articles Section */}
            {relatedArticles.length > 0 && (
              <section className="mt-20 pt-12 border-t border-slate-200">
                <div className="flex items-end justify-between mb-8">
                  <div>
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-1">
                      Further Reading
                    </span>
                    <h3 className="text-2xl font-extrabold tracking-tight text-slate-900">
                      Recommended Field Stories
                    </h3>
                  </div>
                  <Button variant="outline" size="sm" onClick={onBack}>
                    View All Stories
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                  {relatedArticles.map((rel) => (
                    <article
                      key={rel.id}
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        onSelectBlog(rel.slug);
                      }}
                      className="group flex flex-col justify-between overflow-hidden rounded-xl bg-white border border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer"
                    >
                      <div>
                        <div className="relative aspect-16/9 w-full overflow-hidden bg-slate-900">
                          <img
                            src={rel.cover_image}
                            alt={rel.title}
                            referrerPolicy="no-referrer"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="p-4">
                          <span className="text-[11px] font-semibold text-emerald-700 block mb-1.5">
                            {rel.reading_time}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 mb-2">
                            {rel.title}
                          </h4>
                          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                            {rel.excerpt}
                          </p>
                        </div>
                      </div>

                      <div className="px-4 pb-4 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <span>By {rel.author_name}</span>
                        <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-1 transition-all" />
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </div>
        </Container>
      </article>
    </div>
  );
};
