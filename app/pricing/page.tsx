'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { CheckCircle, ArrowLeft, Zap, Users, Star, Loader2, ArrowRight, Shield, Sparkles } from 'lucide-react';

type PlanKey = 'starter' | 'pro' | 'equipe';

const plans = [
  {
    key: 'starter' as PlanKey,
    name: 'Starter',
    price: 29,
    icon: Zap,
    tagline: 'Pour commencer votre transformation',
    description: 'Accès à l’essentiel pour débuter avec un coach IA.',
    color: 'blue',
    features: [
      'Coach IA 2h/jour',
      'Programmes sport de base',
      'Plans nutritionnels simples',
      'Suivi progression basique',
      'Application mobile incluse',
      'Conforme RGPD',
    ],
  },
  {
    key: 'pro' as PlanKey,
    name: 'Pro',
    price: 99,
    icon: Star,
    tagline: 'L’expérience premium complète',
    description: 'Coach IA illimité, suivi avancé et support prioritaire.',
    color: 'emerald',
    popular: true,
    features: [
      'Coach IA illimitée 24h/24',
      'Programmes sport personnalisés',
      'Plans nutritionnels adaptés',
      'Suivi progression avancé',
      'Application mobile incluse',
      'Support prioritaire',
      'Conforme RGPD',
    ],
  },
  {
    key: 'equipe' as PlanKey,
    name: 'Équipe',
    price: 149,
    icon: Users,
    tagline: 'Pour coachs et équipes sportives',
    description: 'Gérez plusieurs athlètes depuis un seul tableau de bord.',
    color: 'violet',
    features: [
      'Tout le forfait Pro',
      'Tableau de bord coach',
      'Suivi équipe en temps réel',
      'Rapports de performance',
      'Support dédié 24h/24',
      'Conforme RGPD',
    ],
  },
];

