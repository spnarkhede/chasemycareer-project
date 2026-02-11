import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { createOrUpdateOnboarding } from '@/db/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Briefcase, MapPin, DollarSign, Building2, TrendingUp, Home } from 'lucide-react';

export default function Onboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    target_role: '',
    target_industry: '',
    experience_level: '',
    location_preference: '',
    work_type: '',
    salary_expectation: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      await createOrUpdateOnboarding(user.id, formData);
      toast.success('Profile setup complete! Let\'s start your job search journey.');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving onboarding:', error);
      toast.error('Failed to save your preferences. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Briefcase className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">Welcome to Chase My Career!</CardTitle>
          <CardDescription className="text-base">
            Let's personalize your 50-day job search plan. Tell us about your career goals.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="target_role" className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Target Role *
              </Label>
              <Input
                id="target_role"
                placeholder="e.g., Software Engineer, Product Manager"
                value={formData.target_role}
                onChange={(e) => updateField('target_role', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="target_industry" className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Target Industry *
              </Label>
              <Input
                id="target_industry"
                placeholder="e.g., Technology, Healthcare, Finance"
                value={formData.target_industry}
                onChange={(e) => updateField('target_industry', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience_level" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Experience Level *
              </Label>
              <Select
                value={formData.experience_level}
                onValueChange={(value) => updateField('experience_level', value)}
                required
              >
                <SelectTrigger id="experience_level">
                  <SelectValue placeholder="Select your experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                  <SelectItem value="mid">Mid Level (3-5 years)</SelectItem>
                  <SelectItem value="senior">Senior Level (6-10 years)</SelectItem>
                  <SelectItem value="lead">Lead/Principal (10+ years)</SelectItem>
                  <SelectItem value="executive">Executive/C-Level</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location_preference" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Standortpräferenz
              </Label>
              <Input
                id="location_preference"
                placeholder="z.B. Stuttgart, Deutschland oder Überall"
                value={formData.location_preference}
                onChange={(e) => updateField('location_preference', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="work_type" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                Work Type Preference *
              </Label>
              <Select
                value={formData.work_type}
                onValueChange={(value) => updateField('work_type', value)}
                required
              >
                <SelectTrigger id="work_type">
                  <SelectValue placeholder="Select work type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                  <SelectItem value="onsite">On-site</SelectItem>
                  <SelectItem value="flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="salary_expectation" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Salary Expectation
              </Label>
              <Input
                id="salary_expectation"
                placeholder="e.g., $80,000 - $100,000"
                value={formData.salary_expectation}
                onChange={(e) => updateField('salary_expectation', e.target.value)}
              />
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={loading}
              >
                {loading ? 'Setting up your plan...' : 'Start My 50-Day Journey'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
