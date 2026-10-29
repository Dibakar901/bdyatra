import React, { useState } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Star,
  MapPin,
  Calendar,
  X,
  AlertCircle,
  Phone,
  Globe,
  Map,
} from 'lucide-react';
import { Destination, BangladeshDivision, DestinationCategory } from '../../types/destination';
import { ImageUploader } from './ImageUploader';

interface DestinationsCMSProps {
  destinations: Destination[];
  onSaveDestination: (destination: Partial<Destination>) => Promise<void>;
  onDeleteDestination: (id: string) => Promise<void>;
}

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

const CATEGORIES: DestinationCategory[] = [
  'Nature & Wildlife',
  'Beaches & Islands',
  'Hill Tracts',
  'Tea Country',
  'Wetlands & Haor',
  'Heritage & Culture',
  'Riverine & Delta',
];

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export const DestinationsCMS: React.FC<DestinationsCMSProps> = ({
  destinations,
  onSaveDestination,
  onDeleteDestination,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [divisionFilter, setDivisionFilter] = useState<string>('All');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingDestination, setEditingDestination] = useState<Partial<Destination> | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSlugUserModified, setIsSlugUserModified] = useState(false);

  // Form states
  const [formData, setFormData] = useState<Partial<Destination>>({
    name: '',
    slug: '',
    tagline: '',
    description: '',
    division: 'Dhaka',
    district: 'Dhaka',
    category: 'Nature & Wildlife',
    image: '',
    bestSeason: 'November to March',
    estimatedBudget: '',
    googleMapUrl: '',
    phone: '',
    website: '',
    rating: 4.8,
    reviewCount: 12,
    featured: false,
    published: true,
  });

  const handleOpenNew = () => {
    setFormData({
      name: '',
      slug: '',
      tagline: '',
      description: '',
      division: 'Dhaka',
      district: 'Dhaka',
      category: 'Nature & Wildlife',
      image: '/src/assets/images/bdyatra_hero_delta_1793169488734.jpg',
      bestSeason: 'November to March',
      estimatedBudget: '',
      googleMapUrl: '',
      phone: '',
      website: '',
      rating: 4.9,
      reviewCount: 1,
      featured: false,
      published: true,
    });
    setEditingDestination(null);
    setIsSlugUserModified(false);
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (dest: Destination) => {
    setFormData({
      ...dest,
      published: dest.published !== undefined ? dest.published : true,
    });
    setEditingDestination(dest);
    setIsSlugUserModified(true); // Keep existing slug unless user changes
    setIsEditorOpen(true);
  };

  const handleNameChange = (val: string) => {
    const updated: Partial<Destination> = {
      ...formData,
      name: val,
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) return;

    setIsSubmitting(true);
    try {
      const payload: Partial<Destination> = {
        ...formData,
        slug: formData.slug?.trim() || generateSlug(formData.name),
      };
      await onSaveDestination(payload);
      setIsEditorOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePublished = async (dest: Destination) => {
    const nextPublished = !(dest.published !== undefined ? dest.published : true);
    await onSaveDestination({
      id: dest.id,
      published: nextPublished,
    });
  };

  const handleToggleFeatured = async (dest: Destination) => {
    await onSaveDestination({
      id: dest.id,
      featured: !dest.featured,
    });
  };

  // Filtered list
  const filtered = destinations.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.division.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDivision =
      divisionFilter === 'All' || d.division.toLowerCase() === divisionFilter.toLowerCase();
    return matchesSearch && matchesDivision;
  });

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search destinations by name or district..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
            />
          </div>

          <select
            value={divisionFilter}
            onChange={(e) => setDivisionFilter(e.target.value)}
            className="text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          >
            <option value="All">All Divisions</option>
            {DIVISIONS.map((div) => (
              <option key={div} value={div}>
                {div}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleOpenNew}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-semibold transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Add Destination
        </button>
      </div>

      {/* Destinations Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold text-xs uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Destination</th>
                <th className="py-3.5 px-4">Division & District</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Budget & Contact</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((dest) => {
                const isPublished = dest.published !== undefined ? dest.published : true;
                return (
                  <tr key={dest.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={dest.image}
                          alt={dest.name}
                          className="h-11 w-11 rounded-lg object-cover border border-slate-200 shrink-0 bg-slate-100"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              '/src/assets/images/bdyatra_hero_delta_1793169488734.jpg';
                          }}
                        />
                        <div>
                          <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                            {dest.name}
                            {dest.featured && (
                              <span className="inline-flex items-center gap-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.2 rounded">
                                Featured
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 truncate max-w-xs">{dest.tagline}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="font-medium text-slate-800">{dest.division}</div>
                      <div className="text-xs text-slate-500">{dest.district}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-xs text-slate-700 bg-slate-100 px-2 py-0.5 rounded font-medium">
                        {dest.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 text-xs">
                      <div>{dest.estimatedBudget || 'N/A'}</div>
                      <div className="text-slate-400 flex items-center gap-1 mt-0.5">
                        <Phone className="h-3 w-3" />
                        <span>{dest.phone || 'No phone'}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleTogglePublished(dest)}
                        title={isPublished ? 'Click to Unpublish (Draft)' : 'Click to Publish'}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer border ${
                          isPublished
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        {isPublished ? (
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
                          onClick={() => handleToggleFeatured(dest)}
                          title={dest.featured ? 'Unfeature' : 'Feature on homepage'}
                          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                            dest.featured
                              ? 'text-amber-500 border-amber-300 bg-amber-50'
                              : 'text-slate-400 border-slate-200 hover:text-slate-700'
                          }`}
                        >
                          <Star className="h-4 w-4 fill-current" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(dest)}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Edit Destination"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setIsDeletingId(dest.id)}
                          className="p-1.5 rounded-lg border border-slate-200 text-rose-500 hover:bg-rose-50 hover:border-rose-200 transition-colors cursor-pointer"
                          title="Delete Destination"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 text-sm">
                    No destinations match your search or filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Add Modal Form */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingDestination ? `Edit Destination: ${formData.name}` : 'Create New Destination'}
                </h3>
                <p className="text-xs text-slate-500">
                  Fill in the details to update the public travel directory.
                </p>
              </div>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Destination Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Sundarbans Mangrove Forest"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                    <span>URL Slug</span>
                    <span className="text-[10px] text-slate-400 font-normal">Auto-generated live</span>
                  </label>
                  <input
                    type="text"
                    value={formData.slug || ''}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    placeholder="e.g. sundarbans-mangrove-forest"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tagline</label>
                <input
                  type="text"
                  value={formData.tagline || ''}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="e.g. World's Largest Tidal Mangrove & Tiger Habitat"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                    placeholder="e.g. Bagerhat & Khulna"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category *</label>
                  <select
                    value={formData.category || 'Nature & Wildlife'}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value as DestinationCategory })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Short Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief destination overview for traveler discovery cards and directory views..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              {/* Cover Image Uploader */}
              <div className="pt-2 border-t border-slate-100">
                <ImageUploader
                  currentImageUrl={formData.image}
                  bucket="destination-images"
                  onImageUploaded={(url) => setFormData({ ...formData, image: url })}
                  label="Destination Cover Photography"
                  aspectRatioHint="16:9 Ratio"
                  recommendedDimensions="1200 × 675 pixels"
                  helperText="Upload wide landscape photography in 16:9 ratio (recommended: 1200 × 675 px) for optimal display across destination hero banners and cards."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Best Season</label>
                  <input
                    type="text"
                    value={formData.bestSeason || ''}
                    onChange={(e) => setFormData({ ...formData, bestSeason: e.target.value })}
                    placeholder="e.g. November to February"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                    <span>Estimated Budget</span>
                    <span className="text-[10px] text-slate-400 font-normal">Optional</span>
                  </label>
                  <input
                    type="text"
                    value={formData.estimatedBudget || ''}
                    onChange={(e) => setFormData({ ...formData, estimatedBudget: e.target.value })}
                    placeholder="e.g. ৳8,000 - ৳16,000 / day (Optional)"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              {/* Contact & Map Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Phone Number</span>
                  </label>
                  <input
                    type="text"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +880 1711-000000"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <Globe className="h-3.5 w-3.5 text-blue-600" />
                    <span>Website</span>
                    <span className="text-[10px] text-slate-400 font-normal ml-auto">Optional</span>
                  </label>
                  <input
                    type="url"
                    value={formData.website || ''}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="e.g. https://parjatan.gov.bd"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              {/* Google Map URL or Embed Link */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Map className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Google Map Link / Embed URL</span>
                </label>
                <input
                  type="text"
                  value={formData.googleMapUrl || ''}
                  onChange={(e) => setFormData({ ...formData, googleMapUrl: e.target.value })}
                  placeholder="e.g. https://maps.google.com/?q=Sundarbans+National+Park or Google Maps share link"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              {/* Publish & Featured Toggles */}
              <div className="flex items-center gap-6 pt-3 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.published !== false}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                  />
                  <span>Published (Visible to public visitors)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={Boolean(formData.featured)}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="h-4 w-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300"
                  />
                  <span>Featured Landmark</span>
                </label>
              </div>

              {/* Form Buttons */}
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
                  {isSubmitting ? 'Saving...' : editingDestination ? 'Update Destination' : 'Create Destination'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeletingId && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <AlertCircle className="h-6 w-6" />
              <h3 className="text-lg font-bold text-slate-900">Delete Destination?</h3>
            </div>
            <p className="text-sm text-slate-600 mb-6">
              Are you sure you want to remove this destination? This will delete the entry from the
              public portal and database.
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
                  await onDeleteDestination(isDeletingId);
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