export default function PricingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<PlanKey | null>(null);

  async function handleSubscribe(plan: PlanKey) {
    setLoading(plan);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });
      if (res.status === 401) { router.push('/register?plan=' + plan); return; }
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert('Erreur lors de la création de la session.');
    } catch { alert('Erreur réseau. Veuillez réessayer.'); }
    finally { setLoading(null); }
  }

  const colorStyles: Record<string, { border: string; glow: string; icon: string; badge: string; btn: string; btnHover: string; ring: string }> = {
    blue: {
      border: 'border-blue-500/25',
      glow: 'shadow-blue-500/10',
      icon: 'text-blue-400',
      badge: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
      btn: 'bg-blue-600',
      btnHover: 'hover:bg-blue-500',
      ring: 'ring-blue-500/20',
    },
    emerald: {
      border: 'border-emerald-500/40',
      glow: 'shadow-emerald-500/20',
      icon: 'text-emerald-400',
      badge: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
      btn: 'bg-gradient-to-r from-emerald-600 to-emerald-500',
      btnHover: 'hover:from-emerald-500 hover:to-emerald-400',
      ring: 'ring-emerald-500/30',
    },
    violet: {
      border: 'border-violet-500/25',
      glow: 'shadow-violet-500/10',
      icon: 'text-violet-400',
      badge: 'bg-violet-500/20 text-violet-300 border border-violet-500/30',
      btn: 'bg-violet-600',
      btnHover: 'hover:bg-violet-500',
      ring: 'ring-violet-500/20',
    },
  };

  return (
    <div
      className="min-h-screen text-white"
      style={{ background: 'linear-gradient(135deg, #09090f 0%, #0d0d1a 50%, #09090f 100%)' }}
    >
      {/* Noise texture overlay */}
      <div className="fixed inset-0 opacity-[0.015] pointer-events-none" style={{backgroundImage: 'url(data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E)'}} />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/5" style={{ backgroundColor: 'rgba(9,9,15,0.85)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 flex items-center justify-center">
              <Image src="/logo RengenX.png" alt="RegenX" width={32} height={32} className="object-contain" />
            </div>
          </Link>
          <Link href="/" className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-20">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-6" style={{ backgroundColor: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: '#6ee7b7' }}>
            <Sparkles className="w-3.5 h-3.5" />
            Tarification transparente
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-5">
            Choisissez votre
            <br />
            <span className="text-emerald-400">niveau de performance</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Sans engagement. Résiliable à tout moment. Remboursé sous 14 jours.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {plans.map((plan) => {
            const cs = colorStyles[plan.color];
            const Icon = plan.icon;
            const isLoading = loading === plan.key;
            return (
              <div
                key={plan.key}
                className={[
                  'relative rounded-2xl flex flex-col transition-all duration-300',
                  'border backdrop-blur-sm',
                  cs.border,
                  plan.popular ? 'shadow-2xl ' + cs.glow + ' ring-1 ' + cs.ring : '',
                ].join(' ')}
                style={{
                  backgroundColor: plan.popular ? 'rgba(16,185,129,0.05)' : 'rgba(255,255,255,0.02)',
                  padding: plan.popular ? '2.25rem' : '2rem',
                }}
              >
                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute -top-4 inset-x-0 flex justify-center">
                    <span className="bg-emerald-500 text-white text-xs font-black px-5 py-1.5 rounded-full tracking-wider uppercase shadow-lg">
                      ⭐ Le plus populaire
                    </span>
                  </div>
                )}

                {/* Icon + name */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className={'inline-flex items-center justify-center w-11 h-11 rounded-xl mb-3 ' + cs.badge.replace('text-', 'text-').replace('border', '')} style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <Icon className={'w-6 h-6 ' + cs.icon} />
                    </div>
                    <div className="text-2xl font-black">{plan.name}</div>
                    <div className="text-slate-500 text-xs mt-0.5">{plan.tagline}</div>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-2">
                  <div className="flex items-end gap-1">
                    <span className="text-5xl font-black tracking-tight">{plan.price}€</span>
                    <span className="text-slate-500 text-sm mb-1.5">/mois</span>
                  </div>
                  <p className="text-slate-500 text-xs mt-1 leading-relaxed">{plan.description}</p>
                </div>

                {/* Divider */}
                <div className="my-6" style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.06)' }} />

                {/* Features */}
                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-3">
                      <div className={'flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ' + cs.icon.replace('text-', 'bg-').replace('400', '500/15')}>
                        <CheckCircle className={'w-4 h-4 ' + cs.icon} />
                      </div>
                      <span className="text-slate-300 text-sm">{f}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  onClick={() => handleSubscribe(plan.key)}
                  disabled={loading !== null}
                  className={[
                    'flex items-center justify-center gap-2 w-full font-bold py-3.5 rounded-xl transition-all text-white',
                    cs.btn, cs.btnHover,
                    loading !== null ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-lg',
                  ].join(' ')}
                >
                  {isLoading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Chargement...</>
                  ) : (
                    <><ArrowRight className="w-4 h-4" /> Commencer avec {plan.name}</>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Trust badges */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Shield, label: 'Conforme RGPD', sub: 'Hébergé en Europe' },
            { icon: CheckCircle, label: 'Sans engagement', sub: 'Résiliable à tout moment' },
            { icon: ArrowLeft, label: 'Remboursement', sub: 'Sous 14 jours' },
            { icon: Sparkles, label: 'IA Exclusive', sub: 'Coach 100% personnalisé' },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center text-center p-4 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <item.icon className="w-5 h-5 text-emerald-400 mb-2" />
              <div className="text-sm font-semibold text-white">{item.label}</div>
              <div className="text-xs text-slate-500 mt-0.5">{item.sub}</div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-slate-600 mt-10">
          Tous les prix incluent la TVA — Résiliable à tout moment — Remboursé si rétractation sous 14 jours — Conforme RGPD
        </p>
      </div>
    </div>
  );
}
