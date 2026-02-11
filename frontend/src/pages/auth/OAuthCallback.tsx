import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/db/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function OAuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error('OAuth callback error:', error);
          setStatus('error');
          setMessage('Authentication failed. Please try again.');
          toast.error('Authentication failed');
          return;
        }

        if (data.session) {
          setStatus('success');
          setMessage('Authentication successful! Redirecting...');
          toast.success('Successfully signed in with Google!');
          
          setTimeout(() => {
            navigate('/dashboard');
          }, 1500);
        } else {
          setStatus('error');
          setMessage('No session found. Please try again.');
          toast.error('No session found');
        }
      } catch (err) {
        console.error('Unexpected error during OAuth callback:', err);
        setStatus('error');
        setMessage(err instanceof Error ? err.message : 'An unexpected error occurred');
        toast.error('An unexpected error occurred');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {status === 'processing' && <Loader2 className="h-5 w-5 animate-spin" />}
            {status === 'success' && <CheckCircle2 className="h-5 w-5 text-green-600" />}
            {status === 'error' && <XCircle className="h-5 w-5 text-red-600" />}
            {status === 'processing' && 'Processing'}
            {status === 'success' && 'Success'}
            {status === 'error' && 'Error'}
          </CardTitle>
          <CardDescription>Google OAuth Authentication</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{message}</p>
          
          {status === 'error' && (
            <Button
              onClick={() => navigate('/login')}
              className="w-full"
            >
              Return to Login
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
