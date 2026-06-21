'use client';
// rebuild: redeploy LanguageSwitcher
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { CheckCircle, Zap, Shield, Brain, Dumbbell, Apple, Leaf, Star, ArrowRight, Smartphone, Loader2 } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

type PlanKey = 'starter' | 'pro' | 'equipe';

const GOLD = '#C8A85A';
const GOLD_LIGHT = '#E7D3A1';
const CREAM = '#D8CBB0';

export default function LandingPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [loading, setLoading] = useState<PlanKey | null>(null);

  const featureIcons = [Brain, Dumbbell, Apple, Leaf, Smartphone, Shield];
  const features = t.features.items.map((f, i) => ({ icon: featureIcons[i], title: f.title, desc: f.desc }));

  const planKeys: PlanKey[] = ['starter', 'pro', 'equipe'];
  const planPrices = ['29', '99', '149'];
  const plans = t.pricing.plans.map((p, i) => ({
    key: planKeys[i],
    name: p.name,
    price: planPrices[i],
    desc: p.desc,
    features: p.features,
    highlight: i === 1,
    badge: (p as { badge?: string }).badge,
  }));

  const testimonialMeta = [
    { name: 'Sophie M.', avatar: 'SM', stars: 5 },
    { name: 'Thomas K.', avatar: 'TK', stars: 5 },
    { name: 'Camille D.', avatar: 'CD', stars: 5 },
  ];
  const testimonials = t.testimonials.items.map((tm, i) => ({
    name: testimonialMeta[i].name,
    avatar: testimonialMeta[i].avatar,
    stars: testimonialMeta[i].stars,
    role: tm.role,
    text: tm.text,
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
    <main style={{ backgroundColor: '#0a0a0a', backgroundImage: "linear-gradient(rgba(10,10,10,0.55), rgba(10,10,10,0.72)), url('/arriere%20plan%20dashboard%20client.webp')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', backgroundRepeat: 'no-repeat', color: '#fff', minHeight: '100vh', overflowX: 'hidden', fontFamily: "'Jost', sans-serif", fontWeight: 300 }}>
      <style dangerouslySetInnerHTML={{ __html: "@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Jost:wght@300;400;500&display=swap'); @media (max-width: 767px) { .nav-center { display: none !important; } }" }} />
      {/* Navbar */}
      <nav style={{ position: 'fixed', top: 0, width: '100%', zIndex: 50, backgroundColor: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(200,146,42,0.12)' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '0 1.5rem', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Image src="/logo RengenX.png" alt="RegenX" width={64} height={64} style={{ objectFit: 'contain' }} />
          </div>
          <div style={{ display: 'flex', gap: '2rem', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase' }} className="hidden md:flex nav-center">
            {[['#features', t.nav.features], ['#pricing', t.nav.pricing], ['#testimonials', t.nav.testimonials]].map(([h, l]) => (
              <a key={h} href={h} style={{ color: CREAM, textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => (e.target as HTMLElement).style.color = GOLD} onMouseLeave={e => (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.5)'}>{l}</a>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <LanguageSwitcher />
            <Link href="/login" style={{ fontSize: '0.8rem', color: CREAM, textDecoration: 'none', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{t.nav.login}</Link>
            <button onClick={() => handleSubscribe('pro')} disabled={loading !== null} style={{ fontSize: '0.75rem', background: 'linear-gradient(135deg, ' + GOLD + ', ' + GOLD_LIGHT + ')', color: '#0a0a0a', fontWeight: 700, padding: '0.5rem 1rem', borderRadius: '3px', border: 'none', cursor: 'pointer', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {t.nav.subscribe}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ paddingTop: '9rem', paddingBottom: '6rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(200,146,42,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1.5rem', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem' }}>
            <Image src="/logo RengenX.webp" alt="RegenX" width={240} height={240} priority style={{ objectFit: 'contain', filter: 'drop-shadow(0 0 40px rgba(200,146,42,0.35))' }} />
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(3rem, 8vw, 5.5rem)', fontWeight: 500, letterSpacing: '0.01em', lineHeight: 1.05, marginBottom: '1.5rem', color: '#F2E8D2' }}>
            {t.hero.titleLine1}
            <br />
            <span style={{ color: GOLD }}>{t.hero.titleLine2}</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: CREAM, maxWidth: '520px', margin: '0 auto 2.5rem', lineHeight: 1.8 }}>
            {t.hero.desc}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginBottom: '3rem' }}>
            <button onClick={() => handleSubscribe('pro')} disabled={loading !== null} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'linear-gradient(135deg, ' + GOLD + ', ' + GOLD_LIGHT + ')', color: '#0a0a0a', fontWeight: 700, padding: '1rem 2rem', borderRadius: '3px', border: 'none', cursor: 'pointer', fontSize: '0.85rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {loading === 'pro' ? <Loader2 style={{ width: 18, height: 18 }} className="animate-spin" /> : <ArrowRight style={{ width: 18, height: 18 }} />} {t.hero.ctaStart}
            </button>
            <a href="#features" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid rgba(200,146,42,0.3)', color: CREAM, fontWeight: 600, padding: '1rem 2rem', borderRadius: '3px', textDecoration: 'none', fontSize: '0.85rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {t.hero.ctaFeatures}
            </a>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem', fontSize: '0.75rem', color: CREAM }}>
            {[t.hero.badge1, t.hero.badge2, t.hero.badge3].map(tx => (
              <span key={tx} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle style={{ width: 14, height: 14, color: GOLD }} />{tx}</span>
            ))}
          </div>

          {/* Partenaires */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginTop: '3rem', paddingTop: '2.5rem', borderTop: '1px solid rgba(200,146,42,0.1)' }}>
            <div style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: CREAM }}>{t.hero.partnersLabel}</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2.5rem', flexWrap: 'wrap' }}>
              <a href="https://harmonia-woad.vercel.app/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '130px', height: '130px', padding: '0.9rem', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(200,146,42,0.25)', boxShadow: '0 8px 30px rgba(0,0,0,0.35)', cursor: 'pointer', transition: 'all 0.3s ease', boxSizing: 'border-box' }}><Image src="Harmonia-logo.webp" alt="Green Therapy" width={110} height={110} style={{ objectFit: 'contain', width: '100%', height: '100%' }} /></a>
              <a href="/boutique.html" title="Eric Favre" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '130px', height: '130px', padding: '0.9rem', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(200,146,42,0.25)', boxShadow: '0 8px 30px rgba(0,0,0,0.35)', cursor: 'pointer', transition: 'all 0.3s ease', boxSizing: 'border-box' }}><Image src="/log%20eric%20favre%201.webp" alt="Eric Favre" width={110} height={110} style={{ objectFit: 'contain', width: '100%', height: '100%' }} /></a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ borderTop: '1px solid rgba(200,146,42,0.12)', borderBottom: '1px solid rgba(200,146,42,0.12)', padding: '2.5rem 1.5rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '3rem', textAlign: 'center' }}>
          {[['2 000+', t.stats.s1], ['100%', t.stats.s2], ['14 jours', t.stats.s3], ['EU', t.stats.s4]].map(([n, l]) => (
            <div key={l}><div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.6rem', fontWeight: 600, color: GOLD, letterSpacing: '0.01em' }}>{n}</div><div style={{ fontSize: '0.7rem', color: 'rgba(216,203,176,0.75)', marginTop: '4px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{l}</div></div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: '6rem 1.5rem' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: GOLD, marginBottom: '1rem' }}>{t.features.eyebrow}</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 500, letterSpacing: '0.01em', color: '#F2E8D2' }}>{t.features.title}</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {features.map(f => (
              <div key={f.title} style={{ backgroundColor: '#111111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '4px', padding: '1.75rem', transition: 'border-color 0.2s' }} onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(200,146,42,0.25)'} onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'}>
                <div style={{ width: '36px', height: '36px', backgroundColor: 'rgba(200,146,42,0.1)', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <f.icon style={{ width: '18px', height: '18px', color: GOLD }} />
                </div>
                <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.5rem' }}>{f.title}</h3>
                <p style={{ color: CREAM, fontSize: '0.82rem', lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" style={{ padding: '6rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: GOLD, marginBottom: '1rem' }}>{t.testimonials.eyebrow}</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 500, letterSpacing: '0.01em', color: '#F2E8D2' }}>{t.testimonials.title}</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {testimonials.map(tm => (
              <div key={tm.name} style={{ backgroundColor: '#111111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '4px', padding: '1.75rem' }}>
                <div style={{ display: 'flex', gap: '3px', marginBottom: '1rem' }}>
                  {Array.from({ length: tm.stars }).map((_, i) => <Star key={i} style={{ width: 14, height: 14, fill: GOLD, color: GOLD }} />)}
                </div>
                <p style={{ color: CREAM, fontSize: '0.85rem', lineHeight: 1.8, marginBottom: '1.25rem' }}>"{tm.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '34px', height: '34px', backgroundColor: 'rgba(200,146,42,0.2)', border: '1px solid rgba(200,146,42,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700, color: GOLD }}>{tm.avatar}</div>
                  <div><div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{tm.name}</div><div style={{ fontSize: '0.72rem', color: CREAM }}>{tm.role}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: '6rem 1.5rem' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: GOLD, marginBottom: '1rem' }}>{t.pricing.eyebrow}</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 500, letterSpacing: '0.01em', color: '#F2E8D2' }}>{t.pricing.title}</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {plans.map(p => (
              <div key={p.name} style={{ position: 'relative', backgroundColor: p.highlight ? 'rgba(200,146,42,0.05)' : '#111111', border: p.highlight ? '1px solid rgba(200,146,42,0.35)' : '1px solid rgba(255,255,255,0.06)', borderRadius: '4px', padding: '2rem', display: 'flex', flexDirection: 'column' }}>
                {p.badge && <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', backgroundColor: GOLD, color: '#0a0a0a', fontSize: '0.6rem', fontWeight: 700, padding: '3px 12px', borderRadius: '2px', letterSpacing: '0.15em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{p.badge}</div>}
                <div style={{ marginBottom: '0.5rem', fontSize: '1rem', fontWeight: 700 }}>{p.name}</div>
                <div style={{ fontSize: '0.75rem', color: CREAM, marginBottom: '1.5rem' }}>{p.desc}</div>
                <div style={{ marginBottom: '1.5rem' }}><span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '3rem', fontWeight: 600, letterSpacing: '0.01em', color: p.highlight ? GOLD : '#fff' }}>{p.price}€</span><span style={{ fontSize: '0.8rem', color: CREAM, marginLeft: '4px' }}>{t.pricing.perMonth}</span></div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.75rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {p.features.map(feat => (<li key={feat} style={{ display: 'flex', gap: '0.6rem', fontSize: '0.82rem', color: CREAM, alignItems: 'flex-start' }}><CheckCircle style={{ width: 14, height: 14, color: GOLD, marginTop: '2px', flexShrink: 0 }} />{feat}</li>))}
                </ul>
                <button onClick={() => handleSubscribe(p.key)} disabled={loading !== null} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '0.85rem', fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.08em', textTransform: 'uppercase', border: 'none', borderRadius: '3px', cursor: 'pointer', background: p.highlight ? 'linear-gradient(135deg, ' + GOLD + ', ' + GOLD_LIGHT + ')' : 'rgba(255,255,255,0.06)', color: p.highlight ? '#0a0a0a' : 'rgba(255,255,255,0.7)', transition: 'opacity 0.2s' }}>
                  {loading === p.key ? <Loader2 style={{ width: 14, height: 14 }} className="animate-spin" /> : <ArrowRight style={{ width: 14, height: 14 }} />} {t.pricing.subscribe}
                </button>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)', marginTop: '2rem' }}>
            {t.pricing.note}
          </p>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '6rem 1.5rem' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center', backgroundColor: '#111111', border: '1px solid rgba(200,146,42,0.2)', borderRadius: '4px', padding: '4rem 3rem' }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: GOLD, marginBottom: '1.5rem' }}>{t.cta.eyebrow}</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 500, letterSpacing: '0.01em', color: '#F2E8D2', marginBottom: '1rem' }}>{t.cta.title}</h2>
          <p style={{ color: CREAM, fontSize: '1rem', lineHeight: 1.8, marginBottom: '2rem' }}>
            {t.cta.desc}
          </p>
          <button onClick={() => handleSubscribe('pro')} disabled={loading !== null} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'linear-gradient(135deg, ' + GOLD + ', ' + GOLD_LIGHT + ')', color: '#0a0a0a', fontWeight: 700, padding: '1rem 2.5rem', borderRadius: '3px', border: 'none', cursor: 'pointer', fontSize: '0.85rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {loading === 'pro' ? <Loader2 style={{ width: 18, height: 18 }} className="animate-spin" /> : <ArrowRight style={{ width: 18, height: 18 }} />} {t.cta.button}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(200,146,42,0.12)', padding: '3rem 1.5rem' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Image src="/logo RengenX.png" alt="RegenX" width={56} height={56} style={{ objectFit: 'contain' }} />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
            {[[t.footer.terms, '/terms'], [t.footer.privacy, '/privacy'], [t.footer.legal, '/mentions-legales'], [t.footer.contact, '/contact'], ['Droit de rétractation', '/retractation']].map(([l, h]) => (
              <Link key={h} href={h} style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', textDecoration: 'none', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{l}</Link>
            ))}
          </div>
          <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)' }}>{t.footer.copyright}</p>
        </div>
      </footer>
    </main>
  );
}
