import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface ImageUrl {
  url: string;
  isPrivate: boolean;
}

export const storageService = {
  /**
   * Clean the path by removing any full URLs and keeping only the relative path
   * @param path The path to clean
   */
  cleanPath(path: string): string {
    // Remove any full URLs and keep only the relative path
    const urlPattern = /https?:\/\/[^/]+\/storage\/v1\/object\/(?:public|sign|authenticated)\/[^/]+\//;
    return path.replace(urlPattern, '');
  },

  /**
   * Get a signed URL for a private bucket image
   * @param bucket The bucket name
   * @param path The path to the image
   * @param expiresIn Number of seconds until the URL expires (default: 3600 = 1 hour)
   */
  async getSignedUrl(bucket: string, path: string, expiresIn = 3600): Promise<string> {
    const cleanPath = this.cleanPath(path);
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(cleanPath, expiresIn);

    if (error) {
      console.error('Error getting signed URL:', error);
      throw error;
    }

    return data.signedUrl;
  },

  /**
   * Get the public URL for a public bucket image
   * @param bucket The bucket name
   * @param path The path to the image
   */
  getPublicUrl(bucket: string, path: string): string {
    const cleanPath = this.cleanPath(path);
    const { data } = supabase.storage.from(bucket).getPublicUrl(cleanPath);
    return data.publicUrl;
  },

  /**
   * Get the appropriate URL for an image based on whether it's private or public
   * @param bucket The bucket name
   * @param path The path to the image
   * @param isPrivate Whether the image is in a private bucket
   */
  async getImageUrl(bucket: string, path: string, isPrivate: boolean): Promise<string> {
    if (isPrivate) {
      return this.getSignedUrl(bucket, path);
    }
    return this.getPublicUrl(bucket, path);
  }
}; 