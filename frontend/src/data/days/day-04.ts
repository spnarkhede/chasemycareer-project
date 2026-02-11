import type { DayContent } from '@/types';

export const day04: DayContent = {
    dayNumber: 4,
    theme: 'Resume: Clean Up Older Roles',
    objective: 'Streamline older positions to keep your resume focused and relevant.',
    keyTasks: [
      'Shorten roles older than 5-7 years',
      'Keep only relevant wins',
      'Remove generic duties ("Responsible for...") and keep impact-focused bullets',
    ],
    instructions: [
      {
        title: 'Prioritize Recent Experience',
        steps: [
          'Identify roles from more than 5-7 years ago',
          'Reduce these to 2-3 bullets maximum',
          'Focus only on achievements that support your current career direction',
        ],
      },
      {
        title: 'Remove Generic Language',
        steps: [
          'Delete phrases like "Responsible for," "Duties included," "Worked on"',
          'Keep only impact-focused, results-driven bullets',
          'If a bullet doesn\'t show measurable impact, remove it',
        ],
      },
    ],
    resources: [],
    timeCommitment: '1-2 hours',
    proTip: 'Your resume should tell a story of progression. Older roles should support that narrative without overwhelming it.',
  };
