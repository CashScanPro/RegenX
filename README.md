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

---

## 🤖 Roadmap IA — Génération de programmes personnalisés (plan de travail)

> **Statut au 2026-07-31 :** audit terminé, roadmap validée, implémentation à démarrer.
> Ce document sert de reprise de travail. Rien n'est encore implémenté côté génération IA.

### 📋 Constat d'audit (état réel du code, vérifié)

- **L'IA existe mais n'est pas branchée à la génération.** `lib/openai.ts` contient un endpoint chatbot conversationnel (`/api/ai/coach`, GPT-4o en streaming) qui fonctionne.
- **Les fonctions `generateWorkoutPlan()` et `generateNutritionPlan()` sont écrites dans `lib/openai.ts` mais ne sont appelées NULLE PART.** Code mort à raccorder.
- **Les pages `/dashboard/workouts` et `/dashboard/nutrition` affichent du contenu 100 % codé en dur** (démo). Vérifié : au chargement, la page ne fait AUCUN appel réseau (ni API, ni base). Tout client verrait le même « Semaine 7/12 ».
- **Les boutons niveau (Débutant/Intermédiaire/Avancé) ne déclenchent aucune génération personnalisée.**
- **Aucun cron / tâche planifiée** dans `vercel.json` → rien n'envoie de programme hebdomadaire automatique.
- Stripe (abonnement) et `isSubscriptionActive()` semblent réellement câblés.

### 🗄️ Schéma Supabase (vérifié — `supabase/migrations/001_initial_schema.sql`)

Bonne nouvelle : la base est déjà bien conçue. Tables : `profiles`, `subscriptions`, `workouts`, `nutrition_plans`, `ai_sessions`, `progress_tracking`.

- **`profiles`** contient déjà : `date_of_birth`, `gender`, `height_cm`, `weight_kg`, `fitness_level` (beginner/intermediate/advanced), `fitness_goals[]`, `health_conditions[]`, `preferred_language`, `gdpr_consent`.
- **`workouts`** : `name`, `type` (strength/cardio/hiit/yoga/recovery/mobility), `difficulty`, `exercises` (JSONB), `ai_generated`, `scheduled_for`.
- **`nutrition_plans`** : `type`, `calories_target`, `protein_g`, `carbs_g`, `fat_g`, `meals` (JSONB), `supplements`, `cbd_recommendations`, `active`, `ai_generated`.

→ Quasiment aucune nouvelle table à créer : le stockage est prêt.

### ⚠️ Incohérence à corriger en priorité

Il existe DEUX notions de « niveau » déconnectées :
- `/api/preferences` écrit `plan_type` + `level` (`debutant`/`intermediaire`/`avance`) dans les **métadonnées Auth** (`supabase.auth.updateUser`).
- `generateWorkoutPlan()` attend `fitnessLevel` (`beginner`/`intermediate`/`advanced`) depuis la table **`profiles`**.

→ À unifier, sinon l'IA ne recevra jamais le bon niveau.

### 🛣️ Roadmap en 6 étapes (~5 à 6 jours de dev)

1. **Collecte du profil client** (~0,5–1 j) — formulaire d'onboarding qui remplit `profiles` (niveau, objectifs, jours dispo, matériel, poids/taille/âge). **← ON COMMENCE ICI.**
2. **Endpoint génération entraînement** (~0,5 j) — `/api/workouts/generate` : lit le profil → appelle `generateWorkoutPlan` → sauvegarde dans `workouts` (`ai_generated: true`).
3. **Endpoint génération nutrition** (~0,5 j) — idem avec `generateNutritionPlan` → table `nutrition_plans`.
4. **Afficher les vraies données** (~1,5–2 j) — brancher les pages dashboard sur la base au lieu du contenu codé en dur ; les boutons niveau déclenchent une (re)génération. ⚠️ ne pas casser le design premium.
5. **Génération hebdomadaire auto** (~1 j) — Vercel Cron (ex. tous les lundis) régénère le programme des abonnés actifs ; email optionnel via `lib/email`.
6. **Garde-fous** (~0,5 j) — vérif abonnement actif, gestion erreurs OpenAI (timeout/JSON invalide → réessai), surveillance des coûts API (chaque génération = appel GPT-4o payant).

### 🎯 Détail Étape 1 (à attaquer demain)

