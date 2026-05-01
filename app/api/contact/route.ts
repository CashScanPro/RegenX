import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sendContactConfirmation } from '@/lib/email';

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.enum(['support', 'billing', 'privacy', 'partnership', 'other']),
  message: z.string().min(20).max(2000),
  gdpr: z.boolean().refine((v) => v === true),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = contactSchema.parse(body);

    // Envoyer email de confirmation à l'utilisateur + notification interne
    const emailResult = await sendContactConfirmation({
      to: data.email,
      name: data.name,
      subject: data.subject,
      message: data.message,
    });

    if (!emailResult.success) {
      console.error('[Contact API] Email send failed:', emailResult.error);
      // On ne bloque pas la réponse si l'email échoue — log interne suffisant
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      );
    }
    console.error('[Contact API Error]', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
