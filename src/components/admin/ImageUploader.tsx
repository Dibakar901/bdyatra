import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, CheckCircle, AlertCircle, Loader2, Link2, X, Sparkles } from 'lucide-react';
import { uploadImageToSupabase, StorageBucketType } from '../../services/storageService';

interface ImageUploaderProps {
  currentImageUrl?: string;
  onImageUploaded: (url: string) => void;
  bucket?: StorageBucketType;
  label?: string;
  helperText?: string;
  aspectRatioHint?: string;
  recommendedDimensions?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentImageUrl,
  onImageUploaded,
  bucket = 'destination-images',
  label = 'Cover Image',
  helperText = 'Upload high-resolution photography (JPG, PNG, WebP up to 6MB) or paste an image URL.',
  aspectRatioHint,
  recommendedDimensions,
}) => {
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [previewUrl, setPreviewUrl] = useState<string>(currentImageUrl || '');
  const [directUrlInput, setDirectUrlInput] = useState<string>(currentImageUrl || '');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [dimensionNote, setDimensionNote] = useState<string>('');
  const [uploadStatus, setUploadStatus] = useState<{
    type: 'idle' | 'success' | 'error';
    message: string;
  }>({ type: 'idle', message: '' });
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileProcess = async (file: File) => {
    setIsUploading(true);
    setUploadStatus({ type: 'idle', message: '' });
    setDimensionNote('');

    // Measure dimensions for admin guidance
    try {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.onload = () => {
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        const calcRatio = w / h;
        let note = `Uploaded file: ${w} × ${h} px. `;
        if (Math.abs(calcRatio - 16 / 9) < 0.08) {
          note += '✓ Matches 16:9 widescreen ratio!';
        } else if (Math.abs(calcRatio - 4 / 3) < 0.08) {
          note += '✓ Matches 4:3 standard ratio!';
        } else if (aspectRatioHint) {
          note += `Note: Target ratio is ${aspectRatioHint}.`;
        }
        setDimensionNote(note);
        URL.revokeObjectURL(objectUrl);
      };
      img.src = objectUrl;
    } catch {
      // Ignore
    }

    try {
      const result = await uploadImageToSupabase(file, bucket);
      setPreviewUrl(result.url);
      setDirectUrlInput(result.url);
      onImageUploaded(result.url);
      setUploadStatus({
        type: 'success',
        message: result.message,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      setUploadStatus({
        type: 'error',
        message: msg,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleApplyDirectUrl = () => {
    if (!directUrlInput.trim()) return;
    setPreviewUrl(directUrlInput.trim());
    onImageUploaded(directUrlInput.trim());
    setUploadStatus({
      type: 'success',
      message: 'Direct image URL applied.',
    });
  };

  const handleClear = () => {
    setPreviewUrl('');
    setDirectUrlInput('');
    setDimensionNote('');
    onImageUploaded('');
    setUploadStatus({ type: 'idle', message: '' });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-slate-800">{label}</label>
          {aspectRatioHint && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200">
              <Sparkles className="h-3 w-3 text-emerald-600" />
              <span>{aspectRatioHint}</span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 p-0.5 bg-slate-100 rounded-lg text-xs font-medium">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              mode === 'upload'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Supabase Storage
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              mode === 'url'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Image URL
          </button>
        </div>
      </div>

      {mode === 'upload' ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-5 text-center transition-all ${
            isDragging
              ? 'border-emerald-600 bg-emerald-50/50'
              : 'border-slate-300 hover:border-slate-400 bg-slate-50/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileProcess(e.target.files[0]);
              }
            }}
            className="hidden"
          />

          {isUploading ? (
            <div className="flex flex-col items-center justify-center py-4">
              <Loader2 className="h-8 w-8 text-emerald-600 animate-spin mb-2" />
              <p className="text-sm font-medium text-slate-800">
                Uploading to Supabase Storage bucket "{bucket}"...
              </p>
              <p className="text-xs text-slate-500 mt-1">Generating public asset URL</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-2">
              <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2.5">
                <Upload className="h-5 w-5" />
              </div>
              <p className="text-sm font-semibold text-slate-800">
                Drag & drop image here, or{' '}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-emerald-700 underline font-bold hover:text-emerald-800"
                >
                  browse files
                </button>
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Target bucket: <code className="bg-slate-200/70 px-1.5 py-0.5 rounded text-[11px] font-mono">{bucket}</code>
              </p>
              {recommendedDimensions && (
                <p className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded mt-2">
                  Recommended Resolution: {recommendedDimensions}
                </p>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="url"
              placeholder="https://images.unsplash.com/... or CDN path"
              value={directUrlInput}
              onChange={(e) => setDirectUrlInput(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
            />
          </div>
          <button
            type="button"
            onClick={handleApplyDirectUrl}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shrink-0"
          >
            Apply URL
          </button>
        </div>
      )}

      {/* Helper text */}
      <p className="text-xs text-slate-500 leading-relaxed">{helperText}</p>

      {/* Measured Dimensions Feedback */}
      {dimensionNote && (
        <div className="text-[11px] font-semibold text-slate-700 bg-slate-100/90 p-2 rounded-lg border border-slate-200 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
          <span>{dimensionNote}</span>
        </div>
      )}

      {/* Upload Feedback status banner */}
      {uploadStatus.message && (
        <div
          className={`flex items-start gap-2 p-2.5 rounded-lg text-xs ${
            uploadStatus.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {uploadStatus.type === 'success' ? (
            <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
          )}
          <span className="leading-snug">{uploadStatus.message}</span>
        </div>
      )}

      {/* Live Image Preview Thumbnail */}
      {previewUrl && (
        <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group">
          <img
            src={previewUrl}
            alt="Upload Preview"
            className="w-full h-44 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                '/src/assets/images/bdyatra_hero_delta_1793169488734.jpg';
            }}
          />
          <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between p-3">
            <span className="text-xs text-white font-medium truncate max-w-xs bg-slate-900/80 px-2 py-1 rounded">
              {previewUrl.slice(0, 48)}...
            </span>
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 rounded-md bg-white/90 text-rose-600 hover:bg-white transition-colors"
              title="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
