import { BlogRow } from './supabase';

export interface BlogTableOfContentItem {
  id: string;
  title: string;
}

export interface BlogSection {
  id: string;
  title: string;
  content: string[];
  quote?: string;
  image?: string;
  imageCaption?: string;
  proTip?: string;
}

export interface EnrichedBlogPost extends BlogRow {
  subtitle?: string;
  estimatedBudget?: string;
  difficulty?: 'Easy' | 'Moderate' | 'Challenging' | 'Expedition';
  idealSeason?: string;
  authorRole?: string;
  authorBio?: string;
  sections?: BlogSection[];
  tableOfContents?: BlogTableOfContentItem[];
  relatedBlogSlugs?: string[];
  relatedDestinationSlugs?: string[];
}
