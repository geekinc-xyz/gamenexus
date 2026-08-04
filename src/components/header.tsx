'use client';

import Link from 'next/link';
import { Gamepad, Compass, Globe } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/language-context';
import { Button } from '@/components/ui/button';

export function Header() {
  const pathname = usePathname();
  const { lang, setLang, t } = useLanguage();

  const navItems = [
    { href: '/games', label: t('browse'), icon: Compass },
    { href: '/franchises', label: t('franchises') },
    { href: '/studios', label: t('studios') },
    { href: '/news', label: t('news') },
  ];

  return (
    <header className="py-4 px-4 sm:px-6 md:px-8 border-b sticky top-0 bg-background/80 backdrop-blur-sm z-20">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center justify-between w-full md:w-auto gap-8">
          <Link href="/" className="flex items-center gap-2">
            <Gamepad className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground tracking-tight">GameNexus</h1>
          </Link>
          <div className="flex items-center gap-3 md:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLang(lang === 'en' ? 'fr' : 'en')}
              className="flex items-center gap-1.5 h-9 px-3 text-xs font-semibold"
            >
              <Globe className="h-3.5 w-3.5" />
              {lang === 'en' ? 'EN / FR' : 'FR / EN'}
            </Button>
          </div>
        </div>

        <nav className="flex items-center gap-6 overflow-x-auto py-1 max-w-full">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm sm:text-md font-medium transition-colors hover:text-primary flex items-center gap-1.5 whitespace-nowrap',
                  pathname === item.href ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {Icon && <Icon className="h-4 w-4" />}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4 flex-wrap justify-center">
          <div className="hidden md:flex items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLang(lang === 'en' ? 'fr' : 'en')}
              className="flex items-center gap-1.5 h-9 px-3 text-xs font-semibold"
            >
              <Globe className="h-3.5 w-3.5" />
              {lang === 'en' ? 'EN (Switch to FR)' : 'FR (Switch to EN)'}
            </Button>
          </div>

          <div className="flex items-center pt-1">
            <github-button repo="geekinc-xyz/gamenexus" data-show-count="true" data-size="large" aria-label="Star geekinc-xyz/gamenexus on GitHub">Star</github-button>
          </div>
        </div>
      </div>
    </header>
  );
}

