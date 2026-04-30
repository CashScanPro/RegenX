import Link from 'next/link';
export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-950 py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-green-400 hover:text-green-300 mb-8 inline-block">&larr; Retour</Link>
        <h1 className="text-4xl font-bold mb-8">Politique de Confidentialite</h1>
        <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Responsable du traitement</h2>
            <p>RegenX (CashScanPro) est responsable du traitement de vos donnees personnelles conformement au RGPD (Reglement UE 2016/679).</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Donnees collectees</h2>
            <p>Nous collectons: email, nom, donnees de profil fitness (age, poids, taille), historique des entrainements, sessions IA, et donnees de progression. Ces donnees sont necessaires pour fournir notre service de coaching personnalise.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Vos droits RGPD</h2>
            <p>Vous disposez des droits suivants: acces, rectification, effacement, portabilite, opposition et limitation du traitement. Exercez-les via votre dashboard ou en contactant privacy@regenx.eu.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Securite</h2>
            <p>Vos donnees sont stockees sur Supabase (UE) avec chiffrement en transit et au repos. Nous appliquons des mesures de securite conformes aux standards industriels.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Contact</h2>
            <p>DPO: privacy@regenx.eu | Adresse: [Adresse legale RegenX]</p>
          </section>
        </div>
      </div>
    </div>
  );
}
