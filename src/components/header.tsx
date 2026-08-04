'use client';

import Link from 'next/link';
import { Gamepad, Compass, Globe, Sun, Moon, Github } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/language-context';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export function Header() {
  const pathname = usePathname();
  const { lang, setLang, t } = useLanguage();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

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
          <div className="flex items-center gap-2 md:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="h-9 w-9 px-0"
              title="Toggle Theme"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLang(lang === 'en' ? 'fr' : 'en')}
              className="flex items-center gap-1 h-9 px-2.5 text-xs font-semibold"
            >
              <Globe className="h-3.5 w-3.5" />
              {lang === 'en' ? 'FR' : 'EN'}
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

        <div className="flex items-center gap-3 flex-wrap justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className="hidden md:flex items-center gap-1.5 h-9 px-3 text-xs font-semibold"
            title="Toggle Theme"
          >
            {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-700" />}
            <span>{isDark ? 'Light' : 'Dark'}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setLang(lang === 'en' ? 'fr' : 'en')}
            className="hidden md:flex items-center gap-1.5 h-9 px-3 text-xs font-semibold"
          >
            <Globe className="h-3.5 w-3.5" />
            <span>{lang === 'en' ? 'FR' : 'EN'}</span>
          </Button>

          <a
            href="https://github.com/geekinc-xyz/gamenexus"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground text-xs font-medium transition-colors"
          >
            <Github className="h-4 w-4" />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
}

