import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { authApi } from '@/db/auth-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Loader2, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address')
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const ForgotPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ''
    }
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      const { error } = await authApi.requestPasswordReset(data.email);

      if (error) {
        toast.error(error.message || 'Failed to send reset email');
        setIsLoading(false);
        return;
      }

      setEmailSent(true);
      toast.success('Password reset email sent!');
    } catch (error) {
      toast.error('An unexpected error occurred');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <CardTitle className="text-2xl font-bold">Forgot Password?</CardTitle>
          </div>
          <CardDescription>
            {emailSent 
              ? "Check your email for reset instructions"
              : "Enter your email address and we'll send you a link to reset your password"
            }
          </CardDescription>
        </CardHeader>

        {emailSent ? (
          <CardContent className="space-y-4">
            <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-600">
                <div className="space-y-2">
                  <p className="font-semibold">Email sent successfully!</p>
                  <p className="text-sm">
                    We've sent a password reset link to <strong>{form.getValues('email')}</strong>
                  </p>
                  <p className="text-sm">
                    Please check your inbox and click the link to reset your password.
                  </p>
                  <p className="text-sm text-muted-foreground mt-4">
                    Didn't receive the email? Check your spam folder or try again.
                  </p>
                </div>
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setEmailSent(false);
                  form.reset();
                }}
              >
                Send Another Email
              </Button>
              <Link to="/login" className="block">
                <Button variant="ghost" className="w-full">
                  Back to Login
                </Button>
              </Link>
            </div>
          </CardContent>
        ) : (
          <>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              {...field}
                              type="email"
                              placeholder="you@example.com"
                              className="pl-10"
                              disabled={isLoading}
                              autoFocus
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending Reset Link...
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4 mr-2" />
                        Send Reset Link
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>

            <CardFooter className="flex flex-col space-y-2">
              <div className="text-sm text-muted-foreground text-center">
                Remember your password?{' '}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
};
