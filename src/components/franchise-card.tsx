
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { Franchise } from '@/lib/types';
import { Badge } from './ui/badge';
import { useLanguage } from '@/context/language-context';

interface FranchiseCardProps {
  franchise: Franchise;
}

export function FranchiseCard({ franchise }: FranchiseCardProps) {
  const { t } = useLanguage();
  return (
    <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 group/card flex flex-col">
      <div className="aspect-[4/3] relative">
        <Link href={`/franchises/${franchise.id}`} className="group block">
            <Image
                src={franchise.coverUrl}
                alt={franchise.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                data-ai-hint="game franchise cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </Link>
      </div>
      <CardContent className="p-4 bg-background/95 backdrop-blur-sm flex-1 flex flex-col justify-between">
          <div>
            <Link href={`/franchises/${franchise.id}`}>
              <CardTitle className="text-lg leading-tight hover:text-primary">{franchise.name}</CardTitle>
            </Link>
          </div>
          <div className="mt-2">
              <Badge variant="secondary">
                {franchise.games.length} {franchise.games.length === 1 ? t('game') : t('games')}
              </Badge>
          </div>
      </CardContent>
    </Card>
  );
}

export function FranchiseCardSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="aspect-[4/3] rounded-lg" />
       <div className="p-4 space-y-2">
         <Skeleton className="h-6 w-3/4" />
         <Skeleton className="h-5 w-1/4" />
       </div>
    </div>
  );
}
