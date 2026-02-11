import type { DayContent } from '@/types';

export const day05: DayContent = {
    dayNumber: 5,
    theme: 'Resume: Tailor to One Job',
    objective: 'Customize your resume to perfectly match a specific target position.',
    keyTasks: [
      'Tailor headline + top bullets to match the job description',
      'Ensure top 5 bullets reflect the role\'s scope + tools + responsibilities',
      'Add any missing skills from JD into resume (authentically)',
    ],
    instructions: [
      {
        title: 'Analyze the Job Description',
        steps: [
          'Select one high-priority job posting',
          'Highlight all required skills, tools, and responsibilities',
          'Note the language and terminology used',
          'Identify the top 5 most important qualifications',
        ],
      },
      {
        title: 'Customize Your Resume',
        steps: [
          'Update your headline to mirror the job title and key requirements',
          'Reorder your top 5 bullets to directly address the job\'s main responsibilities',
          'Incorporate exact keywords from the job description',
          'Add any missing skills you genuinely possess',
          'Ensure your resume clearly shows you can do this specific job',
        ],
      },
    ],
    resources: [],
    timeCommitment: '2-3 hours',
    proTip: 'Create a master resume with all your achievements, then customize versions for different roles. Never lie, but do emphasize relevant experience.',
  };
