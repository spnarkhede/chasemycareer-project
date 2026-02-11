import type { DayContent } from '@/types';

export const day15: DayContent = {
    dayNumber: 15,
    theme: 'Targeting: Build Company List',
    objective: 'Create a strategic target list of 40 companies you want to work for.',
    keyTasks: [
      'Create a tracker of 40 target companies',
      'Add columns for: Hiring managers, Current projects, Company challenges, Tools they use, Warm contacts',
    ],
    instructions: [
      {
        title: 'Build Your Company Tracker',
        steps: [
          'Create a spreadsheet with columns: Company Name, Website, Jobs Page, Hiring Manager, Current Projects, Challenges, Tools, Warm Contacts, Status, Notes',
          'Research companies in your industry and location',
          'Include a mix of company sizes (large, mid-size, small)',
          'Look for companies actively hiring for your target roles',
        ],
      },
      {
        title: 'Research Each Company',
        steps: [
          'Visit company websites and LinkedIn pages',
          'Note current projects and recent news',
          'Identify company challenges you could help solve',
          'List tools and technologies they use',
          'Search for warm contacts (alumni, former colleagues, mutual connections)',
        ],
      },
    ],
    resources: [
      { title: 'LinkedIn Company Pages', url: 'https://www.linkedin.com/company/' },
      { title: 'Glassdoor', url: 'https://www.glassdoor.com/' },
    ],
    timeCommitment: '3-4 hours',
    proTip: 'A targeted approach beats spray-and-pray. Focus on companies where you can make a real impact.',
  };
