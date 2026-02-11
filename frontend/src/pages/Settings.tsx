import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Briefcase, 
  Bell, 
  Shield, 
  Palette, 
  Settings as SettingsIcon 
} from 'lucide-react';
import ProfileSettings from './settings/ProfileSettings';
import JobSearchSettings from './settings/JobSearchSettings';
import NotificationSettings from './settings/NotificationSettings';
import { SecuritySettingsPage } from './settings/SecuritySettingsPage';
import AppCustomization from './settings/AppCustomization';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <SettingsIcon className="w-8 h-8" />
          Settings
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 h-auto gap-2">
          <TabsTrigger value="profile" className="flex items-center gap-2 py-3">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="job-search" className="flex items-center gap-2 py-3">
            <Briefcase className="w-4 h-4" />
            <span className="hidden sm:inline">Job Search</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2 py-3">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2 py-3">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="customization" className="flex items-center gap-2 py-3">
            <Palette className="w-4 h-4" />
            <span className="hidden sm:inline">Appearance</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <ProfileSettings />
        </TabsContent>

        <TabsContent value="job-search" className="space-y-6">
          <JobSearchSettings />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <NotificationSettings />
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <SecuritySettingsPage />
        </TabsContent>

        <TabsContent value="customization" className="space-y-6">
          <AppCustomization />
        </TabsContent>
      </Tabs>

      {/* Settings Info Card */}
      <Card className="mt-8 bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <SettingsIcon className="w-5 h-5 text-primary mt-0.5" />
            <div className="space-y-1">
              <p className="font-medium">About Settings</p>
              <p className="text-sm text-muted-foreground">
                Your preferences are automatically saved and will personalize your job search experience. 
                Changes to country, language, and currency will affect job recommendations, salary displays, 
                and suggested job portals.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
