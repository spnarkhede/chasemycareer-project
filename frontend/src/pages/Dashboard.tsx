import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getAnalytics, getUpcomingInterviews, getDailyTasks } from '@/db/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { DashboardSkeleton } from '@/components/common/DashboardSkeleton';
import { ShareProgress } from '@/components/common/ShareProgress';
import {
  Briefcase,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Users,
  FileText,
  ArrowRight,
  Target,
  Clock,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { format } from 'date-fns';

export default function Dashboard() {
  const { user, isDemoMode } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [analytics, setAnalytics] = useState<any>(null);
  const [upcomingInterviews, setUpcomingInterviews] = useState<any[]>([]);
  const [todayTasks, setTodayTasks] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(false);
      
      // Create timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 10000);
      });

      // Race between data loading and timeout
      const dataPromise = Promise.allSettled([
        getAnalytics(user.id),
        getUpcomingInterviews(user.id),
        getDailyTasks(user.id),
      ]);

      const results = await Promise.race([
        dataPromise,
        timeoutPromise
      ]) as PromiseSettledResult<any>[];

      const [analyticsData, interviews, tasks] = results;

      // Handle analytics data
      if (analyticsData.status === 'fulfilled') {
        setAnalytics(analyticsData.value);
      } else {
        console.error('Error loading analytics:', analyticsData.reason);
        // Set default analytics
        setAnalytics({
          totalApplications: 0,
          completedTasks: 0,
          totalTasks: 0,
          progressPercentage: 0,
          applicationsByStatus: {},
          upcomingInterviews: 0,
          totalContacts: 0,
          recentApplications: []
        });
      }

      // Handle interviews data
      if (interviews.status === 'fulfilled') {
        setUpcomingInterviews(interviews.value || []);
      } else {
        console.error('Error loading interviews:', interviews.reason);
        setUpcomingInterviews([]);
      }

      // Handle tasks data
      if (tasks.status === 'fulfilled') {
        const allTasks = tasks.value || [];
        const completedCount = analyticsData.status === 'fulfilled' 
          ? analyticsData.value.completedTasks 
          : 0;
        const currentDay = Math.min(Math.ceil(completedCount / 2) + 1, 50);
        const tasksForToday = allTasks.filter(t => t.day_number === currentDay);
        setTodayTasks(tasksForToday);
      } else {
        console.error('Error loading tasks:', tasks.reason);
        setTodayTasks([]);
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setError(true);
      // Set default values to prevent infinite loading
      setAnalytics({
        totalApplications: 0,
        completedTasks: 0,
        totalTasks: 0,
        progressPercentage: 0,
        applicationsByStatus: {},
        upcomingInterviews: 0,
        totalContacts: 0,
        recentApplications: []
      });
      setUpcomingInterviews([]);
      setTodayTasks([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <DashboardSkeleton />;
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
                <h3 className="text-lg font-semibold">Failed to Load Dashboard</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  We couldn't load your dashboard data. This might be due to a network issue or timeout.
                </p>
              </div>
              <Button onClick={loadDashboardData} className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentDay = Math.min(Math.ceil((analytics?.completedTasks || 0) / 2) + 1, 50);
  const isNewUser = (analytics?.totalApplications || 0) === 0 && (analytics?.completedTasks || 0) === 0;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Demo mode CTA */}
      {isDemoMode && (
        <Card className="border-primary bg-gradient-to-r from-primary/10 via-primary/5 to-background">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-primary p-3 flex-shrink-0">
                <Target className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="flex-1 space-y-3">
                <h3 className="font-semibold text-xl">You're Exploring Demo Mode 👀</h3>
                <p className="text-muted-foreground">
                  This is sample data showing what your job search journey could look like. 
                  Sign up now to start tracking your real applications, interviews, and progress!
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Link to="/signup">
                    <Button size="lg" className="font-semibold">
                      Sign Up Free - Start Your Journey
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button size="lg" variant="outline">
                      Already Have an Account?
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Onboarding message for new users */}
      {isNewUser && !isDemoMode && (
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-primary/10 p-2 flex-shrink-0">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="font-semibold text-lg">Welcome to Chase My Career! 🎉</h3>
                <p className="text-sm text-muted-foreground">
                  You're about to start your 50-day journey to landing your dream job. Here's how to get started:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                  <li>Check out your <strong>50-Day Plan</strong> to see all the tasks ahead</li>
                  <li>Start with Day 1 tasks to build your job search foundation</li>
                  <li>Track your applications, interviews, and networking contacts</li>
                  <li>Mark tasks as complete to see your progress grow</li>
                </ul>
                <div className="flex gap-2 pt-2">
                  <Link to="/50-day-plan">
                    <Button size="sm">
                      View 50-Day Plan
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/applications">
                    <Button size="sm" variant="outline">
                      Add First Application
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.user_metadata?.full_name?.split(' ')[0] || 'Job Seeker'}!</h1>
          <p className="text-muted-foreground mt-1">
            Day {currentDay} of your 50-day job search journey
          </p>
        </div>
        <Link to="/50-day-plan">
          <Button>
            View Full Plan
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.totalApplications || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Track all your job applications
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics?.completedTasks || 0}/{analytics?.totalTasks || 0}
            </div>
            <Progress value={analytics?.progressPercentage || 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Interviews</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.upcomingInterviews || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Scheduled this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network Contacts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.totalContacts || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Professional connections
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Share Progress Section */}
      {!isDemoMode && analytics && analytics.completedTasks > 0 && (
        <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <h3 className="text-lg font-semibold mb-1">
                  Celebrate Your Progress! 🎉
                </h3>
                <p className="text-sm text-muted-foreground">
                  Share your achievements with your network and inspire others on their career journey
                </p>
              </div>
              <ShareProgress 
                currentDay={currentDay}
                tasksCompleted={analytics.completedTasks}
                applicationsCount={analytics.totalApplications}
              />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Today's Tasks
            </CardTitle>
            <CardDescription>
              Focus on these tasks for Day {currentDay}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {todayTasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No tasks for today. Great job staying on track!</p>
                <Link to="/50-day-plan">
                  <Button variant="link" className="mt-2">
                    View all tasks
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {todayTasks.slice(0, 3).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className={`mt-0.5 ${task.completed ? 'text-primary' : 'text-muted-foreground'}`}>
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {task.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                {todayTasks.length > 3 && (
                  <Link to="/50-day-plan">
                    <Button variant="ghost" className="w-full">
                      View all {todayTasks.length} tasks
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Upcoming Interviews
            </CardTitle>
            <CardDescription>
              Prepare for your scheduled interviews
            </CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingInterviews.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No upcoming interviews scheduled</p>
                <Link to="/interviews">
                  <Button variant="link" className="mt-2">
                    Schedule an interview
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingInterviews.slice(0, 3).map((interview) => (
                  <div
                    key={interview.id}
                    className="p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">
                          {interview.job_applications?.company_name || 'Company'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {interview.interview_type || 'Interview'}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {format(new Date(interview.scheduled_at), 'MMM d')}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {format(new Date(interview.scheduled_at), 'h:mm a')}
                    </p>
                  </div>
                ))}
                {upcomingInterviews.length > 3 && (
                  <Link to="/interviews">
                    <Button variant="ghost" className="w-full">
                      View all interviews
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link to="/job-tracker">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Job Tracker
              </CardTitle>
              <CardDescription>
                Manage your applications and follow-ups
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  {Object.entries(analytics?.applicationsByStatus || {}).map(([status, count]) => (
                    <div key={status} className="flex items-center gap-2 text-sm">
                      <Badge variant="secondary" className="text-xs">
                        {count as number}
                      </Badge>
                      <span className="text-muted-foreground">{status}</span>
                    </div>
                  ))}
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link to="/networking">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Networking
              </CardTitle>
              <CardDescription>
                Build and maintain professional connections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{analytics?.totalContacts || 0}</p>
                  <p className="text-sm text-muted-foreground">Total contacts</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link to="/interview-practice">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Interview Practice
              </CardTitle>
              <CardDescription>
                Prepare with mock interviews and questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Practice makes perfect
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Link>
        </Card>
      </div>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Google Calendar Integration
          </CardTitle>
          <CardDescription>
            Connect your Google Calendar to sync interviews and events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Manage your calendar events with PKCE-secured OAuth
            </p>
            <Link to="/google-calendar">
              <Button>
                Open Calendar
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
