import { lazy } from 'react';
import type { ComponentType } from 'react';

// Eager load critical pages for immediate access
import Landing from './pages/Landing';
import { LoginPage } from './pages/auth/LoginPage';
import { SignUpPage } from './pages/auth/SignUpPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';

// Lazy load all other pages for better performance
const Onboarding = lazy(() => import('./pages/Onboarding'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const FiftyDayPlan = lazy(() => import('./pages/FiftyDayPlan'));
const JobTracker = lazy(() => import('./pages/JobTracker'));
const Interviews = lazy(() => import('./pages/Interviews'));
const Networking = lazy(() => import('./pages/Networking'));
const InterviewPractice = lazy(() => import('./pages/InterviewPractice'));
const JobSearchCalendar = lazy(() => import('./pages/JobSearchCalendar'));
const DayDetail = lazy(() => import('./pages/DayDetail'));
const Congratulations = lazy(() => import('./pages/Congratulations'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const PrivacySettings = lazy(() => import('./pages/PrivacySettings'));
const MfaEnrollPage = lazy(() => import('./pages/auth/MfaEnrollPage').then(m => ({ default: m.MfaEnrollPage })));
const OAuthCallback = lazy(() => import('./pages/auth/OAuthCallback'));
const SecuritySettingsPage = lazy(() => import('./pages/settings/SecuritySettingsPage').then(m => ({ default: m.SecuritySettingsPage })));
const Settings = lazy(() => import('./pages/Settings'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const CreateTestUsers = lazy(() => import('./pages/admin/CreateTestUsers'));
const CreateDemoUser = lazy(() => import('./pages/admin/CreateDemoUser'));
const Calendar = lazy(() => import('./pages/Calendar'));

interface RouteConfig {
  name: string;
  path: string;
  Component: ComponentType;
  protected?: boolean;
  requireAdmin?: boolean;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Home',
    path: '/',
    Component: Landing
  },
  {
    name: 'Login',
    path: '/login',
    Component: LoginPage,
    visible: false
  },
  {
    name: 'Sign Up',
    path: '/signup',
    Component: SignUpPage,
    visible: false
  },
  {
    name: 'Forgot Password',
    path: '/forgot-password',
    Component: ForgotPasswordPage,
    visible: false
  },
  {
    name: 'Reset Password',
    path: '/reset-password',
    Component: ResetPasswordPage,
    visible: false
  },
  {
    name: 'OAuth Callback',
    path: '/auth/callback',
    Component: OAuthCallback,
    visible: false
  },
  {
    name: 'MFA Enrollment',
    path: '/auth/mfa-enroll',
    Component: MfaEnrollPage,
    protected: true,
    visible: false
  },
  {
    name: 'Security Settings',
    path: '/settings/security',
    Component: SecuritySettingsPage,
    protected: true,
    visible: false
  },
  {
    name: 'Settings',
    path: '/settings',
    Component: Settings,
    protected: true,
    visible: false
  },
  {
    name: 'Admin Dashboard',
    path: '/admin',
    Component: AdminDashboard,
    protected: true,
    requireAdmin: true,
    visible: false
  },
  {
    name: 'Create Test Users',
    path: '/admin/create-test-users',
    Component: CreateTestUsers,
    visible: false
  },
  {
    name: 'Create Demo User',
    path: '/admin/create-demo-user',
    Component: CreateDemoUser,
    visible: false
  },
  {
    name: 'Onboarding',
    path: '/onboarding',
    Component: Onboarding,
    protected: true,
    visible: false
  },
  {
    name: 'Dashboard',
    path: '/dashboard',
    Component: Dashboard,
    protected: true,
    visible: false
  },
  {
    name: '50-Day Plan',
    path: '/50-day-plan',
    Component: FiftyDayPlan,
    protected: true,
    visible: false
  },
  {
    name: 'Job Tracker',
    path: '/job-tracker',
    Component: JobTracker,
    protected: true,
    visible: false
  },
  {
    name: 'Interviews',
    path: '/interviews',
    Component: Interviews,
    protected: true,
    visible: false
  },
  {
    name: 'Networking',
    path: '/networking',
    Component: Networking,
    protected: true,
    visible: false
  },
  {
    name: 'Interview Practice',
    path: '/interview-practice',
    Component: InterviewPractice,
    protected: true,
    visible: false
  },
  {
    name: 'Calendar',
    path: '/calendar',
    Component: JobSearchCalendar,
    protected: true,
    visible: false
  },
  {
    name: 'Google Calendar',
    path: '/google-calendar',
    Component: Calendar,
    protected: true,
    visible: false
  },
  {
    name: 'Day Detail',
    path: '/day/:dayNumber',
    Component: DayDetail,
    protected: true,
    visible: false
  },
  {
    name: 'Congratulations',
    path: '/congratulations',
    Component: Congratulations,
    protected: true,
    visible: false
  },
  {
    name: 'Privacy Policy',
    path: '/privacy-policy',
    Component: PrivacyPolicy,
    visible: false
  },
  {
    name: 'Terms of Service',
    path: '/terms-of-service',
    Component: TermsOfService,
    visible: false
  },
  {
    name: 'Privacy Settings',
    path: '/privacy-settings',
    Component: PrivacySettings,
    protected: true,
    visible: false
  }
];

export default routes;
