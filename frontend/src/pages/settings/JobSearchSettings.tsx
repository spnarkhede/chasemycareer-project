import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/db/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Briefcase, Target, TrendingUp, FileText, Save, Loader2, Info } from 'lucide-react';
import { 
  EXPERIENCE_LEVELS, 
  JOB_SEARCH_INTENSITIES, 
  RESUME_FORMATS,
  JOB_ROLES,
  INDUSTRIES 
} from '@/constants/settings';

export default function JobSearchSettings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    target_role: '',
    target_industry: '',
    experience_level: '',
    job_search_intensity: 'moderate',
    resume_format_preference: 'ats_standard',
  });

  useEffect(() => {
    if (user) {
      loadSettings();
    }
  }, [user]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('target_role, target_industry, experience_level, job_search_intensity, resume_format_preference')
        .eq('id', user?.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setFormData({
          target_role: data.target_role || '',
          target_industry: data.target_industry || '',
          experience_level: data.experience_level || '',
          job_search_intensity: data.job_search_intensity || 'moderate',
          resume_format_preference: data.resume_format_preference || 'ats_standard',
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('Failed to load job search settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const { error } = await supabase
        .from('profiles')
        .update({
          target_role: formData.target_role || null,
          target_industry: formData.target_industry || null,
          experience_level: formData.experience_level || null,
          job_search_intensity: formData.job_search_intensity,
          resume_format_preference: formData.resume_format_preference,
        })
        .eq('id', user?.id);

      if (error) throw error;

      toast.success('Job search settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save job search settings');
    } finally {
      setSaving(false);
    }
  };

  const selectedIntensity = JOB_SEARCH_INTENSITIES.find(i => i.value === formData.job_search_intensity);
  const selectedResumeFormat = RESUME_FORMATS.find(r => r.value === formData.resume_format_preference);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-64 bg-muted" />
        <Skeleton className="h-48 bg-muted" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Job Target & Experience
          </CardTitle>
          <CardDescription>
            Define your career goals and experience level
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="target_role">Target Job Role</Label>
            <Select
              value={formData.target_role}
              onValueChange={(value) => setFormData({ ...formData, target_role: value })}
            >
              <SelectTrigger id="target_role">
                <SelectValue placeholder="Select your target role" />
              </SelectTrigger>
              <SelectContent>
                {JOB_ROLES.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              This helps customize daily tasks and interview questions
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="target_industry">Target Industry</Label>
            <Select
              value={formData.target_industry}
              onValueChange={(value) => setFormData({ ...formData, target_industry: value })}
            >
              <SelectTrigger id="target_industry">
                <SelectValue placeholder="Select your target industry" />
              </SelectTrigger>
              <SelectContent>
                {INDUSTRIES.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience_level">Experience Level</Label>
            <Select
              value={formData.experience_level}
              onValueChange={(value) => setFormData({ ...formData, experience_level: value })}
            >
              <SelectTrigger id="experience_level">
                <SelectValue placeholder="Select your experience level" />
              </SelectTrigger>
              <SelectContent>
                {EXPERIENCE_LEVELS.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    <div className="flex flex-col items-start">
                      <span>{level.label}</span>
                      <span className="text-xs text-muted-foreground">{level.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Job Search Intensity
          </CardTitle>
          <CardDescription>
            How actively are you searching for a job?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="job_search_intensity">Search Intensity</Label>
            <Select
              value={formData.job_search_intensity}
              onValueChange={(value) => setFormData({ ...formData, job_search_intensity: value })}
            >
              <SelectTrigger id="job_search_intensity">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {JOB_SEARCH_INTENSITIES.map((intensity) => (
                  <SelectItem key={intensity.value} value={intensity.value}>
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{intensity.label}</span>
                      <span className="text-xs text-muted-foreground">{intensity.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedIntensity && (
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Daily Task Adjustment</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    With <Badge variant="secondary" className="mx-1">{selectedIntensity.label}</Badge> 
                    intensity, you'll receive approximately <strong>{selectedIntensity.tasksPerDay} tasks per day</strong> in your 50-day plan.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Resume Format Preference
          </CardTitle>
          <CardDescription>
            Choose your preferred resume template style
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="resume_format_preference">Resume Format</Label>
            <Select
              value={formData.resume_format_preference}
              onValueChange={(value) => setFormData({ ...formData, resume_format_preference: value })}
            >
              <SelectTrigger id="resume_format_preference">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RESUME_FORMATS.map((format) => (
                  <SelectItem key={format.value} value={format.value}>
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{format.label}</span>
                      <span className="text-xs text-muted-foreground">{format.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedResumeFormat && (
            <div className="p-4 bg-secondary/50 border border-border rounded-lg">
              <div className="space-y-2">
                <p className="text-sm font-medium">About {selectedResumeFormat.label}</p>
                <p className="text-sm text-muted-foreground">{selectedResumeFormat.description}</p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Best for:</span>{' '}
                  <span className="font-medium">{selectedResumeFormat.bestFor}</span>
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
