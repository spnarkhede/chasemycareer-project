export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  withCount?: boolean;
}

export interface DayContent {
  dayNumber: number;
  theme: string;
  objective: string;
  keyTasks: string[];
  instructions: {
    title: string;
    steps: string[];
  }[];
  resources: {
    title: string;
    url: string;
  }[];
  timeCommitment: string;
  proTip: string;
}

// Database Types
export type UserRole = 'user' | 'admin';
export type ApplicationStatus = 'Applied' | 'Screening' | 'Interview' | 'Offer' | 'Rejected' | 'Withdrawn';
export type DocumentType = 'Resume' | 'CoverLetter';

// User Preference Types
export type PreferredLanguage = 'en' | 'de';
export type PreferredCurrency = 'USD' | 'EUR' | 'GBP' | 'INR';
export type ExperienceLevel = 'entry' | 'mid' | 'senior' | 'lead' | 'principal';
export type JobSearchIntensity = 'light' | 'moderate' | 'high';
export type ResumeFormat = 'ats_standard' | 'modern' | 'german_cv' | 'compact';
export type UITheme = 'light' | 'dark' | 'system';
export type LayoutDensity = 'compact' | 'comfortable' | 'spacious';

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
  
  // Location & Localization Preferences
  preferred_country: string | null;
  preferred_language: string;
  preferred_currency: string;
  timezone: string | null;
  
  // Job Search Preferences
  target_role: string | null;
  target_industry: string | null;
  experience_level: string | null;
  job_search_intensity: string;
  resume_format_preference: string;
  
  // Notification Preferences
  email_notifications: boolean;
  daily_reminders: boolean;
  interview_alerts: boolean;
  
  // App Customization
  ui_theme: string;
  layout_density: string;
}

export interface UserOnboarding {
  id: string;
  user_id: string;
  target_role: string | null;
  target_industry: string | null;
  experience_level: string | null;
  location_preference: string | null;
  work_type: string | null;
  salary_expectation: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface DailyTask {
  id: string;
  user_id: string;
  day_number: number;
  title: string;
  description: string | null;
  completed: boolean;
  notes: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface JobApplication {
  id: string;
  user_id: string;
  company_name: string;
  job_title: string;
  job_url: string | null;
  status: ApplicationStatus;
  applied_date: string | null;
  salary_range: string | null;
  location: string | null;
  notes: string | null;
  follow_up_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Interview {
  id: string;
  user_id: string;
  application_id: string | null;
  interview_type: string | null;
  scheduled_at: string;
  duration_minutes: number;
  interviewer_name: string | null;
  interviewer_email: string | null;
  meeting_link: string | null;
  location: string | null;
  notes: string | null;
  google_calendar_event_id: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  user_id: string;
  document_type: DocumentType;
  title: string;
  content: string | null;
  file_url: string | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface NetworkingContact {
  id: string;
  user_id: string;
  name: string;
  company: string | null;
  position: string | null;
  email: string | null;
  linkedin_url: string | null;
  phone: string | null;
  notes: string | null;
  last_contact_date: string | null;
  next_follow_up_date: string | null;
  relationship_strength: number | null;
  created_at: string;
  updated_at: string;
}

export interface NetworkingMessage {
  id: string;
  user_id: string;
  contact_id: string | null;
  message_type: string | null;
  subject: string | null;
  content: string;
  is_template: boolean;
  sent_at: string | null;
  created_at: string;
}

export interface InterviewQuestion {
  id: string;
  user_id: string | null;
  category: string | null;
  question: string;
  sample_answer: string | null;
  is_system: boolean;
  difficulty: string | null;
  created_at: string;
}

export interface InterviewPracticeSession {
  id: string;
  user_id: string;
  duration_minutes: number | null;
  questions_answered: number | null;
  notes: string | null;
  created_at: string;
}

// Authentication Types
export interface MfaBackupCode {
  id: string;
  user_id: string;
  code_hash: string;
  used: boolean;
  created_at: string;
  used_at: string | null;
}

export interface LoginAttempt {
  id: string;
  email: string;
  ip_address: string | null;
  success: boolean;
  attempted_at: string;
}

export interface UserSession {
  id: string;
  user_id: string;
  device_info: string | null;
  ip_address: string | null;
  last_activity: string;
  created_at: string;
}

export interface AuthUser {
  id: string;
  email: string;
  profile: Profile;
  mfaEnabled: boolean;
}

export interface SignUpData {
  email: string;
  password: string;
  fullName?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface MfaEnrollmentData {
  qrCode: string;
  secret: string;
}

export interface BackupCodesData {
  codes: string[];
}

export interface OAuthToken {
  id: string;
  user_id: string;
  provider: string;
  access_token: string;
  refresh_token: string | null;
  token_type: string;
  expires_at: string;
  scopes: string[];
  created_at: string;
  updated_at: string;
}

export interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone?: string;
  };
  end: {
    dateTime: string;
    timeZone?: string;
  };
  attendees?: Array<{
    email: string;
    displayName?: string;
  }>;
  location?: string;
  htmlLink?: string;
}
