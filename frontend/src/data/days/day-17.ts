import type { DayContent } from '@/types';

export const day17: DayContent = {
    dayNumber: 17,
    theme: 'Networking: 5 Connection Requests',
    objective: 'Send personalized LinkedIn connection requests to expand your network.',
    keyTasks: [
      'Send 5 personalized LinkedIn requests: Alumni, Past colleagues, People in similar roles',
      'Keep message short + specific',
    ],
    instructions: [
      {
        title: 'Identify Connection Targets',
        steps: [
          'Alumni from your school working at target companies',
          'Past colleagues who have moved to companies you\'re interested in',
          'People in similar roles who could provide insights',
          'Second-degree connections with mutual contacts',
        ],
      },
      {
        title: 'Craft Personalized Messages',
        steps: [
          'Keep messages under 300 characters',
          'Mention something specific: shared school, mutual connection, article they wrote',
          'Be genuine and specific, not generic',
          'Don\'t ask for a job in the first message',
          'Example: "Hi [Name], I noticed we both studied at [School] and you\'re now at [Company]. I\'m exploring opportunities in [field] and would love to connect."',
        ],
      },
    ],
    resources: [],
    timeCommitment: '1-2 hours',
    proTip: 'Personalized messages have 3x higher acceptance rates. Take the time to customize each request.',
  };
