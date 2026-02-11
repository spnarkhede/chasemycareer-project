import { useNavigate } from 'react-router-dom';
import { Calendar, TrendingUp, RotateCcw, Trophy, Target } from 'lucide-react';
import { CalendarGrid } from '@/components/calendar/CalendarGrid';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useProgress } from '@/hooks/use-progress';
import { jobSearchData } from '@/data/jobSearchData';
import type { DayContent } from '@/types';

export default function JobSearchCalendar() {
  const navigate = useNavigate();
  const { completedDays, resetProgress, completionCount } = useProgress();

  const handleDayClick = (day: DayContent) => {
    navigate(`/day/${day.dayNumber}`);
  };

  const handleCongratulationsClick = () => {
    navigate('/congratulations');
  };

  const progressPercentage = (completionCount / 50) * 100;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img 
                  src="https://miaoda-site-img.s3cdn.medo.dev/images/0e4dc2bc-7476-4d13-acfa-22f42794875a.jpg" 
                  alt="Chase My Career Logo" 
                  className="w-16 h-16 rounded-lg object-cover shadow-lg"
                />
              </div>
              <div>
                <h1 className="text-3xl xl:text-4xl font-bold flex items-center gap-2">
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Chase My Career
                  </span>
                  <Target className="w-7 h-7 text-primary" />
                </h1>
                <p className="text-muted-foreground text-sm xl:text-base mt-1">
                  Your 50-Day Career Chase
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={resetProgress}
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Progress
            </Button>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <span className="font-semibold">Your Progress</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {completionCount} of 50 days completed
                </span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              <p className="text-xs text-muted-foreground mt-2">
                {completionCount === 50
                  ? '🎉 Congratulations! You\'ve completed the 50-day program!'
                  : `Keep going! ${50 - completionCount} days remaining.`}
              </p>
              {completionCount === 50 && (
                <Button
                  onClick={() => navigate('/congratulations')}
                  className="w-full mt-4 bg-gradient-to-r from-primary to-accent"
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  View Your Achievements
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Your 50-Day Journey</h2>
          <p className="text-muted-foreground text-sm">
            Click on any day to view detailed tasks, instructions, and resources. Mark days as complete to track your progress.
          </p>
        </div>

        <CalendarGrid
          days={jobSearchData}
          completedDays={completedDays}
          onDayClick={handleDayClick}
          onCongratulationsClick={handleCongratulationsClick}
        />

        <div className="mt-12 p-6 bg-muted/50 rounded-lg border">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-lg">About Chase My Career</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Chase My Career is your structured 50-day program to transform your job search. Each day includes actionable tasks, step-by-step instructions, and expert resources to help you land your dream role. Visit us at <strong>chasemycareer.de</strong>
          </p>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <p className="mb-2">
                <strong className="text-foreground">Week 1-2:</strong> Build your foundation with resume optimization, LinkedIn profile enhancement, and self-assessment.
              </p>
              <p>
                <strong className="text-foreground">Week 3-4:</strong> Active networking, company research, and strategic outreach to hiring managers and alumni.
              </p>
            </div>
            <div>
              <p className="mb-2">
                <strong className="text-foreground">Week 5-6:</strong> Interview preparation, portfolio updates, and practicing your pitch and STAR stories.
              </p>
              <p>
                <strong className="text-foreground">Week 7+:</strong> Advanced strategies, skill development, and maintaining momentum in your job search.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
