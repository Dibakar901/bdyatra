import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
  Compass,
  MapPin,
  Sparkles,
  Search,
  Building2,
  Ship,
  Users,
  Car,
  Home,
  CheckCircle2,
  Database,
  Globe,
} from 'lucide-react';
import { Container } from './components/common/Container';
import { Button } from './components/common/Button';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/home/HeroSection';
import { SupabaseStatusBanner } from './components/home/SupabaseStatusBanner';
import { TravelGuideHighlights } from './components/home/TravelGuideHighlights';
import { AboutSection } from './components/home/AboutSection';
import { DestinationsDirectoryView } from './components/destinations/DestinationsDirectoryView';
import { DestinationDetailPage } from './components/destinations/DestinationDetailPage';
import { DirectoryCard } from './components/directory/DirectoryCard';
import { DirectoryFilters } from './components/directory/DirectoryFilters';
import { BlogsView } from './components/blogs/BlogsView';
import { BlogPostReaderPage } from './components/blogs/BlogPostReaderPage';
import { BlogDetailModal } from './components/blogs/BlogDetailModal';
import { DatabaseConsoleModal } from './components/database/DatabaseConsoleModal';
import { SEOInspectorModal } from './components/seo/SEOInspectorModal';
import { ProtectedRoute } from './components/admin/ProtectedRoute';
import { supabase } from './services/supabaseClient';

