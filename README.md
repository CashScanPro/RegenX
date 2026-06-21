# RegenX — Plateforme SaaS Fitness IA

> Coach fitness IA personnalisé, disponible sur **Web** et **Mobile**. 3 forfaits : Starter 29€, Pro 99€, Équipe 149€/mois.

**Site en ligne :** https://regenx-phi.vercel.app
**Éditeur / Exploitant :** RegenX — entreprise individuelle (auto-entrepreneur)
**Contact :** jlshop06190@gmail.com

## Stack Technique

| Couche | Technologie |
|---|---|
| Web Frontend | Next.js 14 (App Router) + Tailwind CSS + TypeScript |
| Mobile | React Native + Expo SDK 51 + Expo Router |
| Backend | Supabase (PostgreSQL + Auth + Storage) — hébergement région UE (France) |
| IA | OpenAI GPT-4o (streaming) |
| Paiement | Stripe (abonnements multi-forfaits) |
| Analytics | PostHog (région UE) |
| Déploiement Web | Vercel |
| Déploiement Mobile | Expo EAS Build |

## Architecture du Projet

```
RegenX/
├── app/                    # Next.js App Router (Web)
│   ├── page.tsx            # Landing page
│   ├── layout.tsx          # Layout principal
│   ├── globals.css
│   ├── login/page.tsx      # Connexion
│   ├── register/page.tsx   # Inscription
│   ├── dashboard/
│   │   ├── page.tsx        # Dashboard principal ✅
│   │   ├── coach/page.tsx  # Chat IA (streaming) ✅
│   │   ├── workouts/page.tsx # Programmes entraînement ✅
│   │   ├── nutrition/page.tsx # Plans nutritionnels ✅
│   │   └── progress/page.tsx # Suivi de progression ✅
│   ├── account/page.tsx    # Compte + RGPD + abonnement ✅
│   ├── pricing/page.tsx    # Tarification ✅
│   ├── contact/page.tsx    # Contact ✅
│   ├── privacy/page.tsx    # Politique confidentialité ✅
│   ├── terms/page.tsx      # CGU ✅
│   ├── mentions-legales/page.tsx # Mentions légales ✅
│   ├── gdpr/page.tsx       # Droits RGPD ✅
│   └── api/
│       ├── ai/coach/route.ts  # Chat IA streaming GPT-4o ✅
│       ├── stripe/            # Webhook + checkout + billing portal ✅
│       ├── gdpr/route.ts      # Export/suppression données ✅
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
NEXT_PUBLIC_APP_URL=
```

> **Sécurité :** seules les variables préfixées `NEXT_PUBLIC_` sont exposées côté client. Les clés secrètes (service role, Stripe secret, OpenAI) restent côté serveur uniquement. À faire avant lancement : rotation des clés et vérification que la RLS (Row Level Security) Supabase est bien activée.

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

## Partenaires

RegenX s'appuie sur un réseau partenaire pour ses programmes et contenus : **Eric Favre** et **Essan NFC**.

## Conformité RGPD

- Consentement explicite à l'inscription
- Export des données : `GET /api/gdpr`
- Suppression du compte : `DELETE /api/gdpr`
- Hébergement des données dans l'UE (Supabase région France ; PostHog UE)
- Politique de confidentialité et mentions légales complètes

## Pays cibles

France, Allemagne, Espagne, Italie, Portugal, Pays-Bas, Belgique, Suisse, Royaume-Uni

## Statut du projet

🚧 **En construction / pré-lancement.** Les pages publiques, l'authentification, le tunnel de paiement Stripe, le coach IA et l'espace membre sont en place. Des finalisations restent à effectuer avant la commercialisation.

## Journal des modifications récentes

- **Mentions légales :** statut juridique corrigé en *entreprise individuelle (auto-entrepreneur)* (au lieu de SAS) sur les CGU et la politique de confidentialité.
- **Contact :** toutes les adresses e-mail uniformisées vers l'adresse de contact unique.
- **Hébergement :** précisé Supabase région France et PostHog UE dans la politique de confidentialité.
- **Statistiques landing :** bloc reformulé de façon honnête (réseau partenaire Eric Favre · Essan NFC, programmes personnalisés par IA, satisfait ou remboursé 14 j, hébergement & données UE) — suppression des chiffres non vérifiables.
- **Sécurité :** retrait des mentions non vérifiables (2FA, audits réguliers) tant qu'elles ne sont pas effectivement en place.
- **Accès VIP :** ajout d'une liste blanche d'accès gratuit (whitelist) côté serveur.
- **Design landing :** harmonisation des logos partenaires (cartes carrées identiques), allègement et repositionnement des libellés du bloc statistiques.
- **Design page d'inscription :** texte du panneau visuel gauche centré dans l'image et voile assombri pour une meilleure lisibilité.


## Internationalisation (FR / PT) — suivi des traductions

Le site est bilingue **français / portugais**. La langue est gérée via `lib/i18n.tsx` (contexte `LanguageProvider`, hook `useTranslation`, clé `localStorage` `regenx_lang`). Le sélecteur de langue (FR / PT) se trouve dans la barre de navigation de la page d'accueil ; le choix est mémorisé et s'applique à toutes les pages branchées sur i18n.

### Pages branchées sur i18n (traduites FR + PT)
- Page d'accueil (`app/page.tsx`)
- - Inscription (`app/register/page.tsx`)
  - - Contact (`app/contact/page.tsx`)
    - - Bannière cookies (`components/CookieBanner.tsx`)
      - - **Tarification (`app/pricing/page.tsx`)** — branchée sur i18n via le namespace `pricingPage` (ajouté en FR et PT dans `lib/i18n.tsx`).
       
        - ### Pages restant à traiter
        - - **`app/account/page.tsx`** (espace membre) : c'est un *Server Component* (auth Supabase côté serveur). Le hook `useTranslation` étant client, son branchement i18n nécessite une restructuration (extraction d'un sous-composant client ou passage des libellés en props). À faire avec précaution pour ne pas casser l'authentification.
          - - **`app/retractation/page.tsx`** (droit de rétractation) : actuellement en français en dur ; à brancher sur i18n si besoin d'une version PT.
            - - **Pages légales** (`app/terms`, `app/privacy`, `app/mentions-legales`) : textes juridiques laissés en français volontairement. Leur traduction PT doit être **relue par une personne compétente** avant publication (valeur juridique).
             
              - ### Droit de rétractation
              - - Lien « Droit de rétractation » ajouté dans le pied de page (`app/page.tsx`).
                - - Page `app/retractation/page.tsx` : information sur le délai de 14 jours + formulaire qui ouvre un e-mail `mailto:` pré-rempli vers **jlshop06190@gmail.com**. Le traitement (annulation Stripe + confirmation au client) est manuel.
                  - 
