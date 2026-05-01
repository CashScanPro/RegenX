import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendWelcomeEmail } from '@/lib/email';

/**
 * POST /api/auth/welcome
 *
 * Appelée après une inscription réussie pour envoyer l'email de bienvenue.
 * Peut être appelée depuis le client après signUp(), ou depuis un webhook Supabase.
 *
 * Body: { userId?: string }  — optionnel si l'utilisateur est déjà authentifié
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Récupérer l'utilisateur connecté
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Utilisateur non authentifié' },
        { status: 401 }
      );
    }

    const firstName =
      user.user_metadata?.full_name?.split(' ')[0] ??
      user.user_metadata?.name?.split(' ')[0] ??
      'là';

    const emailResult = await sendWelcomeEmail({
      to: user.email!,
      firstName,
    });

    if (!emailResult.success) {
      console.error('[Welcome Email] Failed:', emailResult.error);
      // Ne pas bloquer l'UX — l'email est non critique
      return NextResponse.json(
        { success: false, warning: 'Email non envoyé' },
        { status: 200 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('[Welcome API Error]', error);
    return NextResponse.json(
      { error: 'Erreur interne' },
      { status: 500 }
    );
  }
}
