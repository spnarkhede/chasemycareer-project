/**
 * Cloudflare API Service
 * 
 * This service provides integration with Cloudflare APIs including:
 * - Cache management
 * - R2 Storage operations
 * - Image optimization
 * - Analytics
 * - Workers KV
 */

import axios, { type AxiosInstance } from 'axios';

// Cloudflare API configuration
const CLOUDFLARE_API_BASE = 'https://api.cloudflare.com/client/v4';
const ACCOUNT_ID = import.meta.env.VITE_CLOUDFLARE_ACCOUNT_ID;
const API_TOKEN = import.meta.env.VITE_CLOUDFLARE_API_TOKEN;
const WORKER_URL = import.meta.env.VITE_CLOUDFLARE_WORKER_URL;
const ZONE_ID = import.meta.env.VITE_CLOUDFLARE_ZONE_ID;

interface CloudflareResponse<T> {
  success: boolean;
  errors: Array<{ code: number; message: string }>;
  messages: string[];
  result: T;
}

interface CacheStats {
  cached: number;
  uncached: number;
  bandwidth: {
    cached: number;
    uncached: number;
  };
}

interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  fit?: 'scale-down' | 'contain' | 'cover' | 'crop' | 'pad';
  format?: 'auto' | 'webp' | 'avif' | 'json' | 'jpeg' | 'png';
  quality?: number;
}

class CloudflareService {
  private client: AxiosInstance;
  private workerUrl: string;

  constructor() {
    this.client = axios.create({
      baseURL: CLOUDFLARE_API_BASE,
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    this.workerUrl = WORKER_URL || '';

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('Cloudflare API Error:', error.response?.data || error.message);
        throw error;
      }
    );
  }

  /**
   * Check if Cloudflare is configured
   */
  isConfigured(): boolean {
    return !!(ACCOUNT_ID && API_TOKEN);
  }

  /**
   * Check if Worker is configured
   */
  isWorkerConfigured(): boolean {
    return !!this.workerUrl;
  }

  // ============================================================================
  // Cache Management
  // ============================================================================

  /**
   * Purge cache for specific URLs
   */
  async purgeCache(urls: string[]): Promise<void> {
    if (!ZONE_ID) {
      console.warn('Cloudflare Zone ID not configured');
      return;
    }

    try {
      await this.client.post<CloudflareResponse<{ id: string }>>(
        `/zones/${ZONE_ID}/purge_cache`,
        { files: urls }
      );
      console.log(`Purged cache for ${urls.length} URLs`);
    } catch (error) {
      console.error('Failed to purge cache:', error);
      throw error;
    }
  }

  /**
   * Purge all cache for the zone
   */
  async purgeAllCache(): Promise<void> {
    if (!ZONE_ID) {
      console.warn('Cloudflare Zone ID not configured');
      return;
    }

    try {
      await this.client.post<CloudflareResponse<{ id: string }>>(
        `/zones/${ZONE_ID}/purge_cache`,
        { purge_everything: true }
      );
      console.log('Purged all cache');
    } catch (error) {
      console.error('Failed to purge all cache:', error);
      throw error;
    }
  }

  /**
   * Get cache statistics
   */
  async getCacheStats(startDate: Date, endDate: Date): Promise<CacheStats | null> {
    if (!ZONE_ID) {
      console.warn('Cloudflare Zone ID not configured');
      return null;
    }

    try {
      const response = await this.client.get<CloudflareResponse<CacheStats>>(
        `/zones/${ZONE_ID}/analytics/dashboard`,
        {
          params: {
            since: startDate.toISOString(),
            until: endDate.toISOString(),
          },
        }
      );
      return response.data.result;
    } catch (error) {
      console.error('Failed to get cache stats:', error);
      return null;
    }
  }

  // ============================================================================
  // Workers KV (via Worker endpoint)
  // ============================================================================

