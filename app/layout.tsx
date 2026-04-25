import type { Metadata } from 'next';
import { Carter_One, Chango, Cinzel, Jost, Playfair_Display } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/lib/i18n/LanguageContext';
import { OrderProvider } from '@/components/OrderProvider';

const chango = Chango({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-chango',
  display: 'swap',
});

const carterOne = Carter_One({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-carter',
  display: 'swap',
});

const cinzel = Cinzel({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
});

const jost = Jost({
  subsets: ['latin'],
  variable: '--font-jost',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Orient Express — Cuisine Chinoise | De Wand, Bruxelles',
  description: 'Restaurant Orient Express — Cuisine Chinoise authentique. Wandstraat 16, 1020 Laeken, Bruxelles. Repas sur place et à emporter.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${chango.variable} ${carterOne.variable} ${cinzel.variable} ${jost.variable} ${playfair.variable}`}>
      <body className="font-body bg-bg text-text">
        <LanguageProvider>
          <OrderProvider>
            {children}
          </OrderProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
