/**
 * Example: Enhanced API with Cloudflare Integration
 * 
 * This file demonstrates how to integrate Cloudflare caching
 * with your existing Supabase API calls.
 * 
 * Copy the patterns below to update your src/db/api.ts file.
 */

import { supabase } from './supabase';
import { hybridManager } from '@/services/hybrid-manager';
import type { DailyTask, JobApplication, UserOnboarding } from '@/types';

// ============================================================================
// Pattern 1: Read-Heavy Data with Caching
// ============================================================================

/**
 * Fetch daily tasks with edge caching
 * 
 * Use this pattern for data that:
 * - Is read frequently
 * - Doesn't change often
 * - Can tolerate slight staleness (5-10 minutes)
 */
export const getDailyTasksCached = async (userId: string) => {
  return hybridManager.fetchWithCache(
    `daily-tasks-${userId}`, // Unique cache key
    async () => {
      // Original Supabase query
      const { data, error } = await supabase
        .from('daily_tasks')
        .select('*')
        .eq('user_id', userId)
        .order('day_number', { ascending: true });

      if (error) throw error;
      return data;
    },
    { ttl: 300 } // Cache for 5 minutes
  );
};

/**
 * Fetch single task with caching
 */
export const getTaskByDayCached = async (userId: string, dayNumber: number) => {
  return hybridManager.fetchWithCache(
    `task-${userId}-day-${dayNumber}`,
    async () => {
      const { data, error } = await supabase
        .from('daily_tasks')
        .select('*')
        .eq('user_id', userId)
        .eq('day_number', dayNumber)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    { ttl: 600 } // Cache for 10 minutes (less frequently updated)
  );
};

// ============================================================================
// Pattern 2: Write Operations with Cache Invalidation
// ============================================================================

/**
 * Update task completion and invalidate cache
 * 
 * Use this pattern for write operations that should:
 * - Update the database
 * - Invalidate related cached data
 * - Ensure fresh data on next read
 */
export const updateTaskCompletion = async (
  taskId: string,
  completed: boolean,
  userId: string,
  dayNumber: number
) => {
  // Update in Supabase
  const { data, error } = await supabase
    .from('daily_tasks')
    .update({
      completed,
      completed_at: completed ? new Date().toISOString() : null,
    })
    .eq('id', taskId)
    .select()
    .maybeSingle();

  if (error) throw error;

  // Invalidate related caches
  await hybridManager.invalidateCache([
    `daily-tasks-${userId}`, // All tasks cache
    `task-${userId}-day-${dayNumber}`, // Specific task cache
    `user-progress-${userId}`, // Progress summary cache
  ]);

  // Track analytics
  await hybridManager.trackAction('task_completed', {
    userId,
    taskId,
    dayNumber,
    completed,
  });

  return data;
};

/**
 * Create new task and invalidate cache
 */
export const createTask = async (userId: string, task: Partial<DailyTask>) => {
  const { data, error } = await supabase
    .from('daily_tasks')
    .insert({
      user_id: userId,
      ...task,
    })
    .select()
    .maybeSingle();

  if (error) throw error;

  // Invalidate tasks cache
  await hybridManager.invalidateCache([`daily-tasks-${userId}`]);

  return data;
};

// ============================================================================
// Pattern 3: Batch Operations with Caching
// ============================================================================

/**
 * Fetch multiple related datasets efficiently
 * 
 * Use this pattern when you need to fetch multiple
 * related datasets that can all be cached.
 */
export const getUserDashboardData = async (userId: string) => {
  return hybridManager.batchFetchWithCache(
    [
      {
        key: `daily-tasks-${userId}`,
        fetcher: async () => {
          const { data, error } = await supabase
            .from('daily_tasks')
            .select('*')
            .eq('user_id', userId)
            .order('day_number');
          if (error) throw error;
          return data;
        },
      },
      {
        key: `job-applications-${userId}`,
        fetcher: async () => {
          const { data, error } = await supabase
            .from('job_applications')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
          if (error) throw error;
          return data;
        },
      },
      {
        key: `user-onboarding-${userId}`,
        fetcher: async () => {
          const { data, error } = await supabase
            .from('user_onboarding')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();
          if (error) throw error;
          return data;
        },
      },
    ],
    { ttl: 300 } // Cache all for 5 minutes
  );
};

// ============================================================================
// Pattern 4: Image Upload with Optimization
// ============================================================================

/**
 * Upload user avatar with automatic optimization
 * 
 * Use this pattern for image uploads that should:
 * - Store original in Supabase
 * - Generate optimized versions via Cloudflare
 * - Return multiple sizes for responsive images
 */
export const uploadUserAvatar = async (userId: string, file: File) => {
  // Upload with optimization
  const result = await hybridManager.uploadImage(file, 'avatars', userId);

  // Update user profile with optimized URL
  const { error } = await supabase
    .from('profiles')
    .update({
      avatar_url: result.optimized, // Use optimized URL
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) throw error;

  // Invalidate profile cache
  await hybridManager.invalidateCache([`profile-${userId}`]);

  return result;
};

/**
 * Upload document with optimization
 */
export const uploadDocument = async (
  userId: string,
  file: File,
  documentType: string
) => {
  const result = await hybridManager.uploadImage(file, 'documents', `${userId}/${documentType}`);

  // Save document record
  const { data, error } = await supabase
    .from('documents')
    .insert({
      user_id: userId,
      type: documentType,
      file_url: result.original,
      optimized_url: result.optimized,
      thumbnail_url: result.thumbnail,
    })
    .select()
    .maybeSingle();

  if (error) throw error;

  return { ...data, urls: result };
};

// ============================================================================
// Pattern 5: Frequently Accessed Static Data
// ============================================================================

/**
 * Fetch interview questions with long cache
 * 
 * Use this pattern for data that:
 * - Rarely changes
 * - Is accessed frequently
 * - Can be cached for hours or days
 */
export const getInterviewQuestions = async () => {
  return hybridManager.fetchWithCache(
    'interview-questions-all',
    async () => {
      const { data, error } = await supabase
        .from('interview_questions')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;
      return data;
    },
    { ttl: 3600 } // Cache for 1 hour
  );
};

/**
 * Fetch networking message templates with long cache
 */
export const getMessageTemplates = async () => {
  return hybridManager.fetchWithCache(
    'message-templates-all',
    async () => {
      const { data, error } = await supabase
        .from('networking_messages')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;
      return data;
    },
    { ttl: 7200 } // Cache for 2 hours
  );
};

// ============================================================================
// Pattern 6: Force Refresh When Needed
// ============================================================================

/**
 * Fetch user profile with optional force refresh
 * 
 * Use this pattern when you need the ability to
 * bypass cache and get fresh data on demand.
 */
export const getUserProfile = async (userId: string, forceRefresh = false) => {
  return hybridManager.fetchWithCache(
    `profile-${userId}`,
    async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    {
      ttl: 600, // Cache for 10 minutes
      forceRefresh, // Bypass cache if true
    }
  );
};

// ============================================================================
// Pattern 7: Analytics Tracking
// ============================================================================

/**
 * Track user actions for analytics
 * 
 * Use this pattern to track user behavior without
 * impacting application performance.
 */
export const trackUserAction = async (
  userId: string,
  action: string,
  metadata?: Record<string, unknown>
) => {
  // This is fire-and-forget, won't slow down the app
  await hybridManager.trackAction(action, {
    userId,
    timestamp: new Date().toISOString(),
    ...metadata,
  });
};

// Example usage in your components:
// await trackUserAction(userId, 'task_viewed', { dayNumber: 5 });
// await trackUserAction(userId, 'application_submitted', { company: 'Google' });

// ============================================================================
// Pattern 8: Optimized Image URLs in Queries
// ============================================================================

/**
 * Get job applications with optimized company logos
 * 
 * Use this pattern to automatically optimize images
 * returned from database queries.
 */
export const getJobApplicationsWithOptimizedLogos = async (userId: string) => {
  const { data, error } = await supabase
    .from('job_applications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Add optimized logo URLs
  return data?.map((app) => ({
    ...app,
    company_logo_optimized: app.company_logo
      ? hybridManager.getOptimizedImageUrl(app.company_logo, {
          width: 100,
          height: 100,
          fit: 'contain',
          format: 'auto',
        })
      : null,
  }));
};

// ============================================================================
// Migration Guide
// ============================================================================

/**
 * How to migrate your existing API calls:
 * 
 * 1. For READ operations (GET):
 *    - Wrap with hybridManager.fetchWithCache()
 *    - Choose appropriate TTL based on update frequency
 *    - Use unique cache keys
 * 
 * 2. For WRITE operations (POST/PUT/DELETE):
 *    - Keep original Supabase call
 *    - Add cache invalidation after success
 *    - Invalidate all related cache keys
 * 
 * 3. For IMAGE uploads:
 *    - Use hybridManager.uploadImage()
 *    - Store optimized URLs in database
 *    - Use responsive URLs in components
 * 
 * 4. For ANALYTICS:
 *    - Add trackAction() calls
 *    - Fire and forget (non-blocking)
 * 
 * 5. Start gradually:
 *    - Begin with most frequently accessed data
 *    - Monitor cache hit rates
 *    - Adjust TTL values based on usage patterns
 */

// ============================================================================
// Cache Key Naming Convention
// ============================================================================

/**
 * Use consistent cache key patterns:
 * 
 * - User-specific data: `resource-${userId}`
 *   Example: `daily-tasks-${userId}`, `profile-${userId}`
 * 
 * - Specific items: `resource-${userId}-${identifier}`
 *   Example: `task-${userId}-day-${dayNumber}`
 * 
 * - Global data: `resource-all`
 *   Example: `interview-questions-all`
 * 
 * - Filtered data: `resource-${userId}-${filter}`
 *   Example: `applications-${userId}-active`
 */

// ============================================================================
// TTL Guidelines
// ============================================================================

/**
 * Choose TTL based on data characteristics:
 * 
 * - Real-time data (user actions): 60-300 seconds (1-5 minutes)
 * - Frequently updated: 300-600 seconds (5-10 minutes)
 * - Moderately updated: 600-1800 seconds (10-30 minutes)
 * - Rarely updated: 1800-7200 seconds (30 minutes - 2 hours)
 * - Static data: 7200+ seconds (2+ hours)
 * 
 * Start conservative (shorter TTL) and increase based on monitoring.
 */

export default {
  // Export all enhanced functions
  getDailyTasksCached,
  getTaskByDayCached,
  updateTaskCompletion,
  createTask,
  getUserDashboardData,
  uploadUserAvatar,
  uploadDocument,
  getInterviewQuestions,
  getMessageTemplates,
  getUserProfile,
  trackUserAction,
  getJobApplicationsWithOptimizedLogos,
};
