import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getInterviewQuestions, createInterviewPracticeSession } from '@/db/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Play, RotateCcw, ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import type { InterviewQuestion } from '@/types';

export default function InterviewPractice() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [practiceMode, setPracticeMode] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const data = await getInterviewQuestions();
      setQuestions(data);
    } catch (error) {
      console.error('Error loading questions:', error);
      toast.error('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const startPractice = () => {
    setPracticeMode(true);
    setCurrentQuestionIndex(0);
    setShowAnswer(false);
    setAnsweredCount(0);
    setStartTime(new Date());
  };

  const endPractice = async () => {
    if (!user || !startTime) return;

    const duration = Math.round((new Date().getTime() - startTime.getTime()) / 60000);

    try {
      await createInterviewPracticeSession({
        user_id: user.id,
        duration_minutes: duration,
        questions_answered: answeredCount,
        notes: `Practiced ${answeredCount} questions in ${duration} minutes`,
      });
      toast.success('Practice session saved!');
    } catch (error) {
      console.error('Error saving session:', error);
    }

    setPracticeMode(false);
    setCurrentQuestionIndex(0);
    setShowAnswer(false);
    setAnsweredCount(0);
    setStartTime(null);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowAnswer(false);
      if (showAnswer) {
        setAnsweredCount(prev => prev + 1);
      }
    } else {
      endPractice();
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setShowAnswer(false);
    }
  };

  const filteredQuestions = selectedCategory === 'all'
    ? questions
    : questions.filter(q => q.category === selectedCategory);

  const categories = ['Behavioral', 'Technical', 'Situational'];

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-12 w-64 bg-muted" />
        <Skeleton className="h-96 bg-muted" />
      </div>
    );
  }

  if (practiceMode) {
    const currentQuestion = filteredQuestions[currentQuestionIndex];

    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Mock Interview Practice</h2>
              <p className="text-muted-foreground">
                Question {currentQuestionIndex + 1} of {filteredQuestions.length}
              </p>
            </div>
            <Button variant="outline" onClick={endPractice}>
              End Practice
            </Button>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge>{currentQuestion.category}</Badge>
                <Badge variant="outline">{currentQuestion.difficulty}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">{currentQuestion.question}</h3>
              </div>

              {!showAnswer ? (
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Take a moment to think about your answer. When you're ready, click below to see a sample answer.
                  </p>
                  <Button onClick={() => setShowAnswer(true)}>
                    Show Sample Answer
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Sample Answer:</h4>
                    <p className="text-sm whitespace-pre-wrap">{currentQuestion.sample_answer}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Use this as a guide to structure your own answer</span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={previousQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button onClick={nextQuestion}>
                  {currentQuestionIndex === filteredQuestions.length - 1 ? 'Finish' : 'Next'}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="h-8 w-8" />
            Interview Practice
          </h1>
          <p className="text-muted-foreground mt-1">
            Practice with common interview questions
          </p>
        </div>
        <Button onClick={startPractice} size="lg">
          <Play className="mr-2 h-4 w-4" />
          Start Practice Session
        </Button>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList>
          <TabsTrigger value="all">All Questions ({questions.length})</TabsTrigger>
          {categories.map(cat => (
            <TabsTrigger key={cat} value={cat}>
              {cat} ({questions.filter(q => q.category === cat).length})
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="space-y-4">
          <div className="grid gap-4">
            {filteredQuestions.map((question, index) => (
              <Card key={question.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{question.category}</Badge>
                        <Badge variant="secondary">{question.difficulty}</Badge>
                      </div>
                      <CardTitle className="text-lg">{question.question}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                {question.sample_answer && (
                  <CardContent>
                    <details className="cursor-pointer">
                      <summary className="font-medium text-sm text-muted-foreground hover:text-foreground">
                        View sample answer
                      </summary>
                      <p className="mt-3 text-sm whitespace-pre-wrap bg-muted p-3 rounded-md">
                        {question.sample_answer}
                      </p>
                    </details>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
