import { NextResponse } from 'next/server';
import { getUser } from '@/lib/supabase/server';
import { createClient } from '@supabase/supabase-js';

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
  const { data: profile } = await adminSupabase.from('profiles').select('*').eq('id', user.id).single();
  const { data: workouts } = await adminSupabase.from('workouts').select('*').eq('user_id', user.id);
  const { data: nutrition } = await adminSupabase.from('nutrition_plans').select('*').eq('user_id', user.id);
  const { data: progress } = await adminSupabase.from('progress_tracking').select('*').eq('user_id', user.id);
  const exportData = { user: { id: user.id, email: user.email }, profile, workouts, nutrition_plans: nutrition, progress_tracking: progress, exported_at: new Date().toISOString() };
  return new NextResponse(JSON.stringify(exportData, null, 2), {
    headers: { 'Content-Type': 'application/json', 'Content-Disposition': 'attachment; filename="regenx-data-export.json"' }
  });
}

export async function DELETE(request: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
  await adminSupabase.from('ai_sessions').delete().eq('user_id', user.id);
  await adminSupabase.from('progress_tracking').delete().eq('user_id', user.id);
  await adminSupabase.from('workouts').delete().eq('user_id', user.id);
  await adminSupabase.from('nutrition_plans').delete().eq('user_id', user.id);
  await adminSupabase.from('subscriptions').delete().eq('user_id', user.id);
  await adminSupabase.from('profiles').delete().eq('id', user.id);
  await adminSupabase.auth.admin.deleteUser(user.id);
  return NextResponse.json({ success: true, message: 'Compte supprime' });
}
