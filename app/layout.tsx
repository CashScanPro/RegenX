import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import { PHProvider } from './providers';
import { CookieBanner } from '@/components/CookieBanner';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'RegenX — Coach Fitness IA',
    template: '%s | RegenX',
  },
  description: 'Plateforme SaaS de coaching fitness par IA. Programmes personnalisés, nutrition, récupération. Sans engagement.',
  keywords: ['coach fitness IA', 'programme entraînement', 'nutrition personnalisée', 'récupération sportive', 'SaaS fitness'],
  authors: [{ name: 'RegenX' }],
  creator: 'RegenX',
  icons: {
    icon: '/logo RengenX.webp',
    shortcut: '/logo RengenX.webp',
    apple: '/logo RengenX.webp',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'RegenX',
    title: 'RegenX — Coach Fitness IA',
    description: 'Coach fitness personnalisé par IA. Sport, nutrition, récupération.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RegenX — Coach Fitness IA',
    description: 'Coach fitness personnalisé par IA. Sport, nutrition, récupération.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        <PHProvider>
          {children}
          <CookieBanner />
        </PHProvider>
      </body>
    </html>
  );
}