import {
  Destination,
  DestinationFilterState,
  BangladeshDivision,
} from './types/destination';
import {
  DirectoryListing,
  DirectoryFilterState,
} from './types/directory';
import { BlogRow } from './types/supabase';
import { EnrichedBlogPost } from './types/blog';
import { SEOMetadata, SitemapEntry } from './types/seo';
import { AdminUser } from './types/auth';
import {
  getDestinations,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination,
} from './services/destinationsService';
import {
  getDirectoryListings,
  createDirectoryListing,
  updateDirectoryListing,
  deleteDirectoryListing,
  getListingSubmissions,
  updateListingSubmissionStatus,
  AdminListingSubmission,
} from './services/directoryService';
import {
  getBlogs,
  getBlogBySlug,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from './services/blogsService';
import { getCurrentAdminUser, signOutAdmin } from './services/authService';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLoginPage } from './components/admin/AdminLoginPage';
import {
  applySEOMetadata,
  buildArticleStructuredData,
  buildDestinationStructuredData,
} from './utils/seo';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('destinations');

  // Destinations State
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [destinationsLoading, setDestinationsLoading] = useState(true);
  const [destinationFilters, setDestinationFilters] = useState<DestinationFilterState>({
    division: 'All',
    district: undefined,
    category: 'All',
    searchQuery: '',
  });

  // Immersive Destination Detail Page State
  const [activeDestinationDetail, setActiveDestinationDetail] = useState<Destination | null>(null);

  // Immersive Blog Reader State
  const [activeBlogReader, setActiveBlogReader] = useState<EnrichedBlogPost | null>(null);

  // Directory State
  const [directoryListings, setDirectoryListings] = useState<DirectoryListing[]>([]);
  const [directoryLoading, setDirectoryLoading] = useState(true);
  const [directoryFilters, setDirectoryFilters] = useState<DirectoryFilterState>({
    category: 'All',
    division: 'All',
    searchQuery: '',
    verifiedOnly: false,
  });

  // All blogs list cache for sitemap and overview
  const [allBlogsList, setAllBlogsList] = useState<EnrichedBlogPost[]>([]);

  // Modals
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [isSEOInspectorOpen, setIsSEOInspectorOpen] = useState(false);
  const [selectedBlogForModal, setSelectedBlogForModal] = useState<BlogRow | null>(null);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);

  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [adminSubmissions, setAdminSubmissions] = useState<AdminListingSubmission[]>([]);

  // Active SEO State for Inspector
  const [currentSEOMeta, setCurrentSEOMeta] = useState<SEOMetadata>({
    title: 'BDYatra - Bangladesh Travel Discovery & Directory',
    description:
      "Discover Bangladesh's premier travel destinations, eco-resorts, heritage trails, and local directories with BDYatra.",
  });
  const [currentJsonLd, setCurrentJsonLd] = useState<Record<string, unknown>>({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'BDYatra',
  });

  // Load Admin user & submissions on start
  useEffect(() => {
    // 1. Initial check
    getCurrentAdminUser().then((user) => {
      setAdminUser(user);
      setAuthLoading(false);
    });

    // 2. Auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        // Fetch full user profile
        const user = await getCurrentAdminUser();
        setAdminUser(user);
      } else {
        setAdminUser(null);
      }
      setAuthLoading(false);
    });

    getListingSubmissions().then(setAdminSubmissions);

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Load Destinations
  useEffect(() => {
    let isMounted = true;
    setDestinationsLoading(true);
    getDestinations(destinationFilters).then((data) => {
      if (isMounted) {
        setDestinations(data);
        setDestinationsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [destinationFilters]);

  // Load Directory Listings
  useEffect(() => {
    let isMounted = true;
    setDirectoryLoading(true);
    getDirectoryListings(directoryFilters).then((data) => {
      if (isMounted) {
        setDirectoryListings(data);
        setDirectoryLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [directoryFilters]);

  // Load Blogs for sitemap cache
  useEffect(() => {
    getBlogs('All', true).then(setAllBlogsList);
  }, []);

  // Load Blogs for sitemap cache
  useEffect(() => {
    getBlogs('All', true).then(setAllBlogsList);
  }, []);

  // DYNAMIC SEO SYNCHRONIZATION
  useEffect(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://bdyatra.travel';

    // 1. Active Blog Post Reader View
    if (activeBlogReader) {
      const meta: SEOMetadata = {
        title: `${activeBlogReader.title} | BDYatra Field Guides`,
        description: activeBlogReader.excerpt.slice(0, 155),
        canonicalUrl: `${origin}/#blog=${activeBlogReader.slug}`,
        ogType: 'article',
        ogImage: activeBlogReader.cover_image,
        ogImageAlt: activeBlogReader.title,
        twitterCard: 'summary_large_image',
        publishedTime: activeBlogReader.published_at,
        author: activeBlogReader.author_name,
        section: activeBlogReader.division_id || 'Bangladesh Travel',
        tags: activeBlogReader.tags,
      };
      const jsonLd = buildArticleStructuredData(activeBlogReader);
      setCurrentSEOMeta(meta);
      setCurrentJsonLd(jsonLd);
      applySEOMetadata(meta, jsonLd);
    }
    // 2. Active Destination Detail Page
    else if (activeDestinationDetail) {
      const meta: SEOMetadata = {
        title: `${activeDestinationDetail.name} — ${activeDestinationDetail.tagline} | BDYatra`,
        description: activeDestinationDetail.description.slice(0, 155),
        canonicalUrl: `${origin}/#destination=${activeDestinationDetail.id}`,
        ogType: 'website',
        ogImage: activeDestinationDetail.image,
        ogImageAlt: activeDestinationDetail.name,
        twitterCard: 'summary_large_image',
      };
      const jsonLd = buildDestinationStructuredData(activeDestinationDetail);
      setCurrentSEOMeta(meta);
      setCurrentJsonLd(jsonLd);
      applySEOMetadata(meta, jsonLd);
    }
    // 3. Tab Views
    else {
      let meta: SEOMetadata;
      if (activeTab === 'directory') {
        meta = {
          title: 'Verified Hotels, Eco-Resorts & Timber Houseboats | BDYatra',
          description:
            'Discover verified eco-resorts, houseboats, certified mountain guides, and boutique stays across Bangladesh.',
          canonicalUrl: `${origin}/#directory`,
          ogType: 'website',
        };
      } else if (activeTab === 'blogs') {
        meta = {
          title: 'Bangladesh Travel Stories, Field Journals & Guides | BDYatra',
          description:
            'Read comprehensive travel journals, convoy logistics, and seasonal guides written by local explorers across Bangladesh.',
          canonicalUrl: `${origin}/#blogs`,
          ogType: 'website',
        };
      } else if (activeTab === 'experiences') {
        meta = {
          title: 'Signature Experiences & Safaris in Bangladesh | BDYatra',
          description:
            'Handpicked adventures including Tanguar Haor cruising, Chander Gari 4x4 safaris, and colonial tea plantation stays.',
          canonicalUrl: `${origin}/#experiences`,
          ogType: 'website',
        };
      } else {
        meta = {
          title: 'BDYatra — Bangladesh Travel Discovery & Directory',
          description:
            "Discover Bangladesh's premier travel destinations, eco-resorts, heritage trails, and local directories with BDYatra.",
          canonicalUrl: `${origin}/`,
          ogType: 'website',
        };
      }

      const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'BDYatra',
        url: origin,
        description: meta.description,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${origin}/#destinations?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      };

      setCurrentSEOMeta(meta);
      setCurrentJsonLd(jsonLd);
      applySEOMetadata(meta, jsonLd);
    }
  }, [activeBlogReader, activeDestinationDetail, activeTab]);

  // Dynamic Sitemap Entries Generation
  const sitemapEntries: SitemapEntry[] = useMemo(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://bdyatra.travel';
    const now = new Date().toISOString();

    const staticRoutes: SitemapEntry[] = [
      { loc: `${origin}/`, lastmod: now, changefreq: 'daily', priority: 1.0, title: 'BDYatra Home & Travel Discovery', category: 'Core' },
      { loc: `${origin}/destinations`, lastmod: now, changefreq: 'daily', priority: 0.9, title: 'Destinations Directory', category: 'Destinations' },
      { loc: `${origin}/directory`, lastmod: now, changefreq: 'daily', priority: 0.9, title: 'Verified Stays & Operators', category: 'Directory' },
      { loc: `${origin}/blogs`, lastmod: now, changefreq: 'daily', priority: 0.9, title: 'Travel Journals & Field Guides', category: 'Editorial' },
      { loc: `${origin}/experiences`, lastmod: now, changefreq: 'weekly', priority: 0.7, title: 'Signature Experiences', category: 'Tours' },
      { loc: `${origin}/about`, lastmod: now, changefreq: 'monthly', priority: 0.5, title: 'About BDYatra', category: 'Institutional' },
    ];

    const destRoutes: SitemapEntry[] = destinations.map((d) => ({
      loc: `${origin}/destination/${d.id}`,
      lastmod: now,
      changefreq: 'weekly',
      priority: 0.85,
      title: `${d.name} Destination Guide`,
      category: `Destination (${d.division})`,
    }));

    const blogRoutes: SitemapEntry[] = allBlogsList.map((b) => ({
      loc: `${origin}/blog/${b.slug}`,
      lastmod: b.published_at || now,
      changefreq: 'monthly',
      priority: 0.8,
      title: b.title,
      category: 'Travel Article',
    }));

    return [...staticRoutes, ...destRoutes, ...blogRoutes];
  }, [destinations, allBlogsList]);

  const handleRefreshDirectory = () => {
    getDirectoryListings(directoryFilters).then((data) => {
      setDirectoryListings(data);
    });
  };

  const handleOpenDestinationDetail = (dest: Destination) => {
    setActiveBlogReader(null);
    setActiveDestinationDetail(dest);
    window.location.hash = `destination=${dest.id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToDestinations = () => {
    setActiveDestinationDetail(null);
    history.replaceState(null, '', window.location.pathname + '#destinations');
    const target = document.getElementById('destinations-directory-content');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenBlogReader = (blog: EnrichedBlogPost) => {
    setActiveDestinationDetail(null);
    setActiveBlogReader(blog);
    window.location.hash = `blog=${blog.slug}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToBlogs = () => {
    setActiveBlogReader(null);
    history.replaceState(null, '', window.location.pathname + '#blogs');
    setActiveTab('blogs');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateBlogSlug = (slug: string) => {
    getBlogBySlug(slug).then((blog) => {
      if (blog) {
        setActiveBlogReader(blog);
        window.location.hash = `blog=${blog.slug}`;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  };

  const handleHeroSearch = (query: string, division: BangladeshDivision | 'All') => {
    setActiveDestinationDetail(null);
    setActiveBlogReader(null);
    history.replaceState(null, '', window.location.pathname + '#destinations');
    setDestinationFilters({
      ...destinationFilters,
      searchQuery: query,
      division: division,
      district: undefined,
    });
    setActiveTab('destinations');
    const target = document.getElementById('destinations-directory-content');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectDivisionFromFooter = (division: BangladeshDivision) => {
    setActiveDestinationDetail(null);
    setActiveBlogReader(null);
    history.replaceState(null, '', window.location.pathname + '#destinations');
    setDestinationFilters({
      ...destinationFilters,
      division: division,
      district: undefined,
      searchQuery: '',
    });
    setActiveTab('destinations');
    const target = document.getElementById('destinations-directory-content');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExploreSeason = (keyword: string) => {
    setActiveDestinationDetail(null);
    setActiveBlogReader(null);
    history.replaceState(null, '', window.location.pathname + '#destinations');
    setDestinationFilters({
      ...destinationFilters,
      searchQuery: keyword,
      division: 'All',
      district: undefined,
      category: 'All',
    });
    setActiveTab('destinations');
    const target = document.getElementById('destinations-directory-content');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExploreDestinationFromBlog = (destId: string) => {
    setActiveBlogReader(null);
    getDestinationById(destId).then((dest) => {
      if (dest) {
        handleOpenDestinationDetail(dest);
      } else {
        setActiveTab('destinations');
        setDestinationFilters({
          ...destinationFilters,
          searchQuery: destId.replace(/-/g, ' '),
        });
      }
    });
  };

  const handleGoHome = () => {
    setActiveDestinationDetail(null);
    setActiveBlogReader(null);
    setActiveTab('destinations');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSwitchTab = (tab: string) => {
    setActiveDestinationDetail(null);
    setActiveBlogReader(null);
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Admin CRUD Handlers
  const handleAdminSaveDestination = async (destData: Partial<Destination>) => {
    if (destData.id && destinations.some((d) => d.id === destData.id)) {
      await updateDestination(destData.id, destData);
    } else {
      await createDestination(destData);
    }
    const refreshed = await getDestinations(destinationFilters);
    setDestinations(refreshed);
  };

  const handleAdminDeleteDestination = async (id: string) => {
    await deleteDestination(id);
    const refreshed = await getDestinations(destinationFilters);
    setDestinations(refreshed);
  };

  const handleAdminSaveListing = async (listingData: Partial<DirectoryListing>) => {
    if (listingData.id && directoryListings.some((l) => l.id === listingData.id)) {
      await updateDirectoryListing(listingData.id, listingData);
    } else {
      await createDirectoryListing(listingData);
    }
    const refreshed = await getDirectoryListings(directoryFilters);
    setDirectoryListings(refreshed);
  };

  const handleAdminDeleteListing = async (id: string) => {
    await deleteDirectoryListing(id);
    const refreshed = await getDirectoryListings(directoryFilters);
    setDirectoryListings(refreshed);
  };

  const handleAdminUpdateSubmissionStatus = async (
    id: string,
    status: 'approved' | 'rejected'
  ) => {
    await updateListingSubmissionStatus(id, status);
    const subs = await getListingSubmissions();
    setAdminSubmissions(subs);
    const refreshedListings = await getDirectoryListings(directoryFilters);
    setDirectoryListings(refreshedListings);
  };

  const handleAdminSaveBlog = async (blogData: Partial<EnrichedBlogPost>) => {
    if (blogData.id && allBlogsList.some((b) => b.id === blogData.id)) {
      await updateBlogPost(blogData.id, blogData);
    } else {
      await createBlogPost(blogData);
    }
    const refreshed = await getBlogs('All', true);
    setAllBlogsList(refreshed);
  };

  const handleAdminDeleteBlog = async (id: string) => {
    await deleteBlogPost(id);
    const refreshed = await getBlogs('All', true);
    setAllBlogsList(refreshed);
  };

  const handleAdminSignOut = async () => {
    await signOutAdmin();
    setAdminUser(null);
  };

  const PublicLayout = () => (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {import.meta.env.DEV && (
        <SupabaseStatusBanner
          onOpenConsole={() => setIsConsoleOpen(true)}
          onOpenSEO={() => setIsSEOInspectorOpen(true)}
        />
      )}

      <Header
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setActiveDestinationDetail(null);
          setActiveBlogReader(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onGoHome={() => {
          setActiveTab('destinations');
          setActiveDestinationDetail(null);
          setActiveBlogReader(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenConsole={import.meta.env.DEV ? () => setIsConsoleOpen(true) : undefined}
      />

      {!activeDestinationDetail && !activeBlogReader && (
        <HeroSection
          onSearch={(query, division) => {
            setActiveDestinationDetail(null);
            setActiveBlogReader(null);
            setDestinationFilters({
              ...destinationFilters,
              searchQuery: query,
              division: division,
              district: undefined,
            });
            setActiveTab('destinations');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {activeBlogReader ? (
        <BlogPostReaderPage
          blog={activeBlogReader}
          onBack={() => {
            setActiveBlogReader(null);
            setActiveTab('blogs');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onSelectBlog={(slug) => {
            getBlogBySlug(slug).then((blog) => {
              if (blog) {
                setActiveBlogReader(blog);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            });
          }}
          onExploreDestination={(destId) => {
            setActiveBlogReader(null);
            getDestinationById(destId).then((dest) => {
              if (dest) {
                setActiveDestinationDetail(dest);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            });
          }}
        />
      ) : activeDestinationDetail ? (
        <DestinationDetailPage
          destination={activeDestinationDetail}
          onBack={() => {
            setActiveDestinationDetail(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          relatedListings={directoryListings}
        />
      ) : (
        <main id="destinations-directory-content" className="flex-1 py-14">
          <Container>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200">
              <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-200/80 rounded-xl">
                {['destinations', 'directory', 'blogs', 'experiences'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                      activeTab === tab
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)} {tab === 'destinations' ? `(${destinations.length})` : tab === 'directory' ? `(${directoryListings.length})` : ''}
                  </button>
                ))}
              </div>
              {import.meta.env.DEV && (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setIsSEOInspectorOpen(true)} icon={<Globe className="h-3.5 w-3.5 text-emerald-600" />} className="text-xs">SEO & Meta</Button>
                  <Button variant="outline" size="sm" onClick={() => setIsConsoleOpen(true)} icon={<Database className="h-3.5 w-3.5 text-slate-600" />} className="text-xs">Supabase Schema</Button>
                </div>
              )}
            </div>

            {activeTab === 'destinations' && <DestinationsDirectoryView destinations={destinations} loading={destinationsLoading} filters={destinationFilters} onFilterChange={setDestinationFilters} onSelectDestination={(dest) => { setActiveDestinationDetail(dest); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />}
            {activeTab === 'directory' && <div><DirectoryFilters filters={directoryFilters} onChange={setDirectoryFilters} totalResults={directoryListings.length} />{directoryLoading ? <div className="py-20 text-center">Loading...</div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{directoryListings.map((listing) => <DirectoryCard key={listing.id} listing={listing} />)}</div>}</div>}
            {activeTab === 'blogs' && <BlogsView onSelectBlog={(blog) => { setActiveBlogReader(blog); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />}
            {activeTab === 'experiences' && <div className="space-y-12"><h2 className="text-2xl font-bold">Signature Experiences</h2></div>}
          </Container>
        </main>
      )}

      {!activeDestinationDetail && !activeBlogReader && <TravelGuideHighlights onExploreSeason={(keyword) => { setActiveDestinationDetail(null); setActiveBlogReader(null); setDestinationFilters({ ...destinationFilters, searchQuery: keyword }); setActiveTab('destinations'); }} />}
      {!activeDestinationDetail && !activeBlogReader && activeTab !== 'about' && <AboutSection />}

      <Footer
        onSelectDivision={(division) => {
          setActiveDestinationDetail(null);
          setActiveBlogReader(null);
          setDestinationFilters({ ...destinationFilters, division });
          setActiveTab('destinations');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onGoHome={() => {
          setActiveTab('destinations');
          setActiveDestinationDetail(null);
          setActiveBlogReader(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSEO={import.meta.env.DEV ? () => setIsSEOInspectorOpen(true) : undefined}
      />

      <BlogDetailModal blog={selectedBlogForModal} isOpen={isBlogModalOpen} onClose={() => setIsBlogModalOpen(false)} onExploreDestination={(destId) => { getDestinationById(destId).then(dest => dest && setActiveDestinationDetail(dest)); }} />
      {import.meta.env.DEV && (
        <>
          <DatabaseConsoleModal isOpen={isConsoleOpen} onClose={() => setIsConsoleOpen(false)} />
          <SEOInspectorModal isOpen={isSEOInspectorOpen} onClose={() => setIsSEOInspectorOpen(false)} currentMeta={currentSEOMeta} currentJsonLd={currentJsonLd} sitemapEntries={[]} />
        </>
      )}
    </div>
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<PublicLayout />} />
        <Route path="/admin/*" element={
          <ProtectedRoute adminUser={adminUser} isLoading={authLoading}>
            <AdminDashboard
              adminUser={adminUser!}
              destinations={destinations}
              directoryListings={directoryListings}
              blogs={allBlogsList}
              submissions={adminSubmissions}
              onSaveDestination={handleAdminSaveDestination}
              onDeleteDestination={handleAdminDeleteDestination}
              onSaveListing={handleAdminSaveListing}
              onDeleteListing={handleAdminDeleteListing}
              onUpdateSubmissionStatus={handleAdminUpdateSubmissionStatus}
              onSaveBlog={handleAdminSaveBlog}
              onDeleteBlog={handleAdminDeleteBlog}
              onSignOut={handleAdminSignOut}
              onReturnToSite={() => window.location.href = '/'}
            />
          </ProtectedRoute>
        } />
        <Route path="/admin/login" element={
          <AdminLoginPage
            onLoginSuccess={(user) => { setAdminUser(user); window.location.href = '/admin'; }}
            onReturnToSite={() => window.location.href = '/'}
          />
        } />
      </Routes>
    </BrowserRouter>
  );
}
