import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// POST /api/preferences - Enregistre les préférences d'entraînement du client
export async function POST(request: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
          return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

  const body = await request.json();
    const planType = body.planType;
    const level = body.level;

  const validPlanTypes = ['salle', 'exterieur'];
    const validLevels = ['debutant', 'intermediaire', 'avance'];

  const data: Record<string, string> = {};
    if (planType && validPlanTypes.includes(planType)) {
          data.plan_type = planType;
    }
    if (level && validLevels.includes(level)) {
          data.level = level;
    }

  if (Object.keys(data).length === 0) {
        return NextResponse.json({ error: 'Aucune préférence valide fournie' }, { status: 400 });
  }

  const { error } = await supabase.auth.updateUser({ data });
    if (error) {
          return NextResponse.json({ error: error.message }, { status: 500 });
    }

  return NextResponse.json({ success: true, preferences: data });
}
