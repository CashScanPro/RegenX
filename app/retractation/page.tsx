'use client';

import { useState } from 'react';
import Link from 'next/link';

const CONTACT_EMAIL = 'jlshop06190@gmail.com';

export default function RetractationPage() {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [forfait, setForfait] = useState('');
  const [dateSouscription, setDateSouscription] = useState('');
  const [motif, setMotif] = useState('');

  function buildMailto() {
    const sujet = 'Demande de retractation - RegenX';
    const corps =
      'Bonjour,\n\n' +
      'Conformement a mon droit de retractation de 14 jours, je souhaite renoncer a mon contrat / abonnement RegenX.\n\n' +
      'Nom : ' + nom + '\n' +
      'Email du compte : ' + email + '\n' +
      'Forfait concerne : ' + forfait + '\n' +
      'Date de souscription : ' + dateSouscription + '\n' +
      'Motif (facultatif) : ' + motif + '\n\n' +
      'Je vous remercie de proceder a l annulation de mon abonnement et au remboursement eventuel, puis de m envoyer une confirmation d annulation.\n\n' +
      'Cordialement,\n' + nom;
    return 'mailto:' + CONTACT_EMAIL + '?subject=' + encodeURIComponent(sujet) + '&body=' + encodeURIComponent(corps);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    window.location.href = buildMailto();
  }

  const inputClass =
    'w-full rounded-md bg-gray-900 border border-gray-700 px-3 py-2 text-gray-100 focus:outline-none focus:border-green-400';

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <header className="border-b border-gray-800 bg-gray-950">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-green-400 font-bold text-xl">RegenX</span>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-white mb-2">Droit de retractation</h1>
        <p className="text-gray-400 text-sm mb-10">
          Renoncer a votre contrat - Article L221-18 du Code de la consommation
        </p>

        <section className="mb-10 space-y-4 text-gray-300 leading-relaxed">
          <p>
            Conformement a la loi, vous disposez d un delai de quatorze (14) jours a compter
            de la souscription de votre abonnement pour exercer votre droit de retractation,
            sans avoir a justifier de motif ni a payer de penalite.
          </p>
          <p>
            Pour exercer ce droit, remplissez le formulaire ci-dessous. Votre logiciel de
            messagerie s ouvrira avec une demande pre-remplie adressee a notre service. Des
            reception de votre demande, nous procedons a l annulation de votre abonnement et,
            le cas echeant, au remboursement, puis nous vous adressons une confirmation
            d annulation.
          </p>
          <p>
            Vous pouvez egalement nous ecrire directement a l adresse{' '}
            <a href={'mailto:' + CONTACT_EMAIL} className="text-green-400 underline">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </section>

        <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
          <div>
            <label className="block text-sm mb-1 text-gray-300">Nom et prenom</label>
            <input
              type="text"
              required
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-gray-300">Email du compte</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-gray-300">Forfait concerne</label>
            <select
              value={forfait}
              onChange={(e) => setForfait(e.target.value)}
              className={inputClass}
            >
              <option value="">Selectionner...</option>
              <option value="Starter (29 EUR/mois)">Starter (29 EUR/mois)</option>
              <option value="Pro (99 EUR/mois)">Pro (99 EUR/mois)</option>
              <option value="Equipe (149 EUR/mois)">Equipe (149 EUR/mois)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1 text-gray-300">Date de souscription</label>
            <input
              type="date"
              value={dateSouscription}
              onChange={(e) => setDateSouscription(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-gray-300">Motif (facultatif)</label>
            <textarea
              rows={3}
              value={motif}
              onChange={(e) => setMotif(e.target.value)}
              className={inputClass}
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-400 text-gray-950 font-semibold px-6 py-3 rounded-md transition-colors"
          >
            Envoyer ma demande de retractation
          </button>
        </form>

        <p className="text-gray-500 text-xs mt-8">
          En cliquant sur le bouton, votre messagerie s ouvre avec un e-mail pre-rempli a
          destination de notre service. Aucune donnee n est transmise automatiquement.
        </p>
      </main>
    </div>
  );
}
