'use client';

import { useState, useEffect, useCallback } from 'react';
import { getFranchiseDetails } from '@/lib/igdb-api';
import { notFound, useParams } from 'next/navigation';
import { GameCard } from '@/components/game-card';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import type { Franchise } from '@/lib/types';
import Loading from './loading';

import { useLanguage } from '@/context/language-context';

export default function FranchiseDetailPage() {
  const params = useParams();
  const franchiseId = parseInt(params.id as string, 10);

  const [franchise, setFranchise] = useState<Franchise | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  const fetchDetails = useCallback(async () => {
    if (isNaN(franchiseId)) {
        notFound();
        return;
    }
    setLoading(true);
    try {
        const franchiseDetails = await getFranchiseDetails(franchiseId);
    
        if (!franchiseDetails) {
            notFound();
            return;
        }
        setFranchise(franchiseDetails);
    } catch (error) {
        console.error("Failed to fetch franchise details", error);
        notFound();
    } finally {
        setLoading(false);
    }
  }, [franchiseId]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  if (loading || !franchise) {
    return <Loading />;
  }

  return (
    <div>
    <div className="relative h-[30vh] md:h-[40vh] w-full">
        {franchise.coverUrl && franchise.coverUrl !== '/placeholder.jpg' ? (
        <Image
            src={franchise.coverUrl}
            alt={`Couverture de la franchise ${franchise.name}`}
            fill
            className="object-cover object-top"
            priority
            data-ai-hint="game franchise art"
        />
        ) : (
        <div className="bg-muted w-full h-full" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute top-4 left-4 z-10">
        <Button asChild variant="secondary" size="sm">
            <Link href="/franchises">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('backToFranchises')}
            </Link>
        </Button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 z-10">
            <div className="container mx-auto px-4 sm:px-6 md:px-8">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-white" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                    {franchise.name}
                </h1>
            </div>
        </div>
    </div>

    <main className="container mx-auto px-4 sm:px-6 md:px-8 py-8">
        <h2 className="text-3xl font-bold tracking-tight mb-6">{t('sagaGames')} ({franchise.games.length})</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {franchise.games.map(game => (
            <GameCard key={game.id} game={game} />
        ))}
        </div>
    </main>
    </div>
  );
}
