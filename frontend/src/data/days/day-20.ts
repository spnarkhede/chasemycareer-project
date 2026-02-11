import type { DayContent } from '@/types';

export const day20: DayContent = {
    dayNumber: 20,
    theme: 'Research: Deep Dive',
    objective: 'Conduct in-depth research on your top 5 target companies.',
    keyTasks: [
      'Research 5 top companies: Projects, Tools, Recent news, Leadership changes',
      'Add insights to tracker for personalized outreach later',
    ],
    instructions: [
      {
        title: 'Deep Company Research',
        steps: [
          'Visit company website and read About, Projects, and News sections',
          'Check recent news on Google News and industry publications',
          'Review their LinkedIn page for company updates',
          'Read employee reviews on Glassdoor',
          'Look for recent leadership changes or strategic shifts',
        ],
      },
      {
        title: 'Document Key Insights',
        steps: [
          'Note current projects and initiatives',
          'Identify tools and technologies they use',
          'List company challenges you could help solve',
          'Record recent achievements or milestones',
          'Add all insights to your company tracker',
          'Prepare talking points for interviews or outreach',
        ],
      },
    ],
    resources: [
      { title: 'Glassdoor', url: 'https://www.glassdoor.com/' },
      { title: 'Crunchbase', url: 'https://www.crunchbase.com/' },
    ],
    timeCommitment: '3-4 hours',
    proTip: 'Deep company knowledge helps you tailor applications and impress in interviews. It shows genuine interest.',
  };
