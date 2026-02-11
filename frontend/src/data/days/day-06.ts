import type { DayContent } from '@/types';

export const day06: DayContent = {
    dayNumber: 6,
    theme: 'Resume: ATS & Formatting',
    objective: 'Ensure your resume passes Applicant Tracking Systems and is properly formatted.',
    keyTasks: [
      'Run resume through an ATS checker',
      'Fix formatting: remove tables/text boxes, standardize bullets',
      'Ensure keywords appear naturally in bullets',
    ],
    instructions: [
      {
        title: 'Test with ATS Checker',
        steps: [
          'Upload your resume to Jobscan or similar ATS tool',
          'Compare against your target job description',
          'Review the match rate and identify missing keywords',
          'Check for formatting issues that could cause parsing errors',
        ],
      },
      {
        title: 'Fix Formatting Issues',
        steps: [
          'Remove tables, text boxes, headers/footers, and graphics',
          'Use standard section headings: Summary, Experience, Education, Skills',
          'Standardize bullet points (use consistent style throughout)',
          'Use standard fonts: Arial, Calibri, or Helvetica',
          'Save as .docx or PDF (check job posting requirements)',
        ],
      },
      {
        title: 'Optimize Keywords',
        steps: [
          'Ensure keywords from the job description appear naturally in your bullets',
          'Don\'t keyword stuff - integrate them authentically',
          'Include both acronyms and full terms (e.g., "RFI" and "Request for Information")',
        ],
      },
    ],
    resources: [
      { title: 'Jobscan ATS Checker', url: 'https://www.jobscan.co/' },
      { title: 'Resume Worded', url: 'https://resumeworded.com/' },
    ],
    timeCommitment: '2 hours',
    proTip: 'A 75%+ ATS match rate significantly increases your chances of getting past the initial screening.',
  };
