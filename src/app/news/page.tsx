'use client';

import { getNewsFromRss } from '@/lib/rss';
import { NewsCard, NewsCardSkeleton } from '@/components/news-card';
import { useState, useEffect } from 'react';
import type { NewsArticle } from '@/lib/types';
import { useLanguage } from '@/context/language-context';

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const data = await getNewsFromRss();
        setArticles(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  return (
    <main className="container mx-auto px-4 sm:px-6 md:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tighter">{t('newsTitle')}</h1>
        <p className="text-lg text-muted-foreground mt-2">{t('newsSubtitle')}</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 9 }).map((_, i) => (
            <NewsCardSkeleton key={i} />
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-20">
            <h2 className="text-2xl font-semibold mb-2">{t('noNewsFound')}</h2>
            <p className="text-muted-foreground">{t('tryAdjusting')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map(article => (
            <NewsCard key={article.guid} article={article} />
          ))}
        </div>
      )}
    </main>
  );
}
