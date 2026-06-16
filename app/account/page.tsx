import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Brain, Dumbbell, Apple, TrendingUp, User, LogOut, Zap, Crown, Shield, FileText, ChevronRight, Check } from 'lucide-react';

const GOLD = '#C8922A';
const GOLD_LIGHT = '#E8B84B';
const SERIF = 'var(--font-playfair), Georgia, serif';

const navItems = [
  { href: '/dashboard', label: 'Vue d’ensemble', icon: Zap },
  { href: '/dashboard/coach', label: 'Coach IA', icon: Brain },
  { href: '/dashboard/workouts', label: 'Entraînements', icon: Dumbbell },
  { href: '/dashboard/nutrition', label: 'Nutrition', icon: Apple },
  { href: '/dashboard/progress', label: 'Progression', icon: TrendingUp },
  { href: '/account', label: 'Mon compte', icon: User },
];

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const email = user.email || '';
  const firstName = user.user_metadata?.first_name || email.split('@')[0] || 'Athlète';
  const displayName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
  const createdAt = new Date(user.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#0a0a0a', color: '#fff' }}>
      {/* Sidebar */}
      <aside style={{ width: '260px', flexShrink: 0, position: 'fixed', top: 0, left: 0, height: '100vh', backgroundColor: '#0d0d0d', borderRight: '1px solid rgba(200,146,42,0.15)', display: 'flex', flexDirection: 'column', zIndex: 40 }}>
        <div style={{ padding: '2rem 1.75rem', borderBottom: '1px solid rgba(200,146,42,0.12)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Image src="/logo RengenX.webp" alt="RegenX" width={58} height={58} style={{ objectFit: 'contain' }} />
        </div>
        <nav style={{ flex: 1, padding: '1.5rem 0.9rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map(item => (
            <Link key={item.href} href={item.href} className={'rx-nav-link' + (item.href === '/account' ? ' active' : '')}>
              <item.icon style={{ width: '16px', height: '16px', flexShrink: 0 }} strokeWidth={1.5} />
              {item.label}
            </Link>
          ))}
        </nav>
        <div style={{ padding: '1rem 0.9rem', borderTop: '1px solid rgba(200,146,42,0.12)' }}>
          <form action="/api/auth/logout" method="POST">
            <button type="submit" className="rx-nav-link" style={{ width: '100%', background: 'none', cursor: 'pointer', textAlign: 'left' }}>
              <LogOut style={{ width: '16px', height: '16px' }} strokeWidth={1.5} /> Déconnexion
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <main style={{ marginLeft: '260px', flex: 1, padding: '4rem 3.5rem' }}>
        <div className="rx-fade-up" style={{ marginBottom: '3rem' }}>
          <div className="rx-eyebrow" style={{ marginBottom: '1rem' }}>★ Espace Membre</div>
          <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(2.5rem, 4vw, 3.25rem)', fontWeight: 500, letterSpacing: '0.005em', color: '#F7EFDD' }}>Mon compte</h1>
        </div>

        <div className="rx-rule" style={{ marginBottom: '2.5rem', maxWidth: '960px' }} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1.5rem', maxWidth: '960px' }}>
          {/* Profile card */}
          <div className="rx-card rx-fade-up">
            <div className="rx-eyebrow" style={{ color: 'rgba(255,255,255,0.3)', marginBottom: '1.75rem' }}>Profil</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem' }}>
              <div style={{ width: '60px', height: '60px', background: 'linear-gradient(135deg, ' + GOLD + ', ' + GOLD_LIGHT + ')', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SERIF, fontSize: '1.6rem', fontWeight: 600, color: '#0a0a0a', flexShrink: 0, boxShadow: '0 4px 16px rgba(200,146,42,0.3)' }}>
                {avatarLetter}
              </div>
              <div>
                <div style={{ fontFamily: SERIF, fontSize: '1.35rem', fontWeight: 600, color: '#fff' }}>{displayName}</div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', fontWeight: 300 }}>{email}</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[['Membre depuis', createdAt], ['Statut', 'Actif']].map(([l, v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.85rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', fontWeight: 300 }}>{l}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 500, color: l === 'Statut' ? '#4ade80' : '#fff' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Subscription card */}
          <div className="rx-card rx-fade-up" style={{ background: 'linear-gradient(135deg, rgba(200,146,42,0.08), rgba(17,17,17,0.4))', borderColor: 'rgba(200,146,42,0.28)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.75rem' }}>
              <Crown style={{ width: '17px', height: '17px', color: GOLD }} strokeWidth={1.5} />
              <div className="rx-eyebrow">Abonnement</div>
            </div>
            <div style={{ marginBottom: '1.75rem' }}>
              <div style={{ fontFamily: SERIF, fontSize: '2rem', fontWeight: 600, color: GOLD, letterSpacing: '0.01em' }}>Premium</div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', marginTop: '6px', fontWeight: 300 }}>Accès illimité — Coach IA 24h/24</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '2rem' }}>
              {['Coach IA illimitée', 'Programmes personnalisés', 'Plans nutritionnels', 'Suivi avancé', 'Support prioritaire'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.82rem', color: 'rgba(255,255,255,0.65)', fontWeight: 300 }}>
                  <Check style={{ width: '15px', height: '15px', color: GOLD, flexShrink: 0 }} strokeWidth={1.6} />{f}
                </div>
              ))}
            </div>
            <Link href="/pricing" className="rx-btn" style={{ width: '100%', textDecoration: 'none' }}>
              Gérer l’abonnement <ChevronRight style={{ width: '15px', height: '15px' }} />
            </Link>
          </div>

          {/* Legal */}
          <div className="rx-card rx-fade-up" style={{ gridColumn: '1 / -1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
              <Shield style={{ width: '15px', height: '15px', color: 'rgba(255,255,255,0.35)' }} strokeWidth={1.5} />
              <div className="rx-eyebrow" style={{ color: 'rgba(255,255,255,0.3)' }}>Données & confidentialité</div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {[['Mentions légales', '/mentions-legales'], ['Politique de confidentialité', '/privacy'], ['CGU', '/terms']].map(([l, h]) => (
                <Link key={l} href={h} className="rx-btn-ghost" style={{ textDecoration: 'none' }}>
                  <FileText style={{ width: '14px', height: '14px' }} />{l}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
