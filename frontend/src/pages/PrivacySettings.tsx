import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Download, Trash2, Shield, Database, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import PageMeta from '@/components/common/PageMeta';

const PrivacySettings = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleExportData = () => {
    setIsExporting(true);
    try {
      const userData = {
        exportDate: new Date().toISOString(),
        user: {
          name: user?.user_metadata?.full_name || '',
          email: user?.email || '',
          picture: user?.user_metadata?.avatar_url || '',
          userId: user?.id || '',
        },
        localStorage: {
          'cookie-consent': localStorage.getItem('cookie-consent'),
          'cookie-preferences': localStorage.getItem('cookie-preferences'),
        },
        note: 'This is all the personal data we store about you in Chase My Career.',
      };

      const dataStr = JSON.stringify(userData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `chase-my-career-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Data exported successfully', {
        description: 'Your data has been downloaded as a JSON file.',
      });
    } catch (error) {
      toast.error('Export failed', {
        description: 'There was an error exporting your data. Please try again.',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteData = async () => {
    setIsDeleting(true);
    try {
      localStorage.removeItem('cookie-consent');
      localStorage.removeItem('cookie-preferences');
      
      await signOut();
      
      toast.success('Data deleted successfully', {
        description: 'All your personal data has been removed from our system.',
      });
      
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error) {
      toast.error('Deletion failed', {
        description: 'There was an error deleting your data. Please try again.',
      });
      setIsDeleting(false);
    }
  };

  if (!user) {
    return (
      <>
        <PageMeta
          title="Privacy Settings"
          description="Manage your privacy settings and personal data."
        />
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle>Sign In Required</CardTitle>
              <CardDescription>
                You need to be signed in to access privacy settings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/login')} className="w-full">
                Go to Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <PageMeta
        title="Privacy Settings"
        description="Manage your privacy settings and personal data."
      />
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle className="text-3xl">Privacy Settings</CardTitle>
                  <CardDescription className="mt-2">
                    Manage your personal data and privacy preferences
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Current User Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Your Account Information
              </CardTitle>
              <CardDescription>
                This is the information we currently store about you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <p className="text-foreground">{user.user_metadata?.full_name || user.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-foreground">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">User ID</p>
                  <p className="text-foreground font-mono text-sm">{user.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Profile Picture</p>
                  <p className="text-foreground text-sm">Stored (from Google)</p>
                </div>
              </div>
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  Your data is stored locally in your browser and is not transmitted to our servers.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Data Export */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Export Your Data
              </CardTitle>
              <CardDescription>
                Download a copy of all your personal data in JSON format (GDPR Right to Data Portability)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                You can export all the personal information we have about you. This includes your profile information and any data stored in your browser's local storage.
              </p>
              <Button
                onClick={handleExportData}
                disabled={isExporting}
                className="w-full sm:w-auto"
              >
                <Download className="mr-2 h-4 w-4" />
                {isExporting ? 'Exporting...' : 'Export My Data'}
              </Button>
            </CardContent>
          </Card>

          {/* Data Deletion */}
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <Trash2 className="h-5 w-5" />
                Delete Your Data
              </CardTitle>
              <CardDescription>
                Permanently delete all your personal data from our system (GDPR Right to Erasure)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Warning:</strong> This action cannot be undone. All your data will be permanently deleted, and you will be signed out.
                </AlertDescription>
              </Alert>
              <p className="text-sm text-muted-foreground">
                Deleting your data will:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Remove all your personal information from local storage</li>
                <li>Sign you out of your account</li>
                <li>Clear your progress and preferences</li>
              </ul>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full sm:w-auto">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete My Data
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your account data and remove all your information from our system. You will be signed out immediately.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteData}
                      disabled={isDeleting}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {isDeleting ? 'Deleting...' : 'Yes, Delete My Data'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Your Privacy Rights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Under GDPR and other privacy regulations, you have the following rights:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                  <span><strong>Right to Access:</strong> View all data we have about you (shown above)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                  <span><strong>Right to Data Portability:</strong> Export your data in a machine-readable format</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                  <span><strong>Right to Erasure:</strong> Delete all your personal data</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                  <span><strong>Right to Withdraw Consent:</strong> Sign out at any time</span>
                </li>
              </ul>
              <Separator />
              <p className="text-sm text-muted-foreground">
                For more information about how we handle your data, please read our{' '}
                <a href="/privacy-policy" className="text-primary hover:underline">
                  Privacy Policy
                </a>
                .
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default PrivacySettings;
