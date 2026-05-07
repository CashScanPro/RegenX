'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
type Workout = { id: string; name: string; type: string; difficulty: string; duration_minutes: number|null; completed_at: string|null; ai_generated: boolean; description: string|null; };
const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: '⚡' },
  { href: '/dashboard/coach', label: 'Coach IA', icon: '🤖' },
  { href: '/dashboard/workouts', label: 'Programmes', icon: '💪' },
  { href: '/dashboard/nutrition', label: 'Nutrition', icon: '🥗' },
  { href: '/dashboard/progress', label: 'Progression', icon: '📈' },
  { href: '/account', label: 'Compte', icon: '👤' },
];
const TYPE_LABELS: Record<string,string> = { strength:'💪 Force', cardio:'🏃 Cardio', hiit:'⚡ HIIT', yoga:'🧘 Yoga', recovery:'🛁 Récupération', mobility:'🤸 Mobilité' };
const DIFF_LABELS: Record<string,string> = { beginner:'🟢 Débutant', intermediate:'🟡 Intermédiaire', advanced:'🔴 Avancé' };
export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [msg, setMsg] = useState<string|null>(null);
  useEffect(() => { loadWorkouts(); }, []);
  async function loadWorkouts() {
    const supabase = createClient();
    const { data:{user} } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from('workouts').select('*').eq('user_id',user.id).order('created_at',{ascending:false});
    setWorkouts(data||[]); setLoading(false);
  }
  async function generateWorkout() {
    setGenerating(true); setMsg(null);
    const res = await fetch('/api/ai/coach',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:[{role:'user',content:"Génère un programme d'entraînement. Réponds UNIQUEMENT en JSON: name, type (strength|cardio|hiit|yoga|recovery|mobility), difficulty (beginner|intermediate|advanced), duration_minutes, description, exercises[]"}]})});
    if (res.status===402){setMsg('Abonnement requis.');setGenerating(false);return;}
    if (!res.ok){setMsg('Erreur lors de la génération.');setGenerating(false);return;}
    const reader=res.body!.getReader(); const decoder=new TextDecoder(); let raw='';
    while(true){const{done,value}=await reader.read();if(done)break;raw+=decoder.decode(value,{stream:true});}
    try {
      const m=raw.match(/{[\s\S]*}/); if(!m) throw new Error('Pas de JSON');
      const plan=JSON.parse(m[0]);
      const supabase=createClient(); const{data:{user}}=await supabase.auth.getUser(); if(!user)return;
      const{error}=await supabase.from('workouts').insert({user_id:user.id,name:plan.name||'Programme IA',type:plan.type||'strength',difficulty:plan.difficulty||'intermediate',duration_minutes:plan.duration_minutes||45,description:plan.description||'',exercises:plan.exercises||[],ai_generated:true});
      if(error) throw error;
      setMsg('Programme généré et sauvegardé !'); loadWorkouts();
    } catch { setMsg('Programme reçu mais impossible de le structurer.'); }
    setGenerating(false);
  }
  async function toggleComplete(w:Workout){
    const supabase=createClient();
    await supabase.from('workouts').update({completed_at:w.completed_at?null:new Date().toISOString()}).eq('id',w.id);
    loadWorkouts();
  }
  async function deleteWorkout(id:string){
    if(!confirm('Supprimer ce programme ?'))return;
    const supabase=createClient(); await supabase.from('workouts').delete().eq('id',id); loadWorkouts();
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
          {NAV.map(item=>(<Link key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${item.href==='/dashboard/workouts'?'bg-blue-500/10 text-blue-400':'text-slate-400 hover:text-white hover:bg-white/5'}`}><span>{item.icon}</span>{item.label}</Link>))}
        </nav>
      </aside>
      <main className="lg:ml-64 min-h-screen">
        <header className="sticky top-0 z-10 border-b px-6 py-4 flex items-center justify-between" style={{background:'rgba(9,9,15,0.95)',backdropFilter:'blur(12px)',borderColor:'rgba(255,255,255,0.06)'}}>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center" style={{background:'linear-gradient(135deg,#059669,#10b981)'}}><span className="text-white text-sm font-black">R</span></Link>
            <div>
              <h1 className="text-white font-bold">Mes Programmes</h1>
              <p className="text-slate-500 text-xs">{workouts.length} programme(s) créé(s)</p>
            </div>
          </div>
          <button onClick={generateWorkout} disabled={generating}
            className="px-5 py-2.5 text-sm font-semibold text-white rounded-xl transition-all hover:scale-105 disabled:opacity-50"
            style={{background:'linear-gradient(135deg,#059669,#10b981)',boxShadow:'0 4px 16px rgba(16,185,129,0.2)'}}
          >{generating?'⏳ Génération...':'🤖 Générer avec IA'}</button>
        </header>
        <div className="px-6 py-8 max-w-5xl mx-auto">
          {msg&&<div className={`p-4 rounded-xl mb-6 text-sm flex items-center justify-between gap-4 ${msg.includes('requis')||msg.includes('Erreur')||msg.includes('impossible')?'text-red-400':'text-emerald-400'}`} style={msg.includes('requis')||msg.includes('Erreur')||msg.includes('impossible')?{background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.15)'}:{background:'rgba(16,185,129,0.08)',border:'1px solid rgba(16,185,129,0.15)'}}><span>{msg}</span>{msg.includes('requis')&&<Link href="/pricing" className="font-semibold text-emerald-400 text-xs">Abonnement →</Link>}</div>}
          {loading?(<div className="text-center py-20 text-slate-600">Chargement...</div>
          ):workouts.length===0?(
            <div className="text-center py-20 rounded-2xl" style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.06)'}}>
              <div className="text-6xl mb-4">💪</div>
              <h3 className="font-bold text-white text-xl mb-2">Aucun programme</h3>
              <p className="text-slate-500 text-sm mb-6">Génère ton premier programme personnalisé avec l&apos;IA RegenX</p>
              <button onClick={generateWorkout} disabled={generating} className="px-6 py-3 font-semibold text-white rounded-xl transition-all hover:scale-105 disabled:opacity-50" style={{background:'linear-gradient(135deg,#059669,#10b981)'}}>{generating?'Génération...':'🤖 Générer mon premier programme'}</button>
            </div>
          ):(
            <div className="grid md:grid-cols-2 gap-4">
              {workouts.map(w=>(
                <div key={w.id} className="rounded-2xl p-5 transition-all" style={{background:'rgba(255,255,255,0.03)',border:w.completed_at?'1px solid rgba(16,185,129,0.2)':'1px solid rgba(255,255,255,0.06)'}}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-white">{w.name}</h3>
                        {w.ai_generated&&<span className="text-xs px-2 py-0.5 rounded-full text-emerald-400" style={{background:'rgba(16,185,129,0.1)',border:'1px solid rgba(16,185,129,0.15)'}}>🤖 IA</span>}
                      </div>
                      {w.description&&<p className="text-slate-500 text-xs line-clamp-2">{w.description}</p>}
                    </div>
                    <button onClick={()=>deleteWorkout(w.id)} className="text-slate-600 hover:text-red-400 ml-2 transition-colors text-lg leading-none">✕</button>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-xs px-2.5 py-1 rounded-full text-slate-400" style={{background:'rgba(255,255,255,0.05)'}}>{TYPE_LABELS[w.type]||w.type}</span>
                    <span className="text-xs px-2.5 py-1 rounded-full text-slate-400" style={{background:'rgba(255,255,255,0.05)'}}>{DIFF_LABELS[w.difficulty]||w.difficulty}</span>
                    {w.duration_minutes&&<span className="text-xs px-2.5 py-1 rounded-full text-slate-400" style={{background:'rgba(255,255,255,0.05)'}}>⏱ {w.duration_minutes} min</span>}
                    {w.completed_at&&<span className="text-xs px-2.5 py-1 rounded-full text-emerald-400" style={{background:'rgba(16,185,129,0.1)'}}>✅ Complété</span>}
                  </div>
                  <button onClick={()=>toggleComplete(w)}
                    className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-[1.01]"
                    style={w.completed_at?{background:'rgba(255,255,255,0.05)',color:'#94a3b8'}:{background:'linear-gradient(135deg,#059669,#10b981)',color:'white'}}
                  >{w.completed_at?'↩ Marquer comme non fait':'▶ Marquer comme complété'}</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
