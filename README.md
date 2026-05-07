# RegenX — Plateforme SaaS Fitness IA

> Coach fitness IA personnalisé, disponible sur **Web** et **Mobile**. 3 forfaits : Starter 29€, Pro 99€, Équipe 149€/mois.

## Stack Technique

| Couche | Technologie |
|---|---|
| Web Frontend | Next.js 14 (App Router) + Tailwind CSS + TypeScript |
| Mobile | React Native + Expo SDK 51 + Expo Router |
| Backend | Supabase (PostgreSQL + Auth + Storage) |
| IA | OpenAI GPT-4o (streaming) |
| Paiement | Stripe (abonnements multi-forfaits) |
| Analytics | PostHog |
| Déploiement Web | Vercel |
| Déploiement Mobile | Expo EAS Build |

## Architecture du Projet

```
RegenX/
├── app/                    # Next.js App Router (Web)
│   ├── page.tsx            # Landing page
│   ├── layout.tsx          # Layout principal
│   ├── globals.css
│   ├── (auth)/
│   │   ├── login/page.tsx  # Connexion
│   │   └── register/page.tsx # Inscription
│   ├── dashboard/
│   │   ├── page.tsx        # Dashboard principal ✅
│   │   ├── coach/page.tsx  # Chat IA (streaming) ✅
│   │   ├── workouts/page.tsx # Programmes entraînement ✅
│   │   ├── nutrition/page.tsx # Plans nutritionnels ✅
│   │   └── progress/page.tsx # Suivi de progression ✅
│   ├── account/page.tsx    # Compte + RGPD + abonnement ✅
│   ├── pricing/page.tsx    # Tarification ✅
│   ├── privacy/page.tsx    # Politique confidentialité ✅
│   ├── terms/page.tsx      # CGU ✅
│   ├── gdpr/page.tsx       # Droits RGPD ✅
│   └── api/
│       ├── ai/coach/route.ts  # Chat IA streaming GPT-4o ✅
│       ├── stripe/            # Webhook + checkout + billing portal ✅
│       ├── gdpr/route.ts      # Export/suppression données ✅
│       ├── workouts/route.ts  # CRUD workouts ✅
│       ├── nutrition/route.ts # CRUD plans nutritionnels ✅
│       └── progress/route.ts  # CRUD progress tracking ✅
│
├── mobile/                 # React Native Expo
├── lib/                    # Utilitaires partagés (Web)
├── supabase/migrations/
├── types/
├── middleware.ts
├── next.config.js
├── tailwind.config.ts
└── vercel.json
```

## Installation Web

```bash
npm install
cp .env.example .env.local  # Remplir les variables d'environnement
npm run dev
```

## Variables d'environnement

Voir `.env.example` pour la liste complète.

### Web (.env.local)

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ID_STARTER=
STRIPE_PRICE_ID_PRO=
STRIPE_PRICE_ID_EQUIPE=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
OPENAI_API_KEY=
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Base de données

Tables créées : `profiles`, `subscriptions`, `workouts`, `nutrition_plans`, `ai_sessions`, `progress_tracking`

## Déploiement

### Web (Vercel)
```bash
vercel --prod
```

## Modèle Commercial

- **Starter** : 29€/mois — Accès de base
- **Pro** : 99€/mois — Accès complet
- **Équipe** : 149€/mois — Multi-utilisateurs
- Sans engagement, remboursement si rétractation sous 14 jours

## Conformité RGPD

- Consentement explicite à l'inscription
- Export des données : `GET /api/gdpr`
- Suppression du compte : `DELETE /api/gdpr`
- Stockage sécurisé UE (région Supabase EU)
- Politique de confidentialité complète

## Pays cibles

France, Allemagne, Espagne, Italie, Portugal, Pays-Bas, Belgique, Suisse, Royaume-Uni
