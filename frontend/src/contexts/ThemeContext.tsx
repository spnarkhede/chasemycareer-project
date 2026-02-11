import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/db/supabase';

type Theme = 'light' | 'dark' | 'system';
type LayoutDensity = 'compact' | 'comfortable' | 'spacious';

interface ThemeContextType {
  theme: Theme;
  layoutDensity: LayoutDensity;
  setTheme: (theme: Theme) => void;
  setLayoutDensity: (density: LayoutDensity) => void;
  effectiveTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [theme, setThemeState] = useState<Theme>('system');
  const [layoutDensity, setLayoutDensityState] = useState<LayoutDensity>('comfortable');
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('light');

  // Load user preferences from database
  useEffect(() => {
    if (user) {
      loadUserPreferences();
    } else {
      // Load from localStorage for non-authenticated users
      const savedTheme = localStorage.getItem('theme') as Theme;
      const savedDensity = localStorage.getItem('layoutDensity') as LayoutDensity;
      
      if (savedTheme) setThemeState(savedTheme);
      if (savedDensity) setLayoutDensityState(savedDensity);
    }
  }, [user]);

  const loadUserPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('ui_theme, layout_density')
        .eq('id', user?.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        const userTheme = (data.ui_theme || 'system') as Theme;
        const userDensity = (data.layout_density || 'comfortable') as LayoutDensity;
        
        setThemeState(userTheme);
        setLayoutDensityState(userDensity);
      }
    } catch (error) {
      console.error('Error loading theme preferences:', error);
    }
  };

  // Apply theme to document
  useEffect(() => {
    const applyTheme = () => {
      const root = document.documentElement;
      
      if (theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        root.classList.toggle('dark', systemTheme === 'dark');
        setEffectiveTheme(systemTheme);
      } else {
        root.classList.toggle('dark', theme === 'dark');
        setEffectiveTheme(theme);
      }
    };

    applyTheme();

    // Listen for system theme changes
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => applyTheme();
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, [theme]);

  // Apply layout density to document
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('density-compact', 'density-comfortable', 'density-spacious');
    root.classList.add(`density-${layoutDensity}`);
  }, [layoutDensity]);

  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    
    if (user) {
      // Save to database
      try {
        await supabase
          .from('profiles')
          .update({ ui_theme: newTheme })
          .eq('id', user.id);
      } catch (error) {
        console.error('Error saving theme preference:', error);
      }
    } else {
      // Save to localStorage
      localStorage.setItem('theme', newTheme);
    }
  };

  const setLayoutDensity = async (newDensity: LayoutDensity) => {
    setLayoutDensityState(newDensity);
    
    if (user) {
      // Save to database
      try {
        await supabase
          .from('profiles')
          .update({ layout_density: newDensity })
          .eq('id', user.id);
      } catch (error) {
        console.error('Error saving layout density preference:', error);
      }
    } else {
      // Save to localStorage
      localStorage.setItem('layoutDensity', newDensity);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, layoutDensity, setTheme, setLayoutDensity, effectiveTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
