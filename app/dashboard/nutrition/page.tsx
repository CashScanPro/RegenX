'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
type NutritionPlan = { id:string; name:string; type:string; calories_target:number|null; protein_g:number|null; carbs_g:number|null; fat_g:number|null; description:string|null; active:boolean; ai_generated:boolean; };
const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: '⚡' },
  { href: '/dashboard/coach', label: 'Coach IA', icon: '🤖' },
  { href: '/dashboard/workouts', label: 'Programmes', icon: '💪' },
  { href: '/dashboard/nutrition', label: 'Nutrition', icon: '🥗' },
  { href: '/dashboard/progress', label: 'Progression', icon: '📈' },
  { href: '/account', label: 'Compte', icon: '👤' },
];
const TYPE_LABELS: Record<string,string> = { balanced:'⚖️ Équilibré', keto:'🥑 Keto', vegan:'🌱 Vegan', vegetarian:'🥗 Végétarien', paleo:'🍖 Paleo', mediterranean:'🫒 Méditerranéen' };
export default function NutritionPage() {
  const [plans, setPlans] = useState<NutritionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [msg, setMsg] = useState<string|null>(null);
  useEffect(()=>{ loadPlans(); },[]);
  async function loadPlans() {
    const supabase=createClient(); const{data:{user}}=await supabase.auth.getUser(); if(!user)return;
    const{data}=await supabase.from('nutrition_plans').select('*').eq('user_id',user.id).order('created_at',{ascending:false});
    setPlans(data||[]); setLoading(false);
  }
  async function generatePlan() {
    setGenerating(true); setMsg(null);
    const res=await fetch('/api/ai/coach',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:[{role:'user',content:'Génère un plan nutritionnel. Réponds UNIQUEMENT en JSON: name, type (balanced|keto|vegan|vegetarian|paleo|mediterranean), calories_target, protein_g, carbs_g, fat_g, description, meals[]'}]})});
    if(res.status===402){setMsg('Abonnement requis.');setGenerating(false);return;}
    if(!res.ok){setMsg('Erreur lors de la génération.');setGenerating(false);return;}
    const reader=res.body!.getReader(); const decoder=new TextDecoder(); let raw='';
    while(true){const{done,value}=await reader.read();if(done)break;raw+=decoder.decode(value,{stream:true});}
    try{
      const m=raw.match(/{[\s\S]*}/); if(!m) throw new Error('Pas de JSON');
      const plan=JSON.parse(m[0]);
      const supabase=createClient(); const{data:{user}}=await supabase.auth.getUser(); if(!user)return;
      const{error}=await supabase.from('nutrition_plans').insert({user_id:user.id,name:plan.name||'Plan IA',type:plan.type||'balanced',calories_target:plan.calories_target||null,protein_g:plan.protein_g||null,carbs_g:plan.carbs_g||null,fat_g:plan.fat_g||null,description:plan.description||'',meals:plan.meals||[],active:true,ai_generated:true});
      if(error) throw error;
      setMsg('Plan nutritionnel généré !'); loadPlans();
    } catch { setMsg('Plan reçu mais impossible de le structurer.'); }
    setGenerating(false);
  }
  async function toggleActive(plan:NutritionPlan){
    const supabase=createClient(); await supabase.from('nutrition_plans').update({active:!plan.active}).eq('id',plan.id); loadPlans();
  }
  async function deletePlan(id:string){
    if(!confirm('Supprimer ce plan ?'))return;
    const supabase=createClient(); await supabase.from('nutrition_plans').delete().eq('id',id); loadPlans();
  }
  return (
    <div className="min-h-screen" style={{background:'#09090f'}}>
      <aside className="fixed top-0 left-0 h-full w-64 border-r flex-col z-20 hidden lg:flex" style={{background:'rgba(255,255,255,0.02)',borderColor:'rgba(255,255,255,0.06)'}}>
        <div className="p-6 border-b" style={{borderColor:'rgba(255,255,255,0.06)'}}>
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:'linear-gradient(135deg,#059669,#10b981)'}}><span className="text-white text-lg font-black">R</span></div>
            <span className="text-white font-bold text-lg">RegenX</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {NAV.map(item=>(<Link key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${item.href==='/dashboard/nutrition'?'bg-orange-500/10 text-orange-400':'text-slate-400 hover:text-white hover:bg-white/5'}`}><span>{item.icon}</span>{item.label}</Link>))}
        </nav>
      </aside>
      <main className="lg:ml-64 min-h-screen">
        <header className="sticky top-0 z-10 border-b px-6 py-4 flex items-center justify-between" style={{background:'rgba(9,9,15,0.95)',backdropFilter:'blur(12px)',borderColor:'rgba(255,255,255,0.06)'}}>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center" style={{background:'linear-gradient(135deg,#059669,#10b981)'}}><span className="text-white text-sm font-black">R</span></Link>
            <div><h1 className="text-white font-bold">Nutrition</h1><p className="text-slate-500 text-xs">{plans.length} plan(s) créé(s)</p></div>
          </div>
          <button onClick={generatePlan} disabled={generating} className="px-5 py-2.5 text-sm font-semibold text-white rounded-xl transition-all hover:scale-105 disabled:opacity-50" style={{background:'linear-gradient(135deg,#059669,#10b981)',boxShadow:'0 4px 16px rgba(16,185,129,0.2)'}}>{generating?'⏳ Génération...':'🤖 Générer avec IA'}</button>
        </header>
        <div className="px-6 py-8 max-w-5xl mx-auto">
          {msg&&<div className={`p-4 rounded-xl mb-6 text-sm flex items-center justify-between gap-4 ${msg.includes('requis')||msg.includes('Erreur')||msg.includes('impossible')?'text-red-400':'text-emerald-400'}`} style={msg.includes('requis')||msg.includes('Erreur')||msg.includes('impossible')?{background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.15)'}:{background:'rgba(16,185,129,0.08)',border:'1px solid rgba(16,185,129,0.15)'}}><span>{msg}</span>{msg.includes('requis')&&<Link href="/pricing" className="font-semibold text-emerald-400 text-xs">Abonnement →</Link>}</div>}
          {loading?<div className="text-center py-20 text-slate-600">Chargement...</div>
          :plans.length===0?(
            <div className="text-center py-20 rounded-2xl" style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.06)'}}>
              <div className="text-6xl mb-4">🥗</div>
              <h3 className="font-bold text-white text-xl mb-2">Aucun plan nutritionnel</h3>
              <p className="text-slate-500 text-sm mb-6">Génère ton premier plan personnalisé avec l&apos;IA RegenX</p>
              <button onClick={generatePlan} disabled={generating} className="px-6 py-3 font-semibold text-white rounded-xl transition-all hover:scale-105 disabled:opacity-50" style={{background:'linear-gradient(135deg,#059669,#10b981)'}}>{generating?'Génération...':'🤖 Générer mon premier plan'}</button>
            </div>
          ):(
            <div className="grid md:grid-cols-2 gap-4">
              {plans.map(plan=>(
                <div key={plan.id} className="rounded-2xl p-5 transition-all" style={{background:'rgba(255,255,255,0.03)',border:plan.active?'1px solid rgba(16,185,129,0.2)':'1px solid rgba(255,255,255,0.06)'}}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-bold text-white">{plan.name}</h3>
                        {plan.ai_generated&&<span className="text-xs px-2 py-0.5 rounded-full text-emerald-400" style={{background:'rgba(16,185,129,0.1)',border:'1px solid rgba(16,185,129,0.15)'}}>🤖 IA</span>}
                        {plan.active&&<span className="text-xs px-2 py-0.5 rounded-full text-blue-400" style={{background:'rgba(59,130,246,0.1)',border:'1px solid rgba(59,130,246,0.15)'}}>✓ Actif</span>}
                      </div>
                      {plan.description&&<p className="text-slate-500 text-xs line-clamp-2">{plan.description}</p>}
                    </div>
                    <button onClick={()=>deletePlan(plan.id)} className="text-slate-600 hover:text-red-400 ml-2 transition-colors text-lg leading-none">✕</button>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-xs px-2.5 py-1 rounded-full text-slate-400" style={{background:'rgba(255,255,255,0.05)'}}>{TYPE_LABELS[plan.type]||plan.type}</span>
                  </div>
                  {(plan.calories_target||plan.protein_g||plan.carbs_g||plan.fat_g)&&(
                    <div className="grid grid-cols-4 gap-2 mb-4 rounded-xl p-3" style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.05)'}}>
                      {plan.calories_target&&<div className="text-center"><div className="text-sm font-bold text-white">{plan.calories_target}</div><div className="text-xs text-slate-500">kcal</div></div>}
                      {plan.protein_g&&<div className="text-center"><div className="text-sm font-bold text-blue-400">{plan.protein_g}g</div><div className="text-xs text-slate-500">Prot.</div></div>}
                      {plan.carbs_g&&<div className="text-center"><div className="text-sm font-bold text-orange-400">{plan.carbs_g}g</div><div className="text-xs text-slate-500">Gluc.</div></div>}
                      {plan.fat_g&&<div className="text-center"><div className="text-sm font-bold text-red-400">{plan.fat_g}g</div><div className="text-xs text-slate-500">Lip.</div></div>}
                    </div>
                  )}
                  <button onClick={()=>toggleActive(plan)} className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-[1.01]"
                    style={plan.active?{background:'rgba(255,255,255,0.05)',color:'#94a3b8'}:{background:'linear-gradient(135deg,#059669,#10b981)',color:'white'}}
                  >{plan.active?'Désactiver ce plan':'▶ Activer ce plan'}</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
