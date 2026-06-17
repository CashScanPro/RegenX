'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Brain, Dumbbell, Apple, TrendingUp, User, Zap, Plus, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

type ProgressEntry = { id:string; date:string; weight_kg:number|null; body_fat_percent:number|null; muscle_mass_kg:number|null; energy_level:number|null; sleep_hours:number|null; sleep_quality:number|null; stress_level:number|null; workout_completed:boolean; notes:string|null; };

const GOLD = '#C8922A';
const GOLD_LIGHT = '#E8B84B';

const navItems = [
  { href: '/dashboard', label: 'Vue d’ensemble', icon: Zap },
  { href: '/dashboard/coach', label: 'Coach IA', icon: Brain },
  { href: '/dashboard/workouts', label: 'Entraînements', icon: Dumbbell },
  { href: '/dashboard/nutrition', label: 'Nutrition', icon: Apple },
  { href: '/dashboard/progress', label: 'Progression', icon: TrendingUp },
  { href: '/account', label: 'Mon compte', icon: User },
];

const emptyForm = { date: new Date().toISOString().split('T')[0], weight_kg:'', body_fat_percent:'', muscle_mass_kg:'', energy_level:'', sleep_hours:'', sleep_quality:'', stress_level:'', workout_completed:false, notes:'' };

