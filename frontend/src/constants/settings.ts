// Settings Constants and Options

export const COUNTRIES = [
  { value: 'australia', label: 'Australia', flag: '🇦🇺' },
  { value: 'canada', label: 'Canada', flag: '🇨🇦' },
  { value: 'europe', label: 'Europe (EU region)', flag: '🇪🇺' },
  { value: 'germany', label: 'Germany', flag: '🇩🇪' },
  { value: 'india', label: 'India', flag: '🇮🇳' },
  { value: 'uk', label: 'United Kingdom (UK)', flag: '🇬🇧' },
  { value: 'usa', label: 'United States (USA)', flag: '🇺🇸' },
] as const;

export const LANGUAGES = [
  { value: 'en', label: 'English', nativeName: 'English' },
  { value: 'de', label: 'German', nativeName: 'Deutsch' },
] as const;

export const CURRENCIES = [
  { value: 'USD', label: 'US Dollar', symbol: '$', country: 'USA' },
  { value: 'EUR', label: 'Euro', symbol: '€', country: 'Europe/Germany' },
  { value: 'GBP', label: 'British Pound', symbol: '£', country: 'UK' },
  { value: 'INR', label: 'Indian Rupee', symbol: '₹', country: 'India' },
] as const;

export const EXPERIENCE_LEVELS = [
  { value: 'entry', label: 'Entry Level', description: '0-2 years' },
  { value: 'mid', label: 'Mid Level', description: '3-5 years' },
  { value: 'senior', label: 'Senior', description: '6-10 years' },
  { value: 'lead', label: 'Lead', description: '10+ years' },
  { value: 'principal', label: 'Principal', description: '15+ years' },
] as const;

export const JOB_SEARCH_INTENSITIES = [
  { 
    value: 'light', 
    label: 'Light', 
    description: '1-2 applications/day',
    tasksPerDay: 3 
  },
  { 
    value: 'moderate', 
    label: 'Moderate', 
    description: '3-4 applications/day',
    tasksPerDay: 5 
  },
  { 
    value: 'high', 
    label: 'High', 
    description: '5-7 applications/day',
    tasksPerDay: 8 
  },
] as const;

export const RESUME_FORMATS = [
  { 
    value: 'ats_standard', 
    label: 'ATS Standard', 
    description: 'Optimized for Applicant Tracking Systems',
    bestFor: 'USA, India, Canada'
  },
  { 
    value: 'modern', 
    label: 'Modern', 
    description: 'Contemporary design with visual elements',
    bestFor: 'Startups, Creative roles'
  },
  { 
    value: 'german_cv', 
    label: 'German CV (Lebenslauf)', 
    description: 'Traditional German format with photo',
    bestFor: 'Germany, Austria, Switzerland'
  },
  { 
    value: 'compact', 
    label: 'Compact 1-Page', 
    description: 'Concise single-page format',
    bestFor: 'Entry level, Career changers'
  },
] as const;

export const UI_THEMES = [
  { value: 'light', label: 'Light', icon: '☀️' },
  { value: 'dark', label: 'Dark', icon: '🌙' },
  { value: 'system', label: 'System', icon: '💻' },
] as const;

export const LAYOUT_DENSITIES = [
  { value: 'compact', label: 'Compact', description: 'More content, less spacing' },
  { value: 'comfortable', label: 'Comfortable', description: 'Balanced spacing' },
  { value: 'spacious', label: 'Spacious', description: 'More spacing, easier reading' },
] as const;

export const JOB_ROLES = [
  'Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'DevOps Engineer',
  'Data Scientist',
  'Data Analyst',
  'Product Manager',
  'Project Manager',
  'UX/UI Designer',
  'Marketing Manager',
  'Sales Manager',
  'Business Analyst',
  'Quality Assurance Engineer',
  'System Administrator',
  'Network Engineer',
  'Security Engineer',
  'Mobile Developer',
  'Cloud Architect',
  'Machine Learning Engineer',
] as const;

