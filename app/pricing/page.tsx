import Link from 'next/link';
import { CheckCircle, ArrowLeft, Zap, Users, Star } from 'lucide-react';

export default function PricingPage() {
  const plans = [
    {
      name: 'Starter',
      price: 29,
      icon: Zap,
      description: 'Ideal pour demarrer votre transformation',
      color: 'blue',
      features: [
        'IA Coach 2h/jour',
        'Programmes sport de base',
        'Plans nutritionnels simples',
        'Suivi progression basique',
        'Application mobile incluse',
        'Acces web et mobile',
        'Conforme RGPD',
      ],
      cta: 'Abonnement Starter',
      popular: false,
    },
    {
      name: 'Pro',
      price: 99,
      icon: Star,
      description: 'Pour les passionnes qui veulent des resultats',
      color: 'green',
      features: [
        'IA Coach illimitee 24h/24',
        'Programmes sport personnalises',
        'Plans nutritionnels adaptes',
        'Suivi progression avance',
        'Application mobile incluse',
        'Support prioritaire',
        'Conforme RGPD',
      ],
      cta: 'Abonnement Pro',
      popular: true,
    },
    {
      name: 'Equipe',
      price: 149,
      icon: Users,
      description: 'Pour les coachs et equipes sportives',
      color: 'purple',
      features: [
        'Tout le forfait Pro',
        'Tableau de bord coach',
        'Support dedie 24h/24',
        'Rapports de performance',
        'Conforme RGPD',
      ],
      cta: 'Abonnement Equipe',
      popular: false,
    },
  ];

  const colorMap: Record<string, {border: string; bg: string; badge: string; btn: string; icon: string}> = {
    blue: {border: 'border-blue-500/30', bg: 'from-blue-500/20', badge: 'bg-blue-500', btn: 'bg-blue-500 hover:bg-blue-600', icon: 'text-blue-400'},
    green: {border: 'border-green-500/30', bg: 'from-green-500/20', badge: 'bg-green-500', btn: 'bg-green-500 hover:bg-green-600', icon: 'text-green-400'},
    purple: {border: 'border-purple-500/30', bg: 'from-purple-500/20', badge: 'bg-purple-500', btn: 'bg-purple-500 hover:bg-purple-600', icon: 'text-purple-400'},
  };

  return (
    <div className="min-h-screen bg-gray-950 py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8">
          <ArrowLeft className="w-4 h-4" /> Retour
        </Link>
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Tarification simple</h1>
          <p className="text-gray-400">Choisissez le plan adapte a vos objectifs.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => {
            const colors = colorMap[plan.color];
            const Icon = plan.icon;
            return (
              <div key={plan.name} className={"bg-gradient-to-b " + colors.bg + " to-transparent border " + colors.border + " rounded-3xl p-8 relative flex flex-col"}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className={colors.badge + " text-white text-sm font-bold px-6 py-1.5 rounded-full"}>LE PLUS POPULAIRE</span>
                  </div>
                )}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gray-800 mb-4">
                    <Icon className={"w-7 h-7 " + colors.icon} />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
                  <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                  <div className="flex items-end justify-center gap-1">
                    <span className="text-5xl font-bold">{plan.price}</span>
                    <span className="text-2xl text-gray-400">EUR</span>
                    <span className="text-gray-400 mb-1">/mois</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-3">
                      <CheckCircle className={"w-5 h-5 " + colors.icon + " flex-shrink-0"} />
                      <span className="text-gray-300 text-sm">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/register" className={"block w-full " + colors.btn + " text-white font-bold py-3 rounded-xl text-center"}>
                  {plan.cta}
                </Link>
              </div>
            );
          })}
        </div>
        <p className="text-center text-xs text-gray-600 mt-10">Sans engagement - Resiliable a tout moment. Conforme RGPD.</p>
      </div>
    </div>
  );
}
