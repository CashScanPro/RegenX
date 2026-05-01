import { NextRequest, NextResponse } from 'next/server';
import { createClient, isSubscriptionActive } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

// GET /api/nutrition - Récupérer tous les plans nutritionnels
export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

  const { data, error } = await supabase
    .from('nutrition_plans')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ plans: data });
}

// POST /api/nutrition - Créer un nouveau plan nutritionnel
export async function POST(request: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

  const active = await isSubscriptionActive(user.id);
  if (!active) return NextResponse.json({ error: 'Abonnement requis' }, { status: 402 });

  const body = await request.json();
  const {
    name, type, calories_target, protein_g, carbs_g, fat_g,
    description, meals, supplements, cbd_recommendations
  } = body;

  if (!name) return NextResponse.json({ error: 'Le nom est requis' }, { status: 400 });

  const { data, error } = await supabase
    .from('nutrition_plans')
    .insert({
      user_id: user.id,
      name,
      type: type || 'balanced',
      calories_target: calories_target || null,
      protein_g: protein_g || null,
      carbs_g: carbs_g || null,
      fat_g: fat_g || null,
      description: description || null,
      meals: meals || [],
      supplements: supplements || [],
      cbd_recommendations: cbd_recommendations || [],
      active: true,
      ai_generated: false,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ plan: data }, { status: 201 });
}

// PUT /api/nutrition - Mettre à jour un plan (activer/désactiver, modifier)
export async function PUT(request: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

  const body = await request.json();
  const { id, ...updates } = body;

  if (!id) return NextResponse.json({ error: 'ID requis' }, { status: 400 });

  // Vérification de propriété
  const { data: existing } = await supabase
    .from('nutrition_plans')
    .select('user_id')
    .eq('id', id)
    .single();

  if (!existing || existing.user_id !== user.id) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
  }

  const { data, error } = await supabase
    .from('nutrition_plans')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ plan: data });
}

// DELETE /api/nutrition?id=xxx - Supprimer un plan
export async function DELETE(request: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID requis' }, { status: 400 });

  const { data: existing } = await supabase
    .from('nutrition_plans')
    .select('user_id')
    .eq('id', id)
    .single();

  if (!existing || existing.user_id !== user.id) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
  }

  const { error } = await supabase.from('nutrition_plans').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
