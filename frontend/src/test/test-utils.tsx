import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';

// Mock Supabase client
export const mockSupabaseClient = {
  auth: {
    getSession: vi.fn(),
    getUser: vi.fn(),
    signUp: vi.fn(),
    signInWithPassword: vi.fn(),
    signInWithOAuth: vi.fn(),
    signOut: vi.fn(),
    onAuthStateChange: vi.fn(() => ({
      data: { subscription: { unsubscribe: vi.fn() } },
    })),
  },
  from: vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn(),
    maybeSingle: vi.fn(),
  })),
  rpc: vi.fn(),
};

// Custom render function with providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialRoute?: string;
}

export function renderWithProviders(
  ui: ReactElement,
  options?: CustomRenderOptions
) {
  const { initialRoute = '/', ...renderOptions } = options || {};

  window.history.pushState({}, 'Test page', initialRoute);

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <BrowserRouter>
        <AuthProvider>{children}</AuthProvider>
      </BrowserRouter>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// Mock user data
export const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  user_metadata: {
    full_name: 'Test User',
  },
  created_at: '2026-01-01T00:00:00Z',
};

// Mock profile data
export const mockProfile = {
  user_id: 'test-user-id',
  full_name: 'Test User',
  email: 'test@example.com',
  created_at: '2026-01-01T00:00:00Z',
  target_role: 'Software Engineer',
  experience_level: 'Mid-level',
};

// Mock daily task
export const mockDailyTask = {
  id: 'task-1',
  user_id: 'test-user-id',
  day_number: 1,
  title: 'Career Goals Definition',
  description: 'Define your career goals',
  category: 'preparation',
  completed: false,
  completed_at: null,
};

// Mock job application
export const mockJobApplication = {
  id: 'app-1',
  user_id: 'test-user-id',
  company_name: 'Test Company',
  position_title: 'Software Engineer',
  status: 'applied',
  applied_date: '2026-01-01',
  job_url: 'https://example.com/job',
  notes: 'Test notes',
  created_at: '2026-01-01T00:00:00Z',
};

// Mock interview
export const mockInterview = {
  id: 'interview-1',
  user_id: 'test-user-id',
  company_name: 'Test Company',
  position_title: 'Software Engineer',
  interview_date: '2026-01-15',
  interview_type: 'technical',
  status: 'scheduled',
  notes: 'Test interview notes',
  created_at: '2026-01-01T00:00:00Z',
};

// Wait for async operations
export const waitFor = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Re-export everything from testing library
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