export const INDUSTRIES = [
  'Technology',
  'Finance',
  'Healthcare',
  'Education',
  'Retail',
  'Manufacturing',
  'Consulting',
  'Media & Entertainment',
  'Telecommunications',
  'Energy',
  'Transportation',
  'Real Estate',
  'Hospitality',
  'Government',
  'Non-Profit',
  'Automotive',
  'Aerospace',
  'Pharmaceuticals',
  'E-commerce',
  'Gaming',
] as const;

// Country-specific job portals
export const JOB_PORTALS = {
  usa: [
    { name: 'LinkedIn', url: 'https://www.linkedin.com/jobs/' },
    { name: 'Indeed', url: 'https://www.indeed.com/' },
    { name: 'Glassdoor', url: 'https://www.glassdoor.com/' },
    { name: 'Monster', url: 'https://www.monster.com/' },
  ],
  germany: [
    { name: 'LinkedIn DE', url: 'https://www.linkedin.com/jobs/' },
    { name: 'StepStone', url: 'https://www.stepstone.de/' },
    { name: 'Indeed DE', url: 'https://de.indeed.com/' },
    { name: 'XING', url: 'https://www.xing.com/jobs' },
  ],
  india: [
    { name: 'Naukri', url: 'https://www.naukri.com/' },
    { name: 'LinkedIn India', url: 'https://www.linkedin.com/jobs/' },
    { name: 'Indeed India', url: 'https://www.indeed.co.in/' },
    { name: 'Monster India', url: 'https://www.monsterindia.com/' },
  ],
  uk: [
    { name: 'LinkedIn UK', url: 'https://www.linkedin.com/jobs/' },
    { name: 'Indeed UK', url: 'https://www.indeed.co.uk/' },
    { name: 'Reed', url: 'https://www.reed.co.uk/' },
    { name: 'Totaljobs', url: 'https://www.totaljobs.com/' },
  ],
  canada: [
    { name: 'LinkedIn Canada', url: 'https://www.linkedin.com/jobs/' },
    { name: 'Indeed Canada', url: 'https://ca.indeed.com/' },
    { name: 'Workopolis', url: 'https://www.workopolis.com/' },
    { name: 'Job Bank', url: 'https://www.jobbank.gc.ca/' },
  ],
  australia: [
    { name: 'LinkedIn Australia', url: 'https://www.linkedin.com/jobs/' },
    { name: 'Seek', url: 'https://www.seek.com.au/' },
    { name: 'Indeed Australia', url: 'https://au.indeed.com/' },
    { name: 'CareerOne', url: 'https://www.careerone.com.au/' },
  ],
  europe: [
    { name: 'LinkedIn Europe', url: 'https://www.linkedin.com/jobs/' },
    { name: 'Indeed Europe', url: 'https://www.indeed.com/' },
    { name: 'EuroJobs', url: 'https://www.eurojobs.com/' },
    { name: 'The Local', url: 'https://www.thelocal.com/jobs/' },
  ],
} as const;

// Currency formatting helpers
export const formatCurrency = (amount: number, currency: string): string => {
  const currencyData = CURRENCIES.find(c => c.value === currency);
  if (!currencyData) return `${amount}`;
  
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  
  return formatter.format(amount);
};

// Get job portals for a country
export const getJobPortals = (country: string | null) => {
  if (!country) return JOB_PORTALS.usa;
  return JOB_PORTALS[country as keyof typeof JOB_PORTALS] || JOB_PORTALS.usa;
};

// Get default currency for a country
export const getDefaultCurrency = (country: string | null): string => {
  const countryToCurrency: Record<string, string> = {
    usa: 'USD',
    germany: 'EUR',
    europe: 'EUR',
    uk: 'GBP',
    india: 'INR',
    canada: 'USD',
    australia: 'USD',
  };
  
  return country ? (countryToCurrency[country] || 'USD') : 'USD';
};

// Get timezone suggestions for a country
export const getTimezoneForCountry = (country: string | null): string => {
  const countryToTimezone: Record<string, string> = {
    usa: 'America/New_York',
    germany: 'Europe/Berlin',
    europe: 'Europe/Brussels',
    uk: 'Europe/London',
    india: 'Asia/Kolkata',
    canada: 'America/Toronto',
    australia: 'Australia/Sydney',
  };
  
  return country ? (countryToTimezone[country] || 'UTC') : 'UTC';
};
