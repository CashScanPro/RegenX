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
    <div className="flex min-h-screen" style={{ backgroundColor: '#0a0a0a', color: '#fff' }}>
      {/* Sidebar */}
      <aside style={{ width: '250px', flexShrink: 0, position: 'fixed', top: 0, left: 0, height: '100vh', backgroundColor: '#0d0d0d', borderRight: '1px solid rgba(200,146,42,0.15)', display: 'flex', flexDirection: 'column', zIndex: 40 }}>
        <div style={{ padding: '1.75rem 1.5rem', borderBottom: '1px solid rgba(200,146,42,0.12)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Image src="/logo RengenX.png" alt="RegenX" width={60} height={60} style={{ objectFit: 'contain' }} />
        </div>

        <nav style={{ flex: 1, padding: '1.25rem 0.85rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map(item => (
            <Link key={item.href} href={item.href} className={'rx-nav-link' + (item.href === '/dashboard' ? ' active' : '')}>
              <item.icon style={{ width: '16px', height: '16px', flexShrink: 0 }} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div style={{ padding: '1rem 0.85rem', borderTop: '1px solid rgba(200,146,42,0.12)' }}>
          <form action="/api/auth/logout" method="POST">
            <button type="submit" className="rx-nav-link" style={{ width: '100%', background: 'none', cursor: 'pointer', textAlign: 'left' }}>
              <LogOut style={{ width: '16px', height: '16px' }} />
              Déconnexion
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ marginLeft: '250px', flex: 1, padding: '3rem 2.5rem' }}>
        {/* Header */}
        <div className="rx-fade-up" style={{ marginBottom: '2.5rem' }}>
          <div className="rx-eyebrow" style={{ marginBottom: '0.6rem' }}>★ Espace Membre Premium</div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '0.4rem' }}>
            Bonjour, {displayName}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>
            Votre programme personnalisé vous attend.
          </p>
        </div>

        {/* Premium banner */}
        <div className="rx-card-gold rx-fade-up" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'linear-gradient(135deg, ' + GOLD + ', ' + GOLD_LIGHT + ')', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Crown style={{ width: '22px', height: '22px', color: '#0a0a0a' }} />
            </div>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: GOLD }}>Membre Premium</div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)' }}>Accès illimité à toutes les fonctionnalités</div>
            </div>
          </div>
          <Link href="/dashboard/coach" className="rx-btn-gold">
            Parler à mon coach <ChevronRight style={{ width: '15px', height: '15px' }} />
          </Link>
        </div>

        {/* Quick actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          {quickActions.map(action => (
            <Link key={action.href} href={action.href} className={action.gold ? 'rx-card-gold' : 'rx-card'} style={{ display: 'flex', flexDirection: 'column', textDecoration: 'none', gap: '1rem' }}>
              <div style={{ width: '44px', height: '44px', backgroundColor: action.gold ? 'rgba(200,146,42,0.18)' : 'rgba(255,255,255,0.05)', border: '1px solid ' + (action.gold ? 'rgba(200,146,42,0.35)' : 'rgba(255,255,255,0.08)'), borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <action.icon style={{ width: '20px', height: '20px', color: action.gold ? GOLD : 'rgba(255,255,255,0.55)' }} />
              </div>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: action.gold ? GOLD : '#fff', marginBottom: '4px' }}>{action.label}</div>
                <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>{action.sub}</div>
              </div>
              <ChevronRight style={{ width: '15px', height: '15px', color: action.gold ? GOLD : 'rgba(255,255,255,0.25)', marginTop: 'auto', alignSelf: 'flex-end' }} />
            </Link>
          ))}
        </div>

        {/* Stats bar */}
        <div className="rx-card" style={{ display: 'flex', flexWrap: 'wrap', gap: '2.5rem' }}>
          <div className="rx-eyebrow" style={{ color: 'rgba(255,255,255,0.3)', letterSpacing: '0.2em', width: '100%', marginBottom: '0.25rem' }}>
            Vue rapide
          </div>
          {[['Entraînements', '0 ce mois'], ['Calories', '0 aujourd’hui'], ['Poids actuel', 'Non renseigné'], ['Objectif', 'Non défini']].map(([l, v]) => (
            <div key={l}>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.02em', color: GOLD }}>{v.split(' ')[0]}</div>
              <div style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.4)', marginTop: '3px' }}>{l}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
