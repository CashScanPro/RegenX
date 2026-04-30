import { NextResponse } from 'next/server';
import { getUser, getSubscription } from '@/lib/supabase/server';
import { createBillingPortalSession } from '@/lib/stripe';

export async function POST(request: Request) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    const subscription = await getSubscription(user.id);
    if (!subscription?.stripe_customer_id) return NextResponse.json({ error: 'Pas de subscription' }, { status: 404 });
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://regenx.eu';
    const url = await createBillingPortalSession({ customerId: subscription.stripe_customer_id, returnUrl: appUrl + '/dashboard' });
    return NextResponse.json({ url });
  } catch (err) {
    return NextResponse.json({ error: 'Erreur' }, { status: 500 });
  }
}
