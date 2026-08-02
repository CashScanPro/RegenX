import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateWorkoutPlan } from '@/lib/anthropic';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Valeurs par defaut si l'info n'est pas dans le profil
const DEFAULT_DAYS = 3;
const DEFAULT_DURATION = 45;

// POST /api/workouts/generate
// Genere un programme d'entrainement personnalise via Claude
// a partir du profil de l'utilisateur, puis l'enregistre dans la table workouts.
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Non authentifie' }, { status: 401 });
  }

  // 1. Charger le profil de l'utilisateur
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('fitness_level, fitness_goals, health_conditions')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    return NextResponse.json(
      { error: 'Profil introuvable. Complete d\'abord ton profil sportif.' },
      { status: 400 }
    );
  }

  // 2. Decoder les infos encodees dans fitness_goals[] (option 1)
  //    days:X / equipment:X / diet:X sont des prefixes, le reste = objectifs
  const rawGoals: string[] = Array.isArray(profile.fitness_goals) ? profile.fitness_goals : [];
  const goals: string[] = [];
  const equipment: string[] = [];
  let availableDays = DEFAULT_DAYS;

  for (const entry of rawGoals) {
    if (typeof entry !== 'string') continue;
    if (entry.startsWith('days:')) {
      const n = Number(entry.slice('days:'.length));
      if (Number.isFinite(n) && n > 0) availableDays = n;
    } else if (entry.startsWith('equipment:')) {
      const e = entry.slice('equipment:'.length).trim();
      if (e) equipment.push(e);
    } else if (entry.startsWith('diet:')) {
      // le type d'alimentation n'est pas utile pour le programme d'entrainement
      continue;
    } else {
      goals.push(entry);
    }
  }

  // 3. Notes de sante (stockees dans health_conditions[])
  const healthArr: string[] = Array.isArray(profile.health_conditions) ? profile.health_conditions : [];
  const healthNotes = healthArr.filter((h) => typeof h === 'string' && h.trim() !== '').join(' ; ');

  // 4. Appeler l'IA Claude
  let plan;
  try {
    plan = await generateWorkoutPlan({
      fitnessLevel: profile.fitness_level || 'beginner',
      goals,
      availableDays,
      equipment,
      durationMinutes: DEFAULT_DURATION,
      healthNotes,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Erreur inconnue';
    return NextResponse.json(
      { error: 'La generation IA a echoue : ' + message },
      { status: 502 }
    );
  }

  // 5. Enregistrer le programme genere dans la table workouts
  const { data: workout, error: insertError } = await supabase
    .from('workouts')
    .insert({
      user_id: user.id,
      name: plan.name,
      type: 'strength',
      difficulty: profile.fitness_level || 'intermediate',
      duration_minutes: DEFAULT_DURATION,
      description: plan.description,
      exercises: plan.exercises,
      ai_generated: true,
    })
    .select()
    .single();

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ workout }, { status: 201 });
}
