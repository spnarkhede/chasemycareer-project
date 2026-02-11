import type { DayContent } from '@/types';

export const day02: DayContent = {
    dayNumber: 2,
    theme: 'Resume: Rewrite Summary',
    objective: 'Create a compelling, keyword-rich summary that positions you for your target roles.',
    keyTasks: [
      'Rewrite your summary using keywords from 2-3 target job descriptions',
      'Keep it forward-looking ("I help deliver...", "I specialize in...")',
      'Mention industry, strengths, tools, and types of projects',
    ],
    instructions: [
      {
        title: 'Analyze Target Job Descriptions',
        steps: [
          'Select 2-3 job descriptions that match your target role',
          'Highlight recurring keywords, skills, and qualifications',
          'Note the language and terminology used in your industry',
        ],
      },
      {
        title: 'Craft Your Summary',
        steps: [
          'Start with a forward-looking statement about what you deliver',
          'Include your industry, core strengths, and key tools/technologies',
          'Mention the types of projects or work you specialize in',
          'Keep it to 3-4 lines maximum',
          'Example: "I help deliver complex commercial construction projects on time and within budget. I specialize in RFI management, submittal coordination, and field operations using Procore and Bluebeam."',
        ],
      },
    ],
    resources: [],
    timeCommitment: '1-2 hours',
    proTip: 'Use "I" statements to make your summary more personal and engaging. Avoid generic phrases like "results-oriented professional."',
  };
