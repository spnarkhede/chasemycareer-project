import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/db/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Globe, DollarSign, Languages, Clock, Save, Loader2 } from 'lucide-react';
import { COUNTRIES, LANGUAGES, CURRENCIES } from '@/constants/settings';
import { getDefaultCurrency, getTimezoneForCountry } from '@/constants/settings';

export default function ProfileSettings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    preferred_country: '',
    preferred_language: 'en',
    preferred_currency: 'USD',
    timezone: '',
  });

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setFormData({
          full_name: data.full_name || '',
          email: data.email || '',
          preferred_country: data.preferred_country || '',
          preferred_language: data.preferred_language || 'en',
          preferred_currency: data.preferred_currency || 'USD',
          timezone: data.timezone || '',
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile settings');
    } finally {
      setLoading(false);
    }
  };

  const handleCountryChange = (country: string) => {
    setFormData({
      ...formData,
      preferred_country: country,
      preferred_currency: getDefaultCurrency(country),
      timezone: getTimezoneForCountry(country),
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          preferred_country: formData.preferred_country || null,
          preferred_language: formData.preferred_language,
          preferred_currency: formData.preferred_currency,
          timezone: formData.timezone || null,
        })
        .eq('id', user?.id);

      if (error) throw error;

      toast.success('Profile settings saved successfully');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 bg-muted" />
        <Skeleton className="h-48 bg-muted" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Update your personal information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              placeholder="John Doe"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              disabled
              className="bg-muted"
            />
            <p className="text-sm text-muted-foreground">
              Email cannot be changed. Contact support if needed.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Location & Localization
          </CardTitle>
          <CardDescription>
            Customize your experience based on your location and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="preferred_country">Preferred Country / Job Location</Label>
            <Select
              value={formData.preferred_country}
              onValueChange={handleCountryChange}
            >
              <SelectTrigger id="preferred_country">
                <SelectValue placeholder="Select your preferred country" />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((country) => (
                  <SelectItem key={country.value} value={country.value}>
                    <span className="flex items-center gap-2">
                      <span>{country.flag}</span>
                      <span>{country.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              This affects job suggestions, salary ranges, and recommended job portals
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferred_language" className="flex items-center gap-2">
              <Languages className="w-4 h-4" />
              Language Preference
            </Label>
            <Select
              value={formData.preferred_language}
              onValueChange={(value) => setFormData({ ...formData, preferred_language: value })}
            >
              <SelectTrigger id="preferred_language">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label} ({lang.nativeName})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Changes UI language, templates, and interview questions
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferred_currency" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Currency Preference
            </Label>
            <Select
              value={formData.preferred_currency}
              onValueChange={(value) => setFormData({ ...formData, preferred_currency: value })}
            >
              <SelectTrigger id="preferred_currency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((currency) => (
                  <SelectItem key={currency.value} value={currency.value}>
                    {currency.symbol} {currency.label} - {currency.country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Affects salary expectations and analytics displays
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Timezone
            </Label>
            <Input
              id="timezone"
              value={formData.timezone}
              onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
              placeholder="e.g., America/New_York, Europe/Berlin"
            />
            <p className="text-sm text-muted-foreground">
              Used for interview scheduling and reminders
            </p>
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
