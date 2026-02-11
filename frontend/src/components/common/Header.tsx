import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, User, Target, Menu, X, Shield, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { ThemeToggle } from './ThemeToggle';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut, isAdmin } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Successfully logged out');
      // Redirect to login page after successful logout
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out. Please try again.');
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="bg-background border-b sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={user ? '/calendar' : '/'} className="flex items-center gap-3">
              <img
                src="/logo.svg"
                alt="Chase My Career"
                className="h-8 w-8"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div className="hidden items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xl font-bold hidden sm:block">Chase My Career</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link to="/calendar">
                  <Button
                    variant={location.pathname === '/calendar' ? 'default' : 'ghost'}
                  >
                    Calendar
                  </Button>
                </Link>

                {isAdmin && (
                  <Link to="/admin">
                    <Button
                      variant={location.pathname === '/admin' ? 'default' : 'ghost'}
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Admin
                    </Button>
                  </Link>
                )}

                <ThemeToggle />

                <Link to="/settings">
                  <Button
                    variant={location.pathname.startsWith('/settings') ? 'default' : 'ghost'}
                    size="icon"
                    title="Settings"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                </Link>

                <div className="flex items-center gap-3 pl-4 border-l">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.full_name || user.email || 'User'} />
                    <AvatarFallback>{getInitials(profile?.full_name || user.email || 'User')}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{profile?.full_name || user.email}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleSignOut}
                    title="Sign Out"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <ThemeToggle />
                <Link to="/">
                  <Button variant={location.pathname === '/' ? 'default' : 'ghost'}>
                    Home
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="default">Sign In</Button>
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            {user ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-4 border-b">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.full_name || user.email || 'User'} />
                    <AvatarFallback>{getInitials(profile?.full_name || user.email || 'User')}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col flex-1">
                    <span className="text-sm font-medium">{profile?.full_name || user.email}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                  </div>
                  <ThemeToggle />
                </div>
                <Link to="/calendar" onClick={() => setIsMenuOpen(false)}>
                  <Button
                    variant={location.pathname === '/calendar' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                  >
                    Calendar
                  </Button>
                </Link>
                {isAdmin && (
                  <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
                    <Button
                      variant={location.pathname === '/admin' ? 'default' : 'ghost'}
                      className="w-full justify-start"
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Admin
                    </Button>
                  </Link>
                )}
                <Link to="/settings" onClick={() => setIsMenuOpen(false)}>
                  <Button
                    variant={location.pathname.startsWith('/settings') ? 'default' : 'ghost'}
                    className="w-full justify-start"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-destructive"
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-end pb-2">
                  <ThemeToggle />
                </div>
                <Link to="/" onClick={() => setIsMenuOpen(false)}>
                  <Button
                    variant={location.pathname === '/' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                  >
                    Home
                  </Button>
                </Link>
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="default" className="w-full justify-start">
                    <User className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
