
import { GameCardSkeleton } from "@/components/game-card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-8 py-8 animate-pulse">
        <div className="mb-8">
            <Skeleton className="h-8 w-40 mb-4" />
            <Skeleton className="h-12 w-3/5" />
            <Skeleton className="h-6 w-1/5 mt-2" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {Array.from({ length: 20 }).map((_, i) => (
            <GameCardSkeleton key={i} />
        ))}
        </div>
    </div>
  );
}
