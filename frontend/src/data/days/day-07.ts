import type { DayContent } from '@/types';

export const day07: DayContent = {
    dayNumber: 7,
    theme: 'Resume: Final Quality Pass',
    objective: 'Polish your resume to perfection with a final quality check.',
    keyTasks: [
      'Fix spacing, alignment, tense inconsistencies',
      'Ensure resume clearly shows: What you do, What tools you know, Your impact',
    ],
    instructions: [
      {
        title: 'Technical Review',
        steps: [
          'Check all spacing and alignment for consistency',
          'Verify tense: past tense for previous roles, present for current role',
          'Proofread for grammar, spelling, and punctuation errors',
          'Ensure all dates, company names, and contact information are accurate',
        ],
      },
      {
        title: 'Content Clarity Check',
        steps: [
          'Read your resume and ask: Is it immediately clear what I do?',
          'Verify that your key tools and technologies are prominently featured',
          'Ensure every bullet demonstrates measurable impact',
          'Check that your value proposition is clear in the first third of the page',
        ],
      },
      {
        title: 'Final Polish',
        steps: [
          'Print your resume and review on paper (you\'ll catch errors you miss on screen)',
          'Read it aloud to catch awkward phrasing',
          'Get feedback from a trusted colleague or mentor',
          'Create final versions in multiple formats (PDF, DOCX)',
        ],
      },
    ],
    resources: [
      { title: 'Grammarly', url: 'https://www.grammarly.com/' },
    ],
    timeCommitment: '2-3 hours',
    proTip: 'Your resume should pass the "6-second test" - a recruiter should understand your value in 6 seconds or less.',
  };