  /**
   * Get value from Workers KV via Worker endpoint
   */
  async kvGet<T>(key: string): Promise<T | null> {
    if (!this.isWorkerConfigured()) {
      console.warn('Cloudflare Worker URL not configured');
      return null;
    }

    try {
      const response = await axios.get<T>(`${this.workerUrl}/kv/${key}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      console.error('Failed to get KV value:', error);
      return null;
    }
  }

  /**
   * Set value in Workers KV via Worker endpoint
   */
  async kvPut(key: string, value: unknown, expirationTtl?: number): Promise<boolean> {
    if (!this.isWorkerConfigured()) {
      console.warn('Cloudflare Worker URL not configured');
      return false;
    }

    try {
      await axios.put(`${this.workerUrl}/kv/${key}`, value, {
        params: expirationTtl ? { expirationTtl } : undefined,
      });
      return true;
    } catch (error) {
      console.error('Failed to set KV value:', error);
      return false;
    }
  }

  /**
   * Delete value from Workers KV via Worker endpoint
   */
  async kvDelete(key: string): Promise<boolean> {
    if (!this.isWorkerConfigured()) {
      console.warn('Cloudflare Worker URL not configured');
      return false;
    }

    try {
      await axios.delete(`${this.workerUrl}/kv/${key}`);
      return true;
    } catch (error) {
      console.error('Failed to delete KV value:', error);
      return false;
    }
  }

  // ============================================================================
  // Image Optimization
  // ============================================================================

  /**
   * Get optimized image URL via Cloudflare Image Resizing
   */
  getOptimizedImageUrl(
    imageUrl: string,
    options: ImageOptimizationOptions = {}
  ): string {
    if (!this.isWorkerConfigured()) {
      // Return original URL if Worker not configured
      return imageUrl;
    }

    const params = new URLSearchParams();
    params.append('url', imageUrl);

    if (options.width) params.append('width', options.width.toString());
    if (options.height) params.append('height', options.height.toString());
    if (options.fit) params.append('fit', options.fit);
    if (options.format) params.append('format', options.format);
    if (options.quality) params.append('quality', options.quality.toString());

    return `${this.workerUrl}/image?${params.toString()}`;
  }

  /**
   * Get thumbnail URL (preset: 150x150, cover fit)
   */
  getThumbnailUrl(imageUrl: string): string {
    return this.getOptimizedImageUrl(imageUrl, {
      width: 150,
      height: 150,
      fit: 'cover',
      format: 'auto',
    });
  }

  /**
   * Get responsive image URLs for different screen sizes
   */
  getResponsiveImageUrls(imageUrl: string): {
    small: string;
    medium: string;
    large: string;
    original: string;
  } {
    return {
      small: this.getOptimizedImageUrl(imageUrl, { width: 640, format: 'auto' }),
      medium: this.getOptimizedImageUrl(imageUrl, { width: 1024, format: 'auto' }),
      large: this.getOptimizedImageUrl(imageUrl, { width: 1920, format: 'auto' }),
      original: imageUrl,
    };
  }

  // ============================================================================
  // R2 Storage (via Worker endpoint)
  // ============================================================================

  /**
   * Upload file to R2 via Worker endpoint
   */
  async uploadToR2(file: File, key: string): Promise<string | null> {
    if (!this.isWorkerConfigured()) {
      console.warn('Cloudflare Worker URL not configured');
      return null;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post<{ url: string }>(
        `${this.workerUrl}/r2/${key}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data.url;
    } catch (error) {
      console.error('Failed to upload to R2:', error);
      return null;
    }
  }

  /**
   * Delete file from R2 via Worker endpoint
   */
  async deleteFromR2(key: string): Promise<boolean> {
    if (!this.isWorkerConfigured()) {
      console.warn('Cloudflare Worker URL not configured');
      return false;
    }

    try {
      await axios.delete(`${this.workerUrl}/r2/${key}`);
      return true;
    } catch (error) {
      console.error('Failed to delete from R2:', error);
      return false;
    }
  }

  /**
   * Get R2 object URL
   */
  getR2Url(key: string): string {
    if (!this.isWorkerConfigured()) {
      return '';
    }
    return `${this.workerUrl}/r2/${key}`;
  }

  // ============================================================================
  // Analytics
  // ============================================================================

  /**
   * Track custom event (via Worker endpoint)
   */
  async trackEvent(eventName: string, properties?: Record<string, unknown>): Promise<void> {
    if (!this.isWorkerConfigured()) {
      return;
    }

    try {
      await axios.post(
        `${this.workerUrl}/analytics/event`,
        {
          event: eventName,
          properties,
          timestamp: new Date().toISOString(),
        },
        { timeout: 2000 } // Short timeout for analytics
      );
    } catch (error) {
      // Silently fail for analytics
      console.debug('Failed to track event:', error);
    }
  }

  /**
   * Get analytics data
   */
  async getAnalytics(startDate: Date, endDate: Date): Promise<unknown> {
    if (!ACCOUNT_ID) {
      console.warn('Cloudflare Account ID not configured');
      return null;
    }

    try {
      const response = await this.client.get(
        `/accounts/${ACCOUNT_ID}/analytics_engine/sql`,
        {
          params: {
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to get analytics:', error);
      return null;
    }
  }

  // ============================================================================
  // Health Check
  // ============================================================================

  /**
   * Check if Cloudflare services are accessible
   */
  async healthCheck(): Promise<{
    api: boolean;
    worker: boolean;
    configured: boolean;
  }> {
    const configured = this.isConfigured();
    let api = false;
    let worker = false;

    // Check API access
    if (configured && ACCOUNT_ID) {
      try {
        await this.client.get(`/accounts/${ACCOUNT_ID}`);
        api = true;
      } catch (error) {
        console.error('Cloudflare API health check failed:', error);
      }
    }

    // Check Worker access
    if (this.isWorkerConfigured()) {
      try {
        await axios.get(`${this.workerUrl}/health`, { timeout: 5000 });
        worker = true;
      } catch (error) {
        console.error('Cloudflare Worker health check failed:', error);
      }
    }

    return { api, worker, configured };
  }
}

// Export singleton instance
export const cloudflareService = new CloudflareService();

// Export types
export type { ImageOptimizationOptions, CacheStats };
