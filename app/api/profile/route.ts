import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const VALID_GENDERS = ['male', 'female', 'other'];
const VALID_LEVELS = ['beginner', 'intermediate', 'advanced'];

// GET /api/profile - Récupère le profil complet de l'utilisateur connecté
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, date_of_birth, gender, height_cm, weight_kg, fitness_level, fitness_goals, health_conditions, preferred_language, gdpr_consent')
    .eq('id', user.id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ profile: data });
}

// POST /api/profile - Écrit/met à jour le profil de l'utilisateur connecté
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

  const body = await request.json();
  const {
    full_name,
    date_of_birth,
    gender,
    height_cm,
    weight_kg,
    fitness_level,
    fitness_goals,
    days_per_week,
    equipment,
    diet_type,
    health_note,
    health_consent,
    gdpr_consent,
  } = body;

  // --- Validation des contraintes CHECK du schéma ---
  if (gender && !VALID_GENDERS.includes(gender)) {
    return NextResponse.json({ error: 'Genre invalide' }, { status: 400 });
  }
  if (fitness_level && !VALID_LEVELS.includes(fitness_level)) {
    return NextResponse.json({ error: 'Niveau invalide' }, { status: 400 });
  }
  if (height_cm != null && (Number(height_cm) < 90 || Number(height_cm) > 250)) {
    return NextResponse.json({ error: 'Taille invalide (90–250 cm)' }, { status: 400 });
  }
  if (weight_kg != null && (Number(weight_kg) < 30 || Number(weight_kg) > 300)) {
    return NextResponse.json({ error: 'Poids invalide (30–300 kg)' }, { status: 400 });
  }

  // Option 1 : jours/sem + matériel + type d'alimentation encodés dans fitness_goals[]
  const goals = Array.isArray(fitness_goals) ? [...fitness_goals] : [];
  if (days_per_week != null) goals.push(`days:${Number(days_per_week)}`);
  if (equipment) goals.push(`equipment:${equipment}`);
  if (diet_type) goals.push(`diet:${diet_type}`);

  const updates = {
    updated_at: new Date().toISOString(),
  };
  if (full_name !== undefined) updates.full_name = full_name || null;
  if (date_of_birth !== undefined) updates.date_of_birth = date_of_birth || null;
  if (gender !== undefined) updates.gender = gender || null;
  if (height_cm !== undefined) updates.height_cm = height_cm ? Number(height_cm) : null;
  if (weight_kg !== undefined) updates.weight_kg = weight_kg ? Number(weight_kg) : null;
  if (fitness_level !== undefined) updates.fitness_level = fitness_level || 'beginner';
  updates.fitness_goals = goals;

  // --- Données de santé : UNIQUEMENT si le consentement santé dédié est donné ---
  const trimmedHealth = typeof health_note === 'string' ? health_note.trim() : '';
  if (trimmedHealth) {
    if (health_consent !== true) {
      return NextResponse.json(
        { error: 'Le consentement santé est requis pour enregistrer des données de santé.' },
        { status: 400 }
      );
    }
    updates.health_conditions = [trimmedHealth];
  } else {
    updates.health_conditions = [];
  }

  if (gdpr_consent === true) {
    updates.gdpr_consent = true;
    updates.gdpr_consent_date = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ profile: data }, { status: 200 });
}
