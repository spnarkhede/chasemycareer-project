import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const useDemoProtection = () => {
  const { isDemoMode } = useAuth();

  const checkDemoMode = (action: string = 'modify data'): boolean => {
    if (isDemoMode) {
      toast.info(`Demo mode is read-only. Sign up to ${action}!`, {
        action: {
          label: 'Sign Up',
          onClick: () => window.location.href = '/signup'
        }
      });
      return true;
    }
    return false;
  };

  return { isDemoMode, checkDemoMode };
};
