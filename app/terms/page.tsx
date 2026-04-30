import Link from 'next/link';
export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-950 py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-green-400 hover:text-green-300 mb-8 inline-block">&larr; Retour</Link>
        <h1 className="text-4xl font-bold mb-8">Conditions Generales d Utilisation</h1>
        <div className="space-y-6 text-gray-300">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Objet</h2>
            <p>RegenX est une plateforme SaaS de coaching fitness par intelligence artificielle. L abonnement Premium est de 99 EUR/mois sans engagement.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Abonnement</h2>
            <p>L abonnement est mensuel et se renouvelle automatiquement. Vous pouvez resilier a tout moment depuis votre espace client. La resiliation prend effet a la fin de la periode en cours.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Limitation de responsabilite</h2>
            <p>Les recommandations de RegenX ne remplacent pas un avis medical professionnel. Consultez un medecin avant de commencer tout programme d exercice ou de supplementation.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Droit applicable</h2>
            <p>Les presentes CGU sont soumises au droit francais. Tout litige sera soumis aux tribunaux competents de Paris.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
