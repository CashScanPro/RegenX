'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, ArrowRight, Crown, Dumbbell, LineChart, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); }
    else { router.push('/dashboard'); router.refresh(); }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '2rem',
        backgroundImage: "linear-gradient(rgba(8,8,10,0.45), rgba(8,8,10,0.55)), url('/Regenx-lieu.webp')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          marginRight: 'clamp(0px, 4vw, 80px)',
          background: 'rgba(15,15,17,0.78)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid var(--border)',
          borderRadius: '10px',
          padding: '2.6rem 2.4rem',
          boxShadow: '0 30px 80px rgba(0,0,0,0.55)',
        }}
      >
        <p className="rx-eyebrow" style={{ marginBottom: '0.6rem' }}>Espace membre</p>
        <h1 className="font-display" style={{ fontSize: '2.4rem', color: 'var(--txt)', marginBottom: '1.8rem' }}>
          Connexion
        </h1>

        {error && (
          <div style={{ background: 'rgba(220,60,60,0.12)', border: '1px solid rgba(220,60,60,0.4)', color: '#f3b4b4', padding: '0.7rem 1rem', borderRadius: '4px', fontSize: '0.85rem', marginBottom: '1.2rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <label className="rx-eyebrow" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.65rem' }}>Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            className="rx-input"
            style={{ width: '100%', marginBottom: '1.3rem' }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <label className="rx-eyebrow" style={{ fontSize: '0.65rem' }}>Mot de passe</label>
            <Link href="/forgot-password" style={{ color: 'var(--gold)', fontSize: '0.78rem', textTransform: 'none', letterSpacing: 'normal' }}>Oublié ?</Link>
          </div>
          <div style={{ position: 'relative', marginBottom: '1.8rem' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="rx-input"
              style={{ width: '100%', paddingRight: '3rem' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--txt-muted)' }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button type="submit" disabled={loading} className="rx-btn" style={{ width: '100%' }}>
            <ArrowRight size={18} />
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.6rem', color: 'var(--txt-muted)', fontSize: '0.88rem' }}>
          Pas encore membre ?{' '}
          <Link href="/register" style={{ color: 'var(--gold)', fontWeight: 500 }}>Créer un compte</Link>
        </p>

        <div className="rx-rule" style={{ margin: '1.8rem 0 1.4rem' }} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.6rem', textAlign: 'center' }}>
          <div>
            <Crown size={22} style={{ color: 'var(--gold)', margin: '0 auto 0.5rem' }} />
            <p style={{ fontSize: '0.62rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--txt-muted)', lineHeight: 1.4 }}>Coaching IA<br/>100% personnalisé</p>
          </div>
          <div>
            <Dumbbell size={22} style={{ color: 'var(--gold)', margin: '0 auto 0.5rem' }} />
            <p style={{ fontSize: '0.62rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--txt-muted)', lineHeight: 1.4 }}>Programmes<br/>sur-mesure</p>
          </div>
          <div>
            <LineChart size={22} style={{ color: 'var(--gold)', margin: '0 auto 0.5rem' }} />
            <p style={{ fontSize: '0.62rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--txt-muted)', lineHeight: 1.4 }}>Suivi &amp; analyses<br/>en temps réel</p>
          </div>
          <div>
            <ShieldCheck size={22} style={{ color: 'var(--gold)', margin: '0 auto 0.5rem' }} />
            <p style={{ fontSize: '0.62rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--txt-muted)', lineHeight: 1.4 }}>Sécurisé &amp;<br/>confidentiel</p>
          </div>
        </div>
      </div>
    </div>
  );
}
