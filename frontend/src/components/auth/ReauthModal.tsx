import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { authApi } from '@/db/auth-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { Loader2, Lock, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const reauthSchema = z.object({
  password: z.string().min(1, 'Password is required')
});

type ReauthFormData = z.infer<typeof reauthSchema>;

interface ReauthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  title?: string;
  description?: string;
}

export const ReauthModal = ({
  open,
  onOpenChange,
  onSuccess,
  title = 'Confirm Your Identity',
  description = 'This is a sensitive action. Please enter your password to continue.'
}: ReauthModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ReauthFormData>({
    resolver: zodResolver(reauthSchema),
    defaultValues: {
      password: ''
    }
  });

  const onSubmit = async (data: ReauthFormData) => {
    setIsLoading(true);
    try {
      const { success, error } = await authApi.reauthenticate(data.password);

      if (error || !success) {
        toast.error('Incorrect password');
        return;
      }

      toast.success('Identity confirmed');
      onOpenChange(false);
      form.reset();
      onSuccess();
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Alert>
          <AlertDescription>
            For your security, we need to verify your identity before proceeding with this action.
          </AlertDescription>
        </Alert>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        {...field}
                        type="password"
                        placeholder="Enter your password"
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                  form.reset();
                }}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Confirm'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
