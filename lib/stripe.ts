import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
  typescript: true,
});

// Les 3 forfaits RegenX
export const STRIPE_PLANS = {
  starter: {
    priceId: process.env.STRIPE_PRICE_ID_STARTER!,
    name: 'RegenX Starter',
    price: 2900, // 29€ en centimes
    currency: 'eur',
    interval: 'month' as Stripe.Price.Recurring.Interval,
    features: [
      'IA Coach 2h/jour',
      'Programmes sport de base',
      'Plans nutritionnels simples',
      'Suivi progression basique',
      'App mobile incluse',
    ],
  },
  pro: {
    priceId: process.env.STRIPE_PRICE_ID_PRO!,
    name: 'RegenX Pro',
    price: 9900, // 99€ en centimes
    currency: 'eur',
    interval: 'month' as Stripe.Price.Recurring.Interval,
    features: [
      'IA Coach illimitée 24h/24',
      'Programmes sport personnalisés',
      'Plans nutritionnels adaptés',
      'Suivi progression avancé',
      'Support prioritaire',
    ],
  },
  equipe: {
    priceId: process.env.STRIPE_PRICE_ID_EQUIPE!,
    name: 'RegenX Équipe',
    price: 14900, // 149€ en centimes
    currency: 'eur',
    interval: 'month' as Stripe.Price.Recurring.Interval,
    features: [
      'Tout le forfait Pro',
      'Tableau de bord coach',
      'Suivi équipe en temps réel',
      'Rapports de performance',
      'Support dédié 24h/24',
    ],
  },
} as const;

export type PlanKey = keyof typeof STRIPE_PLANS;

// Retourne le priceId Stripe correspondant au plan demandé
// Fallback sur STRIPE_PRICE_ID pour compatibilité ascendante
export function getPriceId(plan?: string): string {
  const key = plan as PlanKey;
  if (key && key in STRIPE_PLANS) {
    return STRIPE_PLANS[key].priceId;
  }
  // Fallback : ancienne variable unique (compatibilité)
  return process.env.STRIPE_PRICE_ID_PRO ?? process.env.STRIPE_PRICE_ID ?? '';
}

export async function createOrRetrieveCustomer({
  email,
  userId,
  name,
}: {
  email: string;
  userId: string;
  name?: string;
}): Promise<string> {
  const customers = await stripe.customers.list({ email, limit: 1 });
  if (customers.data.length > 0) {
    return customers.data[0].id;
  }
  const customer = await stripe.customers.create({
    email,
    name,
    metadata: { supabase_user_id: userId },
  });
  return customer.id;
}

export async function createCheckoutSession({
  customerId,
  priceId,
  userId,
  successUrl,
  cancelUrl,
}: {
  customerId: string;
  priceId: string;
  userId: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<string> {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    billing_address_collection: 'auto',
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    allow_promotion_codes: true,
    subscription_data: {
      metadata: { supabase_user_id: userId },
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
    locale: 'fr',
    currency: 'eur',
  });
  return session.url!;
}

export async function createBillingPortalSession({
  customerId,
  returnUrl,
}: {
  customerId: string;
  returnUrl: string;
}): Promise<string> {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
  return session.url;
}
