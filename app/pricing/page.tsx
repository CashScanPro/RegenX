'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Zap, Users, Loader2, Shield, CheckCircle, Crown, Star } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

type PlanKey = 'starter' | 'pro' | 'equipe';

const GOLD = '#C8922A';
const GOLD_LIGHT = '#E8B84B';

const planMeta = [
  { key: 'starter' as PlanKey, name: 'Starter', price: 29, icon: Zap, highlight: false },
  { key: 'pro' as PlanKey, name: 'Pro', price: 99, icon: Crown, highlight: true },
  { key: 'equipe' as PlanKey, name: 'Équipe', price: 149, icon: Users, highlight: false },
];

const badgeIcons = [Shield, CheckCircle, Star, Crown];

export default function PricingPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [loading, setLoading] = useState<PlanKey | null>(null);

  const plans = planMeta.map((p, i) => ({
    ...p,
    tagline: t.pricingPage.plans[i].tagline,
    features: t.pricingPage.plans[i].features,
  }));

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
      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(200,146,42,0.07) 0%, transparent 65%)', pointerEvents: 'none' }} />
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, backgroundColor: 'rgba(10,10,10,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(200,146,42,0.1)' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '0 1.5rem', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <Image src="/logo RengenX.png" alt="RegenX" width={60} height={60} style={{ objectFit: 'contain' }} />
          </Link>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            <ArrowLeft style={{ width: '14px', height: '14px' }} /> {t.pricingPage.back}
          </Link>
        </div>
      </nav>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '5rem 1.5rem 4rem', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: GOLD, marginBottom: '1rem' }}>
            ★ {t.pricingPage.eyebrow}
          </div>
          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: '1rem' }}>
            {t.pricingPage.titleLine1}
            <br /><span style={{ color: GOLD }}>{t.pricingPage.titleLine2}</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '1rem' }}>
            {t.pricingPage.subtitle}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          {plans.map(plan => {
            const Icon = plan.icon;
            return (
              <div key={plan.key} style={{ position: 'relative', backgroundColor: plan.highlight ? 'rgba(200,146,42,0.04)' : '#111111', border: plan.highlight ? '1px solid rgba(200,146,42,0.35)' : '1px solid rgba(255,255,255,0.07)', borderRadius: '4px', padding: '2rem', display: 'flex', flexDirection: 'column' }}>
                {plan.highlight && (
                  <div style={{ position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, ' + GOLD + ', ' + GOLD_LIGHT + ')', color: '#0a0a0a', fontSize: '0.6rem', fontWeight: 700, padding: '4px 14px', borderRadius: '2px', letterSpacing: '0.15em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                    ★ {t.pricingPage.popular}
                  </div>
                )}
                <div style={{ width: '40px', height: '40px', backgroundColor: plan.highlight ? 'rgba(200,146,42,0.12)' : 'rgba(255,255,255,0.05)', border: '1px solid ' + (plan.highlight ? 'rgba(200,146,42,0.3)' : 'rgba(255,255,255,0.08)'), borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  <Icon style={{ width: '20px', height: '20px', color: plan.highlight ? GOLD : 'rgba(255,255,255,0.4)' }} />
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px' }}>{plan.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', marginBottom: '1.5rem' }}>{plan.tagline}</div>
                <div style={{ marginBottom: '1.75rem' }}>
                  <span style={{ fontSize: '3rem', fontWeight: 900, letterSpacing: '-0.04em', color: plan.highlight ? GOLD : '#fff' }}>{plan.price}€</span>
                  <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)', marginLeft: '4px' }}>{t.pricingPage.perMonth}</span>
                </div>
                <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.06)', marginBottom: '1.5rem' }} />
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {plan.features.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>
                      <CheckCircle style={{ width: '14px', height: '14px', color: plan.highlight ? GOLD : 'rgba(255,255,255,0.4)', flexShrink: 0 }} />{f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => handleSubscribe(plan.key)} disabled={loading !== null} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', background: plan.highlight ? 'linear-gradient(135deg, ' + GOLD + ', ' + GOLD_LIGHT + ')' : 'transparent', color: plan.highlight ? '#0a0a0a' : '#fff', fontWeight: 700, padding: '0.9rem', borderRadius: '3px', border: plan.highlight ? 'none' : '1px solid rgba(255,255,255,0.15)', cursor: 'pointer', fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  {loading === plan.key ? <Loader2 style={{ width: 14, height: 14 }} className="animate-spin" /> : null} {t.pricingPage.cta}
                </button>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
          {t.pricingPage.badges.map((item, i) => {
            const Icon = badgeIcons[i];
            return (
              <div key={item.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.5rem', padding: '1.25rem', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                <Icon style={{ width: '18px', height: '18px', color: GOLD, marginBottom: '0.6rem' }} />
                <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>{item.label}</div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', marginTop: '3px' }}>{item.sub}</div>
              </div>
            );
          })}
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.72rem', color: 'rgba(255,255,255,0.2)' }}>
          {t.pricingPage.legalNote}
        </p>
      </div>
    </div>
  );
}
