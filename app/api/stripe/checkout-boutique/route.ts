/* ============================================================
   RegenX x Eric Favre - Stripe Checkout Boutique (Next.js route)
   POST /api/stripe/checkout-boutique

   Cree une session Stripe Checkout (mode payment) a partir du
   panier envoye par cart.js. Ajoute la livraison Colissimo
   (8,90 EUR, offerte des 85 EUR de sous-total).
   Le sous-total est recalcule cote serveur a partir des prix
   reels Stripe (securise : on ne fait pas confiance au navigateur).
============================================================ */
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export const runtime = 'nodejs';

interface CartItem {
  priceId: string;
  quantity?: number;
  name?: string;
  variant?: string;
  productId?: string;
}

// Seuil de livraison offerte et montant des frais (en centimes)
const FREE_SHIPPING_THRESHOLD = 8500; // 85,00 EUR
const SHIPPING_AMOUNT = 890;          // 8,90 EUR

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const items: CartItem[] = Array.isArray(body?.items) ? body.items : [];

    if (!items.length) {
      return NextResponse.json({ error: 'Panier vide.' }, { status: 400 });
    }

    // Construction des line_items a partir des priceId Stripe
    const line_items = items.map((it) => {
      if (!it.priceId) {
        throw new Error('priceId manquant pour un article');
      }
      return {
        price: it.priceId,
        quantity: Math.max(1, parseInt(String(it.quantity), 10) || 1),
      };
    });

    // --- Calcul SECURISE du sous-total a partir des prix reels Stripe ---
    // On recupere chaque Price pour connaitre son unit_amount (en centimes),
    // sans faire confiance a un prix envoye par le navigateur.
    const priceCache: Record<string, number> = {};
    let subtotal = 0; // en centimes
    for (const it of items) {
      const qty = Math.max(1, parseInt(String(it.quantity), 10) || 1);
      if (priceCache[it.priceId] === undefined) {
        const price = await stripe.prices.retrieve(it.priceId);
        priceCache[it.priceId] = price.unit_amount ?? 0;
      }
      subtotal += priceCache[it.priceId] * qty;
    }

    // Colissimo : 8,90 EUR, offert des 85 EUR de sous-total
    const shippingAmount = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_AMOUNT;

    const shipping_options = [
      {
        shipping_rate_data: {
          type: 'fixed_amount' as const,
          fixed_amount: { amount: shippingAmount, currency: 'eur' },
          display_name: shippingAmount === 0 ? 'Colissimo offert' : 'Colissimo',
          delivery_estimate: {
            minimum: { unit: 'business_day' as const, value: 2 },
            maximum: { unit: 'business_day' as const, value: 4 },
          },
        },
      },
    ];

    // Recap des saveurs pour la metadata (visible dans le dashboard Stripe)
    const flavorSummary = items
      .map((it) => {
        const qty = Math.max(1, parseInt(String(it.quantity), 10) || 1);
        const label = it.name || it.productId || 'Produit';
        return it.variant ? `${label} (${it.variant}) x${qty}` : `${label} x${qty}`;
      })
      .join(' | ');

    // Recap des saveurs affiche AU CLIENT sur la page de paiement (custom_text)
    const flavorLines = items
      .filter((it) => it.variant)
      .map((it) => {
        const label = it.name || it.productId || 'Produit';
        return `${label} : ${it.variant}`;
      });
    const flavorMessage = flavorLines.length
      ? `Saveur(s) choisie(s) : ${flavorLines.join(' | ')}. La photo affichee peut differer selon la saveur, votre choix est bien enregistre.`
      : undefined;

    // Origine pour construire les URLs de retour
    const origin =
      process.env.PUBLIC_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      req.headers.get('origin') ||
      'https://regenx.eu';

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      shipping_options,
      phone_number_collection: { enabled: true },
      shipping_address_collection: {
        allowed_countries: ['FR', 'BE', 'LU', 'CH', 'DE', 'ES', 'IT', 'NL', 'PT', 'GB'],
      },
      ...(flavorMessage
        ? {
            custom_text: {
              shipping_address: { message: flavorMessage.slice(0, 1200) },
            },
          }
        : {}),
      custom_fields: [
        {
          key: 'prenom',
          label: { type: 'custom', custom: 'Prenom' },
          type: 'text',
        },
        {
          key: 'nom',
          label: { type: 'custom', custom: 'Nom' },
          type: 'text',
        },
      ],
      metadata: {
        flavors: flavorSummary.slice(0, 490),
        source: 'regenx-boutique',
      },
      success_url: `${origin}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel.html`,
      locale: 'fr',
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe checkout boutique error:', err?.message || err);
    return NextResponse.json({ error: 'Erreur lors de la creation du paiement.' }, { status: 500 });
  }
}
