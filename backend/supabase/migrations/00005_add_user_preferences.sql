/*
# Add User Preferences to Profiles

## Overview
This migration adds comprehensive user preference fields to the profiles table
to support personalized job search experience based on location, language, currency, and other settings.

## Changes to profiles table

### Location & Localization
- `preferred_country` (text) - User's preferred job location/country
- `preferred_language` (text, default: 'en') - UI language preference
- `preferred_currency` (text, default: 'USD') - Currency for salary displays
- `timezone` (text) - User's timezone for scheduling

### Job Search Preferences
- `target_role` (text) - Target job role (e.g., Software Engineer)
- `target_industry` (text) - Target industry
- `experience_level` (text) - Entry/Mid/Senior
- `job_search_intensity` (text, default: 'moderate') - Light/Moderate/High
- `resume_format_preference` (text, default: 'ats_standard') - Resume template preference

### Notification Preferences
- `email_notifications` (boolean, default: true) - Enable email alerts
- `daily_reminders` (boolean, default: true) - Daily task reminders
- `interview_alerts` (boolean, default: true) - Interview reminder alerts

### App Customization
- `ui_theme` (text, default: 'system') - Light/Dark/System theme
- `layout_density` (text, default: 'comfortable') - Compact/Comfortable/Spacious

## Notes
- All preference fields are nullable to allow gradual onboarding
- Default values are set for critical preferences
- Existing users will have NULL values for new fields
*/

-- Add preference columns to profiles table
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS preferred_country text,
  ADD COLUMN IF NOT EXISTS preferred_language text DEFAULT 'en',
  ADD COLUMN IF NOT EXISTS preferred_currency text DEFAULT 'USD',
  ADD COLUMN IF NOT EXISTS timezone text,
  
  ADD COLUMN IF NOT EXISTS target_role text,
  ADD COLUMN IF NOT EXISTS target_industry text,
  ADD COLUMN IF NOT EXISTS experience_level text,
  ADD COLUMN IF NOT EXISTS job_search_intensity text DEFAULT 'moderate',
  ADD COLUMN IF NOT EXISTS resume_format_preference text DEFAULT 'ats_standard',
  
  ADD COLUMN IF NOT EXISTS email_notifications boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS daily_reminders boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS interview_alerts boolean DEFAULT true,
  
  ADD COLUMN IF NOT EXISTS ui_theme text DEFAULT 'system',
  ADD COLUMN IF NOT EXISTS layout_density text DEFAULT 'comfortable';

-- Add check constraints for valid values
ALTER TABLE profiles
  ADD CONSTRAINT check_preferred_language 
    CHECK (preferred_language IN ('en', 'de')),
  
  ADD CONSTRAINT check_preferred_currency 
    CHECK (preferred_currency IN ('USD', 'EUR', 'GBP', 'INR')),
  
  ADD CONSTRAINT check_experience_level 
    CHECK (experience_level IS NULL OR experience_level IN ('entry', 'mid', 'senior', 'lead', 'principal')),
  
  ADD CONSTRAINT check_job_search_intensity 
    CHECK (job_search_intensity IN ('light', 'moderate', 'high')),
  
  ADD CONSTRAINT check_resume_format 
    CHECK (resume_format_preference IN ('ats_standard', 'modern', 'german_cv', 'compact')),
  
  ADD CONSTRAINT check_ui_theme 
    CHECK (ui_theme IN ('light', 'dark', 'system')),
  
  ADD CONSTRAINT check_layout_density 
    CHECK (layout_density IN ('compact', 'comfortable', 'spacious'));

-- Create index for faster preference lookups
CREATE INDEX IF NOT EXISTS idx_profiles_preferences 
  ON profiles(preferred_country, preferred_language, preferred_currency);

-- Update the public_profiles view to include safe preference data
DROP VIEW IF EXISTS public_profiles;
CREATE VIEW public_profiles AS
SELECT
  id,
  full_name,
  avatar_url,
  preferred_country,
  target_role,
  experience_level
FROM profiles;
