'use client';

import { Suspense, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

const GOLD = '#c8a85a';
const GOLD_LIGHT = '#e7d3a1';

function RegisterForm() {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const plan = searchParams.get('plan') || 'pro';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin + '/dashboard' },
    });
    if (error) { setError(error.message); setLoading(false); }
    else { setSuccess(true); }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: '#0a0a0a' }}>
        <div className="w-full max-w-sm text-center rx-animate">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-8" style={{ background: 'radial-gradient(circle, rgba(200,168,90,0.15), rgba(200,168,90,0.03))', border: '1px solid rgba(200,168,90,0.4)', borderRadius: '50%' }}>
            <CheckCircle className="w-9 h-9" style={{ color: GOLD }} strokeWidth={1.4} />
          </div>
          <div className="rx-eyebrow mb-4">{t.register.successEyebrow}</div>
          <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '2.5rem', fontWeight: 500, color: '#F7EFDD', marginBottom: '1rem', letterSpacing: '0.01em' }}>{t.register.successTitle}</h2>
          <p className="text-sm mb-10" style={{ color: 'var(--txt-muted)', lineHeight: '1.9', fontWeight: 300 }}>{t.register.successDesc}</p>
          <Link href="/login" className="rx-btn" style={{ textDecoration: 'none' }}>
            <ArrowRight className="w-4 h-4" /> {t.register.successLogin}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#0a0a0a' }}>
      {/* Panneau gauche — visuel premium */}
      <div className="hidden lg:block relative w-1/2 overflow-hidden">
        <Image
          src="/Regenx-conexion-%20image.webp"
          alt="RegenX — Club Premium"
          fill
          priority
          className="object-cover"
          style={{ objectPosition: 'left center' }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(90deg, rgba(10,10,12,0.78) 0%, rgba(10,10,12,0.55) 50%, rgba(10,10,12,0.82) 100%)' }}
        />
        {/* Logo + accroche en surimpression */}
        <div className="absolute inset-0 flex flex-col justify-center py-14 px-14 lg:pl-28" style={{ zIndex: 2 }}>
          <div>
            <div className="rx-eyebrow mb-4">{t.register.panelEyebrow}</div>
            <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 'clamp(2.5rem, 4vw, 3.75rem)', fontWeight: 500, color: '#F7EFDD', lineHeight: 1.1, marginBottom: '1.25rem', letterSpacing: '0.01em' }}>
              {t.register.panelTitleLine1}<br /><span style={{ color: GOLD, fontStyle: 'italic' }}>{t.register.panelTitleLine2}</span>
            </h2>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.55)', lineHeight: '1.9', fontWeight: 300, maxWidth: '320px' }}>
              {t.register.panelDesc}
            </p>
          </div>
        </div>
      </div>

      {/* Panneau droit — formulaire */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-sm rx-animate">
          <div className="flex justify-center mb-12 lg:hidden">
            <Image src="/logo%20RengenX.webp" alt="RegenX" width={88} height={88} className="object-contain" />
          </div>
          <div className="mb-10">
            <div className="rx-eyebrow mb-4">{t.register.formEyebrow}</div>
            <h1 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '2.5rem', fontWeight: 500, color: '#fff', letterSpacing: '0.01em' }}>{t.register.formTitle}</h1>
          </div>
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block rx-eyebrow mb-3" style={{ color: 'var(--txt-muted)' }}>{t.register.emailLabel}</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="votre@email.com" className="rx-input" />
            </div>
            <div>
              <label className="block rx-eyebrow mb-3" style={{ color: 'var(--txt-muted)' }}>{t.register.passwordLabel}</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder={t.register.passwordPlaceholder} className="rx-input pr-12" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--txt-faint)' }}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {error && <p className="text-sm" style={{ color: '#e0726a' }}>{error}</p>}
            <button type="submit" disabled={loading} className="rx-btn w-full" style={{ opacity: loading ? 0.7 : 1 }}>
              <ArrowRight className="w-4 h-4" /> {loading ? t.register.submitting : t.register.submit}
            </button>
          </form>
          <p className="text-center text-sm mt-8" style={{ color: 'var(--txt-muted)' }}>
            {t.register.alreadyMember}{' '}<Link href="/login" style={{ color: GOLD }}>{t.register.loginLink}</Link>
          </p>
          <div className="rx-rule my-8" />
          <p className="text-center text-xs" style={{ color: 'var(--txt-faint)' }}>
            {t.register.termsPrefix}{' '}<Link href="/terms" style={{ color: 'rgba(200,168,90,0.6)' }}>{t.register.termsLink}</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ backgroundColor: '#0a0a0a' }} />}>
      <RegisterForm />
    </Suspense>
  );
}
