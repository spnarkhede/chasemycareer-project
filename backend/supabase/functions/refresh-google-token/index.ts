import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';

interface RefreshRequest {
  refresh_token: string;
}

interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  try {
    const { refresh_token }: RefreshRequest = await req.json();

    if (!refresh_token) {
      return new Response(
        JSON.stringify({ error: 'Missing refresh token' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const clientId = Deno.env.get('GOOGLE_CLIENT_ID');
    const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET');

    if (!clientId || !clientSecret) {
      console.error('Missing Google OAuth credentials');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const tokenParams = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refresh_token,
      grant_type: 'refresh_token',
    });

    const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: tokenParams.toString(),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error('Google token refresh failed:', errorData);
      return new Response(
        JSON.stringify({ 
          error: 'Token refresh failed',
          details: errorData 
        }),
        { 
          status: tokenResponse.status,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const tokenData: GoogleTokenResponse = await tokenResponse.json();

    return new Response(
      JSON.stringify({
        access_token: tokenData.access_token,
        expires_in: tokenData.expires_in,
        scope: tokenData.scope.split(' '),
        token_type: tokenData.token_type,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error) {
    console.error('Refresh token error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
});
