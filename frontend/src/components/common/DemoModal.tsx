import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Target,
  Calendar,
  TrendingUp,
  CheckCircle2,
  Users,
  BookOpen,
  Briefcase,
  MessageSquare,
  Award,
  Zap,
  Lock,
  Eye,
  Loader2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { supabase } from '@/db/supabase';
import { toast } from 'sonner';

interface DemoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DemoModal({ open, onOpenChange }: DemoModalProps) {
  const navigate = useNavigate();
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  const handleTryDemo = async () => {
    setIsDemoLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: 'demo@chasemycareer.de',
        password: 'DemoUser2024!',
      });

      if (error) {
        toast.error('Demo mode is currently unavailable. Please try again later.');
        console.error('Demo login error:', error);
      } else {
        toast.success('Welcome to demo mode!');
        onOpenChange(false);
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error('Failed to load demo. Please try again.');
      console.error('Demo login exception:', err);
    } finally {
      setIsDemoLoading(false);
    }
  };

  const handleSignUp = () => {
    onOpenChange(false);
    navigate('/signup');
  };

  const features = [
    {
      icon: Calendar,
      title: '50-Day Structured Program',
      description: 'Follow a proven day-by-day plan designed by career experts',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: Lock,
      title: 'Sequential Learning',
      description: 'Complete each day in order to build skills progressively',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      icon: BookOpen,
      title: 'Actionable Tasks',
      description: 'Clear, step-by-step instructions for every activity',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description: 'Monitor your advancement and celebrate milestones',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      icon: Briefcase,
      title: 'Job Application Tools',
      description: 'Track applications, interviews, and networking contacts',
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10',
    },
    {
      icon: MessageSquare,
      title: 'Interview Practice',
      description: 'Prepare with STAR stories and behavioral questions',
      color: 'text-pink-500',
      bgColor: 'bg-pink-500/10',
    },
  ];

  const programHighlights = [
    { week: 'Week 1-2', focus: 'Foundation & Resume Building', icon: Target },
    { week: 'Week 3-4', focus: 'LinkedIn & Online Presence', icon: Users },
    { week: 'Week 5-6', focus: 'Networking & Outreach', icon: MessageSquare },
    { week: 'Week 7-8', focus: 'Applications & Follow-ups', icon: Briefcase },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <DialogTitle className="text-2xl">Chase My Career - Tool Overview</DialogTitle>
          </div>
          <DialogDescription className="text-base">
            Your comprehensive 50-day job search program with structured guidance and proven strategies
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Hero Section */}
          <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">Transform Your Job Search Journey</h3>
                  <p className="text-muted-foreground mb-4">
                    Chase My Career is a comprehensive career development platform that guides you through
                    a structured 50-day program. Each day includes actionable tasks, expert resources, and
                    proven strategies to help you land your dream role.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Structured Learning
                    </Badge>
                    <Badge variant="secondary" className="gap-1">
                      <Award className="w-3 h-3" />
                      Expert Guidance
                    </Badge>
                    <Badge variant="secondary" className="gap-1">
                      <Zap className="w-3 h-3" />
                      Proven Results
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Features Grid */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Key Features
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <Card key={index} className="border hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 ${feature.bgColor} rounded-lg`}>
                        <feature.icon className={`w-5 h-5 ${feature.color}`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{feature.title}</h4>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Program Structure */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Program Structure
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {programHighlights.map((highlight, index) => (
                <Card key={index} className="border-2">
                  <CardContent className="p-4 text-center">
                    <div className="flex justify-center mb-2">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <highlight.icon className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                    <p className="font-semibold text-sm mb-1">{highlight.week}</p>
                    <p className="text-xs text-muted-foreground">{highlight.focus}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* What You'll Get */}
          <Card className="bg-muted/50">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                What You'll Get
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <p className="text-sm">Daily actionable tasks with clear instructions</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <p className="text-sm">Resume and LinkedIn optimization guides</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <p className="text-sm">Networking templates and outreach strategies</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <p className="text-sm">Interview preparation and practice tools</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <p className="text-sm">Job application tracking system</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <p className="text-sm">Progress tracking and milestone celebrations</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <p className="text-sm">Company research and targeting tools</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <p className="text-sm">Salary negotiation and follow-up guides</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How It Works */}
          <Card className="border-2 border-primary/20">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                How It Works
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-semibold">Start Your Journey</p>
                    <p className="text-sm text-muted-foreground">
                      Sign up and complete the onboarding to set your career goals
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-semibold">Follow Daily Tasks</p>
                    <p className="text-sm text-muted-foreground">
                      Complete structured activities each day, building skills progressively
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-semibold">Track Your Progress</p>
                    <p className="text-sm text-muted-foreground">
                      Monitor applications, interviews, and networking activities in one place
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <p className="font-semibold">Land Your Dream Job</p>
                    <p className="text-sm text-muted-foreground">
                      Complete the 50-day program and celebrate your success!
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              size="lg"
              onClick={handleTryDemo}
              disabled={isDemoLoading}
              className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              {isDemoLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Loading Demo...
                </>
              ) : (
                <>
                  <Eye className="w-5 h-5 mr-2" />
                  Try Interactive Demo
                </>
              )}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleSignUp}
              className="flex-1 border-2"
            >
              <Zap className="w-5 h-5 mr-2" />
              Sign Up Free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            The demo account includes sample data to help you explore all features. 
            Sign up to start your personalized 50-day career journey!
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
