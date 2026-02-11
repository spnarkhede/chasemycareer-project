import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, ArrowRight, X } from 'lucide-react';
import { useState } from 'react';

export const DemoModeBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <Alert className="border-primary bg-primary/10 rounded-none border-x-0 border-t-0">
      <div className="container mx-auto">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <Eye className="h-5 w-5 text-primary flex-shrink-0" />
            <AlertDescription className="text-sm font-medium m-0">
              You're viewing <strong>demo mode</strong> with sample data. Sign up to track your own job search progress!
            </AlertDescription>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/signup">
              <Button size="sm" className="whitespace-nowrap">
                Sign Up Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsVisible(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Alert>
  );
};
