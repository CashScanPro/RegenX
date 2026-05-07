'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/client';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  email: z.string().email('Adresse email invalide'),
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(/[A-Z]/, 'Doit contenir au moins une majuscule')
    .regex(/[0-9]/, 'Doit contenir au moins un chiffre'),
  confirmPassword: z.string(),
  gdpr: z.boolean().refine((val) => val === true, {
    message: "Tu dois accepter les conditions d'utilisation",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { gdpr: false },
  });

  async function onSubmit(data: RegisterFormData) {
    setServerError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
          marketing_emails: false,
        },
      },
    });

    if (error) {
      setServerError(
        error.message === 'User already registered'
          ? 'Un compte existe déjà avec cet email.'
          : error.message
      );
      return;
    }

    try {
      await fetch('/api/auth/welcome', { method: 'POST' });
    } catch {
      // Silently ignore
    }

    setSuccess(true);
  }

  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4" style={{background: 'radial-gradient(ellipse at 50% 0%, rgba(16,185,129,0.12) 0%, #0a0a0f 70%)'}}>
        <div className="w-full max-w-md text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl mb-8 shadow-2xl shadow-emerald-500/30"
            style={{background: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)'}}>
            <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-white mb-3 tracking-tight">Vérifie ta boîte mail !</h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Un lien de confirmation et un email de bienvenue t&apos;ont été envoyés.<br/>
            <span className="text-white font-medium">Clique sur le lien pour activer ton compte.</span>
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-8 py-4 font-semibold text-white rounded-2xl transition-all duration-200 hover:scale-105"
            style={{background: 'linear-gradient(135deg, #059669, #10b981)'}}
          >
            Retour à la connexion →
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4 py-12"
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
          <h2 className="text-2xl font-black text-white mb-1 tracking-tight">Créer un compte</h2>
          <p className="text-slate-500 text-sm mb-7">Sans engagement — remboursé sous 14 jours si insatisfait.</p>

          {serverError && (
            <div className="mb-5 p-4 rounded-xl text-red-400 text-sm" style={{background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)'}}>
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Prénom &amp; Nom</label>
              <input
                type="text" autoComplete="name" placeholder="Marie Dupont"
                {...register('fullName')}
                className="w-full px-4 py-3.5 rounded-xl text-white placeholder-slate-600 text-sm focus:outline-none transition-all duration-200"
                style={{background: 'rgba(255,255,255,0.05)', border: errors.fullName ? '1px solid rgba(239,68,68,0.4)' : '1px solid rgba(255,255,255,0.08)'}}
              />
              {errors.fullName && <p className="mt-1.5 text-xs text-red-400">{errors.fullName.message}</p>}
            </div>

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
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Mot de passe</label>
              <input
                type="password" autoComplete="new-password" placeholder="8+ caractères, 1 majuscule, 1 chiffre"
                {...register('password')}
                className="w-full px-4 py-3.5 rounded-xl text-white placeholder-slate-600 text-sm focus:outline-none transition-all duration-200"
                style={{background: 'rgba(255,255,255,0.05)', border: errors.password ? '1px solid rgba(239,68,68,0.4)' : '1px solid rgba(255,255,255,0.08)'}}
              />
              {errors.password && <p className="mt-1.5 text-xs text-red-400">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Confirmer le mot de passe</label>
              <input
                type="password" autoComplete="new-password" placeholder="••••••••"
                {...register('confirmPassword')}
                className="w-full px-4 py-3.5 rounded-xl text-white placeholder-slate-600 text-sm focus:outline-none transition-all duration-200"
                style={{background: 'rgba(255,255,255,0.05)', border: errors.confirmPassword ? '1px solid rgba(239,68,68,0.4)' : '1px solid rgba(255,255,255,0.08)'}}
              />
              {errors.confirmPassword && <p className="mt-1.5 text-xs text-red-400">{errors.confirmPassword.message}</p>}
            </div>

            <div className="flex items-start gap-3 pt-1">
              <input type="checkbox" id="gdpr" {...register('gdpr')} className="mt-0.5 w-4 h-4 accent-emerald-500 cursor-pointer" />
              <label htmlFor="gdpr" className="text-xs text-slate-500 cursor-pointer leading-relaxed">
                {"J'accepte les "}
                <Link href="/terms" className="text-emerald-400 hover:text-emerald-300 transition">CGU</Link>
                {' et la '}
                <Link href="/privacy" className="text-emerald-400 hover:text-emerald-300 transition">politique de confidentialité</Link>
                {' — conformité RGPD'}
              </label>
            </div>
            {errors.gdpr && <p className="text-xs text-red-400 -mt-2">{errors.gdpr.message}</p>}

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
                  Création du compte...
                </span>
              ) : (
                'Créer mon compte →'
              )}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-600">
            Déjà un compte ?{' '}
            <Link href="/login" className="text-emerald-400 font-semibold hover:text-emerald-300 transition">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
