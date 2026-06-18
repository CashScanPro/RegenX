import Link from 'next/link';
import { Zap } from 'lucide-react';

export const metadata = {
  title: 'Politique de Confidentialité | RegenX',
  description: 'Politique de confidentialité et protection des données personnelles de RegenX, conforme au RGPD.',
};

const LAST_UPDATED = '1er mai 2026';
const COMPANY = 'RegenX, entreprise individuelle (auto-entrepreneur)';
const DPO_EMAIL = 'jlshop06190@gmail.com';
const LEGAL_EMAIL = 'jlshop06190@gmail.com';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Nav */}
      <nav className="border-b border-white/5 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-lg">RegenX</span>
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-black mb-2">Politique de Confidentialité</h1>
        <p className="text-slate-400 mb-4">Dernière mise à jour : {LAST_UPDATED}</p>
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-emerald-300 text-sm mb-12">
          Chez RegenX, la protection de vos données personnelles est une priorité.
          Cette politique est conforme au <strong>Règlement Général sur la Protection des Données (RGPD) — Règlement UE 2016/679</strong>.
        </div>

        <div className="space-y-10 text-slate-300 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Responsable du traitement</h2>
            <p>
              Le responsable du traitement est <strong>{COMPANY}</strong>, immatriculée en France.
              Pour toute question relative à vos données personnelles, contactez notre Délégué à la Protection des Données (DPO) :{' '}
              <a href={`mailto:${DPO_EMAIL}`} className="text-emerald-400 hover:text-emerald-300 underline">{DPO_EMAIL}</a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Données collectées</h2>
            <p className="mb-3">Nous collectons uniquement les données nécessaires au fonctionnement du service :</p>

            <div className="space-y-4">
              <div className="bg-white/3 border border-white/8 rounded-xl p-4">
                <h3 className="font-semibold text-white mb-2">Données de compte</h3>
                <ul className="list-disc list-inside text-slate-400 text-sm space-y-1">
                  <li>Nom et prénom</li>
                  <li>Adresse email</li>
                  <li>Mot de passe (hashé, jamais stocké en clair)</li>
                </ul>
              </div>
              <div className="bg-white/3 border border-white/8 rounded-xl p-4">
                <h3 className="font-semibold text-white mb-2">Données de profil fitness</h3>
                <ul className="list-disc list-inside text-slate-400 text-sm space-y-1">
                  <li>Âge, poids, taille, sexe biologique (pour le calcul des macros)</li>
                  <li>Objectifs fitness, niveau sportif, restrictions alimentaires</li>
                  <li>Historique des entraînements et suivi de progression</li>
                </ul>
              </div>
              <div className="bg-white/3 border border-white/8 rounded-xl p-4">
                <h3 className="font-semibold text-white mb-2">Données techniques</h3>
                <ul className="list-disc list-inside text-slate-400 text-sm space-y-1">
                  <li>Adresse IP (anonymisée après 30 jours)</li>
                  <li>Type de navigateur et système exploitation</li>
                  <li>Pages visitées et durée des sessions (analytics anonymes)</li>
                </ul>
              </div>
              <div className="bg-white/3 border border-white/8 rounded-xl p-4">
                <h3 className="font-semibold text-white mb-2">Données de paiement</h3>
                <p className="text-slate-400 text-sm">
                  Nous ne stockons <strong className="text-white">aucune donnée de carte bancaire</strong>.
                  Les paiements sont traités exclusivement par Stripe (certifié PCI-DSS niveau 1).
                  Seul un identifiant Stripe anonymisé est conservé.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Bases légales et finalités</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-2 pr-4 text-white font-semibold">Finalité</th>
                    <th className="text-left py-2 pr-4 text-white font-semibold">Base légale</th>
                  </tr>
                </thead>
                <tbody className="text-slate-400">
                  {[
                    ['Fourniture du service RegenX', "Exécution du contrat (Art. 6.1.b)"],
                    ['Personnalisation des programmes IA', "Exécution du contrat (Art. 6.1.b)"],
                    ['Envoi d\'emails transactionnels', "Exécution du contrat (Art. 6.1.b)"],
                    ['Analytics anonymes (PostHog)', "Intérêt légitime (Art. 6.1.f)"],
                    ['Newsletter marketing (optionnel)', "Consentement (Art. 6.1.a)"],
                    ['Obligations légales et comptables', "Obligation légale (Art. 6.1.c)"],
                  ].map(([fin, base]) => (
                    <tr key={fin} className="border-b border-white/5">
                      <td className="py-2 pr-4">{fin}</td>
                      <td className="py-2">{base}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Hébergement et transferts de données</h2>
            <p className="mb-3">
              Vos données sont hébergées <strong className="text-white">exclusivement en Europe</strong> :
            </p>
            <ul className="list-disc list-inside text-slate-400 space-y-1">
              <li><strong className="text-white">Supabase EU</strong> (Paris, France) — base de données et authentification</li>
              <li><strong className="text-white">Vercel EU</strong> — hébergement de l'application web</li>
              <li><strong className="text-white">PostHog EU</strong> — analytics anonymes, sans cookies tiers</li>
              <li><strong className="text-white">Stripe</strong> — paiements sécurisés, certifié PCI-DSS</li>
            </ul>
            <p className="mt-3">
              Aucun transfert de données vers des pays hors UE/EEE n'est effectué sans garanties appropriées (clauses contractuelles types).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Durée de conservation</h2>
            <ul className="list-disc list-inside text-slate-400 space-y-1">
              <li>Données de compte actif : conservées pendant toute la durée de l'abonnement + 3 ans</li>
              <li>Données après suppression du compte : effacement sous 30 jours</li>
              <li>Données de facturation : 10 ans (obligation légale comptable)</li>
              <li>Logs techniques : 12 mois maximum</li>
              <li>Données analytics anonymisées : 24 mois</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. Vos droits RGPD</h2>
            <p className="mb-3">Conformément au RGPD, vous disposez des droits suivants :</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                ['Droit d\'accès', 'Obtenir une copie de toutes vos données'],
                ['Droit de rectification', 'Corriger des données inexactes'],
                ['Droit à l\'effacement', 'Supprimer votre compte et données'],
                ['Droit à la portabilité', 'Exporter vos données en JSON/CSV'],
                ['Droit d\'opposition', 'S\'opposer au traitement marketing'],
                ['Droit à la limitation', 'Geler le traitement de vos données'],
              ].map(([droit, desc]) => (
                <div key={droit} className="bg-white/3 border border-white/8 rounded-lg p-3">
                  <div className="font-semibold text-white text-sm">{droit}</div>
                  <div className="text-slate-400 text-xs mt-1">{desc}</div>
                </div>
              ))}
            </div>
            <p className="mt-4">
              Pour exercer vos droits :{' '}
              <a href={`mailto:${DPO_EMAIL}`} className="text-emerald-400 hover:text-emerald-300 underline">{DPO_EMAIL}</a>.
              Réponse sous 30 jours maximum.
            </p>
            <p className="mt-2">
              Vous pouvez également introduire une réclamation auprès de la{' '}
              <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 underline">CNIL</a>
              {' '}(Commission Nationale de l'Informatique et des Libertés).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">7. Cookies et traceurs</h2>
            <p className="mb-3">Nous utilisons uniquement :</p>
            <ul className="list-disc list-inside text-slate-400 space-y-1">
              <li><strong className="text-white">Cookies de session</strong> — indispensables à l'authentification (durée : session)</li>
              <li><strong className="text-white">Analytics PostHog</strong> — sans cookie tiers, données anonymisées, hébergées en EU</li>
            </ul>
            <p className="mt-3 text-slate-400">
              Nous n'utilisons <strong className="text-white">aucun cookie publicitaire ou de suivi inter-sites</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">8. Sécurité des données</h2>
            <ul className="list-disc list-inside text-slate-400 space-y-1">
              <li>Chiffrement TLS 1.3 pour toutes les communications</li>
              <li>Chiffrement AES-256 au repos pour les données sensibles</li>
              <li>Accès aux données restreint au personnel autorisé</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">9. Intelligence artificielle</h2>
            <p>
              RegenX utilise des modèles d'IA (OpenAI) pour générer des programmes personnalisés.
              Vos données de profil fitness sont transmises à l'API OpenAI de manière pseudonymisée
              pour la génération de contenu uniquement. OpenAI est contractuellement lié par des
              obligations de confidentialité et n'utilise pas ces données pour entraîner ses modèles.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">10. Modifications</h2>
            <p>
              Nous pouvons modifier cette politique à tout moment. En cas de modification substantielle,
              vous serez notifié par email 30 jours avant l'entrée en vigueur. La version en vigueur
              est toujours disponible sur cette page.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">11. Contact DPO</h2>
            <p>
              Délégué à la Protection des Données :{' '}
              <a href={`mailto:${DPO_EMAIL}`} className="text-emerald-400 hover:text-emerald-300 underline">{DPO_EMAIL}</a>
              <br />
              Questions générales :{' '}
              <a href={`mailto:${LEGAL_EMAIL}`} className="text-emerald-400 hover:text-emerald-300 underline">{LEGAL_EMAIL}</a>
            </p>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-wrap gap-4 text-sm text-slate-500">
          <Link href="/terms" className="hover:text-white transition">CGU</Link>
          <Link href="/contact" className="hover:text-white transition">Contact</Link>
          <Link href="/" className="hover:text-white transition">{"Retour à l'accueil"}</Link>
        </div>
      </div>
    </main>
  );
              }
