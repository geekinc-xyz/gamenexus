'use client';

import Image from 'next/image';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { getGameDetails } from '@/lib/igdb-api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlatformIcon } from '@/components/icons';
import { ArrowLeft, Star, CalendarDays, Tag, Users, Puzzle, Code, Building, Palette, Film } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { useEffect, useState } from 'react';
import type { Game } from '@/lib/types';

export default function GameDetailPage() {
  const params = useParams();
  const gameId = parseInt(params.id as string, 10);
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const { t, lang } = useLanguage();

  useEffect(() => {
    async function load() {
      if (isNaN(gameId)) {
        notFound();
        return;
      }
      setLoading(true);
      try {
        const details = await getGameDetails(gameId);
        if (!details) {
          notFound();
          return;
        }
        setGame(details);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [gameId]);

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center">Loading...</div>;
  }

  if (!game) {
    notFound();
    return null;
  }

  const releaseDate = game.releaseDate 
    ? new Date(game.releaseDate * 1000).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'N/A';
  
  const renderList = (items: { name: string }[]) =>
    items && items.length > 0
      ? items.map(item => <Badge key={item.name} variant="secondary" className="mr-1 mb-1">{item.name}</Badge>)
      : 'N/A';

  const firstTrailer = game.videos && game.videos.length > 0 ? game.videos[0] : null;

  return (
    <div className="animate-in fade-in-50 duration-500">
      <div className="relative h-[40vh] md:h-[50vh] w-full">
        {game.screenshots && game.screenshots.length > 0 ? (
          <Image
            src={game.screenshots[0].url}
            alt={`Screenshot of ${game.name}`}
            fill
            className="object-cover"
            priority
            data-ai-hint="gameplay screenshot"
          />
        ) : (
          <div className="bg-muted w-full h-full" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        <div className="absolute top-4 left-4">
          <Button asChild variant="secondary" size="sm">
            <Link href="/games">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('backToGames')}
            </Link>
          </Button>
        </div>
      </div>

      <main className="container mx-auto px-4 sm:px-6 md:px-8 pb-16 -mt-32 md:-mt-48 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <aside className="md:col-span-1 lg:col-span-1">
            <div className="aspect-[3/4] relative rounded-lg overflow-hidden shadow-2xl shadow-primary/20">
              <Image
                src={game.coverUrl}
                alt={game.name}
                fill
                className="object-cover"
                data-ai-hint="game cover"
              />
            </div>
            <div className="mt-6 space-y-4">
              <div>
                <h3 className="flex items-center text-md font-semibold text-muted-foreground mb-1">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  {t('releaseDate')}
                </h3>
                <div className="text-lg">{releaseDate}</div>
              </div>
              <div>
                <h3 className="flex items-center text-md font-semibold text-muted-foreground mb-1">
                  <Code className="mr-2 h-4 w-4" />
                  {t('developers')}
                </h3>
                <div className="text-lg">{renderList(game.developers)}</div>
              </div>
              <div>
                <h3 className="flex items-center text-md font-semibold text-muted-foreground mb-1">
                  <Building className="mr-2 h-4 w-4" />
                  {t('publishers')}
                </h3>
                <div className="text-lg">{renderList(game.publishers)}</div>
              </div>
            </div>
          </aside>

          <div className="md:col-span-2 lg:col-span-3">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-2">{game.name}</h1>
            
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <span className="font-bold text-lg">{game.rating ? game.rating.toFixed(0) : 'N/A'}</span>
                <span className="text-muted-foreground text-sm">/ 100 (Metascore)</span>
              </div>
              <div className="flex items-center gap-x-3">
                {game.platforms.map(platform => (
                  <div key={platform.id} className="flex items-center gap-2 text-muted-foreground" title={platform.name}>
                    <PlatformIcon platform={platform.name as any} className="h-5 w-5" />
                  </div>
                ))}
              </div>
            </div>

            <p className="text-lg text-muted-foreground mb-8 max-w-3xl">
              {game.description || t('noDescription')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="flex items-center text-md font-semibold text-muted-foreground mb-1">
                  <Tag className="mr-2 h-4 w-4" />
                  {t('genres')}
                </h3>
                <div className="text-lg">{renderList(game.genres)}</div>
              </div>
              <div>
                <h3 className="flex items-center text-md font-semibold text-muted-foreground mb-1">
                  <Users className="mr-2 h-4 w-4" />
                  {t('franchise')}
                </h3>
                <div className="text-lg">{renderList(game.franchises)}</div>
              </div>
              <div>
                <h3 className="flex items-center text-md font-semibold text-muted-foreground mb-1">
                  <Puzzle className="mr-2 h-4 w-4" />
                  {t('gameModes')}
                </h3>
                <div className="text-lg">{renderList(game.gameModes)}</div>
              </div>
              <div>
                <h3 className="flex items-center text-md font-semibold text-muted-foreground mb-1">
                  <Palette className="mr-2 h-4 w-4" />
                  {t('themes')}
                </h3>
                <div className="text-lg">{renderList(game.themes)}</div>
              </div>
            </div>

            {firstTrailer && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center"><Film className="mr-2 h-6 w-6" /> {t('trailer')}</h2>
                <div className="aspect-video relative rounded-lg overflow-hidden border">
                  <iframe
                    src={`https://www.youtube.com/embed/${firstTrailer.video_id}`}
                    title={`Trailer for ${game.name}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
              </div>
            )}

            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">{t('screenshots')}</h2>
                {game.screenshots && game.screenshots.length > 0 ? (
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                      {game.screenshots.map((ss) => (
                          <div key={ss.id} className="aspect-video relative rounded-md overflow-hidden">
                              <Image src={ss.url} alt={`Screenshot`} fill className="object-cover"/>
                          </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">{t('noScreenshots')}</p>
                )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
