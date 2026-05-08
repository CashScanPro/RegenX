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
      <aside style={{ width: '240px', flexShrink: 0, position: 'fixed', top: 0, left: 0, height: '100vh', backgroundColor: '#0d0d0d', borderRight: '1px solid rgba(200,146,42,0.12)', display: 'flex', flexDirection: 'column', zIndex: 40 }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(200,146,42,0.1)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Image src="/logo RengenX.png" alt="RegenX" width={56} height={56} style={{ objectFit: 'contain' }} />
        </div>

        <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {navItems.map(item => (
            <Link key={item.href} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.7rem 0.85rem', borderRadius: '3px', textDecoration: 'none', color: item.href === '/dashboard' ? GOLD : 'rgba(255,255,255,0.45)', backgroundColor: item.href === '/dashboard' ? 'rgba(200,146,42,0.08)' : 'transparent', fontSize: '0.82rem', fontWeight: item.href === '/dashboard' ? 600 : 400, letterSpacing: '0.02em', transition: 'all 0.15s', borderLeft: item.href === '/dashboard' ? '2px solid ' + GOLD : '2px solid transparent' }}>
              <item.icon style={{ width: '16px', height: '16px', flexShrink: 0 }} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid rgba(200,146,42,0.1)' }}>
          <form action="/api/auth/logout" method="POST">
            <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.7rem 0.85rem', borderRadius: '3px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: '0.82rem', cursor: 'pointer', textAlign: 'left' }}>
              <LogOut style={{ width: '16px', height: '16px' }} />
              Déconnexion
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ marginLeft: '240px', flex: 1, padding: '2.5rem 2rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: GOLD, marginBottom: '0.5rem' }}>
            ★ Espace Membre Premium
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '0.25rem' }}>
            Bonsoir, {displayName}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem' }}>
            Votre programme personnalisé vous attend.
          </p>
        </div>

        {/* Premium banner */}
        <div style={{ background: 'linear-gradient(135deg, rgba(200,146,42,0.12) 0%, rgba(200,146,42,0.04) 100%)', border: '1px solid rgba(200,146,42,0.25)', borderRadius: '4px', padding: '1.25rem 1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Crown style={{ width: '20px', height: '20px', color: GOLD }} />
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: GOLD }}>Membre Premium</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>Accès illimité à toutes les fonctionnalités</div>
            </div>
          </div>
          <Link href="/dashboard/coach" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#0a0a0a', background: 'linear-gradient(135deg, ' + GOLD + ', ' + GOLD_LIGHT + ')', padding: '0.5rem 1rem', borderRadius: '3px', textDecoration: 'none' }}>
            Parler à mon coach <ChevronRight style={{ width: '14px', height: '14px' }} />
          </Link>
        </div>

        {/* Quick actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {quickActions.map(action => (
            <Link key={action.href} href={action.href} style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem', backgroundColor: action.gold ? 'rgba(200,146,42,0.06)' : '#111111', border: action.gold ? '1px solid rgba(200,146,42,0.3)' : '1px solid rgba(255,255,255,0.06)', borderRadius: '4px', textDecoration: 'none', transition: 'border-color 0.2s, background 0.2s', gap: '0.75rem' }}>
              <div style={{ width: '36px', height: '36px', backgroundColor: action.gold ? 'rgba(200,146,42,0.15)' : 'rgba(255,255,255,0.05)', border: '1px solid ' + (action.gold ? 'rgba(200,146,42,0.3)' : 'rgba(255,255,255,0.08)'), borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <action.icon style={{ width: '17px', height: '17px', color: action.gold ? GOLD : 'rgba(255,255,255,0.5)' }} />
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: action.gold ? GOLD : '#fff', marginBottom: '3px' }}>{action.label}</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>{action.sub}</div>
              </div>
              <ChevronRight style={{ width: '14px', height: '14px', color: 'rgba(255,255,255,0.2)', marginTop: 'auto', alignSelf: 'flex-end' }} />
            </Link>
          ))}
        </div>

        {/* Stats bar */}
        <div style={{ backgroundColor: '#111111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '4px', padding: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', width: '100%', marginBottom: '0.5rem' }}>
            Vue rapide
          </div>
          {[['Entraînements', '0 ce mois'], ['Calories', '0 aujourd’hui'], ['Poids actuel', 'Non renseigné'], ['Objectif', 'Non défini']].map(([l, v]) => (
            <div key={l}>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '-0.02em', color: GOLD }}>{v.split(' ')[0]}</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>{l}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
