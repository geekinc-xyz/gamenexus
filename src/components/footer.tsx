'use client';

import { useLanguage } from '@/context/language-context';

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="py-4 px-4 sm:px-6 md:px-8 border-t mt-auto">
      <div className="container mx-auto text-center text-sm text-muted-foreground">
        {t('footerCopyright')}
      </div>
    </footer>
  );
}
