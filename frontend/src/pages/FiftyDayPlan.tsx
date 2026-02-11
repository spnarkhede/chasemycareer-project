import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useDemoProtection } from '@/hooks/useDemoProtection';
import { getDailyTasks, createDailyTask, toggleTaskCompletion, updateDailyTask } from '@/db/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle2, Circle, Calendar as CalendarIcon, Target, TrendingUp, Grid3x3, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import type { DailyTask } from '@/types';

const PLAN_STRUCTURE = [
  { week: 1, days: '1-7', theme: 'Foundation & Preparation', focus: 'Set up your job search infrastructure' },
  { week: 2, days: '8-14', theme: 'Resume & Profile Optimization', focus: 'Perfect your professional materials' },
  { week: 3, days: '15-21', theme: 'Networking Activation', focus: 'Build and leverage your network' },
  { week: 4, days: '22-28', theme: 'Application Sprint', focus: 'Apply to target companies' },
  { week: 5, days: '29-35', theme: 'Interview Preparation', focus: 'Master interview skills' },
  { week: 6, days: '36-42', theme: 'Active Interviewing', focus: 'Ace your interviews' },
  { week: 7, days: '43-49', theme: 'Offer Negotiation', focus: 'Evaluate and negotiate offers' },
  { week: 8, days: '50', theme: 'Celebration & Transition', focus: 'Prepare for your new role' },
];

