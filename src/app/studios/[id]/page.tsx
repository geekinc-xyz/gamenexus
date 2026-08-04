'use client';

import { getStudioDetails } from '@/lib/igdb-api';
import { notFound, useParams } from 'next/navigation';
import { GameCard } from '@/components/game-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, ServerCrash } from 'lucide-react';
import type { Studio } from '@/lib/types';
import { useLanguage } from '@/context/language-context';
import { useEffect, useState } from 'react';

export default function StudioDetailPage() {
  const params = useParams();
  const studioId = parseInt(params.id as string, 10);
  const [studio, setStudio] = useState<Studio | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    async function load() {
      if (isNaN(studioId)) {
        notFound();
        return;
      }
      setLoading(true);
      try {
        const details = await getStudioDetails(studioId);
        setStudio(details);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [studioId]);

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center">Loading...</div>;
  }

  if (!studio) {
    return (
      <div className="animate-in fade-in-50 duration-500">
        <main className="container mx-auto px-4 sm:px-6 md:px-8 py-8">
          <div className="mb-8">
              <Button asChild variant="outline" size="sm" className="mb-4">
                  <Link href="/studios">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      {t('backToStudios')}
                  </Link>
              </Button>
          </div>
          <div className="text-center py-20 bg-muted/50 rounded-lg">
              <ServerCrash className="mx-auto h-12 w-12 text-destructive" />
              <h2 className="mt-4 text-2xl font-semibold">{t('loadingError')}</h2>
              <p className="mt-2 text-muted-foreground">{t('apiErrorDesc')}</p>
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
                    {t('backToStudios')}
                </Link>
            </Button>
            <h1 className="text-4xl font-extrabold tracking-tighter">{studio.name}</h1>
            {studio.developed.length > 0 && (
                 <p className="text-lg text-muted-foreground mt-2">
                    {studio.developed.length} {t('developedCount')}
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
                <h2 className="text-2xl font-semibold mb-2">{t('noGamesFound')}</h2>
                <p className="text-muted-foreground">{t('noStudioGames')}</p>
            </div>
        )}
      </main>
    </div>
  );
}
