import { useState } from 'react';
import { supabase } from '@/db/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, CheckCircle2, XCircle, Eye } from 'lucide-react';
import { toast } from 'sonner';

export default function CreateDemoUser() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCreateDemoUser = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const { data, error: functionError } = await supabase.functions.invoke('create-demo-user', {
        body: {}
      });

      if (functionError) {
        const errorMsg = await functionError?.context?.text();
        throw new Error(errorMsg || 'Failed to create demo user');
      }

      if (data.success) {
        setResult(data);
        toast.success('Demo user created successfully!');
      } else {
        throw new Error(data.error || 'Unknown error occurred');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-6 w-6" />
            Create Demo User
          </CardTitle>
          <CardDescription>
            Create a demo user account with pre-populated sample data for visitors to explore the application.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold">Demo Account Details:</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Email: demo@chasemycareer.de</li>
              <li>Password: DemoUser2024!</li>
              <li>Progress: Day 5 (10 tasks completed)</li>
              <li>Sample data: 4 applications, 2 interviews, 4 contacts</li>
              <li>Read-only mode for visitors</li>
            </ul>
          </div>

          <Button
            onClick={handleCreateDemoUser}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Demo User...
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                Create Demo User
              </>
            )}
          </Button>

          {result && (
            <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-600">Success!</AlertTitle>
              <AlertDescription className="text-green-700 dark:text-green-400">
                <div className="space-y-2 mt-2">
                  <p><strong>Demo user created successfully!</strong></p>
                  <div className="text-sm">
                    <p>User ID: {result.userId}</p>
                    <p>Email: demo@chasemycareer.de</p>
                    <p>Tasks Created: {result.tasksCreated}</p>
                    <p>Applications Created: {result.applicationsCreated}</p>
                    <p>Interviews Created: {result.interviewsCreated}</p>
                    <p>Contacts Created: {result.contactsCreated}</p>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="text-sm text-muted-foreground">
            <p><strong>Note:</strong> This will create or reset the demo user account. The demo account is used for the "View Demo" feature on the homepage.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
