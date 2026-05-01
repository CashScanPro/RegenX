'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

type NutritionPlan = {
  id: string;
  name: string;
  type: string;
  calories_target: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
  description: string | null;
  active: boolean;
  ai_generated: boolean;
};

export default function NutritionPage() {
  const [plans, setPlans] = useState<NutritionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    loadPlans();
  }, []);

  async function loadPlans() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from('nutrition_plans')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setPlans(data || []);
    setLoading(false);
  }

  async function generatePlan() {
    setGenerating(true);
    setMsg(null);
    const res = await fetch('/api/ai/coach', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{
          role: 'user',
          content: 'Génère un plan nutritionnel complet et équilibré. Réponds UNIQUEMENT en JSON valide avec: name, type (balanced|keto|vegan|vegetarian|paleo|mediterranean), calories_target, protein_g, carbs_g, fat_g, description, meals (tableau de repas avec name, time, foods).'
        }]
      })
    });
    if (res.status === 402) {
      setMsg('Abonnement requis pour générer des plans nutritionnels IA.');
      setGenerating(false);
      return;
    }
    if (!res.ok) {
      setMsg('Erreur lors de la génération. Réessaie.');
      setGenerating(false);
      return;
    }
    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let raw = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      raw += decoder.decode(value, { stream: true });
    }
    try {
      const jsonMatch = raw.match(/{[sS]*}/);
      if (!jsonMatch) throw new Error('Pas de JSON');
      const plan = JSON.parse(jsonMatch[0]);
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { error } = await supabase.from('nutrition_plans').insert({
        user_id: user.id,
        name: plan.name || 'Plan Nutritionnel IA',
        type: plan.type || 'balanced',
        calories_target: plan.calories_target || null,
        protein_g: plan.protein_g || null,
        carbs_g: plan.carbs_g || null,
        fat_g: plan.fat_g || null,
        description: plan.description || '',
        meals: plan.meals || [],
        active: true,
        ai_generated: true,
      });
      if (error) throw error;
      setMsg('Plan nutritionnel généré et sauvegardé !');
      loadPlans();
    } catch {
      setMsg('Plan reçu mais impossible de le structurer. Réessaie.');
    }
    setGenerating(false);
  }

  async function toggleActive(plan: NutritionPlan) {
    const supabase = createClient();
    await supabase
      .from('nutrition_plans')
      .update({ active: !plan.active })
      .eq('id', plan.id);
    loadPlans();
  }

  async function deletePlan(id: string) {
    if (!confirm('Supprimer ce plan nutritionnel ?')) return;
    const supabase = createClient();
    await supabase.from('nutrition_plans').delete().eq('id', id);
    loadPlans();
  }

  const typeLabels: Record<string, string> = {
    balanced: '⚖️ Équilibré',
    keto: '🥑 Keto',
    vegan: '🌱 Vegan',
    vegetarian: '🥗 Végétarien',
    paleo: '🍖 Paleo',
    mediterranean: '🫒 Méditerranéen',
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="font-bold text-emerald-700">← RegenX</Link>
          <h1 className="font-semibold">Nutrition</h1>
          <Link href="/account" className="text-sm text-slate-600">Compte</Link>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold">Plans Nutritionnels</h2>
            <p className="text-slate-600 text-sm mt-1">{plans.length} plan(s) créé(s)</p>
          </div>
          <button
            onClick={generatePlan}
            disabled={generating}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-semibold rounded-lg"
          >
            {generating ? '⏳ Génération...' : '🤖 Générer avec IA'}
          </button>
        </div>

        {msg && (
          <div className={`p-4 rounded-xl mb-6 ${
            msg.includes('requis') || msg.includes('Erreur') || msg.includes('impossible')
              ? 'bg-red-50 text-red-700 border border-red-200'
              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
          }`}>
            {msg}
            {msg.includes('requis') && (
              <Link href="/pricing" className="ml-2 underline font-semibold">Voir l'abonnement →</Link>
            )}
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-slate-500">Chargement...</div>
        ) : plans.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-slate-200">
            <div className="text-5xl mb-4">🥗</div>
            <h3 className="font-semibold text-xl mb-2">Aucun plan nutritionnel</h3>
            <p className="text-slate-500 text-sm mb-6">
              Génère ton premier plan nutritionnel personnalisé avec l'IA RegenX
            </p>
            <button
              onClick={generatePlan}
              disabled={generating}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg"
            >
              {generating ? 'Génération en cours...' : '🤖 Générer mon premier plan'}
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`bg-white rounded-xl shadow-sm p-6 border-l-4 transition ${
                  plan.active ? 'border-emerald-400' : 'border-slate-200'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg">{plan.name}</h3>
                      {plan.ai_generated && (
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">🤖 IA</span>
                      )}
                      {plan.active && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">✓ Actif</span>
                      )}
                    </div>
                    {plan.description && (
                      <p className="text-sm text-slate-500 line-clamp-2">{plan.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => deletePlan(plan.id)}
                    className="text-slate-300 hover:text-red-500 ml-2 text-lg leading-none"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full">
                    {typeLabels[plan.type] || plan.type}
                  </span>
                </div>

                {(plan.calories_target || plan.protein_g || plan.carbs_g || plan.fat_g) && (
                  <div className="grid grid-cols-4 gap-2 mb-4 bg-slate-50 rounded-lg p-3">
                    {plan.calories_target && (
                      <div className="text-center">
                        <div className="text-sm font-bold text-slate-800">{plan.calories_target}</div>
                        <div className="text-xs text-slate-500">kcal</div>
                      </div>
                    )}
                    {plan.protein_g && (
                      <div className="text-center">
                        <div className="text-sm font-bold text-blue-600">{plan.protein_g}g</div>
                        <div className="text-xs text-slate-500">Protéines</div>
                      </div>
                    )}
                    {plan.carbs_g && (
                      <div className="text-center">
                        <div className="text-sm font-bold text-amber-600">{plan.carbs_g}g</div>
                        <div className="text-xs text-slate-500">Glucides</div>
                      </div>
                    )}
                    {plan.fat_g && (
                      <div className="text-center">
                        <div className="text-sm font-bold text-red-500">{plan.fat_g}g</div>
                        <div className="text-xs text-slate-500">Lipides</div>
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={() => toggleActive(plan)}
                  className={`w-full py-2.5 rounded-lg text-sm font-semibold transition ${
                    plan.active
                      ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  {plan.active ? 'Désactiver ce plan' : '▶ Activer ce plan'}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
