import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Brain, Dumbbell, Apple, TrendingUp, User, LogOut, ChevronRight, Zap, Crown } from 'lucide-react';

const GOLD = '#C8922A';
const GOLD_LIGHT = '#E8B84B';

const navItems = [
  { href: '/dashboard', label: 'Vue d’ensemble', icon: Zap },
  { href: '/dashboard/coach', label: 'Coach IA', icon: Brain },
  { href: '/dashboard/workouts', label: 'Entraînements', icon: Dumbbell },
  { href: '/dashboard/nutrition', label: 'Nutrition', icon: Apple },
  { href: '/dashboard/progress', label: 'Progression', icon: TrendingUp },
  { href: '/account', label: 'Mon compte', icon: User },
];

const quickActions = [
  { href: '/dashboard/coach', icon: Brain, label: 'Coach IA', sub: 'Parlez à votre coach', gold: true },
  { href: '/dashboard/workouts', icon: Dumbbell, label: 'Entraînement', sub: 'Programme du jour' },
  { href: '/dashboard/nutrition', icon: Apple, label: 'Nutrition', sub: 'Plan alimentaire' },
  { href: '/dashboard/progress', icon: TrendingUp, label: 'Progression', sub: 'Suivez vos gains' },
];

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const firstName = user.user_metadata?.first_name || user.email?.split('@')[0] || 'Athlète';
  const displayName = firstName.charAt(0).toUpperCase() + firstName.slice(1);

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#0a0a0a', backgroundImage: "linear-gradient(rgba(10,10,10,0.60), rgba(10,10,10,0.78)), url('/Regenx-lieu.webp')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', backgroundRepeat: 'no-repeat', color: '#fff' }}>
      {/* Sidebar */}
      <aside style={{ width: '260px', flexShrink: 0, position: 'fixed', top: 0, left: 0, height: '100vh', backgroundColor: '#0d0d0d', borderRight: '1px solid rgba(200,146,42,0.15)', display: 'flex', flexDirection: 'column', zIndex: 40 }}>
        <div style={{ padding: '2rem 1.75rem', borderBottom: '1px solid rgba(200,146,42,0.12)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Image src="/logo RengenX.webp" alt="RegenX" width={58} height={58} style={{ objectFit: 'contain' }} />
        </div>

        <nav style={{ flex: 1, padding: '1.5rem 0.9rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map(item => (
            <Link key={item.href} href={item.href} className={'rx-nav-link' + (item.href === '/dashboard' ? ' active' : '')}>
              <item.icon style={{ width: '16px', height: '16px', flexShrink: 0 }} strokeWidth={1.5} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div style={{ padding: '1rem 0.9rem', borderTop: '1px solid rgba(200,146,42,0.12)' }}>
          <form action="/api/auth/logout" method="POST">
            <button type="submit" className="rx-nav-link" style={{ width: '100%', background: 'none', cursor: 'pointer', textAlign: 'left' }}>
              <LogOut style={{ width: '16px', height: '16px' }} strokeWidth={1.5} />
              Déconnexion
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ marginLeft: '260px', flex: 1, padding: '4rem 3.5rem' }}>
        {/* Header */}
        <div className="rx-fade-up" style={{ marginBottom: '3.5rem' }}>
          <div className="rx-eyebrow" style={{ marginBottom: '1rem' }}>★ Espace Membre Premium</div>
          <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', fontWeight: 500, letterSpacing: '0.005em', lineHeight: 1.1, marginBottom: '0.75rem', color: '#F7EFDD' }}>
            Bonjour, <span style={{ color: GOLD, fontStyle: 'italic' }}>{displayName}</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.95rem', fontWeight: 300, letterSpacing: '0.02em' }}>
            Votre programme personnalisé vous attend.
          </p>
        </div>

        <div className="rx-rule" style={{ marginBottom: '2.5rem' }} />

        {/* Premium banner */}
        <div className="rx-fade-up" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem', padding: '2rem', borderRadius: '4px', background: 'linear-gradient(135deg, rgba(200,146,42,0.10), rgba(17,17,17,0.4))', border: '1px solid rgba(200,146,42,0.28)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '4px', background: 'linear-gradient(135deg, ' + GOLD + ', ' + GOLD_LIGHT + ')', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Crown style={{ width: '22px', height: '22px', color: '#0a0a0a' }} strokeWidth={1.5} />
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: '1.25rem', fontWeight: 600, color: GOLD, letterSpacing: '0.01em' }}>Membre Premium</div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', fontWeight: 300 }}>Accès illimité à toutes les fonctionnalités</div>
            </div>
          </div>
          <Link href="/dashboard/coach" className="rx-btn" style={{ textDecoration: 'none' }}>
            Parler à mon coach <ChevronRight style={{ width: '15px', height: '15px' }} />
          </Link>
        </div>

        {/* Quick actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {quickActions.map(action => (
            <Link key={action.href} href={action.href} className="rx-card" style={{ display: 'flex', flexDirection: 'column', textDecoration: 'none', gap: '1.25rem', ...(action.gold ? { background: 'linear-gradient(135deg, rgba(200,146,42,0.08), rgba(17,17,17,0.4))', borderColor: 'rgba(200,146,42,0.28)' } : {}) }}>
              <div style={{ width: '48px', height: '48px', backgroundColor: action.gold ? 'rgba(200,146,42,0.12)' : 'rgba(255,255,255,0.03)', border: '1px solid ' + (action.gold ? 'rgba(200,146,42,0.3)' : 'rgba(255,255,255,0.08)'), borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <action.icon style={{ width: '20px', height: '20px', color: action.gold ? GOLD : 'rgba(255,255,255,0.55)' }} strokeWidth={1.4} />
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: '1.35rem', fontWeight: 600, color: action.gold ? GOLD : '#fff', marginBottom: '4px', letterSpacing: '0.01em' }}>{action.label}</div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', fontWeight: 300 }}>{action.sub}</div>
              </div>
              <ChevronRight style={{ width: '15px', height: '15px', color: action.gold ? GOLD : 'rgba(255,255,255,0.25)', marginTop: 'auto', alignSelf: 'flex-end' }} />
            </Link>
          ))}
        </div>

        {/* Stats bar */}
        <div className="rx-card" style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem' }}>
          <div className="rx-eyebrow" style={{ color: 'rgba(255,255,255,0.3)', width: '100%', marginBottom: '0.25rem' }}>
            Vue rapide
          </div>
          {[['Entraînements', '0 ce mois'], ['Calories', '0 aujourd’hui'], ['Poids actuel', 'Non renseigné'], ['Objectif', 'Non défini']].map(([l, v]) => (
            <div key={l}>
              <div style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: '2rem', fontWeight: 600, letterSpacing: '0.01em', color: GOLD }}>{v.split(' ')[0]}</div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginTop: '6px', textTransform: 'uppercase', letterSpacing: '0.15em' }}>{l}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
