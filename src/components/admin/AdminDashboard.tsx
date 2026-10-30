import React, { useState } from 'react';
import {
  Compass,
  LayoutDashboard,
  MapPin,
  Building2,
  BookOpen,
  ShieldCheck,
  LogOut,
  ExternalLink,
  Plus,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingUp,
  FileCheck,
  AlertCircle,
  Database,
  RefreshCw,
} from 'lucide-react';
import { AdminUser, AdminStatsSummary } from '../../types/auth';
import { Destination } from '../../types/destination';
import { DirectoryListing } from '../../types/directory';
import { EnrichedBlogPost } from '../../types/blog';
import { AdminListingSubmission } from '../../services/directoryService';
import { DestinationsCMS } from './DestinationsCMS';
import { DirectoryCMS } from './DirectoryCMS';
import { BlogsCMS } from './BlogsCMS';
import { SecurityRLSView } from './SecurityRLSView';

interface AdminDashboardProps {
  adminUser: AdminUser;
  destinations: Destination[];
  directoryListings: DirectoryListing[];
  blogs: EnrichedBlogPost[];
  submissions: AdminListingSubmission[];
  onSaveDestination: (dest: Partial<Destination>) => Promise<{ success: boolean; message: string }>;
  onDeleteDestination: (id: string) => Promise<{ success: boolean; message: string }>;
  onSaveListing: (listing: Partial<DirectoryListing>) => Promise<{ success: boolean; message: string }>;
  onDeleteListing: (id: string) => Promise<{ success: boolean; message: string }>;
  onUpdateSubmissionStatus: (id: string, status: 'approved' | 'rejected') => Promise<{ success: boolean; message: string }>;
  onSaveBlog: (blog: Partial<EnrichedBlogPost>) => Promise<{ success: boolean; message: string }>;
  onDeleteBlog: (id: string) => Promise<{ success: boolean; message: string }>;
  onSignOut: () => void;
  onReturnToSite: () => void;
}

