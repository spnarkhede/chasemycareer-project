import { OAuthService } from './oauth.service';
import type { GoogleCalendarEvent } from '@/types';

export class CalendarService {
  private static readonly CALENDAR_API_BASE = 'https://www.googleapis.com/calendar/v3';

  private static async getAccessToken(): Promise<string | null> {
    const token = await OAuthService.getStoredToken();
    return token?.accessToken || null;
  }

  private static async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const accessToken = await this.getAccessToken();
    
    if (!accessToken) {
      throw new Error('No access token available. Please authenticate with Google.');
    }

    const response = await fetch(`${this.CALENDAR_API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error?.message || `Calendar API error: ${response.status}`);
    }

    return await response.json();
  }

  static async listEvents(
    maxResults: number = 10,
    timeMin?: string,
    timeMax?: string
  ): Promise<GoogleCalendarEvent[]> {
    const params = new URLSearchParams({
      maxResults: maxResults.toString(),
      singleEvents: 'true',
      orderBy: 'startTime',
    });

    if (timeMin) {
      params.append('timeMin', timeMin);
    } else {
      params.append('timeMin', new Date().toISOString());
    }

    if (timeMax) {
      params.append('timeMax', timeMax);
    }

    const data = await this.makeRequest<{ items: GoogleCalendarEvent[] }>(
      `/calendars/primary/events?${params.toString()}`
    );

    return data.items || [];
  }

  static async getEvent(eventId: string): Promise<GoogleCalendarEvent> {
    return await this.makeRequest<GoogleCalendarEvent>(
      `/calendars/primary/events/${eventId}`
    );
  }

  static async createEvent(event: {
    summary: string;
    description?: string;
    start: { dateTime: string; timeZone?: string };
    end: { dateTime: string; timeZone?: string };
    attendees?: Array<{ email: string }>;
    location?: string;
  }): Promise<GoogleCalendarEvent> {
    return await this.makeRequest<GoogleCalendarEvent>(
      '/calendars/primary/events',
      {
        method: 'POST',
        body: JSON.stringify(event),
      }
    );
  }

  static async updateEvent(
    eventId: string,
    event: Partial<GoogleCalendarEvent>
  ): Promise<GoogleCalendarEvent> {
    return await this.makeRequest<GoogleCalendarEvent>(
      `/calendars/primary/events/${eventId}`,
      {
        method: 'PUT',
        body: JSON.stringify(event),
      }
    );
  }

  static async deleteEvent(eventId: string): Promise<void> {
    await this.makeRequest<void>(
      `/calendars/primary/events/${eventId}`,
      {
        method: 'DELETE',
      }
    );
  }

  static async getUpcomingEvents(days: number = 7): Promise<GoogleCalendarEvent[]> {
    const timeMin = new Date().toISOString();
    const timeMax = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();

    return await this.listEvents(50, timeMin, timeMax);
  }

  static async getTodayEvents(): Promise<GoogleCalendarEvent[]> {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    return await this.listEvents(50, startOfDay.toISOString(), endOfDay.toISOString());
  }
}
