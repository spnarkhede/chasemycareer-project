import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function DashboardSkeleton() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64 bg-muted" />
        <Skeleton className="h-4 w-96 bg-muted" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <Skeleton className="h-5 w-32 bg-muted" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2 bg-muted" />
              <Skeleton className="h-3 w-24 bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-48 bg-muted" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="space-y-2">
                  <Skeleton className="h-4 w-full bg-muted" />
                  <Skeleton className="h-3 w-3/4 bg-muted" />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-32 bg-muted" />
              <Skeleton className="h-3 w-48 bg-muted" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
