import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createAdminClient } from '@/lib/supabase/server';
import {
    sendSubscriptionEmail,
    sendCancellationEmail,
} from '@/lib/email';
import type Stripe from 'stripe';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    const sig = req.headers.get('stripe-signature');
    const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !secret) {
        return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  const body = await req.text();
    let event: Stripe.Event;

  try {
        event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err: any) {
        console.error('Webhook signature failed', err.message);
        return NextResponse.json({ error: `Invalid signature: ${err.message}` }, { status: 400 });
  }

  const supabase = createAdminClient();

  try {
        switch (event.type) {
          case 'checkout.session.completed': {
                    const session = event.data.object as Stripe.Checkout.Session;
                    const userId = session.metadata?.supabase_user_id;

                    if (userId && session.subscription) {
                                const sub = await stripe.subscriptions.retrieve(session.subscription as string);

                      await supabase.from('subscriptions').upsert({
                                    user_id: userId,
                                    stripe_customer_id: session.customer as string,
                                    stripe_subscription_id: sub.id,
                                    stripe_price_id: sub.items.data[0]?.price.id,
                                    status: sub.status,
                                    current_period_start: new Date(sub.current_period_start * 1000).toISOString(),
                                    current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
                                    cancel_at_period_end: sub.cancel_at_period_end,
                      }, { onConflict: 'user_id' });

                      // Envoyer email de confirmation d'abonnement
                      try {
                                    const { data: profile } = await supabase
                                      .from('profiles')
                                      .select('email, full_name')
                                      .eq('id', userId)
                                      .single();

                                  if (profile?.email) {
                                                  const firstName = profile.full_name?.split(' ')[0] ?? 'là';
                                                  const nextBillingDate = new Date(sub.current_period_end * 1000)
                                                    .toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
                                                  const amount = sub.items.data[0]?.price.unit_amount
                                                    ? (sub.items.data[0].price.unit_amount / 100).toFixed(0) + '€'
                                                                    : '99€';

                                      await sendSubscriptionEmail({
                                                        to: profile.email,
                                                        firstName,
                                                        plan: 'pro',
                                                        nextBillingDate,
                                                        amount,
                                      });
                                  }
                      } catch (emailErr) {
                                    console.error('[Webhook] Failed to send subscription email:', emailErr);
                      }
                    }
                    break;
          }

          case 'customer.subscription.updated': {
                    const sub = event.data.object as Stripe.Subscription;

                    await supabase.from('subscriptions').update({
                                status: sub.status,
                                current_period_start: new Date(sub.current_period_start * 1000).toISOString(),
                                current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
                                cancel_at_period_end: sub.cancel_at_period_end,
                    }).eq('stripe_subscription_id', sub.id);

                    // Envoyer email si annulation planifiée activée
                    if (sub.cancel_at_period_end) {
                                try {
                                              const { data: subscriptionRow } = await supabase
                                                .from('subscriptions')
                                                .select('user_id')
                                                .eq('stripe_subscription_id', sub.id)
                                                .single();

                                  if (subscriptionRow?.user_id) {
                                                  const { data: profile } = await supabase
                                                    .from('profiles')
                                                    .select('email, full_name')
                                                    .eq('id', subscriptionRow.user_id)
                                                    .single();

                                                if (profile?.email) {
                                                                  const firstName = profile.full_name?.split(' ')[0] ?? 'là';
                                                                  const endDate = new Date(sub.current_period_end * 1000)
                                                                    .toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

                                                    await sendCancellationEmail({
                                                                        to: profile.email,
                                                                        firstName,
                                                                        endDate,
                                                    });
                                                }
                                  }
                                } catch (emailErr) {
                                              console.error('[Webhook] Failed to send cancellation email:', emailErr);
                                }
                    }
                    break;
          }

          case 'customer.subscription.deleted': {
                    const sub = event.data.object as Stripe.Subscription;

                    await supabase.from('subscriptions').update({
                                status: sub.status,
                                current_period_start: new Date(sub.current_period_start * 1000).toISOString(),
                                current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
                                cancel_at_period_end: sub.cancel_at_period_end,
                    }).eq('stripe_subscription_id', sub.id);
                    break;
          }

          case 'invoice.payment_failed': {
                    const invoice = event.data.object as Stripe.Invoice;
                    if (invoice.subscription) {
                                await supabase.from('subscriptions').update({ status: 'past_due' })
                                  .eq('stripe_subscription_id', invoice.subscription as string);
                    }
                    break;
          }
        }

      return NextResponse.json({ received: true });
  } catch (e: any) {
        console.error('webhook handler error', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
