import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { authApi } from '@/db/auth-api';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ReauthModal } from '@/components/auth/ReauthModal';
import { toast } from 'sonner';
import { Loader2, Shield, Key, Trash2, Download, Check, X } from 'lucide-react';

const passwordSchema = z
  .string()
  .min(12, 'Password must be at least 12 characters')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character');

const changePasswordSchema = z.object({
  newPassword: passwordSchema,
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
});

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

const PasswordRequirement = ({ met, text }: { met: boolean; text: string }) => (
  <div className="flex items-center gap-2 text-sm">
    {met ? (
      <Check className="w-4 h-4 text-green-500" />
    ) : (
      <X className="w-4 h-4 text-muted-foreground" />
    )}
    <span className={met ? 'text-green-500' : 'text-muted-foreground'}>{text}</span>
  </div>
);

export const SecuritySettingsPage = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [mfaFactorId, setMfaFactorId] = useState<string>('');
  const [sessions, setSessions] = useState<any[]>([]);
  const [reauthAction, setReauthAction] = useState<'password' | 'delete' | 'disable-mfa' | null>(null);
  const [password, setPassword] = useState('');

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: ''
    }
  });

  const passwordRequirements = {
    length: password.length >= 12,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^a-zA-Z0-9]/.test(password)
  };

  useEffect(() => {
    loadSecurityData();
  }, []);

  const loadSecurityData = async () => {
    const { factors } = await authApi.getMfaFactors();
    setMfaEnabled(factors.length > 0);
    if (factors.length > 0) {
      setMfaFactorId(factors[0].id);
    }

    const { sessions: userSessions } = await authApi.getUserSessions();
    setSessions(userSessions);
  };

  const handleChangePassword = async (data: ChangePasswordFormData) => {
    setIsLoading(true);
    try {
      const { error } = await authApi.updatePassword(data.newPassword);

      if (error) {
        toast.error('Failed to update password');
        return;
      }

      toast.success('Password updated successfully');
      form.reset();
      setPassword('');
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnableMfa = () => {
    navigate('/auth/mfa-enroll');
  };

  const handleDisableMfa = async () => {
    if (!mfaFactorId) return;

    setIsLoading(true);
    try {
      const { error } = await authApi.unenrollMfa(mfaFactorId);

      if (error) {
        toast.error('Failed to disable MFA');
        return;
      }

      toast.success('MFA disabled successfully');
      setMfaEnabled(false);
      setMfaFactorId('');
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
      const { error } = await authApi.deleteAccount();

      if (error) {
        toast.error('Failed to delete account');
        return;
      }

      toast.success('Account deleted successfully');
      await signOut();
      navigate('/');
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      const { user: currentUser, profile } = await authApi.getCurrentUser();
      const { sessions: userSessions } = await authApi.getUserSessions();

      const exportData = {
        user: currentUser,
        profile,
        sessions: userSessions,
        exportedAt: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `account-data-${new Date().toISOString()}.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success('Data exported successfully');
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      const { error } = await authApi.deleteSession(sessionId);

      if (error) {
        toast.error('Failed to delete session');
        return;
      }

      toast.success('Session deleted');
      setSessions(sessions.filter(s => s.id !== sessionId));
    } catch (error) {
      toast.error('An unexpected error occurred');
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Security Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account security and privacy settings
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              Change Password
            </CardTitle>
            <CardDescription>
              Update your password to keep your account secure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((data) => {
                setReauthAction('password');
              })} className="space-y-4">
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="••••••••"
                          disabled={isLoading}
                          onChange={(e) => {
                            field.onChange(e);
                            setPassword(e.target.value);
                          }}
                        />
                      </FormControl>
                      <div className="space-y-1 mt-2">
                        <PasswordRequirement met={passwordRequirements.length} text="At least 12 characters" />
                        <PasswordRequirement met={passwordRequirements.lowercase} text="One lowercase letter" />
                        <PasswordRequirement met={passwordRequirements.uppercase} text="One uppercase letter" />
                        <PasswordRequirement met={passwordRequirements.number} text="One number" />
                        <PasswordRequirement met={passwordRequirements.special} text="One special character" />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="••••••••"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Password'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Two-Factor Authentication
            </CardTitle>
            <CardDescription>
              Add an extra layer of security to your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mfaEnabled ? (
              <>
                <Alert>
                  <AlertDescription className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Two-factor authentication is enabled
                  </AlertDescription>
                </Alert>
                <Button
                  variant="destructive"
                  onClick={() => setReauthAction('disable-mfa')}
                  disabled={isLoading}
                >
                  Disable MFA
                </Button>
              </>
            ) : (
              <>
                <Alert>
                  <AlertDescription>
                    Two-factor authentication is not enabled. Enable it to add an extra layer of security.
                  </AlertDescription>
                </Alert>
                <Button onClick={handleEnableMfa}>
                  Enable MFA
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Sessions</CardTitle>
            <CardDescription>
              Manage your active sessions across devices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{session.device_info || 'Unknown Device'}</p>
                    <p className="text-xs text-muted-foreground">
                      IP: {session.ip_address} • Last active: {new Date(session.last_activity).toLocaleString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteSession(session.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data & Privacy</CardTitle>
            <CardDescription>
              Export or delete your account data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Export Your Data</p>
                <p className="text-sm text-muted-foreground">
                  Download a copy of your account data
                </p>
              </div>
              <Button variant="outline" onClick={handleExportData}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <p className="font-medium text-destructive">Delete Account</p>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all data
                </p>
              </div>
              <Button
                variant="destructive"
                onClick={() => setReauthAction('delete')}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <ReauthModal
        open={reauthAction !== null}
        onOpenChange={(open) => !open && setReauthAction(null)}
        onSuccess={() => {
          if (reauthAction === 'password') {
            form.handleSubmit(handleChangePassword)();
          } else if (reauthAction === 'delete') {
            handleDeleteAccount();
          } else if (reauthAction === 'disable-mfa') {
            handleDisableMfa();
          }
        }}
        title={
          reauthAction === 'delete'
            ? 'Confirm Account Deletion'
            : reauthAction === 'disable-mfa'
            ? 'Confirm Disable MFA'
            : 'Confirm Password Change'
        }
        description={
          reauthAction === 'delete'
            ? 'This action cannot be undone. Please enter your password to confirm.'
            : 'Please enter your password to confirm this action.'
        }
      />
    </div>
  );
};
