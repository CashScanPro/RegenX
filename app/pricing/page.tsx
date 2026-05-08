'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { CheckCircle, ArrowLeft, Zap, Users, Star, Loader2, ArrowRight, Shield, Crown } from 'lucide-react';

type PlanKey = 'starter' | 'pro' | 'equipe';

const GOLD = '#C8922A';
const GOLD_LIGHT = '#E8B84B';

const plans = [
  {
    key: 'starter' as PlanKey,
    name: 'Starter',
    price: 29,
    icon: Zap,
    tagline: 'Pour débuter votre transformation',
    features: ['Coach IA 2h/jour', 'Programmes sport de base', 'Plans nutritionnels simples', 'Suivi basique', 'App mobile incluse', 'Conforme RGPD'],
    highlight: false,
  },
  {
    key: 'pro' as PlanKey,
    name: 'Pro',
    price: 99,
    icon: Crown,
    tagline: 'L’expérience premium complète',
    features: ['Coach IA illimitée 24h/24', 'Programmes personnalisés', 'Plans nutritionnels adaptés', 'Suivi avancé', 'App mobile incluse', 'Support prioritaire', 'Conforme RGPD'],
    highlight: true,
  },
  {
    key: 'equipe' as PlanKey,
    name: 'Équipe',
    price: 149,
    icon: Users,
    tagline: 'Pour coachs & équipes sportives',
    features: ['Tout le forfait Pro', 'Tableau de bord coach', 'Suivi équipe temps réel', 'Rapports de performance', 'Support dédié 24h/24', 'Conforme RGPD'],
    highlight: false,
  },
];

export default function PricingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<PlanKey | null>(null);

  async function handleSubscribe(plan: PlanKey) {
    setLoading(plan);
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ plan }) });
      if (res.status === 401) { router.push('/register?plan=' + plan); return; }
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert('Erreur lors de la création de la session.');
    } catch { alert('Erreur réseau. Veuillez réessayer.'); }
    finally { setLoading(null); }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#fff' }}>
      {/* Ambient */}
      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(200,146,42,0.07) 0%, transparent 65%)', pointerEvents: 'none' }} />

      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, backgroundColor: 'rgba(10,10,10,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(200,146,42,0.1)' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '0 1.5rem', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <Image src="/logo RengenX.png" alt="RegenX" width={32} height={32} style={{ objectFit: 'contain' }} />
          </Link>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            <ArrowLeft style={{ width: '14px', height: '14px' }} /> Retour
          </Link>
        </div>
      </nav>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '5rem 1.5rem 4rem', position: 'relative' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: GOLD, marginBottom: '1rem' }}>
            ★ Tarification
          </div>
          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: '1rem' }}>
            Choisissez votre niveau
            <br /><span style={{ color: GOLD }}>de performance</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '1rem' }}>
            Sans engagement — Résiliable à tout moment — Remboursé sous 14 jours
          </p>
        </div>

        {/* Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          {plans.map(plan => {
            const Icon = plan.icon;
            return (
              <div key={plan.key} style={{ position: 'relative', backgroundColor: plan.highlight ? 'rgba(200,146,42,0.04)' : '#111111', border: plan.highlight ? '1px solid rgba(200,146,42,0.35)' : '1px solid rgba(255,255,255,0.07)', borderRadius: '4px', padding: '2rem', display: 'flex', flexDirection: 'column' }}>
                {plan.highlight && (
                  <div style={{ position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, ' + GOLD + ', ' + GOLD_LIGHT + ')', color: '#0a0a0a', fontSize: '0.6rem', fontWeight: 700, padding: '4px 14px', borderRadius: '2px', letterSpacing: '0.15em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                    ★ Populaire
                  </div>
                )}

                {/* Icon */}
                <div style={{ width: '40px', height: '40px', backgroundColor: plan.highlight ? 'rgba(200,146,42,0.12)' : 'rgba(255,255,255,0.05)', border: '1px solid ' + (plan.highlight ? 'rgba(200,146,42,0.3)' : 'rgba(255,255,255,0.08)'), borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  <Icon style={{ width: '20px', height: '20px', color: plan.highlight ? GOLD : 'rgba(255,255,255,0.4)' }} />
                </div>

                <div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px' }}>{plan.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', marginBottom: '1.5rem' }}>{plan.tagline}</div>

                {/* Price */}
                <div style={{ marginBottom: '1.75rem' }}>
                  <span style={{ fontSize: '3rem', fontWeight: 900, letterSpacing: '-0.04em', color: plan.highlight ? GOLD : '#fff' }}>{plan.price}€</span>
                  <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)', marginLeft: '4px' }}>/mois</span>
                </div>

                {/* Divider */}
                <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.06)', marginBottom: '1.5rem' }} />

                {/* Features */}
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {plan.features.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)' }}>
                      <CheckCircle style={{ width: '14px', height: '14px', color: plan.highlight ? GOLD : 'rgba(255,255,255,0.35)', flexShrink: 0 }} />{f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button onClick={() => handleSubscribe(plan.key)} disabled={loading !== null}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '0.9rem', fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.08em', textTransform: 'uppercase', border: 'none', borderRadius: '3px', cursor: 'pointer', background: plan.highlight ? 'linear-gradient(135deg, ' + GOLD + ', ' + GOLD_LIGHT + ')' : 'rgba(255,255,255,0.07)', color: plan.highlight ? '#0a0a0a' : 'rgba(255,255,255,0.6)', opacity: loading !== null ? 0.6 : 1, transition: 'opacity 0.2s' }}>
                  {loading === plan.key ? (<><Loader2 style={{ width: 14, height: 14 }} className="animate-spin" /> Chargement...</>) : (<><ArrowRight style={{ width: 14, height: 14 }} /> Commencer</>)}
                </button>
              </div>
            );
          })}
        </div>

        {/* Trust badges */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
          {[
            { icon: Shield, label: 'Conforme RGPD', sub: 'Hébergé en Europe' },
            { icon: CheckCircle, label: 'Sans engagement', sub: 'Résiliable à tout moment' },
            { icon: Star, label: 'Remboursement', sub: 'Sous 14 jours' },
            { icon: Crown, label: 'IA Exclusive', sub: 'Coach 100% personnalisé' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '1.25rem', backgroundColor: '#111111', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px' }}>
              <item.icon style={{ width: '18px', height: '18px', color: GOLD, marginBottom: '0.6rem' }} />
              <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>{item.label}</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', marginTop: '3px' }}>{item.sub}</div>
            </div>
          ))}
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.72rem', color: 'rgba(255,255,255,0.2)' }}>
          TVA incluse — Sans engagement — Remboursement sous 14 jours — Conforme RGPD
        </p>
      </div>
    </div>
  );
}
