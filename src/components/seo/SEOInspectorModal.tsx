import React, { useState } from 'react';
import {
  Globe,
  Share2,
  FileCode,
  Check,
  Copy,
  ExternalLink,
  Search,
  CheckCircle2,
  AlertCircle,
  FileText,
  MapPin,
  Calendar,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { SEOMetadata, SitemapEntry } from '../../types/seo';
import { generateSitemapXml, generateRobotsTxt } from '../../utils/seo';

interface SEOInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMeta: SEOMetadata;
  currentJsonLd: Record<string, unknown>;
  sitemapEntries: SitemapEntry[];
}

export const SEOInspectorModal: React.FC<SEOInspectorModalProps> = ({
  isOpen,
  onClose,
  currentMeta,
  currentJsonLd,
  sitemapEntries,
}) => {
  const [activeTab, setActiveTab] = useState<'audit' | 'preview' | 'schema' | 'sitemap' | 'robots'>(
    'audit'
  );
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, label: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedCode(label);
        setTimeout(() => setCopiedCode(null), 2000);
      });
    }
  };

  const titleLength = currentMeta.title.length;
  const descLength = currentMeta.description.length;
  const isTitleGood = titleLength >= 30 && titleLength <= 65;
  const isDescGood = descLength >= 100 && descLength <= 170;

  const jsonLdString = JSON.stringify(currentJsonLd, null, 2);
  const sitemapXml = generateSitemapXml(sitemapEntries);
  const robotsTxt = generateRobotsTxt();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="4xl"
      title="BDYatra SEO & OpenGraph Intelligence Engine"
      subtitle="Verify dynamic metadata, social card rendering, Schema.org JSON-LD, and XML sitemaps."
    >
      <div className="space-y-6 text-left">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'audit'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Page Metadata Audit
          </button>

          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'preview'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Social Cards & SERP Preview
          </button>

          <button
            onClick={() => setActiveTab('schema')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'schema'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Schema.org JSON-LD
          </button>

          <button
            onClick={() => setActiveTab('sitemap')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'sitemap'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sitemap.xml ({sitemapEntries.length} URLs)
          </button>

          <button
            onClick={() => setActiveTab('robots')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'robots'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Robots.txt
          </button>
        </div>

        {/* TAB 1: METADATA AUDIT */}
        {activeTab === 'audit' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title Check */}
              <div className="p-4 rounded-xl bg-white border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Page Title (`&lt;title&gt;` & `og:title`)
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded ${
                      isTitleGood ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
                    }`}
                  >
                    {titleLength} Chars {isTitleGood ? '(Optimal: 30-65)' : '(Review Length)'}
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-900 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  {currentMeta.title}
                </p>
              </div>

              {/* Description Check */}
              <div className="p-4 rounded-xl bg-white border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Meta Description (`og:description`)
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded ${
                      isDescGood ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {descLength} Chars {isDescGood ? '(Optimal: 100-160)' : ''}
                  </span>
                </div>
                <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100 leading-relaxed">
                  {currentMeta.description}
                </p>
              </div>
            </div>

            {/* Checklist of Tag Health */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 pb-2 border-b border-slate-100">
                SEO Verification Audit Checklist
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>
                    Canonical Link Tag: <strong className="font-mono text-[11px]">{currentMeta.canonicalUrl || 'Auto-resolved'}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>
                    OpenGraph Type: <strong className="font-mono text-[11px]">{currentMeta.ogType || 'website'}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>
                    Twitter Card Mode: <strong className="font-mono text-[11px]">{currentMeta.twitterCard || 'summary_large_image'}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>
                    Schema.org Entity: <strong className="font-mono text-[11px]">{(currentJsonLd['@type'] as string) || 'WebSite'}</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SOCIAL CARDS PREVIEW */}
        {activeTab === 'preview' && (
          <div className="space-y-8">
            {/* Google SERP Snippet Preview */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Google Search Engine Result Snippet (Desktop Preview)
              </span>
              <div className="p-4 rounded-xl bg-white border border-slate-200 font-sans max-w-2xl shadow-xs">
                <div className="text-[12px] text-slate-500 mb-1 flex items-center gap-1">
                  <span>https://bdyatra.travel</span>
                  <span className="text-slate-300">›</span>
                  <span className="text-slate-600">
                    {currentMeta.canonicalUrl ? currentMeta.canonicalUrl.replace(/https?:\/\/[^/]+/, '') : 'bangladesh'}
                  </span>
                </div>
                <h3 className="text-lg font-medium text-[#1a0dab] hover:underline cursor-pointer leading-tight mb-1">
                  {currentMeta.title}
                </h3>
                <p className="text-xs text-[#4d5156] leading-relaxed line-clamp-2">
                  {currentMeta.description}
                </p>
              </div>
            </div>

            {/* Twitter / X Summary Large Image Card Preview */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Twitter / X Social Card Preview (summary_large_image)
              </span>
              <div className="max-w-md rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-xs font-sans">
                {currentMeta.ogImage && (
                  <div className="aspect-16/9 w-full bg-slate-900 overflow-hidden">
                    <img
                      src={currentMeta.ogImage}
                      alt={currentMeta.title}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="p-3 bg-slate-50 border-t border-slate-100">
                  <span className="text-[11px] text-slate-400 block uppercase tracking-wider">
                    bdyatra.travel
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5">
                    {currentMeta.title}
                  </h4>
                  <p className="text-[11px] text-slate-600 line-clamp-2 mt-1 leading-snug">
                    {currentMeta.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SCHEMA.ORG JSON-LD */}
        {activeTab === 'schema' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Injected Schema.org Structured Data (`application/ld+json`)
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(jsonLdString, 'schema')}
                icon={copiedCode === 'schema' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                className="text-xs"
              >
                {copiedCode === 'schema' ? 'Copied JSON-LD!' : 'Copy Schema Code'}
              </Button>
            </div>

            <pre className="p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto max-h-[380px] leading-relaxed">
              {jsonLdString}
            </pre>
          </div>
        )}

        {/* TAB 4: SITEMAP.XML */}
        {activeTab === 'sitemap' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  Dynamic XML Sitemap Output
                </span>
                <span className="text-[11px] text-slate-500">
                  Contains all {sitemapEntries.length} crawlable routes with priorities and update timestamps.
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(sitemapXml, 'sitemap')}
                icon={copiedCode === 'sitemap' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                className="text-xs"
              >
                {copiedCode === 'sitemap' ? 'Copied Sitemap!' : 'Copy sitemap.xml'}
              </Button>
            </div>

            <pre className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto max-h-[320px] leading-relaxed">
              {sitemapXml}
            </pre>

            {/* Sitemap URL Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="min-w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-2 px-3">Location URL</th>
                    <th className="py-2 px-3">Category</th>
                    <th className="py-2 px-3">Priority</th>
                    <th className="py-2 px-3">Frequency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {sitemapEntries.map((e, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-mono text-slate-800 truncate max-w-xs">{e.loc}</td>
                      <td className="py-2 px-3 text-slate-600">{e.category}</td>
                      <td className="py-2 px-3 font-semibold text-emerald-700">{e.priority.toFixed(1)}</td>
                      <td className="py-2 px-3 text-slate-500">{e.changefreq}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: ROBOTS.TXT */}
        {activeTab === 'robots' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Robots.txt Directives
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(robotsTxt, 'robots')}
                icon={copiedCode === 'robots' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                className="text-xs"
              >
                {copiedCode === 'robots' ? 'Copied Robots.txt!' : 'Copy robots.txt'}
              </Button>
            </div>

            <pre className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto leading-relaxed">
              {robotsTxt}
            </pre>
          </div>
        )}

        {/* Modal Footer */}
        <div className="pt-4 border-t border-slate-200 flex justify-end">
          <Button variant="emerald" size="sm" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
};