const DEFAULT_TASKS = [
  // Week 1: Foundation
  { day: 1, title: 'Set up job search workspace', description: 'Create a dedicated space and organize your tools' },
  { day: 1, title: 'Define target roles and companies', description: 'List 20-30 companies you want to work for' },
  { day: 2, title: 'Audit current resume', description: 'Review and identify areas for improvement' },
  { day: 2, title: 'Update LinkedIn profile', description: 'Ensure all sections are complete and current' },
  { day: 3, title: 'Research industry trends', description: 'Stay current with your target industry' },
  { day: 3, title: 'Set up job alerts', description: 'Configure alerts on LinkedIn, Indeed, and company sites' },
  { day: 4, title: 'Create application tracker', description: 'Set up system to track all applications' },
  { day: 4, title: 'Prepare references list', description: 'Contact and confirm 3-5 professional references' },
  { day: 5, title: 'Review job descriptions', description: 'Analyze 10 job postings for common requirements' },
  { day: 5, title: 'Identify skill gaps', description: 'Note skills you need to highlight or develop' },
  { day: 6, title: 'Plan weekly schedule', description: 'Block time for job search activities' },
  { day: 6, title: 'Join professional groups', description: 'Find and join relevant online communities' },
  { day: 7, title: 'Week 1 review', description: 'Reflect on progress and adjust strategy' },

  // Week 2: Resume & Profile
  { day: 8, title: 'Rewrite resume summary', description: 'Craft compelling professional summary' },
  { day: 8, title: 'Quantify achievements', description: 'Add metrics and numbers to accomplishments' },
  { day: 9, title: 'Tailor resume for target role', description: 'Customize for your primary target position' },
  { day: 9, title: 'Create resume variations', description: 'Prepare 2-3 versions for different roles' },
  { day: 10, title: 'Optimize LinkedIn headline', description: 'Write attention-grabbing headline' },
  { day: 10, title: 'Update LinkedIn experience', description: 'Mirror resume improvements' },
  { day: 11, title: 'Write cover letter template', description: 'Create customizable cover letter base' },
  { day: 11, title: 'Get resume feedback', description: 'Ask 2-3 people to review your resume' },
  { day: 12, title: 'Finalize resume design', description: 'Ensure professional formatting and ATS compatibility' },
  { day: 12, title: 'Create portfolio/work samples', description: 'Prepare examples of your work' },
  { day: 13, title: 'Update all online profiles', description: 'Ensure consistency across platforms' },
  { day: 13, title: 'Prepare elevator pitch', description: 'Write and practice 30-second introduction' },
  { day: 14, title: 'Week 2 review', description: 'Finalize all professional materials' },

  // Week 3: Networking
  { day: 15, title: 'List networking contacts', description: 'Identify 20-30 people in your network' },
  { day: 15, title: 'Reach out to close contacts', description: 'Message 5 people you know well' },
  { day: 16, title: 'Request informational interviews', description: 'Ask 3 people for 15-minute calls' },
  { day: 16, title: 'Join virtual networking events', description: 'Register for 2-3 upcoming events' },
  { day: 17, title: 'Engage on LinkedIn', description: 'Comment on 10 posts, share 2 articles' },
  { day: 17, title: 'Connect with alumni', description: 'Reach out to 5 alumni from your school' },
  { day: 18, title: 'Attend networking event', description: 'Participate actively and collect contacts' },
  { day: 18, title: 'Follow up with new contacts', description: 'Send personalized messages within 24 hours' },
  { day: 19, title: 'Conduct informational interviews', description: 'Complete 2-3 scheduled calls' },
  { day: 19, title: 'Send thank you notes', description: 'Thank everyone who helped you' },
  { day: 20, title: 'Expand LinkedIn network', description: 'Send 10 connection requests with notes' },
  { day: 20, title: 'Join industry Slack/Discord', description: 'Find and join relevant communities' },
  { day: 21, title: 'Week 3 review', description: 'Assess networking progress and leads' },

  // Week 4: Applications
  { day: 22, title: 'Apply to 5 target companies', description: 'Submit customized applications' },
  { day: 22, title: 'Track all applications', description: 'Log details in your tracker' },
  { day: 23, title: 'Apply to 5 more companies', description: 'Continue application momentum' },
  { day: 23, title: 'Research company cultures', description: 'Deep dive into company values and reviews' },
  { day: 24, title: 'Apply to 5 more companies', description: 'Maintain consistent application pace' },
  { day: 24, title: 'Customize cover letters', description: 'Personalize for each application' },
  { day: 25, title: 'Apply to 5 more companies', description: 'Total 20 applications this week' },
  { day: 25, title: 'Follow up on applications', description: 'Message recruiters or hiring managers' },
  { day: 26, title: 'Apply through referrals', description: 'Leverage network connections' },
  { day: 26, title: 'Apply to stretch roles', description: 'Apply to 2-3 reach positions' },
  { day: 27, title: 'Review application responses', description: 'Track response rates and patterns' },
  { day: 27, title: 'Adjust application strategy', description: 'Refine based on feedback' },
  { day: 28, title: 'Week 4 review', description: 'Analyze application metrics' },

  // Week 5: Interview Prep
  { day: 29, title: 'Research common questions', description: 'Compile list of 20 frequent questions' },
  { day: 29, title: 'Prepare STAR stories', description: 'Write 5-7 achievement stories' },
  { day: 30, title: 'Practice behavioral questions', description: 'Record yourself answering questions' },
  { day: 30, title: 'Prepare questions to ask', description: 'Create list of 10 insightful questions' },
  { day: 31, title: 'Mock interview practice', description: 'Do practice interview with friend' },
  { day: 31, title: 'Review technical skills', description: 'Brush up on role-specific knowledge' },
  { day: 32, title: 'Research target companies deeply', description: 'Know products, competitors, news' },
  { day: 32, title: 'Prepare company-specific answers', description: 'Customize responses for each company' },
  { day: 33, title: 'Practice virtual interview setup', description: 'Test camera, audio, lighting' },
  { day: 33, title: 'Prepare interview outfit', description: 'Choose and prepare professional attire' },
  { day: 34, title: 'Do final mock interview', description: 'Full practice interview session' },
  { day: 34, title: 'Review and refine answers', description: 'Polish your responses' },
  { day: 35, title: 'Week 5 review', description: 'Assess interview readiness' },

  // Week 6: Interviewing
  { day: 36, title: 'Confirm interview schedules', description: 'Double-check all appointments' },
  { day: 36, title: 'Prepare interview materials', description: 'Print resumes, gather portfolio' },
  { day: 37, title: 'Attend interviews', description: 'Give your best performance' },
  { day: 37, title: 'Send thank you emails', description: 'Within 24 hours of each interview' },
  { day: 38, title: 'Continue interviewing', description: 'Maintain momentum with multiple companies' },
  { day: 38, title: 'Take interview notes', description: 'Document questions and impressions' },
  { day: 39, title: 'Follow up on pending interviews', description: 'Check status politely' },
  { day: 39, title: 'Prepare for second rounds', description: 'Research deeper for callbacks' },
  { day: 40, title: 'Attend second round interviews', description: 'Show continued interest and fit' },
  { day: 40, title: 'Continue applying', description: 'Don\'t stop until you have an offer' },
  { day: 41, title: 'Evaluate interview performance', description: 'Identify areas for improvement' },
  { day: 41, title: 'Adjust interview strategy', description: 'Refine based on experience' },
  { day: 42, title: 'Week 6 review', description: 'Track interview progress' },

  // Week 7: Offers
  { day: 43, title: 'Review offer details', description: 'Analyze compensation and benefits' },
  { day: 43, title: 'Research market rates', description: 'Know your worth in the market' },
  { day: 44, title: 'Prepare negotiation strategy', description: 'Plan your negotiation approach' },
  { day: 44, title: 'Practice negotiation', description: 'Role-play negotiation scenarios' },
  { day: 45, title: 'Negotiate offer', description: 'Professionally discuss compensation' },
  { day: 45, title: 'Evaluate total package', description: 'Consider all aspects of offer' },
  { day: 46, title: 'Compare multiple offers', description: 'Weigh pros and cons of each' },
  { day: 46, title: 'Seek advice', description: 'Consult mentors about decision' },
  { day: 47, title: 'Make final decision', description: 'Choose the best opportunity' },
  { day: 47, title: 'Accept offer formally', description: 'Sign and return offer letter' },
  { day: 48, title: 'Decline other offers', description: 'Professionally decline with gratitude' },
  { day: 48, title: 'Notify current employer', description: 'Give proper notice if employed' },
  { day: 49, title: 'Week 7 review', description: 'Celebrate your success!' },

  // Week 8: Transition
  { day: 50, title: 'Prepare for new role', description: 'Plan your first 90 days' },
  { day: 50, title: 'Thank your network', description: 'Express gratitude to everyone who helped' },
  { day: 50, title: 'Celebrate your achievement', description: 'You did it! Congratulations!' },
];

