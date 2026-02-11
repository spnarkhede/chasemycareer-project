import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface CardGridSkeletonProps {
  cards?: number;
  columns?: 2 | 3 | 4;
}

export function CardGridSkeleton({ cards = 6, columns = 3 }: CardGridSkeletonProps) {
  const gridClass = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4'
  }[columns];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 bg-muted" />
          <Skeleton className="h-4 w-64 bg-muted" />
        </div>
        <Skeleton className="h-10 w-32 bg-muted" />
      </div>

      <div className={`grid gap-6 ${gridClass}`}>
        {[...Array(cards)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32 bg-muted" />
              <Skeleton className="h-4 w-48 bg-muted" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-full bg-muted" />
              <Skeleton className="h-4 w-3/4 bg-muted" />
              <div className="flex gap-2 pt-2">
                <Skeleton className="h-6 w-16 bg-muted" />
                <Skeleton className="h-6 w-16 bg-muted" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
