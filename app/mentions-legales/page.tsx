import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mentions Légales | RegenX',
  description: 'Mentions légales de RegenX — éditeur, hébergeur, propriété intellectuelle.',
};

export default function MentionsLegalesPage() {
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
        <h1 className="text-3xl font-bold text-white mb-2">Mentions Légales</h1>
        <p className="text-gray-400 text-sm mb-10">Conformément à la loi n° 2004-575 du 21 juin 2004 (LCEN)</p>

        {/* 1. Éditeur */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-green-400 mb-4">1. Éditeur du site</h2>
          <div className="bg-gray-900 rounded-xl p-6 space-y-2 text-gray-300">
            <p><span className="text-gray-400">Nom commercial :</span> <strong className="text-white">RegenX</strong></p>
            <p><span className="text-gray-400">Statut juridique :</span> Auto-entrepreneur (entreprise individuelle)</p>
            <p><span className="text-gray-400">Siège social :</span> 49 chemin du Vallonet, 06190 Roquebrune-Cap-Martin, France</p>
            <p><span className="text-gray-400">SIRET :</span> 848 732 137 00015</p>
            <p><span className="text-gray-400">Directeur de la publication :</span> Le titulaire de l'entreprise individuelle RegenX</p>
            <p><span className="text-gray-400">Contact :</span>{' '}
              <a href="mailto:jlshop06190@gmail.com" className="text-green-400 hover:underline">jlshop06190@gmail.com</a>
            </p>
          </div>
        </section>

        {/* 2. Hébergeur */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-green-400 mb-4">2. Hébergeur</h2>
          <div className="bg-gray-900 rounded-xl p-6 space-y-2 text-gray-300">
            <p><span className="text-gray-400">Société :</span> <strong className="text-white">Vercel Inc.</strong></p>
            <p><span className="text-gray-400">Adresse :</span> 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis</p>
            <p><span className="text-gray-400">Site :</span>{' '}
              <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">vercel.com</a>
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Les données utilisateurs sont stockées sur Supabase (infrastructure AWS EU-West-3 — Paris), garantissant la résidence des données en Europe conformément au RGPD.
            </p>
          </div>
        </section>

        {/* 3. Propriété intellectuelle */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-green-400 mb-4">3. Propriété intellectuelle</h2>
          <div className="bg-gray-900 rounded-xl p-6 text-gray-300 space-y-3">
            <p>
              L'ensemble du contenu de ce site (textes, images, interfaces, code source, logo, marque RegenX) est la propriété exclusive de l'éditeur ou de ses ayants droit, et est protégé par les lois françaises et internationales relatives à la propriété intellectuelle.
            </p>
            <p>
              Toute reproduction, représentation, modification, publication ou adaptation, totale ou partielle, est strictement interdite sans l'accord écrit préalable de l'éditeur.
            </p>
          </div>
        </section>

        {/* 4. Données personnelles */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-green-400 mb-4">4. Données personnelles (RGPD)</h2>
          <div className="bg-gray-900 rounded-xl p-6 text-gray-300 space-y-3">
            <p>
              RegenX collecte et traite des données personnelles dans le cadre de la fourniture de ses services de coaching fitness IA. Ces traitements sont réalisés conformément au Règlement Général sur la Protection des Données (RGPD — UE 2016/679).
            </p>
            <p>
              Vous disposez d'un droit d'accès, de rectification, d'effacement, de portabilité et d'opposition à vos données. Pour exercer ces droits :{' '}
              <a href="mailto:jlshop06190@gmail.com" className="text-green-400 hover:underline">jlshop06190@gmail.com</a>
            </p>
            <p>
              Pour plus d'informations, consultez notre{' '}
              <Link href="/privacy" className="text-green-400 hover:underline">Politique de confidentialité</Link>
              {' '}et notre page{' '}
              <Link href="/gdpr" className="text-green-400 hover:underline">Droits RGPD</Link>.
            </p>
          </div>
        </section>

        {/* 5. Cookies */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-green-400 mb-4">5. Cookies</h2>
          <div className="bg-gray-900 rounded-xl p-6 text-gray-300 space-y-3">
            <p>
              Ce site utilise des cookies techniques nécessaires à son fonctionnement (authentification, session) et des cookies analytiques (PostHog) soumis à votre consentement préalable.
            </p>
            <p>
              Vous pouvez accepter ou refuser les cookies analytiques via la bannière de consentement affichée lors de votre première visite. Votre choix est mémorisé pour vos visites ultérieures.
            </p>
            <p>
              Conformément aux recommandations de la CNIL, aucune donnée analytique n'est collectée sans votre accord explicite.
            </p>
          </div>
        </section>

        {/* 6. Limitation de responsabilité */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-green-400 mb-4">6. Limitation de responsabilité</h2>
          <div className="bg-gray-900 rounded-xl p-6 text-gray-300 space-y-3">
            <p>
              Les informations fournies sur ce site le sont à titre indicatif. RegenX s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées, mais ne peut garantir l'exhaustivité ou l'absence d'erreurs.
            </p>
            <p>
              Les programmes d'entraînement générés par l'IA RegenX sont fournis à titre indicatif et ne remplacent pas l'avis d'un professionnel de santé ou d'un coach certifié. Consultez un médecin avant de commencer tout programme d'exercice physique.
            </p>
          </div>
        </section>

        {/* 7. Droit applicable */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-green-400 mb-4">7. Droit applicable</h2>
          <div className="bg-gray-900 rounded-xl p-6 text-gray-300">
            <p>
              Les présentes mentions légales sont régies par le droit français. En cas de litige, les tribunaux compétents seront ceux du ressort de Roquebrune-Cap-Martin (Alpes-Maritimes), sauf disposition légale contraire.
            </p>
          </div>
        </section>

        {/* 8. Contact */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-green-400 mb-4">8. Contact</h2>
          <div className="bg-gray-900 rounded-xl p-6 text-gray-300 space-y-2">
            <p>Pour toute question relative aux présentes mentions légales :</p>
            <p>
              <a href="mailto:jlshop06190@gmail.com" className="text-green-400 hover:underline font-medium">jlshop06190@gmail.com</a>
            </p>
            <p>
              Ou via le{' '}
              <Link href="/contact" className="text-green-400 hover:underline">formulaire de contact</Link>.
            </p>
          </div>
        </section>

        <p className="text-gray-500 text-sm text-center mt-12">
          © {new Date().getFullYear()} RegenX — Tous droits réservés
        </p>
      </main>
    </div>
  );
}
