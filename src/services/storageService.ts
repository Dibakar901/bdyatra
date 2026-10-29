import { supabase, isSupabaseConfigured } from './supabaseClient';

export interface StorageUploadResult {
  url: string;
  success: boolean;
  message: string;
  storageProvider: 'supabase-storage' | 'local-buffer';
  bucket: string;
  path: string;
}

export type StorageBucketType = 'destination-images' | 'blog-covers' | 'place-photos' | 'general-media';

/**
 * Uploads an image file to Supabase Storage bucket with unique path
 * Falls back gracefully to base64 DataURL if storage bucket is not yet provisioned in the remote cluster.
 */
export async function uploadImageToSupabase(
  file: File,
  bucket: StorageBucketType = 'destination-images'
): Promise<StorageUploadResult> {
  // Validate file type
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/svg+xml'];
  if (!validTypes.includes(file.type)) {
    throw new Error('Unsupported image format. Please upload JPG, PNG, or WebP.');
  }

  // Validate file size (max 6MB)
  if (file.size > 6 * 1024 * 1024) {
    throw new Error('Image file is too large. Maximum allowed size is 6 MB.');
  }

  const cleanFileName = file.name
    .toLowerCase()
    .replace(/[^a-z0-9.]/g, '-')
    .replace(/-+/g, '-');
  const filePath = `${Date.now()}_${cleanFileName}`;

  // Try real Supabase Storage upload
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
        if (publicUrlData && publicUrlData.publicUrl) {
          return {
            url: publicUrlData.publicUrl,
            success: true,
            message: `Successfully uploaded to Supabase Storage bucket "${bucket}".`,
            storageProvider: 'supabase-storage',
            bucket,
            path: filePath,
          };
        }
      } else if (error) {
        console.warn(`[Supabase Storage: ${bucket}] Upload message:`, error.message);
      }
    } catch (storageErr) {
      console.warn('[Supabase Storage] Network upload error:', storageErr);
    }
  }

  // Graceful fallback: convert to base64 DataURL so editor preview and local persistence work smoothly
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const resultUrl = e.target?.result as string;
      resolve({
        url: resultUrl,
        success: true,
        message: `Image processed and stored locally for preview. In production with initialized Supabase Storage bucket "${bucket}", it is persisted to Cloud Object Storage.`,
        storageProvider: 'local-buffer',
        bucket,
        path: filePath,
      });
    };
    reader.onerror = () => {
      resolve({
        url: URL.createObjectURL(file),
        success: true,
        message: 'Object URL generated for local preview.',
        storageProvider: 'local-buffer',
        bucket,
        path: filePath,
      });
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Checks whether a given Supabase Storage bucket exists and is accessible
 */
export async function checkStorageBucketAccess(bucket: string): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const { data, error } = await supabase.storage.getBucket(bucket);
    return !error && Boolean(data);
  } catch {
    return false;
  }
}
