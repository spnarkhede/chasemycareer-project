import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Trophy, Star, CheckCircle2, ArrowLeft, RotateCcw, TrendingUp, Target, Users, Briefcase, FileText, Linkedin, MessageSquare, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useProgress } from '@/hooks/use-progress';
import { useToast } from '@/hooks/use-toast';

export default function Congratulations() {
  const navigate = useNavigate();
  const { completionCount, resetProgress } = useProgress();
  const { toast } = useToast();

  // Check if all 50 days are completed
  const allDaysCompleted = completionCount === 50;

  // Redirect if not all days are completed
  useEffect(() => {
    if (!allDaysCompleted) {
      toast({
        title: 'Congratulations Page Locked',
        description: `Complete all 50 days to unlock this page. You have completed ${completionCount}/50 days.`,
        variant: 'destructive',
      });
      navigate('/');
    }
  }, [allDaysCompleted, completionCount, navigate, toast]);

  // Show loading state while checking completion
  if (!allDaysCompleted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Lock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-2">Congratulations Page Locked</h1>
          <p className="text-muted-foreground mb-4">
            Complete all 50 days to unlock this page
          </p>
          <p className="text-sm text-muted-foreground">
            Progress: {completionCount}/50 days
          </p>
        </div>
      </div>
    );
  }

  const handleResetAndRestart = () => {
    if (window.confirm('Are you sure you want to reset your progress and start over?')) {
      resetProgress();
      navigate('/');
    }
  };

  const learningCategories = [
    {
      icon: FileText,
      title: 'Resume Mastery',
      description: 'Transformed your resume with quantified achievements, ATS optimization, and compelling bullet points.',
      days: 'Days 1-7',
      color: 'text-blue-500',
    },
    {
      icon: Linkedin,
      title: 'LinkedIn Excellence',
      description: 'Built a powerful LinkedIn profile with keyword-rich headline, compelling About section, and strategic recommendations.',
      days: 'Days 8-13',
      color: 'text-cyan-500',
    },
    {
      icon: Target,
      title: 'Strategic Targeting',
      description: 'Created a focused company list, identified hiring managers, and researched target organizations deeply.',
      days: 'Days 15-16, 20',
      color: 'text-purple-500',
    },
    {
      icon: Users,
      title: 'Networking Skills',
      description: 'Mastered personalized outreach, built meaningful connections, and developed effective networking templates.',
      days: 'Days 17-19',
      color: 'text-green-500',
    },
    {
      icon: MessageSquare,
      title: 'Interview Preparation',
      description: 'Perfected your pitch, crafted STAR stories, and practiced behavioral questions with confidence.',
      days: 'Days 22-24',
      color: 'text-orange-500',
    },
    {
      icon: Briefcase,
      title: 'Professional Portfolio',
      description: 'Updated work samples, built a sustainable job search routine, and developed ongoing growth strategies.',
      days: 'Days 25-30',
      color: 'text-pink-500',
    },
  ];

  const keyAchievements = [
    'Built a results-focused, ATS-optimized resume',
    'Created a compelling LinkedIn profile that attracts recruiters',
    'Developed a strategic list of 40+ target companies',
    'Mastered networking and personalized outreach',
    'Prepared 6+ STAR stories for behavioral interviews',
    'Practiced your 60-second elevator pitch',
    'Created reusable templates for efficient outreach',
    'Established a sustainable weekly job search routine',
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Calendar
        </Button>

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full mb-6 animate-bounce">
            <Trophy className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl xl:text-5xl font-bold mb-4">
            🎉 Congratulations! 🎉
          </h1>
          <p className="text-xl text-muted-foreground mb-2">
            You've completed the Chase My Career 50-Day Program!
          </p>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge variant="default" className="text-lg px-4 py-2">
              <CheckCircle2 className="w-5 h-5 mr-2" />
              {completionCount} Days Completed
            </Badge>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            You've invested significant time and effort into transforming your job search strategy. 
            This achievement demonstrates your commitment to professional growth and career success.
          </p>
        </div>

        <Separator className="my-8" />

        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Star className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">What You've Learned</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {learningCategories.map((category, index) => (
              <Card key={index} className="border-l-4 border-l-primary">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg bg-accent/50 ${category.color}`}>
                      <category.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">{category.title}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {category.days}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Separator className="my-8" />

        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Your Key Achievements</h2>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-3">
                {keyAchievements.map((achievement, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{achievement}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-8" />

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">What's Next?</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="bg-accent/50">
              <CardHeader>
                <CardTitle className="text-lg">Continue Applying</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Maintain your weekly routine: 5-10 quality applications, 3-5 networking touches, and ongoing interview prep.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-accent/50">
              <CardHeader>
                <CardTitle className="text-lg">Keep Learning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Continue developing skills, taking courses, and staying current with industry trends and tools.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-accent/50">
              <CardHeader>
                <CardTitle className="text-lg">Stay Connected</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Nurture your network, engage on LinkedIn, and maintain relationships with new connections.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-8 text-center mb-8">
          <h3 className="text-2xl font-bold mb-3">Remember</h3>
          <p className="text-lg text-muted-foreground mb-4 max-w-2xl mx-auto">
            Job searching is a marathon, not a sprint. You've built a strong foundation. 
            Stay consistent, stay positive, and trust the process. Your next opportunity is closer than you think!
          </p>
          <div className="flex items-center justify-center gap-2 text-primary">
            <Star className="w-5 h-5 fill-current" />
            <Star className="w-5 h-5 fill-current" />
            <Star className="w-5 h-5 fill-current" />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            onClick={() => navigate('/')}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Review Your Journey
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={handleResetAndRestart}
            className="w-full sm:w-auto"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Start Fresh Journey
          </Button>
        </div>

        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>You've completed all 50 days. We're proud of your dedication! 🌟</p>
        </div>
      </div>
    </div>
  );
}
