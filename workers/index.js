/**
 * Cloudflare Worker for ChaseMyCareer
 * 
 * Provides:
 * - Edge caching with Workers KV
 * - Image optimization
 * - R2 storage proxy
 * - Analytics tracking
 * - Health check endpoint
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Health check endpoint
      if (path === '/health') {
        return jsonResponse({ status: 'ok', timestamp: new Date().toISOString() }, corsHeaders);
      }

      // KV Cache endpoints
      if (path.startsWith('/kv/')) {
        return handleKV(request, env, path, corsHeaders);
      }

      // Image optimization endpoint
      if (path.startsWith('/image')) {
        return handleImageOptimization(request, url, corsHeaders);
      }

      // R2 Storage endpoints
      if (path.startsWith('/r2/')) {
        return handleR2(request, env, path, corsHeaders);
      }

      // Analytics endpoint
      if (path.startsWith('/analytics/')) {
        return handleAnalytics(request, env, path, corsHeaders);
      }

      return jsonResponse({ error: 'Not found' }, corsHeaders, 404);
    } catch (error) {
      console.error('Worker error:', error);
      return jsonResponse(
        { error: 'Internal server error', message: error.message },
        corsHeaders,
        500
      );
    }
  },
};

// ============================================================================
// KV Cache Handlers
// ============================================================================

async function handleKV(request, env, path, corsHeaders) {
  const key = path.replace('/kv/', '');

  if (!key) {
    return jsonResponse({ error: 'Key required' }, corsHeaders, 400);
  }

  // GET: Retrieve from KV
  if (request.method === 'GET') {
    const value = await env.CACHE_KV.get(key, 'json');
    
    if (value === null) {
      return jsonResponse({ error: 'Not found' }, corsHeaders, 404);
    }

    return jsonResponse(value, {
      ...corsHeaders,
      'Cache-Control': 'public, max-age=300',
    });
  }

  // PUT: Store in KV
  if (request.method === 'PUT') {
    const data = await request.json();
    const expirationTtl = parseInt(new URL(request.url).searchParams.get('expirationTtl')) || 300;

    await env.CACHE_KV.put(key, JSON.stringify(data), {
      expirationTtl,
    });

    return jsonResponse({ success: true }, corsHeaders);
  }

  // DELETE: Remove from KV
  if (request.method === 'DELETE') {
    await env.CACHE_KV.delete(key);
    return jsonResponse({ success: true }, corsHeaders);
  }

  return jsonResponse({ error: 'Method not allowed' }, corsHeaders, 405);
}

// ============================================================================
// Image Optimization Handler
// ============================================================================

async function handleImageOptimization(request, url, corsHeaders) {
  const imageUrl = url.searchParams.get('url');
  
  if (!imageUrl) {
    return jsonResponse({ error: 'Image URL required' }, corsHeaders, 400);
  }

  try {
    // Fetch original image
    const imageResponse = await fetch(imageUrl);
    
    if (!imageResponse.ok) {
      return jsonResponse({ error: 'Failed to fetch image' }, corsHeaders, 404);
    }

    // Get optimization parameters
    const width = url.searchParams.get('width');
    const height = url.searchParams.get('height');
    const fit = url.searchParams.get('fit') || 'scale-down';
    const format = url.searchParams.get('format') || 'auto';
    const quality = url.searchParams.get('quality') || '85';

    // Build CF-Images options
    const options = {
      cf: {
        image: {
          fit,
          format,
          quality: parseInt(quality),
        },
      },
    };

    if (width) options.cf.image.width = parseInt(width);
    if (height) options.cf.image.height = parseInt(height);

    // Fetch with image optimization
    const optimizedResponse = await fetch(imageUrl, options);

    // Return optimized image with cache headers
    return new Response(optimizedResponse.body, {
      headers: {
        ...corsHeaders,
        'Content-Type': optimizedResponse.headers.get('Content-Type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'CF-Cache-Status': optimizedResponse.headers.get('CF-Cache-Status') || 'MISS',
      },
    });
  } catch (error) {
    console.error('Image optimization error:', error);
    return jsonResponse({ error: 'Image optimization failed' }, corsHeaders, 500);
  }
}

// ============================================================================
// R2 Storage Handlers
// ============================================================================

async function handleR2(request, env, path, corsHeaders) {
  const key = path.replace('/r2/', '');

  if (!key) {
    return jsonResponse({ error: 'Key required' }, corsHeaders, 400);
  }

  // GET: Retrieve from R2
  if (request.method === 'GET') {
    const object = await env.R2_BUCKET.get(key);

    if (object === null) {
      return jsonResponse({ error: 'Not found' }, corsHeaders, 404);
    }

    return new Response(object.body, {
      headers: {
        ...corsHeaders,
        'Content-Type': object.httpMetadata.contentType || 'application/octet-stream',
        'Cache-Control': 'public, max-age=31536000',
        'ETag': object.httpEtag,
      },
    });
  }

  // POST: Upload to R2
  if (request.method === 'POST') {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return jsonResponse({ error: 'File required' }, corsHeaders, 400);
    }

    await env.R2_BUCKET.put(key, file.stream(), {
      httpMetadata: {
        contentType: file.type,
      },
    });

    const publicUrl = `${url.origin}/r2/${key}`;

    return jsonResponse({ success: true, url: publicUrl }, corsHeaders);
  }

  // DELETE: Remove from R2
  if (request.method === 'DELETE') {
    await env.R2_BUCKET.delete(key);
    return jsonResponse({ success: true }, corsHeaders);
  }

  return jsonResponse({ error: 'Method not allowed' }, corsHeaders, 405);
}

// ============================================================================
// Analytics Handler
// ============================================================================

async function handleAnalytics(request, env, path, corsHeaders) {
  if (path === '/analytics/event' && request.method === 'POST') {
    const data = await request.json();
    
    // Store event in Analytics Engine (if configured)
    if (env.ANALYTICS) {
      env.ANALYTICS.writeDataPoint({
        blobs: [data.event],
        doubles: [Date.now()],
        indexes: [data.properties?.userId || 'anonymous'],
      });
    }

    return jsonResponse({ success: true }, corsHeaders);
  }

  return jsonResponse({ error: 'Not found' }, corsHeaders, 404);
}

// ============================================================================
// Helper Functions
// ============================================================================

function jsonResponse(data, headers = {}, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });
}
