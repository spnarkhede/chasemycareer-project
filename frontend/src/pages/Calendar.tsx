import { useState, useEffect } from 'react';
import { CalendarService } from '@/services/calendar.service';
import { OAuthService } from '@/services/oauth.service';
import type { GoogleCalendarEvent } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Plus, ExternalLink, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { CardGridSkeleton } from '@/components/common/CardGridSkeleton';

interface EventFormData {
  summary: string;
  description: string;
  start: string;
  end: string;
  location: string;
}

export default function Calendar() {
  const [events, setEvents] = useState<GoogleCalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<EventFormData>({
    defaultValues: {
      summary: '',
      description: '',
      start: '',
      end: '',
      location: ''
    }
  });

  useEffect(() => {
    checkAccessAndLoadEvents();
  }, []);

  const checkAccessAndLoadEvents = async () => {
    try {
      setLoading(true);
      const token = await OAuthService.getStoredToken();
      
      if (!token) {
        setHasAccess(false);
        setLoading(false);
        return;
      }

      setHasAccess(true);
      await loadEvents();
    } catch (error) {
      console.error('Error checking access:', error);
      setHasAccess(false);
    } finally {
      setLoading(false);
    }
  };

  const loadEvents = async () => {
    try {
      const upcomingEvents = await CalendarService.getUpcomingEvents(30);
      setEvents(upcomingEvents);
    } catch (error) {
      console.error('Error loading events:', error);
      toast({
        title: 'Error',
        description: 'Failed to load calendar events',
        variant: 'destructive'
      });
    }
  };

  const handleConnectCalendar = async () => {
    try {
      const authUrl = await OAuthService.initiateGoogleOAuth();
      window.location.href = authUrl;
    } catch (error) {
      console.error('Error initiating OAuth:', error);
      toast({
        title: 'Error',
        description: 'Failed to initiate Google authentication',
        variant: 'destructive'
      });
    }
  };

  const handleCreateEvent = async (data: EventFormData) => {
    try {
      const event = {
        summary: data.summary,
        description: data.description,
        start: {
          dateTime: new Date(data.start).toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        end: {
          dateTime: new Date(data.end).toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        location: data.location
      };

      await CalendarService.createEvent(event);
      
      toast({
        title: 'Success',
        description: 'Event created successfully'
      });

      setIsDialogOpen(false);
      form.reset();
      await loadEvents();
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create event',
        variant: 'destructive'
      });
    }
  };

  const handleDisconnect = async () => {
    try {
      await OAuthService.revokeAccess();
      setHasAccess(false);
      setEvents([]);
      toast({
        title: 'Success',
        description: 'Calendar disconnected successfully'
      });
    } catch (error) {
      console.error('Error disconnecting:', error);
      toast({
        title: 'Error',
        description: 'Failed to disconnect calendar',
        variant: 'destructive'
      });
    }
  };

  if (loading) {
    return <CardGridSkeleton cards={4} columns={2} />;
  }

  if (!hasAccess) {
    return (
      <div className="container mx-auto p-6">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-6 w-6" />
              Google Calendar Integration
            </CardTitle>
            <CardDescription>
              Connect your Google Calendar to manage events directly from this application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Required Permissions
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
                <li>View and manage your calendar events</li>
                <li>Create, edit, and delete events</li>
                <li>Access your email and profile information</li>
              </ul>
            </div>

            <div className="bg-muted p-4 rounded-lg space-y-2">
              <h3 className="font-semibold">Security Features</h3>
              <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
                <li>PKCE (Proof Key for Code Exchange) for enhanced security</li>
                <li>Secure server-side token exchange</li>
                <li>Encrypted token storage</li>
                <li>Automatic token refresh</li>
              </ul>
            </div>

            <Button onClick={handleConnectCalendar} className="w-full" size="lg">
              <CalendarIcon className="mr-2 h-5 w-5" />
              Connect Google Calendar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <CalendarIcon className="h-8 w-8" />
            My Calendar
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your Google Calendar events
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Calendar Event</DialogTitle>
                <DialogDescription>
                  Add a new event to your Google Calendar
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleCreateEvent)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="summary"
                    rules={{ required: 'Event title is required' }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Team Meeting" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Meeting agenda and details..."
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="start"
                      rules={{ required: 'Start time is required' }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Time</FormLabel>
                          <FormControl>
                            <Input type="datetime-local" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="end"
                      rules={{ required: 'End time is required' }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Time</FormLabel>
                          <FormControl>
                            <Input type="datetime-local" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Conference Room A" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-2 justify-end">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Create Event</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          <Button variant="outline" onClick={handleDisconnect}>
            Disconnect
          </Button>
        </div>
      </div>

      {events.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No upcoming events</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {events.map((event) => (
            <Card key={event.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle>{event.summary}</CardTitle>
                    {event.description && (
                      <CardDescription>{event.description}</CardDescription>
                    )}
                  </div>
                  {event.htmlLink && (
                    <Button variant="ghost" size="sm" asChild>
                      <a href={event.htmlLink} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {format(new Date(event.start.dateTime), 'PPP p')} - {format(new Date(event.end.dateTime), 'p')}
                    </span>
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">📍</span>
                      <span>{event.location}</span>
                    </div>
                  )}
                  {event.attendees && event.attendees.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">👥</span>
                      <span>{event.attendees.length} attendee(s)</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
