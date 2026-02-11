import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48 bg-muted" />
        <Skeleton className="h-10 w-32 bg-muted" />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-64 bg-muted" />
            <Skeleton className="h-10 w-32 bg-muted" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-5 gap-4 pb-4 border-b">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-full bg-muted" />
              ))}
            </div>
            {[...Array(rows)].map((_, i) => (
              <div key={i} className="grid grid-cols-5 gap-4 py-3">
                {[...Array(5)].map((_, j) => (
                  <Skeleton key={j} className="h-4 w-full bg-muted" />
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
