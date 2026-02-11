import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Share2, Copy, Check, Linkedin, Twitter, Facebook } from 'lucide-react';
import { toast } from 'sonner';

interface ShareProgressProps {
  currentDay: number;
  tasksCompleted: number;
  applicationsCount?: number;
}

export function ShareProgress({ 
  currentDay, 
  tasksCompleted,
  applicationsCount = 0 
}: ShareProgressProps) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const shareMessages = [
    `🎯 Just completed Day ${currentDay} of my 50-day career chase! ${tasksCompleted} tasks down, making real progress toward my dream job! 💪 #CareerGrowth #JobSearch`,
    `📈 Day ${currentDay}/50 complete! I've finished ${tasksCompleted} tasks and applied to ${applicationsCount} positions. The journey continues! 🚀 #CareerDevelopment`,
    `💼 Milestone alert! Reached Day ${currentDay} in my structured job search program. ${tasksCompleted} tasks completed and counting! #JobHunt #CareerSuccess`,
    `🌟 Progress update: Day ${currentDay} of my 50-day career transformation! Every task brings me closer to my goals. ${tasksCompleted} completed so far! #CareerJourney`,
  ];

  const randomMessage = shareMessages[Math.floor(Math.random() * shareMessages.length)];

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(randomMessage);
      setCopied(true);
      toast.success('Message copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy message');
    }
  };

  const handleShareLinkedIn = () => {
    const url = encodeURIComponent(window.location.origin);
    const text = encodeURIComponent(randomMessage);
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${text}`,
      '_blank',
      'width=600,height=600'
    );
    toast.success('Opening LinkedIn...');
  };

  const handleShareTwitter = () => {
    const url = encodeURIComponent(window.location.origin);
    const text = encodeURIComponent(randomMessage);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      '_blank',
      'width=600,height=400'
    );
    toast.success('Opening Twitter...');
  };

  const handleShareFacebook = () => {
    const url = encodeURIComponent(window.location.origin);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${encodeURIComponent(randomMessage)}`,
      '_blank',
      'width=600,height=600'
    );
    toast.success('Opening Facebook...');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="w-4 h-4 mr-2" />
          Share Progress
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Your Progress 🎉</DialogTitle>
          <DialogDescription>
            Celebrate your achievements and inspire others on their career journey!
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Preview Card */}
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Your Progress Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{randomMessage}</p>
            </CardContent>
          </Card>

          {/* Copy Button */}
          <Button 
            onClick={handleCopyMessage} 
            variant="outline" 
            className="w-full"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2 text-green-600" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy Message
              </>
            )}
          </Button>

          {/* Social Media Buttons */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Share directly to:
            </p>
            <div className="grid grid-cols-3 gap-2">
              <Button
                onClick={handleShareLinkedIn}
                variant="outline"
                size="sm"
                className="flex-col h-auto py-3"
              >
                <Linkedin className="w-5 h-5 mb-1 text-[#0A66C2]" />
                <span className="text-xs">LinkedIn</span>
              </Button>
              
              <Button
                onClick={handleShareTwitter}
                variant="outline"
                size="sm"
                className="flex-col h-auto py-3"
              >
                <Twitter className="w-5 h-5 mb-1 text-[#1DA1F2]" />
                <span className="text-xs">Twitter</span>
              </Button>
              
              <Button
                onClick={handleShareFacebook}
                variant="outline"
                size="sm"
                className="flex-col h-auto py-3"
              >
                <Facebook className="w-5 h-5 mb-1 text-[#1877F2]" />
                <span className="text-xs">Facebook</span>
              </Button>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Sharing your progress can inspire others and keep you accountable! 🌟
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
