import React, { useState } from 'react';
import {
  Plus,
  Search,
  CheckCircle,
  XCircle,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Building2,
  Phone,
  Mail,
  ExternalLink,
  ShieldCheck,
  X,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import {
  DirectoryListing,
  DirectoryCategory,
  PriceTier,
} from '../../types/directory';
import { BangladeshDivision } from '../../types/destination';
import { AdminListingSubmission } from '../../services/directoryService';
import { ImageUploader } from './ImageUploader';

interface DirectoryCMSProps {
  listings: DirectoryListing[];
  submissions: AdminListingSubmission[];
  onSaveListing: (listing: Partial<DirectoryListing>) => Promise<void>;
  onDeleteListing: (id: string) => Promise<void>;
  onUpdateSubmissionStatus: (id: string, status: 'approved' | 'rejected') => Promise<void>;
}

const CATEGORIES: DirectoryCategory[] = [
  'Eco Resorts & Hotels',
  'Houseboats & Cruisers',
  'Licensed Tour Guides',
  'Transport & Chander Gari',
  'Heritage Stays',
];

const DIVISIONS: BangladeshDivision[] = [
  'Dhaka',
  'Chittagong',
  'Sylhet',
  'Khulna',
  'Barishal',
  'Rajshahi',
  'Rangpur',
  'Mymensingh',
];

export const DirectoryCMS: React.FC<DirectoryCMSProps> = ({
  listings,
  submissions,
  onSaveListing,
  onDeleteListing,
  onUpdateSubmissionStatus,
}) => {
  const [subTab, setSubTab] = useState<'listings' | 'submissions'>('listings');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [divisionFilter, setDivisionFilter] = useState<string>('All');

  // Modal states
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<Partial<DirectoryListing> | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serviceInput, setServiceInput] = useState('');

  const [formData, setFormData] = useState<Partial<DirectoryListing>>({
    name: '',
    category: 'Eco Resorts & Hotels',
    division: 'Dhaka',
    district: 'Dhaka',
    description: '',
    priceRange: '৳৳',
    priceRate: '৳7,000 / night',
    phone: '',
    email: '',
    website: '',
    address: '',
    services: [],
    verified: true,
    featured: false,
    published: true,
    coverImage: '',
  });

  const handleOpenNew = () => {
    setFormData({
      name: '',
      category: 'Eco Resorts & Hotels',
      division: 'Dhaka',
      district: 'Dhaka',
      description: '',
      priceRange: '',
      priceRate: '',
      phone: '',
      email: '',
      website: '',
      address: '',
      services: [],
      verified: true,
      featured: false,
      published: true,
      coverImage: '/src/assets/images/srimangal_tea_hills_1793169489776.jpg',
    });
    setEditingListing(null);
    setServiceInput('');
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (item: DirectoryListing) => {
    setFormData({
      ...item,
      published: item.published !== undefined ? item.published : true,
    });
    setEditingListing(item);
    setServiceInput('');
    setIsEditorOpen(true);
  };

  const handleAddService = () => {
    if (!serviceInput.trim()) return;
    const current = formData.services || [];
    setFormData({
      ...formData,
      services: [...current, serviceInput.trim()],
    });
    setServiceInput('');
  };

  const handleRemoveService = (index: number) => {
    const current = formData.services || [];
    setFormData({
      ...formData,
      services: current.filter((_, i) => i !== index),
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) return;

    setIsSubmitting(true);
    try {
      await onSaveListing(formData);
      setIsEditorOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleVerified = async (item: DirectoryListing) => {
    await onSaveListing({
      id: item.id,
      verified: !item.verified,
    });
  };

  const handleTogglePublished = async (item: DirectoryListing) => {
    const nextPublished = !(item.published !== undefined ? item.published : true);
    await onSaveListing({
      id: item.id,
      published: nextPublished,
    });
  };

  // Filter listings
  const filteredListings = listings.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === 'All' || item.category === categoryFilter;
    const matchesDivision =
      divisionFilter === 'All' || item.division === divisionFilter;
    return matchesSearch && matchesCategory && matchesDivision;
  });

  const pendingSubmissions = submissions.filter((s) => s.status === 'pending');

  return (
    <div className="space-y-6">
      {/* Sub-tab navigation */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
        <button
          onClick={() => setSubTab('listings')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
            subTab === 'listings'
              ? 'bg-emerald-600 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Active Stays & Services ({listings.length})
        </button>

        <button
          onClick={() => setSubTab('submissions')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
            subTab === 'submissions'
              ? 'bg-emerald-600 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <span>User Submissions</span>
          {pendingSubmissions.length > 0 && (
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                subTab === 'submissions'
                  ? 'bg-white text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {pendingSubmissions.length} Pending
            </span>
          )}
        </button>
      </div>

      {subTab === 'listings' && (
        <>
          {/* Controls bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
            <div className="flex flex-1 flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by stay name, district, or address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <option value="All">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <select
                value={divisionFilter}
                onChange={(e) => setDivisionFilter(e.target.value)}
                className="text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <option value="All">All Divisions</option>
                {DIVISIONS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleOpenNew}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-semibold transition-colors shadow-xs cursor-pointer shrink-0"
            >
              <Plus className="h-4 w-4" />
              Add Stay / Service
            </button>
          </div>

          {/* Listings Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold text-xs uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Provider / Stay</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Location</th>
                    <th className="py-3.5 px-4">Pricing</th>
                    <th className="py-3.5 px-4 text-center">Verified</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredListings.map((item) => {
                    const isPublished = item.published !== undefined ? item.published : true;
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-900">{item.name}</div>
                          <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                            {item.phone && <span>{item.phone}</span>}
                            {item.email && <span>&bull; {item.email}</span>}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="text-xs text-slate-700 bg-slate-100 px-2 py-0.5 rounded font-medium whitespace-nowrap">
                            {item.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-slate-600">
                          <div className="font-medium text-slate-800">{item.district}</div>
                          <div className="text-slate-500">{item.division}</div>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-slate-600">
                          <div className="font-bold text-slate-800">{item.priceRate}</div>
                          <div className="text-slate-400 font-mono">{item.priceRange}</div>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => handleToggleVerified(item)}
                            title={item.verified ? 'Verified (Click to toggle)' : 'Unverified (Click to toggle)'}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold cursor-pointer border ${
                              item.verified
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-slate-100 text-slate-500 border-slate-300'
                            }`}
                          >
                            <ShieldCheck className="h-3 w-3" />
                            {item.verified ? 'Verified' : 'Standard'}
                          </button>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => handleTogglePublished(item)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer border ${
                              isPublished
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200'
                            }`}
                          >
                            {isPublished ? (
                              <>
                                <Eye className="h-3 w-3" />
                                Live
                              </>
                            ) : (
                              <>
                                <EyeOff className="h-3 w-3" />
                                Hidden
                              </>
                            )}
                          </button>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => handleOpenEdit(item)}
                              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                              title="Edit Listing"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setIsDeletingId(item.id)}
                              className="p-1.5 rounded-lg border border-slate-200 text-rose-500 hover:bg-rose-50 hover:border-rose-200 transition-colors cursor-pointer"
                              title="Delete Listing"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredListings.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500 text-sm">
                        No hospitality listings match your query.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Submissions Tab */}
      {subTab === 'submissions' && (
        <div className="space-y-4">
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-4 flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-900 leading-relaxed">
              <strong>Editorial Verification Workflow:</strong> Review incoming submissions submitted by local hotels, houseboat captains, and tour guides. Approving a submission automatically activates a verified directory profile and notifies the directory index.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {submissions.map((sub) => {
              const isPending = sub.status === 'pending';
              return (
                <div
                  key={sub.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-start justify-between gap-5"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-base font-bold text-slate-900">{sub.name}</h4>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {sub.category}
                      </span>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                          sub.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : sub.status === 'rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {sub.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">{sub.description}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs text-slate-500 pt-1">
                      <div>
                        <span className="font-medium text-slate-700">Location: </span>
                        {sub.district}, {sub.division}
                      </div>
                      <div>
                        <span className="font-medium text-slate-700">Rate: </span>
                        {sub.priceRate || 'N/A'} ({sub.priceRange})
                      </div>
                      <div>
                        <span className="font-medium text-slate-700">Contact: </span>
                        {sub.phone}
                      </div>
                      {sub.email && (
                        <div>
                          <span className="font-medium text-slate-700">Email: </span>
                          {sub.email}
                        </div>
                      )}
                      {sub.address && (
                        <div className="sm:col-span-2">
                          <span className="font-medium text-slate-700">Address: </span>
                          {sub.address}
                        </div>
                      )}
                    </div>

                    {sub.servicesText && (
                      <div className="text-xs text-slate-500">
                        <span className="font-medium text-slate-700">Services Offered: </span>
                        <span className="text-slate-700 font-mono bg-slate-50 px-1 py-0.5 rounded">
                          {sub.servicesText}
                        </span>
                      </div>
                    )}
                  </div>

                  {isPending && (
                    <div className="flex md:flex-col gap-2 shrink-0">
                      <button
                        onClick={() => onUpdateSubmissionStatus(sub.id, 'approved')}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs transition-colors"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Approve & Verify
                      </button>
                      <button
                        onClick={() => onUpdateSubmissionStatus(sub.id, 'rejected')}
                        className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-300 text-slate-600 hover:text-rose-600 hover:border-rose-300 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
            {submissions.length === 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-sm text-slate-500">
                No user submissions recorded yet.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add / Edit Listing Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingListing ? `Edit Stay: ${formData.name}` : 'Add New Hospitality Provider'}
                </h3>
                <p className="text-xs text-slate-500">
                  Configure directory listings for verified hotels, eco-resorts, and houseboats.
                </p>
              </div>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Provider Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Grand Sultan Tea Resort & Golf"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category *</label>
                  <select
                    value={formData.category || 'Eco Resorts & Hotels'}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value as DirectoryCategory })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Division *</label>
                  <select
                    value={formData.division || 'Dhaka'}
                    onChange={(e) =>
                      setFormData({ ...formData, division: e.target.value as BangladeshDivision })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
                  >
                    {DIVISIONS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">District *</label>
                  <input
                    type="text"
                    required
                    value={formData.district || ''}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    placeholder="e.g. Moulvibazar"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Overview of amenities, hospitality level, scenic surroundings..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              {/* Cover Image */}
              <div className="pt-2 border-t border-slate-100">
                <ImageUploader
                  currentImageUrl={formData.coverImage}
                  bucket="place-photos"
                  onImageUploaded={(url) => setFormData({ ...formData, coverImage: url })}
                  label="Provider & Property Photo"
                  aspectRatioHint="4:3 or 16:9 Ratio"
                  recommendedDimensions="800 × 600 or 1200 × 675 pixels"
                  helperText="Upload crisp photography in 4:3 ratio (800 × 600 px) for stays/places or 16:9 ratio (1200 × 675 px) for wide property displays."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                    <span>Price Tier</span>
                    <span className="text-[10px] text-slate-400 font-normal">Optional</span>
                  </label>
                  <select
                    value={formData.priceRange || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, priceRange: e.target.value as PriceTier })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
                  >
                    <option value="">Select Price Tier (Optional)</option>
                    <option value="৳">৳ (Budget friendly)</option>
                    <option value="৳৳">৳৳ (Moderate)</option>
                    <option value="৳৳৳">৳৳৳ (Upscale)</option>
                    <option value="৳৳৳৳">৳৳৳৳ (Luxury / Premium)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                    <span>Price Rate Text</span>
                    <span className="text-[10px] text-slate-400 font-normal">Optional</span>
                  </label>
                  <input
                    type="text"
                    value={formData.priceRate || ''}
                    onChange={(e) => setFormData({ ...formData, priceRate: e.target.value })}
                    placeholder="e.g. ৳8,500 / night (Optional)"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone *</label>
                  <input
                    type="text"
                    required
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+880 1800..."
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                    <span>Email</span>
                    <span className="text-[10px] text-slate-400 font-normal">Optional</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. info@hotel.com (Optional)"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                    <span>Website</span>
                    <span className="text-[10px] text-slate-400 font-normal">Optional</span>
                  </label>
                  <input
                    type="url"
                    value={formData.website || ''}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="e.g. https://... (Optional)"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Physical Address
                </label>
                <input
                  type="text"
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. Radhanagar, Sreemangal, Moulvibazar"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              {/* Services tags */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Services & Amenities
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={serviceInput}
                    onChange={(e) => setServiceInput(e.target.value)}
                    placeholder="e.g. Solar Power, Guided Boat Tour"
                    className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddService();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddService}
                    className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(formData.services || []).map((s, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 text-xs border border-slate-200"
                    >
                      {s}
                      <button
                        type="button"
                        onClick={() => handleRemoveService(i)}
                        className="text-slate-500 hover:text-slate-800"
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
                    checked={formData.verified !== false}
                    onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                    className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                  />
                  <span>Verified Provider Badge</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.published !== false}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                  />
                  <span>Published (Live in Directory)</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : editingListing ? 'Update Listing' : 'Create Listing'}
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
              <h3 className="text-lg font-bold text-slate-900">Delete Listing?</h3>
            </div>
            <p className="text-sm text-slate-600 mb-6">
              Are you sure you want to delete this listing from the directory?
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setIsDeletingId(null)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await onDeleteListing(isDeletingId);
                  setIsDeletingId(null);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-sm font-semibold"
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
