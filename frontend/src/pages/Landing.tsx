import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Calendar, TrendingUp, CheckCircle2, Trophy, Lock, Zap, Eye, Users, Award } from 'lucide-react';
import { supabase } from '@/db/supabase';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { LoadingMessage } from '@/components/ui/loading-message';
import { DemoModal } from '@/components/common/DemoModal';

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTasksCompleted: 0,
    completedThisMonth: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchGlobalStats();
  }, []);

  const fetchGlobalStats = async () => {
    try {
      setStatsLoading(true);
      
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      const { data: tasksData } = await supabase
        .from('task_completions')
        .select('id');

      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data: progressData } = await supabase
        .from('user_progress')
        .select('current_day')
        .gte('last_activity', startOfMonth.toISOString())
        .eq('current_day', 50);

      setStats({
        totalUsers: userCount || 0,
        totalTasksCompleted: tasksData?.length || 0,
        completedThisMonth: progressData?.length || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleGetStarted = () => {
    navigate('/login');
  };

  const handleViewDemo = () => {
    setIsDemoModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <img 
              src="https://miaoda-site-img.s3cdn.medo.dev/images/0e4dc2bc-7476-4d13-acfa-22f42794875a.jpg" 
              alt="Chase My Career Logo" 
              className="w-20 h-20 rounded-lg object-cover shadow-lg"
            />
            <div>
              <h1 className="text-5xl xl:text-6xl font-bold flex items-center gap-3">
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Chase My Career
                </span>
                <Target className="w-10 h-10 text-primary" />
              </h1>
              <p className="text-xl text-muted-foreground mt-2">
                Your 50-Day Career Chase
              </p>
            </div>
          </div>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Transform your job search with our structured 50-day program. Each day includes actionable tasks, 
            step-by-step instructions, and expert resources to help you land your dream role.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              <Zap className="w-5 h-5 mr-2" />
              Get Started Free
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              onClick={handleViewDemo}
              className="text-lg px-8 py-6 border-2"
            >
              <Eye className="w-5 h-5 mr-2" />
              View Demo
            </Button>
          </div>
        </div>

        {/* Global Statistics Section */}
        <div className="mb-16">
          <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 via-background to-accent/5">
            <CardContent className="p-8">
              {statsLoading ? (
                <div className="flex justify-center py-8">
                  <LoadingMessage message="Loading community stats..." size="lg" />
                </div>
              ) : (
                <div className="grid md:grid-cols-3 gap-8 text-center">
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Users className="w-6 h-6 text-primary" />
                      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                        Active Users
                      </h3>
                    </div>
                    <div className="text-4xl font-bold text-primary">
                      <AnimatedCounter value={stats.totalUsers} suffix="+" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Job seekers on their journey
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <CheckCircle2 className="w-6 h-6 text-primary" />
                      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                        Tasks Completed
                      </h3>
                    </div>
                    <div className="text-4xl font-bold text-primary">
                      <AnimatedCounter value={stats.totalTasksCompleted} suffix="+" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Collective progress made
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Award className="w-6 h-6 text-primary" />
                      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                        Completed This Month
                      </h3>
                    </div>
                    <div className="text-4xl font-bold text-primary">
                      <AnimatedCounter value={stats.completedThisMonth} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Users finished the program
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="border-2 hover:border-primary transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">50-Day Structure</h3>
              </div>
              <p className="text-muted-foreground">
                Follow a proven day-by-day plan that covers resume building, networking, 
                interview prep, and more.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Lock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Sequential Progress</h3>
              </div>
              <p className="text-muted-foreground">
                Complete each day in order to unlock the next. Build skills progressively 
                without skipping ahead.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Track Progress</h3>
              </div>
              <p className="text-muted-foreground">
                Mark days complete, track your progress, and celebrate milestones 
                as you advance through the program.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* What You'll Learn */}
        <div className="bg-muted/50 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">What You'll Learn</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Resume & LinkedIn Optimization</h3>
                <p className="text-sm text-muted-foreground">
                  Build a compelling resume with quantified achievements and optimize your LinkedIn profile for maximum visibility.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Strategic Networking</h3>
                <p className="text-sm text-muted-foreground">
                  Master personalized outreach, build meaningful connections, and develop effective networking templates.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Interview Preparation</h3>
                <p className="text-sm text-muted-foreground">
                  Practice STAR stories, prepare for behavioral questions, and develop confidence for any interview.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Company Research & Targeting</h3>
                <p className="text-sm text-muted-foreground">
                  Create a focused company list, identify hiring managers, and research target organizations deeply.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Application Strategy</h3>
                <p className="text-sm text-muted-foreground">
                  Learn how to tailor applications, beat ATS systems, and stand out from other candidates.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Negotiation & Follow-up</h3>
                <p className="text-sm text-muted-foreground">
                  Master salary negotiation, write effective follow-up emails, and close the deal on your terms.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-8">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="font-semibold mb-2">Sign Up Free</h3>
              <p className="text-sm text-muted-foreground">
                Create your account with Google in seconds
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="font-semibold mb-2">Start Day 1</h3>
              <p className="text-sm text-muted-foreground">
                Begin with resume building and self-assessment
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="font-semibold mb-2">Complete Daily Tasks</h3>
              <p className="text-sm text-muted-foreground">
                Follow step-by-step instructions each day
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Trophy className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Land Your Dream Job</h3>
              <p className="text-sm text-muted-foreground">
                Celebrate your success after 50 days
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Chase Your Career?</h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join thousands of job seekers who have transformed their career search with our proven 50-day program.
          </p>
          <Button 
            size="lg" 
            onClick={handleGetStarted}
            className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-accent hover:opacity-90"
          >
            <Zap className="w-5 h-5 mr-2" />
            Start Your Journey Today
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            No credit card required • Free forever
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>2025 Chase My Career • <a href="https://chasemycareer.de" className="hover:text-primary">chasemycareer.de</a></p>
        </div>
      </footer>

      {/* Demo Modal */}
      <DemoModal open={isDemoModalOpen} onOpenChange={setIsDemoModalOpen} />
    </div>
  );
}
