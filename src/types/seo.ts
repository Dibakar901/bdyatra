/**
 * BDYatra SEO & OpenGraph Types
 */

export interface SEOMetadata {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  ogImageAlt?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  noindex?: boolean;
}

export interface BreadcrumbItem {
  name: string;
  item: string;
}

export interface StructuredDataConfig {
  type: 'WebSite' | 'TouristDestination' | 'Article' | 'BlogPosting' | 'BreadcrumbList';
  data: Record<string, unknown>;
}

export interface SitemapEntry {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
  title: string;
  category: string;
}
