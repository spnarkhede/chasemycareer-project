import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '@/db/supabase';
import { authApi } from '@/db/auth-api';
import type { Profile } from '@/types';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  isAdmin: boolean;
  isDemoMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    const { user: currentUser, profile: currentProfile } = await authApi.getCurrentUser();
    setUser(currentUser);
    setProfile(currentProfile);
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(session.user);
          const { profile: userProfile } = await authApi.getCurrentUser();
          setProfile(userProfile);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        const { profile: userProfile } = await authApi.getCurrentUser();
        setProfile(userProfile);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
      } else if (event === 'USER_UPDATED' && session?.user) {
        setUser(session.user);
        await refreshProfile();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      // Clear local state first
      setUser(null);
      setProfile(null);
      
      // Then sign out from Supabase
      const { error } = await authApi.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
      }
      
      // Force a small delay to ensure auth state is cleared
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error('Exception during sign out:', error);
      // Still clear local state even if API call fails
      setUser(null);
      setProfile(null);
    }
  };

  const isAdmin = profile?.role === 'admin';
  const isDemoMode = user?.email === 'demo@chasemycareer.de';

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut, refreshProfile, isAdmin, isDemoMode }}>
      {children}
    </AuthContext.Provider>
  );
};