export default function FiftyDayPlan() {
  const { user } = useAuth();
  const { checkDemoMode } = useDemoProtection();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [selectedWeek, setSelectedWeek] = useState('1');
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  useEffect(() => {
    if (user) {
      loadTasks();
    }
  }, [user]);

  const loadTasks = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(false);

      // Create timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 10000);
      });

      // Race between data loading and timeout
      const existingTasks = await Promise.race([
        getDailyTasks(user.id),
        timeoutPromise
      ]);

      if (existingTasks.length === 0) {
        const tasksToCreate = DEFAULT_TASKS.map(task => ({
          user_id: user.id,
          day_number: task.day,
          title: task.title,
          description: task.description,
          completed: false,
        }));

        await Promise.all(tasksToCreate.map(task => createDailyTask(task)));
        const newTasks = await getDailyTasks(user.id);
        setTasks(newTasks);
      } else {
        setTasks(existingTasks);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
      setError(true);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTask = async (taskId: string, completed: boolean) => {
    if (checkDemoMode('mark tasks as complete')) return;
    
    try {
      await toggleTaskCompletion(taskId, !completed);
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: !completed } : t));
      toast.success(completed ? 'Task marked as incomplete' : 'Task completed!');
    } catch (error) {
      console.error('Error toggling task:', error);
      toast.error('Failed to update task');
    }
  };

  const handleSaveNotes = async (taskId: string) => {
    if (checkDemoMode('save notes')) return;
    
    try {
      await updateDailyTask(taskId, { notes: noteText });
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, notes: noteText } : t));
      setEditingNotes(null);
      setNoteText('');
      toast.success('Notes saved');
    } catch (error) {
      console.error('Error saving notes:', error);
      toast.error('Failed to save notes');
    }
  };

  const startEditingNotes = (task: DailyTask) => {
    setEditingNotes(task.id);
    setNoteText(task.notes || '');
  };

  const weekTasks = tasks.filter(task => {
    const weekNum = parseInt(selectedWeek);
    const startDay = (weekNum - 1) * 7 + 1;
    const endDay = weekNum === 8 ? 50 : weekNum * 7;
    return task.day_number >= startDay && task.day_number <= endDay;
  });

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercentage = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  // Get completion status for each day
  const getDayStatus = (dayNumber: number) => {
    const dayTasks = tasks.filter(t => t.day_number === dayNumber);
    if (dayTasks.length === 0) return 'empty';
    const allCompleted = dayTasks.every(t => t.completed);
    const someCompleted = dayTasks.some(t => t.completed);
    if (allCompleted) return 'completed';
    if (someCompleted) return 'partial';
    return 'pending';
  };

  const handleDayClick = (dayNumber: number) => {
    const weekNum = Math.ceil(dayNumber / 7);
    setSelectedWeek(weekNum.toString());
    // Scroll to the tasks section
    setTimeout(() => {
      const element = document.getElementById(`day-${dayNumber}`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-12 w-64 bg-muted" />
        <Skeleton className="h-32 bg-muted" />
        <Skeleton className="h-96 bg-muted" />
      </div>
    );
  }

  // Error state with retry button
  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="max-w-md mx-auto mt-20">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="rounded-full bg-destructive/10 p-3">
                  <AlertCircle className="h-10 w-10 text-destructive" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Failed to Load 50-Day Plan</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  We couldn't load your tasks. This might be due to a network issue or timeout.
                </p>
              </div>
              <Button onClick={loadTasks} className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Target className="h-8 w-8" />
          50-Day Job Search Plan
        </h1>
        <p className="text-muted-foreground mt-1">
          Your structured path to landing your dream job
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Overall Progress
          </CardTitle>
          <CardDescription>
            {completedCount} of {tasks.length} tasks completed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{progressPercentage}% Complete</span>
              <span className="text-muted-foreground">
                {tasks.length - completedCount} tasks remaining
              </span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Grid3x3 className="h-5 w-5" />
            50-Day Calendar View
          </CardTitle>
          <CardDescription>
            Click on any day to jump to its tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 sm:grid-cols-10 gap-2">
            {Array.from({ length: 50 }, (_, i) => i + 1).map((day) => {
              const status = getDayStatus(day);
              const dayTasks = tasks.filter(t => t.day_number === day);
              const completedTasksCount = dayTasks.filter(t => t.completed).length;
              
              return (
                <button
                  key={day}
                  onClick={() => handleDayClick(day)}
                  className={`
                    relative aspect-square rounded-lg border-2 transition-all hover:scale-105
                    flex flex-col items-center justify-center text-sm font-medium
                    ${status === 'completed' ? 'bg-primary text-primary-foreground border-primary' : ''}
                    ${status === 'partial' ? 'bg-primary/20 text-foreground border-primary/50' : ''}
                    ${status === 'pending' ? 'bg-muted text-muted-foreground border-border hover:border-primary/50' : ''}
                    ${status === 'empty' ? 'bg-background text-muted-foreground border-dashed border-border' : ''}
                  `}
                  title={`Day ${day}: ${completedTasksCount}/${dayTasks.length} tasks completed`}
                >
                  <span className="text-xs sm:text-sm">{day}</span>
                  {status === 'completed' && (
                    <CheckCircle2 className="h-3 w-3 absolute top-0.5 right-0.5" />
                  )}
                  {status === 'partial' && dayTasks.length > 0 && (
                    <span className="text-[10px] absolute bottom-0.5">
                      {completedTasksCount}/{dayTasks.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border-2 bg-primary border-primary" />
              <span className="text-muted-foreground">All Complete</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border-2 bg-primary/20 border-primary/50" />
              <span className="text-muted-foreground">In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border-2 bg-muted border-border" />
              <span className="text-muted-foreground">Not Started</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={selectedWeek} onValueChange={setSelectedWeek}>
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          {PLAN_STRUCTURE.map((week) => (
            <TabsTrigger key={week.week} value={week.week.toString()}>
              Week {week.week}
            </TabsTrigger>
          ))}
        </TabsList>

        {PLAN_STRUCTURE.map((week) => (
          <TabsContent key={week.week} value={week.week.toString()} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Week {week.week}: {week.theme}
                </CardTitle>
                <CardDescription>
                  Days {week.days} • {week.focus}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {weekTasks.map((task) => (
                    <Card 
                      key={task.id} 
                      id={`day-${task.day_number}`}
                      className={task.completed ? 'bg-muted/50' : ''}
                    >
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={task.completed}
                            onCheckedChange={() => handleToggleTask(task.id, task.completed)}
                            className="mt-1"
                          />
                          <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs">
                                    Day {task.day_number}
                                  </Badge>
                                  <h4 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                                    {task.title}
                                  </h4>
                                </div>
                                {task.description && (
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {task.description}
                                  </p>
                                )}
                              </div>
                              {task.completed && (
                                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                              )}
                            </div>

                            {editingNotes === task.id ? (
                              <div className="space-y-2">
                                <Textarea
                                  value={noteText}
                                  onChange={(e) => setNoteText(e.target.value)}
                                  placeholder="Add your notes here..."
                                  className="min-h-[80px]"
                                />
                                <div className="flex gap-2">
                                  <Button size="sm" onClick={() => handleSaveNotes(task.id)}>
                                    Save Notes
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setEditingNotes(null);
                                      setNoteText('');
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div>
                                {task.notes ? (
                                  <div className="bg-muted p-3 rounded-md text-sm">
                                    <p className="whitespace-pre-wrap">{task.notes}</p>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => startEditingNotes(task)}
                                      className="mt-2"
                                    >
                                      Edit Notes
                                    </Button>
                                  </div>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => startEditingNotes(task)}
                                  >
                                    Add Notes
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
