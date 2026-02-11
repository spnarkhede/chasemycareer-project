import { useState } from 'react';
import { supabase } from '@/db/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, CheckCircle2, XCircle, Users } from 'lucide-react';
import { toast } from 'sonner';

export default function CreateTestUsers() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCreateUsers = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const { data, error: functionError } = await supabase.functions.invoke('create-test-users', {
        body: {}
      });

      if (functionError) {
        const errorMsg = await functionError?.context?.text();
        throw new Error(errorMsg || 'Failed to create test users');
      }

      if (data.success) {
        setResult(data);
        toast.success('Test users created successfully!');
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
            <Users className="h-6 w-6" />
            Create Test Users
          </CardTitle>
          <CardDescription>
            This will create or recreate the test user accounts for development and testing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <h3 className="font-semibold">Test Accounts to be Created:</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="font-medium">Admin Account:</p>
                  <p className="text-muted-foreground">Email: admin@jobtracker.test</p>
                  <p className="text-muted-foreground">Password: AdminTest123!@#</p>
                </div>
                <div>
                  <p className="font-medium">User Account:</p>
                  <p className="text-muted-foreground">Email: user@jobtracker.test</p>
                  <p className="text-muted-foreground">Password: UserTest123!@#</p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleCreateUsers}
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Test Users...
                </>
              ) : (
                <>
                  <Users className="w-4 h-4 mr-2" />
                  Create Test Users
                </>
              )}
            </Button>
          </div>

          {result && (
            <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-600">Success!</AlertTitle>
              <AlertDescription className="text-green-600">
                <div className="space-y-2 mt-2">
                  <p>{result.message}</p>
                  <div className="bg-white dark:bg-gray-900 p-3 rounded text-xs font-mono space-y-1">
                    <p>✅ Admin: {result.users.admin.email}</p>
                    <p>✅ User: {result.users.user.email}</p>
                  </div>
                  <p className="text-sm mt-2">
                    You can now log in with these credentials at the login page.
                  </p>
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

          <div className="text-sm text-muted-foreground space-y-2">
            <p className="font-semibold">Note:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>This will delete and recreate existing test accounts</li>
              <li>Use these accounts for development and testing only</li>
              <li>Remove test accounts before deploying to production</li>
              <li>Passwords meet all security requirements</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
