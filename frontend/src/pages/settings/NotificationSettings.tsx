import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/db/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Bell, Mail, Calendar, Save, Loader2 } from 'lucide-react';

export default function NotificationSettings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    email_notifications: true,
    daily_reminders: true,
    interview_alerts: true,
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
        .select('email_notifications, daily_reminders, interview_alerts')
        .eq('id', user?.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setFormData({
          email_notifications: data.email_notifications ?? true,
          daily_reminders: data.daily_reminders ?? true,
          interview_alerts: data.interview_alerts ?? true,
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('Failed to load notification settings');
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
          email_notifications: formData.email_notifications,
          daily_reminders: formData.daily_reminders,
          interview_alerts: formData.interview_alerts,
        })
        .eq('id', user?.id);

      if (error) throw error;

      toast.success('Notification settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save notification settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-64 bg-muted" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Manage how you receive updates and reminders
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-start gap-3 flex-1">
              <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div className="space-y-1">
                <Label htmlFor="email_notifications" className="text-base font-medium cursor-pointer">
                  Email Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive email updates about your job applications, interview invitations, and important account activities
                </p>
              </div>
            </div>
            <Switch
              id="email_notifications"
              checked={formData.email_notifications}
              onCheckedChange={(checked) => setFormData({ ...formData, email_notifications: checked })}
            />
          </div>

          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-start gap-3 flex-1">
              <Bell className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div className="space-y-1">
                <Label htmlFor="daily_reminders" className="text-base font-medium cursor-pointer">
                  Daily Task Reminders
                </Label>
                <p className="text-sm text-muted-foreground">
                  Get daily reminders about your 50-day plan tasks and goals to stay on track with your job search
                </p>
              </div>
            </div>
            <Switch
              id="daily_reminders"
              checked={formData.daily_reminders}
              onCheckedChange={(checked) => setFormData({ ...formData, daily_reminders: checked })}
            />
          </div>

          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-start gap-3 flex-1">
              <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div className="space-y-1">
                <Label htmlFor="interview_alerts" className="text-base font-medium cursor-pointer">
                  Interview Alerts
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive reminders before scheduled interviews and follow-up notifications
                </p>
              </div>
            </div>
            <Switch
              id="interview_alerts"
              checked={formData.interview_alerts}
              onCheckedChange={(checked) => setFormData({ ...formData, interview_alerts: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Timing</CardTitle>
          <CardDescription>
            When you'll receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-primary mt-2" />
              <div>
                <p className="font-medium">Daily Reminders</p>
                <p className="text-muted-foreground">Sent every morning at 9:00 AM in your timezone</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-primary mt-2" />
              <div>
                <p className="font-medium">Interview Alerts</p>
                <p className="text-muted-foreground">Sent 24 hours and 1 hour before scheduled interviews</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-primary mt-2" />
              <div>
                <p className="font-medium">Application Updates</p>
                <p className="text-muted-foreground">Sent immediately when there's a status change</p>
              </div>
            </div>
          </div>
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
