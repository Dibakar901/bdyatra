import React, { useState } from 'react';
import { Calendar, Clock, User, Tag, ArrowLeft, Compass } from 'lucide-react';
import { BlogRow } from '../../types/supabase';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

interface BlogDetailModalProps {
  blog: BlogRow | null;
  isOpen: boolean;
  onClose: () => void;
  onExploreDestination?: (destId: string) => void;
}

export const BlogDetailModal: React.FC<BlogDetailModalProps> = ({
  blog,
  isOpen,
  onClose,
  onExploreDestination,
}) => {
  const [imageError, setImageError] = useState(false);

  if (!blog) return null;

  const formattedDate = new Date(blog.published_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="4xl"
      title={blog.title}
      subtitle={`By ${blog.author_name} · Published ${formattedDate}`}
    >
      <div className="space-y-6">
        {/* Cover Image */}
        <div className="relative aspect-16/9 w-full overflow-hidden rounded-xl bg-slate-900 shadow-inner">
          {!imageError ? (
            <img
              src={blog.cover_image}
              alt={blog.title}
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-emerald-950 to-slate-900 flex items-center justify-center p-6 text-white">
              <Compass className="h-10 w-10 text-emerald-400 mb-2" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex flex-wrap items-center gap-2 text-xs mb-2">
              <span className="font-semibold text-emerald-300">{blog.reading_time}</span>
              <span aria-hidden="true">·</span>
              <span>{formattedDate}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-sm">
              {blog.title}
            </h2>
          </div>
        </div>

        {/* Metadata row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <User className="h-3.5 w-3.5 text-slate-400" />
            <span className="font-medium text-slate-700">{blog.author_name}</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Excerpt Lead */}
        <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-800 text-sm font-medium leading-relaxed italic">
          "{blog.excerpt}"
        </div>

        {/* Article Body */}
        <div className="prose prose-slate max-w-none text-sm text-slate-700 leading-relaxed space-y-4">
          {blog.content.split('\n\n').map((paragraph, idx) => {
            if (paragraph.startsWith('### ')) {
              return (
                <h3 key={idx} className="text-base font-bold text-slate-900 pt-2">
                  {paragraph.replace('### ', '')}
                </h3>
              );
            }
            return <p key={idx}>{paragraph}</p>;
          })}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            icon={<ArrowLeft className="h-3.5 w-3.5" />}
          >
            Back to Articles
          </Button>

          {blog.destination_id && onExploreDestination && (
            <Button
              variant="emerald"
              size="sm"
              onClick={() => {
                onClose();
                onExploreDestination(blog.destination_id!);
              }}
              icon={<Compass className="h-3.5 w-3.5" />}
            >
              Explore Destination Guide
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
