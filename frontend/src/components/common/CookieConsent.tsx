import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Cookie, Settings } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

const CONSENT_KEY = 'cookie-consent';
const CONSENT_PREFERENCES_KEY = 'cookie-preferences';

interface CookiePreferences {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
}

const CookieConsent: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    functional: true,
    analytics: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    const savedPreferences = localStorage.getItem(CONSENT_PREFERENCES_KEY);
    
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    }
    
    if (!consent) {
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveConsent = (accepted: boolean, customPreferences?: CookiePreferences) => {
    const prefs = customPreferences || preferences;
    localStorage.setItem(CONSENT_KEY, accepted ? 'accepted' : 'rejected');
    localStorage.setItem(CONSENT_PREFERENCES_KEY, JSON.stringify(prefs));
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      functional: true,
      analytics: true,
    };
    setPreferences(allAccepted);
    saveConsent(true, allAccepted);
  };

  const handleRejectAll = () => {
    const onlyNecessary: CookiePreferences = {
      necessary: true,
      functional: false,
      analytics: false,
    };
    setPreferences(onlyNecessary);
    saveConsent(false, onlyNecessary);
  };

  const handleSavePreferences = () => {
    saveConsent(true, preferences);
  };

  const handlePreferenceChange = (key: keyof CookiePreferences, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom duration-500">
      <Card className="max-w-4xl mx-auto shadow-2xl border-2">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Cookie className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">We Value Your Privacy</h3>
                <p className="text-sm text-muted-foreground">
                  We use cookies and similar technologies to enhance your experience, analyze site usage, and personalize content. By clicking "Accept All", you consent to our use of cookies. You can manage your preferences or learn more in our{' '}
                  <a href="/privacy-policy" className="text-primary hover:underline">
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={handleAcceptAll} className="flex-1 sm:flex-none">
                  Accept All
                </Button>
                <Button onClick={handleRejectAll} variant="outline" className="flex-1 sm:flex-none">
                  Reject All
                </Button>
                <Dialog open={showSettings} onOpenChange={setShowSettings}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex-1 sm:flex-none">
                      <Settings className="mr-2 h-4 w-4" />
                      Customize
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Cookie Preferences</DialogTitle>
                      <DialogDescription>
                        Manage your cookie preferences. You can enable or disable different types of cookies below.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                      {/* Necessary Cookies */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1 flex-1">
                            <Label htmlFor="necessary" className="text-base font-semibold">
                              Necessary Cookies
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              These cookies are essential for the website to function properly. They enable core functionality such as security, authentication, and accessibility. These cookies cannot be disabled.
                            </p>
                          </div>
                          <Switch
                            id="necessary"
                            checked={preferences.necessary}
                            disabled
                            className="ml-4"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Examples: Session management, authentication tokens, security features
                        </p>
                      </div>

                      <Separator />

                      {/* Functional Cookies */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1 flex-1">
                            <Label htmlFor="functional" className="text-base font-semibold">
                              Functional Cookies
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              These cookies enable enhanced functionality and personalization, such as remembering your preferences and settings.
                            </p>
                          </div>
                          <Switch
                            id="functional"
                            checked={preferences.functional}
                            onCheckedChange={(checked) => handlePreferenceChange('functional', checked)}
                            className="ml-4"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Examples: Language preferences, theme settings, user interface customization
                        </p>
                      </div>

                      <Separator />

                      {/* Analytics Cookies */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1 flex-1">
                            <Label htmlFor="analytics" className="text-base font-semibold">
                              Analytics Cookies
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
                            </p>
                          </div>
                          <Switch
                            id="analytics"
                            checked={preferences.analytics}
                            onCheckedChange={(checked) => handlePreferenceChange('analytics', checked)}
                            className="ml-4"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Examples: Page views, user behavior, performance metrics
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 pt-4">
                      <Button onClick={handleSavePreferences} className="flex-1">
                        Save Preferences
                      </Button>
                      <Button onClick={handleAcceptAll} variant="outline" className="flex-1">
                        Accept All
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRejectAll}
              className="flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CookieConsent;
