# Etape 2 - Comment activer l'IA le jour venu

Tout le code de generation de programmes par l'IA Claude est **deja pret** dans le projet.
Il ne manque qu'une seule chose pour l'allumer : la **cle API Claude** + un peu de **credits**.
Cette notice explique, pas a pas, quoi faire quand tu auras un budget (par ex. avec ton premier client).

---

## Ce qui est deja fait (code termine)

- `lib/anthropic.ts` : le "cerveau" qui parle a Claude et fabrique le programme.
- `app/api/workouts/generate/route.ts` : l'API qui lit ton profil, appelle Claude, et enregistre le programme dans la table `workouts`.
- Le build passe au vert (aucune erreur de code).

## Ce qui reste a faire (5 minutes, sans toucher au code)

### 1. Creer la cle API Claude
- Aller sur **console.anthropic.com** (le site des developpeurs, PAS claude.ai qui est le chat).
- Se connecter (meme email que claude.ai).
- Ajouter un peu de credits : menu **Billing** > acheter 5 $US suffisent pour des dizaines de generations.
- Aller dans **Settings > API Keys** > bouton **Create Key**.
- Copier la cle (elle commence par `sk-ant-...`). Attention : elle ne s'affiche qu'une seule fois.

### 2. Ajouter la cle dans Vercel
- Aller sur le projet regenx dans **Vercel > Settings > Environment Variables**.
- Bouton **Add Environment Variable**.
- Nom (Key) : `ANTHROPIC_API_KEY` (exactement, en majuscules).
- Valeur (Value) : coller la cle `sk-ant-...`.
- Environnements : cocher **Production** et **Preview**.
- **Save**.

### 3. Redeployer
- Une variable n'est prise en compte qu'apres un nouveau deploiement.
- Dans Vercel > Deployments, relancer un deploiement (Redeploy) de la branche.

### 4. Tester
- Une fois en ligne, declencher une generation (via le bouton dans l'interface, a ajouter a l'etape suivante).
- Verifier qu'un nouveau programme apparait dans la table `workouts` de Supabase.

---

## Bon a savoir

- L'abonnement **claude.ai** (le chat) et l'**API Claude** sont deux choses separees, avec deux paiements differents. L'abonnement chat ne finance PAS l'API.
- L'API est facturee a l'usage : quelques centimes par programme genere.
- Modele utilise dans le code : `claude-3-5-sonnet` (modifiable dans `lib/anthropic.ts`).