export type AdminTab = 'overview' | 'destinations' | 'directory' | 'blogs' | 'security';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  adminUser,
  destinations,
  directoryListings,
  blogs,
  submissions,
  onSaveDestination,
  onDeleteDestination,
  onSaveListing,
  onDeleteListing,
  onUpdateSubmissionStatus,
  onSaveBlog,
  onDeleteBlog,
  onSignOut,
  onReturnToSite,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showFeedback = (msg: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ message: msg, type });
    setTimeout(() => setFeedback(null), 5000);
  };

  // Wrapped handlers to show feedback
  const handleSaveDestination = async (dest: Partial<Destination>) => {
    const result = await onSaveDestination(dest);
    if (result.success) {
      showFeedback(result.message, 'success');
    } else {
      showFeedback(result.message, 'error');
    }
    return result;
  };

  const handleDeleteDestination = async (id: string) => {
    const result = await onDeleteDestination(id);
    if (result.success) {
      showFeedback(result.message, 'success');
    } else {
      showFeedback(result.message, 'error');
    }
    return result;
  };

  const handleSaveListing = async (listing: Partial<DirectoryListing>) => {
    const result = await onSaveListing(listing);
    if (result.success) {
      showFeedback(result.message, 'success');
    } else {
      showFeedback(result.message, 'error');
    }
    return result;
  };

  const handleDeleteListing = async (id: string) => {
    const result = await onDeleteListing(id);
    if (result.success) {
      showFeedback(result.message, 'success');
    } else {
      showFeedback(result.message, 'error');
    }
    return result;
  };

  const handleUpdateSubmission = async (id: string, status: 'approved' | 'rejected') => {
    const result = await onUpdateSubmissionStatus(id, status);
    if (result.success) {
      showFeedback(result.message, 'success');
    } else {
      showFeedback(result.message, 'error');
    }
    return result;
  };

  const handleSaveBlog = async (blog: Partial<EnrichedBlogPost>) => {
    const result = await onSaveBlog(blog);
    if (result.success) {
      showFeedback(result.message, 'success');
    } else {
      showFeedback(result.message, 'error');
    }
    return result;
  };

  const handleDeleteBlog = async (id: string) => {
    const result = await onDeleteBlog(id);
    if (result.success) {
      showFeedback(result.message, 'success');
    } else {
      showFeedback(result.message, 'error');
    }
    return result;
  };

  // Statistics
  const pendingSubmissionsCount = submissions.filter((s) => s.status === 'pending').length;
  const verifiedListingsCount = directoryListings.filter((l) => l.verified).length;
  const publishedDestinationsCount = destinations.filter(
    (d) => d.published !== false
  ).length;
  const publishedBlogsCount = blogs.filter((b) => b.is_published).length;

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-xs">
              <Compass className="h-5 w-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-slate-950">
                  BD<span className="text-emerald-600">Yatra</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider bg-slate-900 text-white px-2 py-0.5 rounded">
                  Admin CMS
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Bangladesh Travel Discovery & Editorial Platform
              </p>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* User status */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-medium text-slate-700">{adminUser.email}</span>
              <span className="text-slate-400 font-mono text-[11px]">({adminUser.role})</span>
            </div>

            <button
              onClick={onReturnToSite}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">View Public Website</span>
              <span className="sm:hidden">Public Site</span>
            </button>

            <button
              onClick={onSignOut}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-100 flex items-center gap-1 sm:gap-4 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'destinations', label: `Destinations (${destinations.length})`, icon: MapPin },
            {
              id: 'directory',
              label: `Stays & Places (${directoryListings.length})`,
              icon: Building2,
              badge: pendingSubmissionsCount > 0 ? pendingSubmissionsCount : null,
            },
            { id: 'blogs', label: `Travel Blogs (${blogs.length})`, icon: BookOpen },
            { id: 'security', label: 'Supabase RLS & Storage', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`flex items-center gap-2 py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'border-emerald-600 text-emerald-800 font-bold'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="h-4.5 min-w-[18px] px-1 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* Toast Feedback Notification Banner */}
      {feedback && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom duration-200">
          <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl border text-sm ${
            feedback.type === 'success' 
              ? 'bg-slate-900 text-white border-slate-700' 
              : 'bg-red-600 text-white border-red-500'
          }`}>
            {feedback.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 text-white shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Header intro */}
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Editorial Control & Content Architecture
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Manage travel directories, review operator applications, and maintain real-time
                Supabase database state.
              </p>
            </div>

            {/* Metric Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Destinations
                  </span>
                  <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <MapPin className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900">{destinations.length}</div>
                <div className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                  <span>{publishedDestinationsCount} published</span>
                  <span className="text-slate-400">&bull;</span>
                  <span>{destinations.length - publishedDestinationsCount} drafts</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Hospitality & Stays
                  </span>
                  <div className="h-8 w-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                    <Building2 className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900">
                  {directoryListings.length}
                </div>
                <div className="text-xs text-sky-700 font-medium">
                  {verifiedListingsCount} certified verified operators
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Published Blogs
                  </span>
                  <div className="h-8 w-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                    <BookOpen className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900">{blogs.length}</div>
                <div className="text-xs text-purple-700 font-medium">
                  {publishedBlogsCount} live field narratives
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Pending Submissions
                  </span>
                  <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Clock className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900">{pendingSubmissionsCount}</div>
                <div className="text-xs text-amber-700 font-medium">
                  {pendingSubmissionsCount > 0 ? 'Requires editorial review' : 'All caught up'}
                </div>
              </div>
            </div>

            {/* Quick Actions & System Info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Quick Actions
                </h3>
                <div className="flex flex-col gap-2.5">
                  <button
                    onClick={() => setActiveTab('destinations')}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900 group-hover:text-emerald-800">
                          Add New Destination
                        </div>
                        <div className="text-xs text-slate-500">
                          Create landmark with photography & coordinates
                        </div>
                      </div>
                    </div>
                    <Plus className="h-4 w-4 text-slate-400 group-hover:text-emerald-600" />
                  </button>

                  <button
                    onClick={() => setActiveTab('directory')}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-sky-500 hover:bg-sky-50/40 text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center">
                        <Building2 className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900 group-hover:text-sky-800">
                          Verify Stay Submissions
                        </div>
                        <div className="text-xs text-slate-500">
                          {pendingSubmissionsCount} submissions pending approval
                        </div>
                      </div>
                    </div>
                    <Sparkles className="h-4 w-4 text-slate-400 group-hover:text-sky-600" />
                  </button>

                  <button
                    onClick={() => setActiveTab('blogs')}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-purple-500 hover:bg-purple-50/40 text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center">
                        <BookOpen className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900 group-hover:text-purple-800">
                          Draft Travel Article
                        </div>
                        <div className="text-xs text-slate-500">
                          Write field narratives and travel guides
                        </div>
                      </div>
                    </div>
                    <Plus className="h-4 w-4 text-slate-400 group-hover:text-purple-600" />
                  </button>

                  <button
                    onClick={() => setActiveTab('security')}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-slate-400 hover:bg-slate-50 text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center">
                        <ShieldCheck className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">
                          Inspect Supabase RLS
                        </div>
                        <div className="text-xs text-slate-500">
                          Review Row Level Security policies & storage buckets
                        </div>
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4 text-slate-400" />
                  </button>
                </div>
              </div>

              {/* Recent Activity stream */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                      Recent Platform Operations
                    </h3>
                    <span className="text-xs text-slate-400">Live Sync</span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="h-7 w-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                        <FileCheck className="h-4 w-4" />
                      </div>
                      <div className="flex-1 text-xs">
                        <div className="font-semibold text-slate-900">
                          Editorial System Initialized
                        </div>
                        <p className="text-slate-500 mt-0.5">
                          Connected to Supabase cluster <code>kdriflxmjwsxonmttyr.supabase.co</code>.
                          Storage buckets configured for <code>destination-images</code>, <code>blog-covers</code>, and <code>place-photos</code>.
                        </p>
                        <span className="text-[10px] text-slate-400 mt-1 block">Just now</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="h-7 w-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Building2 className="h-4 w-4" />
                      </div>
                      <div className="flex-1 text-xs">
                        <div className="font-semibold text-slate-900">
                          Hospitality Directory Live
                        </div>
                        <p className="text-slate-500 mt-0.5">
                          Verified listings loaded for eco-resorts in Sreemangal, houseboats in Sunamganj, and heritage stays in Dhaka.
                        </p>
                        <span className="text-[10px] text-slate-400 mt-1 block">Active</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* DB Initialization Utility */}
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                      <Database className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                        System Initialization & Database Sync
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Required for cross-device persistence and RLS write permissions.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={async () => {
                        const { seedDatabase } = await import('../../services/geoService');
                        const res = await seedDatabase();
                        showFeedback(res.message, res.success ? 'success' : 'error');
                      }}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-800 border border-slate-700 hover:border-emerald-500 hover:bg-slate-800/80 text-left transition-all cursor-pointer group"
                    >
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                          Seed Geography Metadata
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Ensures Divisions & Districts exist
                        </div>
                      </div>
                      <RefreshCw className="h-3.5 w-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                    </button>

                    <button
                      onClick={async () => {
                        const { ensureAdminProfile } = await import('../../services/authService');
                        const res = await ensureAdminProfile(adminUser);
                        showFeedback(res.message, res.success ? 'success' : 'error');
                      }}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-800 border border-slate-700 hover:border-emerald-500 hover:bg-slate-800/80 text-left transition-all cursor-pointer group"
                    >
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                          Sync Admin Profile
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Enables RLS write permissions
                        </div>
                      </div>
                      <ShieldCheck className="h-3.5 w-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'destinations' && (
          <DestinationsCMS
            destinations={destinations}
            onSaveDestination={handleSaveDestination}
            onDeleteDestination={handleDeleteDestination}
          />
        )}

        {activeTab === 'directory' && (
          <DirectoryCMS
            listings={directoryListings}
            submissions={submissions}
            onSaveListing={handleSaveListing}
            onDeleteListing={handleDeleteListing}
            onUpdateSubmissionStatus={handleUpdateSubmission}
          />
        )}

        {activeTab === 'blogs' && (
          <BlogsCMS
            blogs={blogs}
            onSaveBlog={handleSaveBlog}
            onDeleteBlog={handleDeleteBlog}
          />
        )}

        {activeTab === 'security' && <SecurityRLSView />}
      </main>
    </div>
  );
};
