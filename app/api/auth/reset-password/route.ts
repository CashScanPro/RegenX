import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { sendPasswordResetEmail } from '@/lib/email';

const schema = z.object({
    email: z.string().email(),
  });

/**
 * POST /api/auth/reset-password
 *
 * Déclenche la réinitialisation du mot de passe via Supabase
 * et envoie un email personnalisé via Resend.
 *
 * Body: { email: string }
 */
export async function POST(request: Request) {
    try {
          const body = await request.json();
          const { email } = schema.parse(body);

          const supabase = await createClient();
          const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://regenx.app';

          // Déclencher le reset Supabase (envoie aussi son propre email)
          const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                  redirectTo: `${appUrl}/reset-password`,
                });

          if (resetError) {
                  console.error('[Reset Password] Supabase error:', resetError.message);
                  // Ne pas révéler si l'email existe ou non
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // Récupérer le prénom depuis les profils si disponible
    let firstName = 'là';
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('email', email)
        .maybeSingle();

      if (profile?.full_name) {
        firstName = profile.full_name.split(' ')[0];
      }
    } catch {
      // Silently ignore — prénom non critique
    }

    // Envoyer email de reset personnalisé via Resend
    const resetUrl = `${appUrl}/reset-password`;
    await sendPasswordResetEmail({
      to: email,
      firstName,
      resetUrl,
    }).catch((err) => {
      console.error('[Reset Password] Email send failed:', err);
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Email invalide', details: error.errors },
        { status: 400 }
      );
    }
    console.error('[Reset Password API Error]', error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}
