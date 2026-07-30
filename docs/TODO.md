# RegenX — TODO / Suivi du travail

> Liste des tâches à réaliser avant la commercialisation.
> Statut du projet : reconstruction de l'app en cours.

## Priorité 1 — Bloquant lancement

- [ ] Dashboard « Vue rapide » : les tuiles POIDS ACTUEL et OBJECTIF affichent « Non » au lieu d'une valeur / d'un tiret (mauvaise gestion des valeurs vides).
- [ ] Contraste des textes : sous-titres gris clair illisibles sur les images de fond (pages Entraînements, Nutrition, Dashboard). Ajouter un voile sombre + ombre/couleur plus contrastée.
- [ ] Cohérence abonnement : aligner le nom du plan affiché dans « Mon compte » (actuellement « Premium ») avec la grille tarifaire réelle (Starter / Pro / Équipe).
- [ ] Afficher le statut d'abonnement réel (basé sur la table subscriptions / whitelist) au lieu d'un « Premium / Actif » codé en dur.

## Priorité 2 — Contenu & cohérence

- [ ] Revoir les DESCRIPTIONS des 3 forfaits (les tarifs 29/99/149€ sont bons, seules les descriptions sont à corriger).
- [ ] Harmoniser les avantages annoncés entre la landing et l'espace membre (ex. « IA Coach 2h/jour » vs « 24h/24 »).
- [ ] Mentions légales : corriger la région d'hébergement Supabase (indiqué « AWS EU-West-3 Paris » -> vérifier : projet réel en eu-west-1 / Irlande).

## Priorité 3 — Finitions UX

- [ ] Page 404 personnalisée : actuellement en anglais, fond blanc, sans charte. La refaire en FR avec le thème RegenX + bouton retour.
- [ ] Lien « Tarifs » du menu : l'ancre #pricing ne scrolle pas correctement (ajouter scroll-margin-top pour compenser le header collant).
- [ ] Titre d'onglet dupliqué sur la page Mentions légales (« Mentions Légales | RegenX | RegenX »).
- [ ] Unifier la charte graphique entre pages légales (vert/sombre) et espace membre (doré).
- [ ] Vérifier / tester le rendu responsive mobile (grille des tarifs, menu de navigation).

## Reporté (volontairement)

- [ ] Coach IA : mise en service reportée au premier client (prévu). Clé OpenAI à activer + gérer proprement le message d'erreur en attendant.

## i18n (rappel README)

- [ ] Brancher app/account/page.tsx sur i18n (Server Component -> restructuration prudente).
- [ ] Décider si app/retractation/page.tsx doit avoir une version PT.
- [ ] Faire relire les traductions PT des pages légales avant publication.
