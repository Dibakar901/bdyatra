export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'superadmin' | 'editor';
  avatarUrl?: string;
  lastSignInAt?: string;
  isDemo?: boolean;
}

export interface AuthSessionState {
  user: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error?: string | null;
}

export interface AdminStatsSummary {
  totalDestinations: number;
  publishedDestinations: number;
  featuredDestinations: number;
  totalListings: number;
  verifiedListings: number;
  pendingSubmissions: number;
  totalBlogs: number;
  publishedBlogs: number;
}
