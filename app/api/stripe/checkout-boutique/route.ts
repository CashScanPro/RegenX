/* ============================================================
   RegenX x Eric Favre - Stripe Checkout Boutique (Next.js route)
   POST /api/stripe/checkout-boutique

   Cree une session Stripe Checkout (mode payment) a partir du
   panier envoye par cart.js. La saveur choisie (variant) est
   transmise dans le nom de la ligne ET en metadata, afin de
   figurer dans la commande Stripe pour la preparation.

   Boutique publique (pas d auth) : reutilise l instance Stripe
   partagee de @/lib/stripe. Variable requise : boutique_html_eric_favre.
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
