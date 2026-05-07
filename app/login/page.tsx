'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/client';

const loginSchema = z.object({
  email: z.string().email('Adresse email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData) {
    setServerError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      setServerError(
        error.message === 'Invalid login credentials'
          ? 'Email ou mot de passe incorrect.'
          : error.message
      );
      return;
    }

    router.push('/dashboard');
    router.refresh();
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
      style={{background: 'radial-gradient(ellipse at 50% 0%, rgba(16,185,129,0.12) 0%, #0a0a0f 70%)'}}
    >
      <div className="w-full max-w-md">

        {/* Logo uniquement — sans texte RegenX */}
        <div className="flex flex-col items-center mb-10">
          <div
            className="w-24 h-24 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/30 mb-5"
            style={{background: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)'}}
          >
            <span className="text-white text-4xl font-black tracking-tighter select-none">R</span>
          </div>
          <p className="text-slate-400 text-sm tracking-widest uppercase font-medium">Ton coach fitness IA</p>
        </div>

        {/* Card glassmorphism */}
        <div
          className="rounded-3xl p-8 shadow-2xl"
          style={{
            background: 'rgba(255,255,255,0.03)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.07)',
            boxShadow: '0 32px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)'
          }}
        >
          <h2 className="text-2xl font-black text-white mb-1 tracking-tight">Bon retour !</h2>
          <p className="text-slate-500 text-sm mb-7">Connecte-toi pour accéder à ton programme.</p>

          {serverError && (
            <div className="mb-5 p-4 rounded-xl text-red-400 text-sm" style={{background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)'}}>
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Adresse email</label>
              <input
                type="email" autoComplete="email" placeholder="toi@exemple.com"
                {...register('email')}
                className="w-full px-4 py-3.5 rounded-xl text-white placeholder-slate-600 text-sm focus:outline-none transition-all duration-200"
                style={{background: 'rgba(255,255,255,0.05)', border: errors.email ? '1px solid rgba(239,68,68,0.4)' : '1px solid rgba(255,255,255,0.08)'}}
              />
              {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Mot de passe</label>
                <Link href="/forgot-password" className="text-xs text-emerald-400 hover:text-emerald-300 transition">
                  Mot de passe oublié ?
                </Link>
              </div>
              <input
                type="password" autoComplete="current-password" placeholder="••••••••"
                {...register('password')}
                className="w-full px-4 py-3.5 rounded-xl text-white placeholder-slate-600 text-sm focus:outline-none transition-all duration-200"
                style={{background: 'rgba(255,255,255,0.05)', border: errors.password ? '1px solid rgba(239,68,68,0.4)' : '1px solid rgba(255,255,255,0.08)'}}
              />
              {errors.password && <p className="mt-1.5 text-xs text-red-400">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 font-bold text-white rounded-2xl transition-all duration-200 mt-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
              style={{background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', boxShadow: '0 8px 32px rgba(16,185,129,0.25)'}}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Connexion...
                </span>
              ) : (
                'Se connecter →'
              )}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-600">
            Pas encore de compte ?{' '}
            <Link href="/register" className="text-emerald-400 font-semibold hover:text-emerald-300 transition">
              S&apos;inscrire gratuitement
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-slate-700 mt-6">
          En continuant, tu acceptes nos{' '}
          <Link href="/terms" className="underline hover:text-slate-500 transition">CGU</Link>
          {' '}et notre{' '}
          <Link href="/privacy" className="underline hover:text-slate-500 transition">politique de confidentialité</Link>.
        </p>
      </div>
    </main>
  );
}