Deux fichiers, sur une branche dédiée `feat/onboarding-profil` (pas directement main) :
- **Route `/api/profile`** : lit + écrit le profil complet dans `profiles`, en respectant les contraintes CHECK du schéma, uniquement pour l'utilisateur connecté.
- **Page `/dashboard/onboarding`** : formulaire premium (objectif, niveau, jours/sem, matériel, poids/taille/âge, type d'alimentation) → POST vers `/api/profile` → redirection dashboard.

À cette étape on **collecte et stocke** seulement. La génération IA vient à l'étape 2.

**Question ouverte à trancher :** inclure ou non le champ « conditions de santé / blessures » (`profiles.health_conditions`) ? Utile pour l'IA mais = donnée de santé sensible (RGPD renforcé).

### 🚨 Points de vigilance (non négociables)

- **Clés d'environnement** : à vérifier PAR LE PROPRIÉTAIRE dans Vercel — `OPENAI_API_KEY`, clés Supabase. Sans elles, la génération échoue silencieusement. (Claude n'y a pas accès.)
- **RGPD** : le formulaire collecte des données personnelles (mensurations, santé). Consentement + relecture juridique recommandés.
- **Disclaimer médical** : produit qui donne des conseils sport/nutrition à de vrais utilisateurs → disclaimer clair obligatoire, idéalement relecture par un professionnel de santé qualifié. La justesse des programmes générés par l'IA ne peut pas être garantie.
- **Méthode** : chaque étape est montrée avant commit, committée sur branche dédiée, testée, puis mergée sur main SEULEMENT avec feu vert explicite.


---

## ✅ Suivi Étape 1 — Onboarding profil (branche feat/onboarding-profil)

Statut : **implémentée et testée en preview Vercel** (build vert). En attente de merge sur main.

### Fait
- **Route API `app/api/profile/route.ts`** : GET (lecture) + POST (écriture) du profil de l'utilisateur connecté, avec validation des contraintes CHECK (gender, fitness_level, taille 90–250 cm, poids 30–300 kg). Écrit dans la table `profiles` avec les valeurs anglaises (`beginner/intermediate/advanced`) → résout l'incohérence de niveau signalée dans l'audit.
- **Page `app/dashboard/onboarding/page.tsx`** : formulaire premium (design or RegenX) — nom, date de naissance, genre, taille, poids, objectifs multi-choix, niveau, jours/semaine, matériel, type d'alimentation.
- **Encodage jours/matériel/alimentation** dans `fitness_goals[]` (préfixes `days:`, `equipment:`, `diet:`) → aucune migration nécessaire (option 1).
- **Champ santé (texte libre)** stocké dans `health_conditions[]`, avec **case de consentement RGPD dédiée obligatoire** (vérifiée côté client ET serveur). Garde-fou testé : sans consentement, l'enregistrement est refusé.
- **Taille et poids obligatoires** (attribut required + validation formulaire) — utiles pour la personnalisation IA.
- **Disclaimer médical** affiché en bas du formulaire.
- Correctifs : type `Record<string, unknown>` sur l'objet updates (build TS) ; normalisation des champs numériques vides (`""` → null) via `toNumberOrNull()`.
- **Test end-to-end validé** : soumission du formulaire (173 cm, 54 kg, objectifs Force + Mobilité, spondylarthrite + consentement) → redirection `/dashboard/onboarding` vers `/dashboard` (succès).

### Reste à faire
- **Ajouter un lien "Mon profil" dans le menu (sidebar)** — la page n'est accessible que par URL directe (`/dashboard/onboarding`) pour l'instant.
- **Merger la branche `feat/onboarding-profil` sur main** après feu vert.
- **Étape 2 (prochaine)** : endpoint `/api/workouts/generate` — lit le profil → génère un programme via **Claude (API Anthropic)** au lieu d'OpenAI → sauvegarde dans `workouts` (`ai_generated: true`). Nécessite la clé `ANTHROPIC_API_KEY` dans Vercel (à configurer par le propriétaire).
- **Décision IA** : migration OpenAI → Claude actée pour la génération (SDK `@anthropic-ai/sdk`, prompts en sortie JSON structurée).
- Pré-remplir le formulaire avec le profil existant (GET /api/profile) à l'ouverture, pour permettre la modification.
