import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useDemoProtection } from '@/hooks/useDemoProtection';
import { getInterviews, getJobApplications, createInterview, updateInterview, deleteInterview } from '@/db/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Plus, Video, MapPin, Clock, ExternalLink, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import type { Interview, JobApplication } from '@/types';

export default function Interviews() {
  const { user } = useAuth();
  const { checkDemoMode } = useDemoProtection();
  const [loading, setLoading] = useState(true);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingInterview, setEditingInterview] = useState<Interview | null>(null);
  const [formData, setFormData] = useState({
    application_id: '',
    interview_type: '',
    scheduled_at: '',
    duration_minutes: 60,
    interviewer_name: '',
    interviewer_email: '',
    meeting_link: '',
    location: '',
    notes: '',
  });

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const [interviewsData, appsData] = await Promise.all([
        getInterviews(user.id),
        getJobApplications(user.id),
      ]);
      setInterviews(interviewsData);
      setApplications(appsData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load interviews');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (checkDemoMode(editingInterview ? 'update interviews' : 'schedule interviews')) return;

    try {
      if (editingInterview) {
        await updateInterview(editingInterview.id, formData);
        toast.success('Interview updated successfully');
      } else {
        await createInterview({ ...formData, user_id: user.id });
        toast.success('Interview scheduled successfully');
      }

      await loadData();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving interview:', error);
      toast.error('Failed to save interview');
    }
  };

  const handleDelete = async (id: string) => {
    if (checkDemoMode('delete interviews')) return;
    if (!confirm('Are you sure you want to delete this interview?')) return;

    try {
      await deleteInterview(id);
      toast.success('Interview deleted');
      await loadData();
    } catch (error) {
      console.error('Error deleting interview:', error);
      toast.error('Failed to delete interview');
    }
  };

  const handleEdit = (interview: any) => {
    setEditingInterview(interview);
    setFormData({
      application_id: interview.application_id || '',
      interview_type: interview.interview_type || '',
      scheduled_at: interview.scheduled_at ? new Date(interview.scheduled_at).toISOString().slice(0, 16) : '',
      duration_minutes: interview.duration_minutes || 60,
      interviewer_name: interview.interviewer_name || '',
      interviewer_email: interview.interviewer_email || '',
      meeting_link: interview.meeting_link || '',
      location: interview.location || '',
      notes: interview.notes || '',
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingInterview(null);
    setFormData({
      application_id: '',
      interview_type: '',
      scheduled_at: '',
      duration_minutes: 60,
      interviewer_name: '',
      interviewer_email: '',
      meeting_link: '',
      location: '',
      notes: '',
    });
  };

  const upcomingInterviews = interviews.filter(i => !i.completed && new Date(i.scheduled_at) >= new Date());
  const pastInterviews = interviews.filter(i => i.completed || new Date(i.scheduled_at) < new Date());

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-12 w-64 bg-muted" />
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-48 bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Calendar className="h-8 w-8" />
            Interview Schedule
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your interview appointments
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingInterview(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Schedule Interview
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingInterview ? 'Edit Interview' : 'Schedule New Interview'}</DialogTitle>
              <DialogDescription>
                {editingInterview ? 'Update interview details' : 'Add a new interview to your calendar'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="application_id">Related Application</Label>
                <Select
                  value={formData.application_id}
                  onValueChange={(value) => setFormData({ ...formData, application_id: value })}
                >
                  <SelectTrigger id="application_id">
                    <SelectValue placeholder="Select an application (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {applications.map((app) => (
                      <SelectItem key={app.id} value={app.id}>
                        {app.company_name} - {app.job_title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="interview_type">Interview Type *</Label>
                  <Select
                    value={formData.interview_type}
                    onValueChange={(value) => setFormData({ ...formData, interview_type: value })}
                    required
                  >
                    <SelectTrigger id="interview_type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Phone">Phone Screen</SelectItem>
                      <SelectItem value="Video">Video Call</SelectItem>
                      <SelectItem value="Onsite">On-site</SelectItem>
                      <SelectItem value="Technical">Technical Interview</SelectItem>
                      <SelectItem value="Behavioral">Behavioral Interview</SelectItem>
                      <SelectItem value="Final">Final Round</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration_minutes">Duration (minutes)</Label>
                  <Input
                    id="duration_minutes"
                    type="number"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
                    min="15"
                    step="15"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="scheduled_at">Date & Time *</Label>
                <Input
                  id="scheduled_at"
                  type="datetime-local"
                  value={formData.scheduled_at}
                  onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="interviewer_name">Interviewer Name</Label>
                  <Input
                    id="interviewer_name"
                    value={formData.interviewer_name}
                    onChange={(e) => setFormData({ ...formData, interviewer_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interviewer_email">Interviewer Email</Label>
                  <Input
                    id="interviewer_email"
                    type="email"
                    value={formData.interviewer_email}
                    onChange={(e) => setFormData({ ...formData, interviewer_email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="meeting_link">Meeting Link (for video calls)</Label>
                <Input
                  id="meeting_link"
                  type="url"
                  value={formData.meeting_link}
                  onChange={(e) => setFormData({ ...formData, meeting_link: e.target.value })}
                  placeholder="https://zoom.us/..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Standort (für Vor-Ort-Termine)</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="z.B. Frankfurt, Hessen, Deutschland"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Preparation notes, topics to discuss, etc."
                  className="min-h-[100px]"
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingInterview ? 'Update Interview' : 'Schedule Interview'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-4">Upcoming Interviews</h2>
          {upcomingInterviews.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">No upcoming interviews</p>
                <p className="text-muted-foreground mb-4">Schedule your interviews here</p>
                <Button onClick={() => setDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Schedule Interview
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {upcomingInterviews.map((interview) => (
                <Card key={interview.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg">
                          {interview.job_applications?.company_name || 'Interview'}
                        </CardTitle>
                        <CardDescription>
                          {interview.job_applications?.job_title || interview.interview_type}
                        </CardDescription>
                      </div>
                      <Badge>{interview.interview_type}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {format(new Date(interview.scheduled_at), 'EEEE, MMMM d, yyyy')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {format(new Date(interview.scheduled_at), 'h:mm a')} ({interview.duration_minutes} min)
                    </div>
                    {interview.interviewer_name && (
                      <p className="text-sm text-muted-foreground">
                        With: {interview.interviewer_name}
                      </p>
                    )}
                    {interview.meeting_link && (
                      <div className="flex items-center gap-2 text-sm">
                        <Video className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={interview.meeting_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Join Meeting
                        </a>
                      </div>
                    )}
                    {interview.location && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {interview.location}
                      </div>
                    )}
                    {interview.notes && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                        {interview.notes}
                      </p>
                    )}
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(interview)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(interview.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {pastInterviews.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Past Interviews</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {pastInterviews.map((interview) => (
                <Card key={interview.id} className="opacity-75">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg">
                          {interview.job_applications?.company_name || 'Interview'}
                        </CardTitle>
                        <CardDescription>
                          {interview.job_applications?.job_title || interview.interview_type}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">{interview.interview_type}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(interview.scheduled_at), 'MMM d, yyyy')}
                    </div>
                    {interview.notes && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {interview.notes}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
