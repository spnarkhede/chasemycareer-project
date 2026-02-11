/**
 * Hybrid Manager Service
 * 
 * Manages integration between Supabase and Cloudflare services.
 * Provides intelligent caching, image optimization, and data management.
 */

import { supabase } from '@/db/supabase';
import { cloudflareService } from './cloudflare';
import type { ImageOptimizationOptions } from './cloudflare';

interface CacheOptions {
  ttl?: number; // Time to live in seconds (default: 300 = 5 minutes)
  forceRefresh?: boolean; // Force refresh from source
}

interface UploadResult {
  original: string;
  optimized: string;
  thumbnail: string;
  responsive: {
    small: string;
    medium: string;
    large: string;
  };
}

class HybridManager {
  private cachePrefix = 'cache:';
  private defaultTTL = 300; // 5 minutes

  /**
   * Fetch data with edge caching
   * 
   * @param key - Cache key
   * @param fetcher - Function to fetch data from Supabase
   * @param options - Cache options
   */
  async fetchWithCache<T>(
    key: string,
    fetcher: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<T> {
    const { ttl = this.defaultTTL, forceRefresh = false } = options;
    const cacheKey = `${this.cachePrefix}${key}`;

    // Try to get from cache first (unless force refresh)
    if (!forceRefresh && cloudflareService.isWorkerConfigured()) {
      try {
        const cached = await cloudflareService.kvGet<T>(cacheKey);
        if (cached !== null) {
          console.log(`Cache HIT: ${key}`);
          return cached;
        }
      } catch (error) {
        console.log(`Cache MISS: ${key}`, error);
      }
    }

    // Fetch from Supabase
    console.log(`Fetching from Supabase: ${key}`);
    const data = await fetcher();

    // Store in cache (fire and forget)
    if (cloudflareService.isWorkerConfigured()) {
      cloudflareService.kvPut(cacheKey, data, ttl).catch((error) => {
        console.error('Failed to cache data:', error);
      });
    }

    return data;
  }

  /**
   * Invalidate cache for specific keys
   */
  async invalidateCache(keys: string[]): Promise<void> {
    if (!cloudflareService.isWorkerConfigured()) {
      return;
    }

    const cacheKeys = keys.map((key) => `${this.cachePrefix}${key}`);

    await Promise.all(
      cacheKeys.map((key) =>
        cloudflareService.kvDelete(key).catch((error) => {
          console.error(`Failed to invalidate cache for ${key}:`, error);
        })
      )
    );

    console.log(`Invalidated cache for ${keys.length} keys`);
  }

  /**
   * Upload image with automatic optimization
   * 
   * @param file - File to upload
   * @param bucket - Supabase storage bucket
   * @param path - Optional path within bucket
   */
  async uploadImage(
    file: File,
    bucket: string = 'avatars',
    path?: string
  ): Promise<UploadResult> {
    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = path
      ? `${path}/${timestamp}-${sanitizedName}`
      : `${timestamp}-${sanitizedName}`;

    // Upload to Supabase Storage (source of truth)
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Failed to upload to Supabase:', error);
      throw error;
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(data.path);

    // Generate optimized URLs via Cloudflare
    const optimized = cloudflareService.getOptimizedImageUrl(publicUrl, {
      format: 'auto',
      quality: 85,
    });

    const thumbnail = cloudflareService.getThumbnailUrl(publicUrl);

    const responsive = cloudflareService.getResponsiveImageUrls(publicUrl);

    return {
      original: publicUrl,
      optimized,
      thumbnail,
      responsive,
    };
  }

  /**
   * Delete image from storage
   */
  async deleteImage(bucket: string, path: string): Promise<boolean> {
    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) {
      console.error('Failed to delete from Supabase:', error);
      return false;
    }

    return true;
  }

  /**
   * Get optimized image URL for existing Supabase image
   */
  getOptimizedImageUrl(
    supabaseUrl: string,
    options?: ImageOptimizationOptions
  ): string {
    return cloudflareService.getOptimizedImageUrl(supabaseUrl, options);
  }

  /**
   * Batch fetch with caching
   * 
   * Useful for fetching multiple related datasets
   */
  async batchFetchWithCache<T>(
    items: Array<{ key: string; fetcher: () => Promise<T> }>,
    options: CacheOptions = {}
  ): Promise<T[]> {
    return Promise.all(
      items.map((item) => this.fetchWithCache(item.key, item.fetcher, options))
    );
  }

  /**
   * Track user action (analytics)
   */
  async trackAction(
    action: string,
    properties?: Record<string, unknown>
  ): Promise<void> {
    await cloudflareService.trackEvent(action, properties);
  }

  /**
   * Purge CDN cache for specific URLs
   */
  async purgeCDNCache(urls: string[]): Promise<void> {
    if (!cloudflareService.isConfigured()) {
      return;
    }

    await cloudflareService.purgeCache(urls);
  }

  /**
   * Get cache statistics
   */
  async getCacheStats(
    startDate: Date = new Date(Date.now() - 24 * 60 * 60 * 1000),
    endDate: Date = new Date()
  ) {
    return cloudflareService.getCacheStats(startDate, endDate);
  }

  /**
   * Health check for all services
   */
  async healthCheck() {
    const cloudflareHealth = await cloudflareService.healthCheck();

    // Check Supabase
    let supabaseHealth = false;
    try {
      const { error } = await supabase.from('profiles').select('id').limit(1);
      supabaseHealth = !error;
    } catch (error) {
      console.error('Supabase health check failed:', error);
    }

    return {
      supabase: supabaseHealth,
      cloudflare: cloudflareHealth,
      overall: supabaseHealth && (cloudflareHealth.api || !cloudflareHealth.configured),
    };
  }
}

// Export singleton instance
export const hybridManager = new HybridManager();

// Export types
export type { CacheOptions, UploadResult };
