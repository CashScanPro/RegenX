import Link from 'next/link';
import { CheckCircle, Zap, ArrowLeft } from 'lucide-react';

export default function PricingPage() {
  const features = [
    'IA Coach illimitee 24h/24',
    'Programmes sport personnalises',
    'Plans nutritionnels adaptes',
    'Conseils CBD & complements',
    'Suivi progression avance',
    'Application mobile iOS & Android',
    'Acces web + mobile',
    'Support prioritaire',
    'Conforme RGPD',
  ];
  return (
    <div className="min-h-screen bg-gray-950 py-24 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Retour
        </Link>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Tarification simple</h1>
          <p className="text-gray-400">Un seul plan. Tout inclus. Sans surprise.</p>
        </div>
        <div className="bg-gradient-to-b from-green-500/20 to-transparent border border-green-500/30 rounded-3xl p-10 relative">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2">
            <span className="bg-green-500 text-white text-sm font-bold px-6 py-1.5 rounded-full">LE PLUS POPULAIRE</span>
          </div>
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold mb-4">RegenX Premium</h2>
            <div className="flex items-end justify-center gap-1 mb-2">
              <span className="text-6xl font-bold">99</span>
              <span className="text-3xl text-gray-400">EUR</span>
              <span className="text-gray-400 mb-2">/mois</span>
            </div>
            <p className="text-gray-500">Sans engagement - Resiliable a tout moment</p>
          </div>
          <ul className="space-y-4 mb-10">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-gray-300">{f}</span>
              </li>
            ))}
          </ul>
          <Link href="/register" className="block w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl text-center text-lg transition-all hover:scale-[1.02]">
            Commencer maintenant
          </Link>
          <p className="text-center text-xs text-gray-600 mt-4">
            En vous inscrivant, vous acceptez nos CGU et politique de confidentialite. Conforme RGPD.
          </p>
        </div>
      </div>
    </div>
  );
}
