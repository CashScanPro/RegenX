import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import { PHProvider } from './providers';
import { CookieBanner } from '@/components/CookieBanner';
import { LanguageProvider } from '@/lib/i18n';

const SITE_URL = 'https://regenx-phi.vercel.app';

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
metadataBase: new URL(SITE_URL),
title: {
default: 'RegenX — Coach Fitness IA & Nutrition Sportive Personnalisee',
template: '%s | RegenX',
},
description: 'RegenX, plateforme SaaS de coaching fitness par IA : programmes d entrainement et plans nutritionnels personnalises. En partenariat avec Eric Favre.',
keywords: ['coach fitness IA', 'programme entrainement', 'nutrition personnalisee', 'recuperation sportive', 'SaaS fitness', 'coach sportif en ligne', 'Eric Favre'],
authors: [{ name: 'RegenX' }],
creator: 'RegenX',
publisher: 'RegenX',
manifest: '/manifest.json',
alternates: {
canonical: SITE_URL,
languages: {
'fr-FR': SITE_URL,
},
},
icons: {
icon: '/logo RengenX.webp',
shortcut: '/logo RengenX.webp',
apple: '/logo RengenX.webp',
},
openGraph: {
type: 'website',
locale: 'fr_FR',
url: SITE_URL,
siteName: 'RegenX',
title: 'RegenX — Coach Fitness IA & Nutrition Sportive Personnalisee',
description: 'Coach fitness personnalise par IA : sport, nutrition, recuperation. En partenariat avec Eric Favre. Sans engagement.',
},
twitter: {
card: 'summary_large_image',
title: 'RegenX — Coach Fitness IA & Nutrition Sportive Personnalisee',
description: 'Coach fitness personnalise par IA : sport, nutrition, recuperation. En partenariat avec Eric Favre.',
},
robots: { index: true, follow: true },
};

export const viewport = {
themeColor: '#000000',
};

const organizationSchema = {
'@context': 'https://schema.org',
'@type': 'Organization',
name: 'RegenX',
url: SITE_URL,
logo: SITE_URL + '/logo RengenX.webp',
email: 'jlshop06190@gmail.com',
description: 'RegenX est une plateforme SaaS de coaching fitness par intelligence artificielle. Elle genere des programmes d entrainement et des plans nutritionnels personnalises, avec suivi de progression, en partenariat avec la marque de nutrition sportive Eric Favre.',
slogan: 'Ton coach fitness 100 % personnalise',
foundingDate: '2026',
areaServed: 'EU',
sameAs: [],
};

const websiteSchema = {
'@context': 'https://schema.org',
'@type': 'WebSite',
name: 'RegenX',
url: SITE_URL,
inLanguage: 'fr-FR',
publisher: { '@type': 'Organization', name: 'RegenX' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
return (
<html lang="fr" className={`${playfair.variable} ${inter.variable}`}>
<head>
<script
type="application/ld+json"
dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
/>
<script
type="application/ld+json"
dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
/>
</head>
<body>
<PHProvider>
<LanguageProvider>
{children}
<CookieBanner />
</LanguageProvider>
</PHProvider>
<script
dangerouslySetInnerHTML={{
__html: `if ('serviceWorker' in navigator) { window.addEventListener('load', function () { navigator.serviceWorker.register('/sw.js').catch(function (e) { console.error('SW registration failed', e); }); }); }`,
}}
/>
</body>
</html>
);
}
