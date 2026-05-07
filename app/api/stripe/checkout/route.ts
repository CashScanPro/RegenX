import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession, createOrRetrieveCustomer, getPriceId } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Récupère le plan demandé (starter | pro | equipe)
    // Si absent, fallback sur le plan pro
    let plan: string | undefined;
    try {
      const body = await req.json();
      plan = body?.plan;
    } catch {
      // body vide ou non-JSON : on utilise le fallback
    }

    const priceId = getPriceId(plan);
    if (!priceId) {
      return NextResponse.json(
        { error: 'Stripe price not configured for plan: ' + (plan ?? 'pro') },
        { status: 500 }
      );
    }

    const customerId = await createOrRetrieveCustomer({
      email: user.email!,
      userId: user.id,
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://regenx.eu';
    const url = await createCheckoutSession({
      userId: user.id,
      customerId,
      priceId,
      successUrl: `${appUrl}/dashboard?checkout=success`,
      cancelUrl: `${appUrl}/pricing?checkout=cancel`,
    });

    return NextResponse.json({ url });
  } catch (e: any) {
    console.error('checkout error', e);
    return NextResponse.json({ error: e.message || 'Checkout failed' }, { status: 500 });
  }
}
