import Link from 'next/link';
import Image from 'next/image';
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
            <Image src="/logo.png" alt="RegenX" width={32} height={32} className="rounded-lg" />
            <span className="font-bold text-xl text-white">RegenX</span>
          </Link>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-white mb-2">Mentions Légales</h1>
        <p className="text-gray-400 mb-10">Conformément à la loi n° 2004-575 du 21 juin 2004 (LCEN)</p>
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-green-400 mb-4">1. Éditeur du site</h2>
          <div className="bg-gray-900 rounded-xl p-6 space-y-2 text-gray-300">
            <p><span className="text-white font-medium">Raison sociale :</span> RegenX SAS</p>
            <p><span className="text-white font-medium">Forme juridique :</span> Société par Actions Simplifiée (SAS)</p>
            <p><span className="text-white font-medium">Capital social :</span> En cours d&apos;immatriculation</p>
            <p><span className="text-white font-medium">Siège social :</span> France</p>
            <p><span className="text-white font-medium">SIREN :</span> En cours d&apos;immatriculation</p>
            <p><span className="text-white font-medium">Directeur de la publication :</span> Le représentant légal de RegenX SAS</p>
            <p><span className="text-white font-medium">Email :</span>{' '}
              <a href="mailto:legal@regenx.app" className="text-green-400 hover:underline">legal@regenx.app</a>
            </p>
          </div>
        </section>
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-green-400 mb-4">2. Hébergeur</h2>
          <div className="bg-gray-900 rounded-xl p-6 space-y-2 text-gray-300">
            <p><span className="text-white font-medium">Hébergeur web :</span> Vercel Inc., 340 Pine Street, Suite 701, San Francisco, CA 94104</p>
            <p><a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">vercel.com</a></p>
            <p><span className="text-white font-medium">Base de données :</span> Supabase (Frankfurt, Allemagne)</p>
          </div>
        </section>
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-green-400 mb-4">3. Propriété intellectuelle</h2>
          <div className="bg-gray-900 rounded-xl p-6 text-gray-300">
            <p>L&apos;ensemble des éléments constituant le site RegenX est la propriété exclusive de RegenX SAS et est protégé par les lois françaises et internationales relatives à la propriété intellectuelle. Toute reproduction sans autorisation écrite préalable est interdite.</p>
          </div>
        </section>
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-green-400 mb-4">4. Données personnelles</h2>
          <div className="bg-gray-900 rounded-xl p-6 text-gray-300">
            <p>Le traitement des données personnelles est régi par notre <Link href="/privacy" className="text-green-400 hover:underline">Politique de confidentialité</Link>, conforme au RGPD (UE 2016/679). Contact DPO : <a href="mailto:dpo@regenx.app" className="text-green-400 hover:underline">dpo@regenx.app</a>.</p>
          </div>
        </section>
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-green-400 mb-4">5. Cookies</h2>
          <div className="bg-gray-900 rounded-xl p-6 text-gray-300">
            <p>RegenX utilise uniquement des cookies strictement nécessaires au fonctionnement du service et des analytics anonymisés (PostHog EU, hébergés en Allemagne). Vous pouvez gérer vos préférences via la bannière de consentement.</p>
          </div>
        </section>
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-green-400 mb-4">6. Limitation de responsabilité</h2>
          <div className="bg-gray-900 rounded-xl p-6 text-gray-300">
            <p>RegenX SAS s&apos;efforce d&apos;assurer l&apos;exactitude des informations diffusées sur ce site mais ne peut en garantir l&apos;exhaustivité. RegenX SAS décline toute responsabilité pour tout dommage résultant de l&apos;utilisation du site.</p>
          </div>
        </section>
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-green-400 mb-4">7. Droit applicable</h2>
          <div className="bg-gray-900 rounded-xl p-6 text-gray-300">
            <p>Les présentes mentions légales sont soumises au droit français. Les tribunaux compétents de Paris seront seuls compétents en cas de litige.</p>
          </div>
        </section>
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-green-400 mb-4">8. Contact</h2>
          <div className="bg-gray-900 rounded-xl p-6 text-gray-300 space-y-2">
            <p>Email : <a href="mailto:legal@regenx.app" className="text-green-400 hover:underline">legal@regenx.app</a></p>
            <p><Link href="/contact" className="text-green-400 hover:underline">Formulaire de contact</Link></p>
          </div>
        </section>
        <div className="pt-8 border-t border-gray-800 flex flex-wrap gap-4 text-sm text-gray-400">
          <Link href="/privacy" className="hover:text-green-400 transition-colors">Politique de confidentialité</Link>
          <Link href="/terms" className="hover:text-green-400 transition-colors">CGU</Link>
          <Link href="/gdpr" className="hover:text-green-400 transition-colors">Droits RGPD</Link>
          <Link href="/contact" className="hover:text-green-400 transition-colors">Contact</Link>
          <Link href="/" className="hover:text-green-400 transition-colors">Retour à l&apos;accueil</Link>
        </div>
      </main>
    </div>
  );
}
