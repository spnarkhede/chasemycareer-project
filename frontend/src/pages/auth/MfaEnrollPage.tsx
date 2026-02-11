import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { authApi } from '@/db/auth-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Loader2, Shield, Copy, Check } from 'lucide-react';

const verifySchema = z.object({
  code: z.string().length(6, 'Code must be 6 digits')
});

type VerifyFormData = z.infer<typeof verifySchema>;

export const MfaEnrollPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [qrCode, setQrCode] = useState<string>('');
  const [secret, setSecret] = useState<string>('');
  const [factorId, setFactorId] = useState<string>('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const form = useForm<VerifyFormData>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: ''
    }
  });

  useEffect(() => {
    const enrollMfa = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await authApi.enrollMfa();

        if (error || !data) {
          toast.error('Failed to initialize MFA enrollment');
          navigate('/settings/security');
          return;
        }

        setQrCode(data.qrCode);
        setSecret(data.secret);

        const { factors } = await authApi.getMfaFactors();
        if (factors.length > 0) {
          setFactorId(factors[0].id);
        }
      } catch (error) {
        toast.error('An unexpected error occurred');
        navigate('/settings/security');
      } finally {
        setIsLoading(false);
      }
    };

    enrollMfa();
  }, [navigate]);

  const onSubmit = async (data: VerifyFormData) => {
    if (!factorId) {
      toast.error('MFA factor not initialized');
      return;
    }

    setIsLoading(true);
    try {
      const { success, error } = await authApi.verifyMfaEnrollment(data.code, factorId);

      if (error || !success) {
        toast.error('Invalid verification code');
        return;
      }

      const { data: backupCodesData, error: backupError } = await authApi.generateBackupCodes();

      if (backupError || !backupCodesData) {
        toast.error('Failed to generate backup codes');
        return;
      }

      setBackupCodes(backupCodesData.codes);
      setShowBackupCodes(true);
      toast.success('MFA enabled successfully!');
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const copyAllCodes = () => {
    const allCodes = backupCodes.join('\n');
    navigator.clipboard.writeText(allCodes);
    toast.success('All backup codes copied to clipboard');
  };

  const handleFinish = () => {
    navigate('/settings/security');
  };

  if (showBackupCodes) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Backup Codes
            </CardTitle>
            <CardDescription>
              Save these backup codes in a secure location. Each code can only be used once.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription>
                Store these codes securely. You'll need them to access your account if you lose your authenticator device.
              </AlertDescription>
            </Alert>

            <div className="bg-muted p-4 rounded-lg space-y-2">
              {backupCodes.map((code, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-background rounded">
                  <code className="text-sm font-mono">{code}</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(code)}
                  >
                    {copiedCode === code ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={copyAllCodes} className="flex-1">
                <Copy className="w-4 h-4 mr-2" />
                Copy All
              </Button>
              <Button onClick={handleFinish} className="flex-1">
                I've Saved My Codes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Enable Two-Factor Authentication
          </CardTitle>
          <CardDescription>
            Scan the QR code with your authenticator app
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading && !qrCode ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="flex justify-center">
                {qrCode && (
                  <img src={qrCode} alt="MFA QR Code" className="w-48 h-48" />
                )}
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Can't scan the QR code? Enter this code manually:
                </p>
                <div className="flex items-center gap-2 p-2 bg-muted rounded">
                  <code className="text-sm font-mono flex-1">{secret}</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(secret)}
                  >
                    {copiedCode === secret ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Verification Code</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            placeholder="000000"
                            maxLength={6}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormDescription>
                          Enter the 6-digit code from your authenticator app
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/settings/security')}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading} className="flex-1">
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        'Verify & Enable'
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
