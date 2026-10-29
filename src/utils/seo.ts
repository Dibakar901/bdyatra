import { SEOMetadata, SitemapEntry } from '../types/seo';

const BASE_URL = typeof window !== 'undefined' ? window.location.origin : 'https://bdyatra.travel';

/**
 * Updates dynamic meta tags and Schema.org structured data in document.head
 */
export function applySEOMetadata(meta: SEOMetadata, jsonLd?: Record<string, unknown>) {
  if (typeof document === 'undefined') return;

  // 1. Title
  document.title = meta.title;

  // Helper to set or create meta tag by name or property
  const setMeta = (attribute: 'name' | 'property', key: string, content: string | undefined) => {
    if (!content) return;
    let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attribute, key);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  };

  // 2. Primary Meta Tags
  setMeta('name', 'description', meta.description);

  if (meta.noindex) {
    setMeta('name', 'robots', 'noindex, nofollow');
  } else {
    setMeta('name', 'robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
  }

  // 3. OpenGraph Tags
  setMeta('property', 'og:site_name', 'BDYatra - Bangladesh Travel Discovery');
  setMeta('property', 'og:title', meta.title);
  setMeta('property', 'og:description', meta.description);
  setMeta('property', 'og:type', meta.ogType || 'website');
  
  const currentUrl = meta.canonicalUrl || (typeof window !== 'undefined' ? window.location.href : BASE_URL);
  setMeta('property', 'og:url', currentUrl);

  const fallbackImage = `${BASE_URL}/src/assets/images/bdyatra_hero_delta_1793169488734.jpg`;
  const ogImg = meta.ogImage || fallbackImage;
  setMeta('property', 'og:image', ogImg);
  if (meta.ogImageAlt) {
    setMeta('property', 'og:image:alt', meta.ogImageAlt);
  }

  if (meta.ogType === 'article') {
    if (meta.publishedTime) setMeta('property', 'article:published_time', meta.publishedTime);
    if (meta.modifiedTime) setMeta('property', 'article:modified_time', meta.modifiedTime);
    if (meta.author) setMeta('property', 'article:author', meta.author);
    if (meta.section) setMeta('property', 'article:section', meta.section);
    if (meta.tags && meta.tags.length > 0) {
      meta.tags.forEach((tag) => setMeta('property', 'article:tag', tag));
    }
  }

  // 4. Twitter Card Tags
  setMeta('name', 'twitter:card', meta.twitterCard || 'summary_large_image');
  setMeta('name', 'twitter:title', meta.title);
  setMeta('name', 'twitter:description', meta.description);
  setMeta('name', 'twitter:image', ogImg);

  // 5. Canonical Link Tag
  let canonicalLink = document.head.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', meta.canonicalUrl || currentUrl);

  // 6. Structured Data (JSON-LD)
  let scriptTag = document.head.querySelector('#bdyatra-jsonld') as HTMLScriptElement | null;
  if (!scriptTag) {
    scriptTag = document.createElement('script');
    scriptTag.id = 'bdyatra-jsonld';
    scriptTag.type = 'application/ld+json';
    document.head.appendChild(scriptTag);
  }

  const structuredData = jsonLd || {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'BDYatra',
    url: BASE_URL,
    description: meta.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${BASE_URL}/#destinations?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  scriptTag.textContent = JSON.stringify(structuredData, null, 2);
}

/**
 * Builds Schema.org JSON-LD for a Travel Blog Article
 */
export function buildArticleStructuredData(blog: {
  title: string;
  excerpt: string;
  author_name: string;
  published_at: string;
  cover_image: string;
  slug: string;
  tags: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.excerpt,
    image: [blog.cover_image],
    datePublished: blog.published_at,
    dateModified: blog.published_at,
    author: {
      '@type': 'Person',
      name: blog.author_name,
    },
    publisher: {
      '@type': 'Organization',
      name: 'BDYatra',
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/src/assets/images/bdyatra_hero_delta_1793169488734.jpg`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/#blog=${blog.slug}`,
    },
    keywords: blog.tags.join(', '),
  };
}

/**
 * Builds Schema.org JSON-LD for a Tourist Destination
 */
export function buildDestinationStructuredData(dest: {
  name?: string;
  title?: string;
  tagline: string;
  description: string;
  division: string;
  district?: string;
  image?: string;
  coverImage?: string;
  id: string;
  coordinates?: { lat: number; lng: number };
}) {
  const destName = dest.name || dest.title || 'Destination';
  const destImage = dest.image || dest.coverImage || '';
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: destName,
    description: dest.description,
    alternateName: dest.tagline,
    touristType: ['Eco-Tourism', 'Heritage & Culture', 'Photography', 'Nature'],
    address: {
      '@type': 'PostalAddress',
      addressRegion: dest.division,
      addressLocality: dest.district || dest.division,
      addressCountry: 'BD',
    },
    ...(dest.coordinates
      ? {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: dest.coordinates.lat,
            longitude: dest.coordinates.lng,
          },
        }
      : {}),
    image: [destImage],
    url: `${BASE_URL}/#destination=${dest.id}`,
  };
}

/**
 * Generates dynamic XML Sitemap string for BDYatra
 */
export function generateSitemapXml(entries: SitemapEntry[]): string {
  const urlNodes = entries
    .map(
      (entry) => `  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${entry.lastmod.split('T')[0]}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority.toFixed(1)}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlNodes}
</urlset>`;
}

/**
 * Generates standard robots.txt output
 */
export function generateRobotsTxt(): string {
  return `# BDYatra Travel Portal - Robots Configuration
User-agent: *
Allow: /
Allow: /#destinations
Allow: /#directory
Allow: /#blogs
Allow: /#map
Disallow: /api/private/
Disallow: /admin/

# Dynamic Sitemaps
Sitemap: ${BASE_URL}/sitemap.xml
`;
}
