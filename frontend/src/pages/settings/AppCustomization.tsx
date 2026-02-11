import { useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { Palette, Layout, Sun, Moon, Monitor, Maximize2, Minimize2, Square } from 'lucide-react';
import { UI_THEMES, LAYOUT_DENSITIES } from '@/constants/settings';

export default function AppCustomization() {
  const { theme, layoutDensity, setTheme, setLayoutDensity, effectiveTheme } = useTheme();

  const handleThemeChange = (value: string) => {
    setTheme(value as 'light' | 'dark' | 'system');
    toast.success('Theme updated successfully');
  };

  const handleLayoutDensityChange = (value: string) => {
    setLayoutDensity(value as 'compact' | 'comfortable' | 'spacious');
    toast.success('Layout density updated successfully');
  };

  const getThemeIcon = (themeValue: string) => {
    switch (themeValue) {
      case 'light':
        return <Sun className="w-5 h-5" />;
      case 'dark':
        return <Moon className="w-5 h-5" />;
      case 'system':
        return <Monitor className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getDensityIcon = (densityValue: string) => {
    switch (densityValue) {
      case 'compact':
        return <Minimize2 className="w-5 h-5" />;
      case 'comfortable':
        return <Square className="w-5 h-5" />;
      case 'spacious':
        return <Maximize2 className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Theme Preference
          </CardTitle>
          <CardDescription>
            Choose your preferred color theme. Currently using: <strong>{effectiveTheme}</strong> mode
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={theme}
            onValueChange={handleThemeChange}
            className="space-y-4"
          >
            {UI_THEMES.map((themeOption) => (
              <div key={themeOption.value} className="flex items-center space-x-3">
                <RadioGroupItem value={themeOption.value} id={`theme-${themeOption.value}`} />
                <Label 
                  htmlFor={`theme-${themeOption.value}`} 
                  className="flex items-center gap-3 cursor-pointer flex-1 p-3 rounded-lg border border-transparent hover:border-border hover:bg-muted/50 transition-colors"
                >
                  {getThemeIcon(themeOption.value)}
                  <div className="flex-1">
                    <p className="font-medium">{themeOption.label}</p>
                    <p className="text-sm text-muted-foreground">
                      {themeOption.value === 'system' && 'Automatically matches your system preference'}
                      {themeOption.value === 'light' && 'Always use light mode for better visibility'}
                      {themeOption.value === 'dark' && 'Always use dark mode to reduce eye strain'}
                    </p>
                  </div>
                  {theme === themeOption.value && (
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layout className="w-5 h-5" />
            Layout Density
          </CardTitle>
          <CardDescription>
            Adjust the spacing and density of the interface. Currently: <strong>{layoutDensity}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={layoutDensity}
            onValueChange={handleLayoutDensityChange}
            className="space-y-4"
          >
            {LAYOUT_DENSITIES.map((density) => (
              <div key={density.value} className="flex items-center space-x-3">
                <RadioGroupItem value={density.value} id={`density-${density.value}`} />
                <Label 
                  htmlFor={`density-${density.value}`} 
                  className="flex items-center gap-3 cursor-pointer flex-1 p-3 rounded-lg border border-transparent hover:border-border hover:bg-muted/50 transition-colors"
                >
                  {getDensityIcon(density.value)}
                  <div className="flex-1">
                    <p className="font-medium">{density.label}</p>
                    <p className="text-sm text-muted-foreground">{density.description}</p>
                  </div>
                  {layoutDensity === density.value && (
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Live Preview</CardTitle>
          <CardDescription>
            See how your customizations affect the interface
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className={`p-6 border rounded-lg bg-card ${
            layoutDensity === 'compact' ? 'space-y-2' :
            layoutDensity === 'spacious' ? 'space-y-6' :
            'space-y-4'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Palette className="w-5 h-5 text-primary" />
              </div>
              <div className={layoutDensity === 'compact' ? 'space-y-0.5' : 'space-y-1'}>
                <p className="font-medium">Sample Card Title</p>
                <p className="text-sm text-muted-foreground">This is how content will appear with your settings</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size={layoutDensity === 'compact' ? 'sm' : layoutDensity === 'spacious' ? 'lg' : 'default'}>
                Primary Action
              </Button>
              <Button 
                variant="outline" 
                size={layoutDensity === 'compact' ? 'sm' : layoutDensity === 'spacious' ? 'lg' : 'default'}
              >
                Secondary
              </Button>
            </div>
            <div className={`text-sm ${layoutDensity === 'compact' ? 'space-y-1' : layoutDensity === 'spacious' ? 'space-y-3' : 'space-y-2'}`}>
              <p className="text-muted-foreground">
                Current theme: <span className="font-medium text-foreground">{effectiveTheme}</span>
              </p>
              <p className="text-muted-foreground">
                Layout density: <span className="font-medium text-foreground">{layoutDensity}</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Palette className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="font-medium">About Customization</p>
              <p className="text-sm text-muted-foreground">
                Your preferences are automatically saved and applied across all pages. 
                Theme changes take effect immediately, and layout density adjustments will 
                affect spacing, button sizes, and overall interface density throughout the application.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
