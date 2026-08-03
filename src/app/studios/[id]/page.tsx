
import { getStudioDetails } from '@/lib/igdb-api';
import { notFound } from 'next/navigation';
import { GameCard } from '@/components/game-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, ServerCrash } from 'lucide-react';
import type { Studio } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function StudioDetailPage({ params }: { params: { id: string } }) {
  const studioId = parseInt(params.id, 10);
  
  if (isNaN(studioId)) {
      notFound();
  }

  const studio: Studio | null = await getStudioDetails(studioId);

  if (!studio) {
    return (
      <div className="animate-in fade-in-50 duration-500">
        <main className="container mx-auto px-4 sm:px-6 md:px-8 py-8">
          <div className="mb-8">
              <Button asChild variant="outline" size="sm" className="mb-4">
                  <Link href="/studios">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Retour aux studios
                  </Link>
              </Button>
          </div>
          <div className="text-center py-20 bg-muted/50 rounded-lg">
              <ServerCrash className="mx-auto h-12 w-12 text-destructive" />
              <h2 className="mt-4 text-2xl font-semibold">Erreur de chargement</h2>
              <p className="mt-2 text-muted-foreground">Impossible de charger les détails du studio. L'API est peut-être indisponible ou les clés d'API ne sont pas configurées.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in-50 duration-500">
      <main className="container mx-auto px-4 sm:px-6 md:px-8 py-8">
        <div className="mb-8">
            <Button asChild variant="outline" size="sm" className="mb-4">
                <Link href="/studios">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Retour aux studios
                </Link>
            </Button>
            <h1 className="text-4xl font-extrabold tracking-tighter">{studio.name}</h1>
            {studio.developed.length > 0 && (
                 <p className="text-lg text-muted-foreground mt-2">
                    {studio.developed.length} jeu{studio.developed.length > 1 ? 'x' : ''} développé{studio.developed.length > 1 ? 's' : ''}
                </p>
            )}
        </div>
        
        {studio.developed.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {studio.developed.map(game => (
                <GameCard key={game.id} game={game} />
            ))}
            </div>
        ) : (
            <div className="text-center py-20">
                <h2 className="text-2xl font-semibold mb-2">Aucun jeu trouvé</h2>
                <p className="text-muted-foreground">Ce studio n'a aucun jeu répertorié dans notre base de données.</p>
            </div>
        )}
      </main>
    </div>
  );
}