export default function ProgressPage() {
  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [msg, setMsg] = useState<string|null>(null);

  useEffect(()=>{ loadEntries(); },[]);

  async function loadEntries() {
    const supabase=createClient(); const{data:{user}}=await supabase.auth.getUser(); if(!user)return;
    const{data}=await supabase.from('progress_tracking').select('*').eq('user_id',user.id).order('date',{ascending:false}).limit(30);
    setEntries(data||[]); setLoading(false);
  }

  async function saveEntry(e:React.FormEvent) {
    e.preventDefault(); setSaving(true); setMsg(null);
    const supabase=createClient(); const{data:{user}}=await supabase.auth.getUser(); if(!user)return;
    const payload={user_id:user.id,date:form.date,weight_kg:form.weight_kg?parseFloat(form.weight_kg):null,body_fat_percent:form.body_fat_percent?parseFloat(form.body_fat_percent):null,muscle_mass_kg:form.muscle_mass_kg?parseFloat(form.muscle_mass_kg):null,energy_level:form.energy_level?parseInt(form.energy_level):null,sleep_hours:form.sleep_hours?parseFloat(form.sleep_hours):null,sleep_quality:form.sleep_quality?parseInt(form.sleep_quality):null,stress_level:form.stress_level?parseInt(form.stress_level):null,workout_completed:form.workout_completed,notes:form.notes||null};
    const{error}=await supabase.from('progress_tracking').insert(payload);
    if(error){setMsg('Erreur lors de la sauvegarde.');}else{setMsg('Entrée sauvegardée !');setForm(emptyForm);setShowForm(false);loadEntries();}
    setSaving(false);
  }

  async function deleteEntry(id:string){
    if(!confirm('Supprimer cette entrée ?'))return;
    const supabase=createClient(); await supabase.from('progress_tracking').delete().eq('id',id); loadEntries();
  }

  const inputStyle = { background:'#161616', border:'1px solid rgba(255,255,255,0.08)', color:'white' };
  const latest = entries[0];

  return (
    <div className="min-h-screen" style={{ backgroundColor:'#0a0a0a', backgroundImage:"linear-gradient(rgba(10,9,7,0.74), rgba(8,7,6,0.90)), url('/Regenx-lieu.webp')", backgroundSize:'cover', backgroundPosition:'center', backgroundAttachment:'fixed', backgroundRepeat:'no-repeat' }}>
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-full flex-col z-20 hidden lg:flex" style={{ width:'250px', backgroundColor:'#0d0d0d', borderRight:'1px solid rgba(200,146,42,0.15)' }}>
        <div style={{ padding:'1.75rem 1.5rem', borderBottom:'1px solid rgba(200,146,42,0.12)' }}>
          <Link href="/dashboard" style={{ display:'flex', alignItems:'center' }}><Image src="/logo RengenX.webp" alt="RegenX — Retour à l’accueil" width={88} height={88} style={{ objectFit:'contain' }} /></Link>
        </div>
        <nav style={{ flex:1, padding:'1.25rem 0.85rem', display:'flex', flexDirection:'column', gap:'4px' }}>
          {navItems.map(item=>(
            <Link key={item.href} href={item.href} className={'rx-nav-link' + (item.href==='/dashboard/progress'?' active':'')}>
              <item.icon style={{ width:'16px', height:'16px', flexShrink:0 }} />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="lg:ml-[250px] min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between" style={{ background:'rgba(10,9,7,0.72)', backdropFilter:'blur(18px) saturate(130%)', WebkitBackdropFilter:'blur(18px) saturate(130%)', borderBottom:'1px solid rgba(200,146,42,0.18)' }}>
          <div>
            <div className="rx-eyebrow" style={{ marginBottom:'2px' }}>★ Suivi Premium</div>
            <h1 style={{ color:'#fff', fontWeight:800, fontSize:'1.05rem' }}>Ma Progression</h1>
            <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.72rem' }}>{entries.length} entrée(s)</p>
          </div>
          <button onClick={()=>setShowForm(!showForm)} className={showForm?'rx-btn-ghost':'rx-btn-gold'}>
            {showForm?<><X style={{width:'15px',height:'15px'}}/> Fermer</>:<><Plus style={{width:'15px',height:'15px'}}/> Nouvelle entrée</>}
          </button>
        </header>

        <div className="px-6 py-8 max-w-5xl mx-auto">
          {msg&&<div className="rx-fade-up" style={msg.includes('Erreur')?{padding:'1rem',borderRadius:'12px',marginBottom:'1.5rem',fontSize:'0.85rem',color:'#f87171',background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.15)'}:{padding:'1rem',borderRadius:'12px',marginBottom:'1.5rem',fontSize:'0.85rem',color:GOLD,background:'rgba(200,146,42,0.08)',border:'1px solid rgba(200,146,42,0.2)'}}>{msg}</div>}

          {/* Formulaire */}
          {showForm&&(
            <form onSubmit={saveEntry} className="rx-card-gold rx-fade-up" style={{ marginBottom:'2rem' }}>
              <h3 style={{ fontWeight:800, color:'#fff', fontSize:'1.1rem', marginBottom:'1.5rem' }}>Nouvelle entrée</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  {label:'Date',key:'date',type:'date'},
                  {label:'Poids (kg)',key:'weight_kg',type:'number',step:'0.1',placeholder:'75.5'},
                  {label:'% Masse grasse',key:'body_fat_percent',type:'number',step:'0.1',placeholder:'18.5'},
                  {label:'Masse musculaire (kg)',key:'muscle_mass_kg',type:'number',step:'0.1',placeholder:'35.0'},
                  {label:'Énergie (1-10)',key:'energy_level',type:'number',min:'1',max:'10',placeholder:'7'},
                  {label:'Heures de sommeil',key:'sleep_hours',type:'number',step:'0.5',min:'0',max:'24',placeholder:'7.5'},
                  {label:'Qualité sommeil (1-10)',key:'sleep_quality',type:'number',min:'1',max:'10',placeholder:'8'},
                  {label:'Stress (1-10)',key:'stress_level',type:'number',min:'1',max:'10',placeholder:'3'},
                ].map(field=>(
                  <div key={field.key}>
                    <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color:'rgba(255,255,255,0.4)' }}>{field.label}</label>
                    <input type={field.type} step={(field as {step?:string}).step} min={(field as {min?:string}).min} max={(field as {max?:string}).max} placeholder={(field as {placeholder?:string}).placeholder}
                      value={(form as Record<string,string|boolean>)[field.key] as string}
                      onChange={e=>setForm({...form,[field.key]:field.type==='date'?e.target.value:e.target.value})}
                      required={field.key==='date'}
                      className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-all"
                      style={inputStyle}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-3">
                <input type="checkbox" id="wc" checked={form.workout_completed} onChange={e=>setForm({...form,workout_completed:e.target.checked})} className="w-4 h-4" style={{ accentColor: GOLD }} />
                <label htmlFor="wc" className="text-sm" style={{ color:'rgba(255,255,255,0.5)' }}>Séance d&apos;entraînement complétée</label>
              </div>
              <div className="mt-4">
                <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color:'rgba(255,255,255,0.4)' }}>Notes</label>
                <textarea placeholder="Comment tu te sens..." value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} rows={3} className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-all resize-none" style={inputStyle} />
              </div>
              <div className="flex gap-3 mt-6">
                <button type="submit" disabled={saving} className="rx-btn-gold disabled:opacity-50">{saving?'Sauvegarde...':'Enregistrer'}</button>
                <button type="button" onClick={()=>setShowForm(false)} className="rx-btn-ghost">Annuler</button>
              </div>
            </form>
          )}

          {/* Stats rapides */}
          {latest&&!showForm&&(
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {latest.weight_kg&&<div className="rx-card" style={{ textAlign:'center', padding:'1.25rem' }}><div style={{ fontSize:'1.6rem', fontWeight:900, color:'#fff' }}>{latest.weight_kg}</div><div style={{ fontSize:'0.72rem', color:'rgba(255,255,255,0.4)', marginTop:'4px' }}>Poids (kg)</div></div>}
              {latest.energy_level&&<div className="rx-card" style={{ textAlign:'center', padding:'1.25rem' }}><div style={{ fontSize:'1.6rem', fontWeight:900, color:GOLD }}>{latest.energy_level}/10</div><div style={{ fontSize:'0.72rem', color:'rgba(255,255,255,0.4)', marginTop:'4px' }}>Énergie</div></div>}
              {latest.sleep_hours&&<div className="rx-card" style={{ textAlign:'center', padding:'1.25rem' }}><div style={{ fontSize:'1.6rem', fontWeight:900, color:GOLD_LIGHT }}>{latest.sleep_hours}h</div><div style={{ fontSize:'0.72rem', color:'rgba(255,255,255,0.4)', marginTop:'4px' }}>Sommeil</div></div>}
              {latest.stress_level&&<div className="rx-card" style={{ textAlign:'center', padding:'1.25rem' }}><div style={{ fontSize:'1.6rem', fontWeight:900, color:GOLD }}>{latest.stress_level}/10</div><div style={{ fontSize:'0.72rem', color:'rgba(255,255,255,0.4)', marginTop:'4px' }}>Stress</div></div>}
            </div>
          )}

          {loading?<div className="text-center py-20" style={{ color:'rgba(255,255,255,0.3)' }}>Chargement...</div>
          :entries.length===0?(
            <div className="rx-card text-center" style={{ padding:'4rem 2rem' }}>
              <div style={{ width:'56px', height:'56px', margin:'0 auto 1.5rem', borderRadius:'16px', background:'rgba(200,146,42,0.15)', border:'1px solid rgba(200,146,42,0.3)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <TrendingUp style={{ width:'28px', height:'28px', color:GOLD }} />
              </div>
              <h3 style={{ fontWeight:800, color:'#fff', fontSize:'1.25rem', marginBottom:'0.5rem' }}>Commence à suivre ta progression</h3>
              <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.85rem', marginBottom:'1.5rem' }}>Poids, énergie, sommeil, stress — visualise tes progrès</p>
              <button onClick={()=>setShowForm(true)} className="rx-btn-gold" style={{ margin:'0 auto' }}><Plus style={{width:'15px',height:'15px'}}/> Première entrée</button>
            </div>
          ):(
            <div className="space-y-3">
              {entries.map(entry=>(
                <div key={entry.id} className="rx-card" style={{ padding:'1.4rem' }}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 style={{ fontWeight:700, color:'#fff', fontSize:'0.88rem' }}>{new Date(entry.date).toLocaleDateString('fr-FR',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</h3>
                      {entry.workout_completed&&<span style={{ fontSize:'0.72rem', color:'#4ade80' }}>✓ Séance complétée</span>}
                    </div>
                    <button onClick={()=>deleteEntry(entry.id)} style={{ color:'rgba(255,255,255,0.35)', background:'none', border:'none', cursor:'pointer' }} className="hover:text-red-400 transition-colors"><X style={{width:'16px',height:'16px'}}/></button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {entry.weight_kg&&<div><div style={{ fontSize:'0.7rem', color:'rgba(255,255,255,0.4)', marginBottom:'2px' }}>Poids</div><div style={{ fontSize:'0.88rem', fontWeight:700, color:'#fff' }}>{entry.weight_kg} kg</div></div>}
                    {entry.body_fat_percent&&<div><div style={{ fontSize:'0.7rem', color:'rgba(255,255,255,0.4)', marginBottom:'2px' }}>Masse grasse</div><div style={{ fontSize:'0.88rem', fontWeight:700, color:'#fff' }}>{entry.body_fat_percent}%</div></div>}
                    {entry.energy_level&&<div><div style={{ fontSize:'0.7rem', color:'rgba(255,255,255,0.4)', marginBottom:'2px' }}>Énergie</div><div style={{ fontSize:'0.88rem', fontWeight:700, color:GOLD }}>{entry.energy_level}/10</div></div>}
                    {entry.sleep_hours&&<div><div style={{ fontSize:'0.7rem', color:'rgba(255,255,255,0.4)', marginBottom:'2px' }}>Sommeil</div><div style={{ fontSize:'0.88rem', fontWeight:700, color:GOLD_LIGHT }}>{entry.sleep_hours}h</div></div>}
                  </div>
                  {entry.notes&&<p style={{ fontSize:'0.74rem', color:'rgba(255,255,255,0.4)', marginTop:'0.75rem', fontStyle:'italic' }}>&ldquo;{entry.notes}&rdquo;</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
