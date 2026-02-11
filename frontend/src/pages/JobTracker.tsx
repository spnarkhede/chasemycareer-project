import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useDemoProtection } from '@/hooks/useDemoProtection';
import { getJobApplications, createJobApplication, updateJobApplication, deleteJobApplication } from '@/db/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Briefcase, Plus, ExternalLink, Calendar, DollarSign, MapPin, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import type { JobApplication, ApplicationStatus } from '@/types';

const STATUS_COLORS: Record<ApplicationStatus, string> = {
  Applied: 'bg-blue-500/10 text-blue-700 border-blue-200',
  Screening: 'bg-yellow-500/10 text-yellow-700 border-yellow-200',
  Interview: 'bg-purple-500/10 text-purple-700 border-purple-200',
  Offer: 'bg-green-500/10 text-green-700 border-green-200',
  Rejected: 'bg-red-500/10 text-red-700 border-red-200',
  Withdrawn: 'bg-gray-500/10 text-gray-700 border-gray-200',
};

export default function JobTracker() {
  const { user } = useAuth();
  const { checkDemoMode } = useDemoProtection();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<JobApplication | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | 'all'>('all');
  const [formData, setFormData] = useState({
    company_name: '',
    job_title: '',
    job_url: '',
    status: 'Applied' as ApplicationStatus,
    applied_date: new Date().toISOString().split('T')[0],
    salary_range: '',
    location: '',
    notes: '',
    follow_up_date: '',
  });

  useEffect(() => {
    if (user) {
      loadApplications();
    }
  }, [user]);

  const loadApplications = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await getJobApplications(user.id);
      setApplications(data);
    } catch (error) {
      console.error('Error loading applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (checkDemoMode(editingApp ? 'update applications' : 'add applications')) return;

    try {
      if (editingApp) {
        await updateJobApplication(editingApp.id, formData);
        toast.success('Application updated successfully');
      } else {
        await createJobApplication({ ...formData, user_id: user.id });
        toast.success('Application added successfully');
      }

      await loadApplications();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving application:', error);
      toast.error('Failed to save application');
    }
  };

  const handleDelete = async (id: string) => {
    if (checkDemoMode('delete applications')) return;
    if (!confirm('Are you sure you want to delete this application?')) return;

    try {
      await deleteJobApplication(id);
      toast.success('Application deleted');
      await loadApplications();
    } catch (error) {
      console.error('Error deleting application:', error);
      toast.error('Failed to delete application');
    }
  };

  const handleEdit = (app: JobApplication) => {
    setEditingApp(app);
    setFormData({
      company_name: app.company_name,
      job_title: app.job_title,
      job_url: app.job_url || '',
      status: app.status,
      applied_date: app.applied_date || new Date().toISOString().split('T')[0],
      salary_range: app.salary_range || '',
      location: app.location || '',
      notes: app.notes || '',
      follow_up_date: app.follow_up_date || '',
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingApp(null);
    setFormData({
      company_name: '',
      job_title: '',
      job_url: '',
      status: 'Applied',
      applied_date: new Date().toISOString().split('T')[0],
      salary_range: '',
      location: '',
      notes: '',
      follow_up_date: '',
    });
  };

  const filteredApplications = selectedStatus === 'all'
    ? applications
    : applications.filter(app => app.status === selectedStatus);

  const statusCounts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {} as Record<ApplicationStatus, number>);

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-12 w-64 bg-muted" />
        <div className="grid gap-4 md:grid-cols-3">
          {[...Array(6)].map((_, i) => (
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
            <Briefcase className="h-8 w-8" />
            Job Application Tracker
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all your job applications
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingApp(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Application
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingApp ? 'Edit Application' : 'Add New Application'}</DialogTitle>
              <DialogDescription>
                {editingApp ? 'Update the details of your job application' : 'Track a new job application'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="company_name">Company Name *</Label>
                  <Input
                    id="company_name"
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="job_title">Job Title *</Label>
                  <Input
                    id="job_title"
                    value={formData.job_title}
                    onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="job_url">Job Posting URL</Label>
                <Input
                  id="job_url"
                  type="url"
                  value={formData.job_url}
                  onChange={(e) => setFormData({ ...formData, job_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value as ApplicationStatus })}
                  >
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Applied">Applied</SelectItem>
                      <SelectItem value="Screening">Screening</SelectItem>
                      <SelectItem value="Interview">Interview</SelectItem>
                      <SelectItem value="Offer">Offer</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                      <SelectItem value="Withdrawn">Withdrawn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="applied_date">Applied Date</Label>
                  <Input
                    id="applied_date"
                    type="date"
                    value={formData.applied_date}
                    onChange={(e) => setFormData({ ...formData, applied_date: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="salary_range">Salary Range</Label>
                  <Input
                    id="salary_range"
                    value={formData.salary_range}
                    onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
                    placeholder="z.B. 60.000 € - 80.000 €"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Standort</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="z.B. Stuttgart, Deutschland"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="follow_up_date">Follow-up Date</Label>
                <Input
                  id="follow_up_date"
                  type="date"
                  value={formData.follow_up_date}
                  onChange={(e) => setFormData({ ...formData, follow_up_date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Add any notes about this application..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingApp ? 'Update Application' : 'Add Application'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={selectedStatus} onValueChange={(v) => setSelectedStatus(v as ApplicationStatus | 'all')}>
        <TabsList>
          <TabsTrigger value="all">
            All ({applications.length})
          </TabsTrigger>
          <TabsTrigger value="Applied">
            Applied ({statusCounts.Applied || 0})
          </TabsTrigger>
          <TabsTrigger value="Screening">
            Screening ({statusCounts.Screening || 0})
          </TabsTrigger>
          <TabsTrigger value="Interview">
            Interview ({statusCounts.Interview || 0})
          </TabsTrigger>
          <TabsTrigger value="Offer">
            Offer ({statusCounts.Offer || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedStatus} className="space-y-4">
          {filteredApplications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">No applications yet</p>
                <p className="text-muted-foreground mb-4">Start tracking your job applications</p>
                <Button onClick={() => setDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Application
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredApplications.map((app) => (
                <Card key={app.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg truncate">{app.company_name}</CardTitle>
                        <CardDescription className="truncate">{app.job_title}</CardDescription>
                      </div>
                      <Badge className={STATUS_COLORS[app.status]}>
                        {app.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {app.applied_date && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        Applied: {format(new Date(app.applied_date), 'MMM d, yyyy')}
                      </div>
                    )}
                    {app.salary_range && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                        {app.salary_range}
                      </div>
                    )}
                    {app.location && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {app.location}
                      </div>
                    )}
                    {app.notes && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                        {app.notes}
                      </p>
                    )}
                    <div className="flex gap-2 pt-2">
                      {app.job_url && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => window.open(app.job_url || '', '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          View Job
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(app)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(app.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
