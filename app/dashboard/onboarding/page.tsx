'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Zap, Brain, Dumbbell, Apple, TrendingUp, User, Save, ShieldCheck } from 'lucide-react';

const GOLD = '#C8922A';

const navItems = [
  { href: '/dashboard', label: 'Vue d’ensemble', icon: Zap },
  { href: '/dashboard/coach', label: 'Coach IA', icon: Brain },
  { href: '/dashboard/workouts', label: 'Entraînements', icon: Dumbbell },
  { href: '/dashboard/nutrition', label: 'Nutrition', icon: Apple },
  { href: '/dashboard/progress', label: 'Progression', icon: TrendingUp },
  { href: '/account', label: 'Mon compte', icon: User },
];

const GOALS = [
  { value: 'perte_poids', label: 'Perte de poids' },
  { value: 'prise_muscle', label: 'Prise de muscle' },
  { value: 'force', label: 'Force' },
  { value: 'endurance', label: 'Endurance' },
  { value: 'mobilite', label: 'Mobilité / souplesse' },
  { value: 'forme_generale', label: 'Forme générale' },
];

const LEVELS = [
  { value: 'beginner', label: 'Débutant' },
  { value: 'intermediate', label: 'Intermédiaire' },
  { value: 'advanced', label: 'Avancé' },
];

const EQUIPMENT = [
  { value: 'salle', label: 'Salle de sport' },
  { value: 'maison', label: 'Maison (peu de matériel)' },
  { value: 'exterieur', label: 'Extérieur' },
];

const DIETS = [
  { value: 'balanced', label: 'Équilibrée' },
  { value: 'keto', label: 'Keto' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'vegetarian', label: 'Végétarienne' },
  { value: 'paleo', label: 'Paléo' },
  { value: 'mediterranean', label: 'Méditerranéenne' },
];

const inputStyle = { background: '#161616', border: '1px solid rgba(255,255,255,0.08)', color: 'white' };
const labelCls = 'block text-xs font-semibold mb-2 uppercase tracking-wider';
const labelStyle = { color: 'rgba(255,255,255,0.4)' };

export default function OnboardingPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const [form, setForm] = useState({
    full_name: '',
    date_of_birth: '',
    gender: '',
    height_cm: '',
    weight_kg: '',
    fitness_level: 'beginner',
    fitness_goals: [] as string[],
    days_per_week: '3',
    equipment: 'salle',
    diet_type: 'balanced',
    health_note: '',
    health_consent: false,
  });

  function toggleGoal(value: string) {
    setForm((f) => ({
      ...f,
      fitness_goals: f.fitness_goals.includes(value)
        ? f.fitness_goals.filter((g) => g !== value)
        : [...f.fitness_goals, value],
    }));
  }
  // Pré-remplissage : charge le profil existant au montage.
  useEffect(() => {
    let active = true;
    fetch('/api/profile')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const profile = data && data.profile;
        if (!active || !profile) return;
        const rawGoals = Array.isArray(profile.fitness_goals) ? profile.fitness_goals : [];
        const realGoals: string[] = [];
        let days = '3', equip = 'salle', diet = 'balanced';
        for (const g of rawGoals) {
          if (typeof g !== 'string') continue;
          if (g.startsWith('days:')) days = g.slice(5) || '3';
          else if (g.startsWith('equipment:')) equip = g.slice(10) || 'salle';
          else if (g.startsWith('diet:')) diet = g.slice(5) || 'balanced';
          else realGoals.push(g);
        }
        const health = Array.isArray(profile.health_conditions) ? (profile.health_conditions[0] || '') : '';
        setForm((f) => ({
          ...f,
          full_name: profile.full_name || '',
          date_of_birth: profile.date_of_birth || '',
          gender: profile.gender || '',
          height_cm: profile.height_cm != null ? String(profile.height_cm) : '',
          weight_kg: profile.weight_kg != null ? String(profile.weight_kg) : '',
          fitness_level: profile.fitness_level || 'beginner',
          fitness_goals: realGoals,
          days_per_week: days,
          equipment: equip,
          diet_type: diet,
          health_note: health,
        }));
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    // Taille et poids obligatoires (utiles pour personnaliser les programmes)
    const h = Number(form.height_cm);
    const w = Number(form.weight_kg);
    if (!form.height_cm || h < 90 || h > 250) {
      setMsg('Erreur : merci d’indiquer une taille valide (entre 90 et 250 cm).');
      return;
    }
    if (!form.weight_kg || w < 30 || w > 300) {
      setMsg('Erreur : merci d’indiquer un poids valide (entre 30 et 300 kg).');
      return;
    }

    if (form.health_note.trim() && !form.health_consent) {
      setMsg('Erreur : merci d’autoriser l’utilisation de vos données de santé, ou de laisser le champ vide.');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: form.full_name,
          date_of_birth: form.date_of_birth,
          gender: form.gender,
          height_cm: form.height_cm,
          weight_kg: form.weight_kg,
          fitness_level: form.fitness_level,
          fitness_goals: form.fitness_goals,
          days_per_week: form.days_per_week,
          equipment: form.equipment,
          diet_type: form.diet_type,
          health_note: form.health_note,
          health_consent: form.health_consent,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg(`Erreur : ${data.error || 'sauvegarde impossible.'}`);
      } else {
        setMsg('Profil enregistré ! Redirection…');
        setTimeout(() => router.push('/dashboard'), 900);
      }
    } catch {
      setMsg('Erreur réseau. Réessayez.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0a0a', backgroundImage: "linear-gradient(rgba(10,9,7,0.42), rgba(8,7,6,0.60)), url('/Regenx-lieu.webp')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', backgroundRepeat: 'no-repeat' }}>
      <aside className="rx-sidebar fixed top-0 left-0 h-full flex-col z-20 hidden lg:flex" style={{ width: '250px', borderRight: '1px solid rgba(200,146,42,0.15)' }}>
        <div style={{ padding: '1.75rem 1.5rem', borderBottom: '1px solid rgba(200,146,42,0.12)' }}>
          <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center' }}>
            <Image src="/logo RengenX.webp" alt="RegenX" width={88} height={88} style={{ objectFit: 'contain' }} />
          </Link>
        </div>
        <nav style={{ flex: 1, padding: '1.25rem 0.85rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="rx-nav-link">
              <item.icon style={{ width: '16px', height: '16px', flexShrink: 0 }} />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="lg:ml-[250px] min-h-screen">
        <header className="sticky top-0 z-10 px-6 py-4" style={{ background: 'rgba(10,9,7,0.72)', backdropFilter: 'blur(18px) saturate(130%)', WebkitBackdropFilter: 'blur(18px) saturate(130%)', borderBottom: '1px solid rgba(200,146,42,0.18)' }}>
          <div className="rx-eyebrow" style={{ marginBottom: '2px' }}>★ Personnalisation Premium</div>
          <h1 style={{ color: '#fff', fontWeight: 800, fontSize: '1.05rem' }}>Mon profil sportif</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem' }}>Ces informations permettent à l’IA de générer vos programmes sur-mesure.</p>
        </header>

        <form onSubmit={handleSubmit} className="px-6 py-8 max-w-3xl mx-auto">
          {msg && (
            <div className="rx-fade-up" style={msg.includes('Erreur') ? { padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.85rem', color: '#f87171', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' } : { padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.85rem', color: GOLD, background: 'rgba(200,146,42,0.08)', border: '1px solid rgba(200,146,42,0.2)' }}>
              {msg}
            </div>
          )}

          <div className="rx-card-gold" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontWeight: 800, color: '#fff', fontSize: '1.05rem', marginBottom: '1.25rem' }}>Informations générales</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls} style={labelStyle}>Nom complet</label>
                <input type="text" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none" style={inputStyle} placeholder="Jean Dupont" />
              </div>
              <div>
                <label className={labelCls} style={labelStyle}>Date de naissance</label>
                <input type="date" value={form.date_of_birth} onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })} className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none" style={inputStyle} />
              </div>
              <div>
                <label className={labelCls} style={labelStyle}>Genre</label>
                <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none" style={inputStyle}>
                  <option value="">—</option>
                  <option value="male">Homme</option>
                  <option value="female">Femme</option>
                  <option value="other">Autre</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls} style={labelStyle}>Taille (cm) *</label>
                  <input type="number" step="0.1" min="90" max="250" required value={form.height_cm} onChange={(e) => setForm({ ...form, height_cm: e.target.value })} className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none" style={inputStyle} placeholder="173" />
                </div>
                <div>
                  <label className={labelCls} style={labelStyle}>Poids (kg) *</label>
                  <input type="number" step="0.1" min="30" max="300" required value={form.weight_kg} onChange={(e) => setForm({ ...form, weight_kg: e.target.value })} className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none" style={inputStyle} placeholder="54" />
                </div>
              </div>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem', marginTop: '0.75rem' }}>* Taille et poids requis pour personnaliser vos programmes.</p>
          </div>

          <div className="rx-card-gold" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontWeight: 800, color: '#fff', fontSize: '1.05rem', marginBottom: '1.25rem' }}>Objectifs & niveau</h3>

            <label className={labelCls} style={labelStyle}>Objectifs (plusieurs choix)</label>
            <div className="flex flex-wrap gap-2 mb-5">
              {GOALS.map((g) => {
                const active = form.fitness_goals.includes(g.value);
                return (
                  <button type="button" key={g.value} onClick={() => toggleGoal(g.value)} className="px-4 py-2 rounded-full text-sm transition-all" style={active ? { background: GOLD, color: '#0a0a0a', fontWeight: 700, border: '1px solid ' + GOLD } : { background: '#161616', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    {g.label}
                  </button>
                );
              })}
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className={labelCls} style={labelStyle}>Niveau</label>
                <select value={form.fitness_level} onChange={(e) => setForm({ ...form, fitness_level: e.target.value })} className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none" style={inputStyle}>
                  {LEVELS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls} style={labelStyle}>Jours / semaine</label>
                <select value={form.days_per_week} onChange={(e) => setForm({ ...form, days_per_week: e.target.value })} className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none" style={inputStyle}>
                  {[1, 2, 3, 4, 5, 6, 7].map((n) => <option key={n} value={String(n)}>{n}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls} style={labelStyle}>Matériel</label>
                <select value={form.equipment} onChange={(e) => setForm({ ...form, equipment: e.target.value })} className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none" style={inputStyle}>
                  {EQUIPMENT.map((eq) => <option key={eq.value} value={eq.value}>{eq.label}</option>)}
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className={labelCls} style={labelStyle}>Type d’alimentation</label>
              <select value={form.diet_type} onChange={(e) => setForm({ ...form, diet_type: e.target.value })} className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none" style={inputStyle}>
                {DIETS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
              </select>
            </div>
          </div>

          <div className="rx-card-gold" style={{ marginBottom: '1.5rem', borderColor: 'rgba(200,146,42,0.35)' }}>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck style={{ width: '18px', height: '18px', color: GOLD }} />
              <h3 style={{ fontWeight: 800, color: '#fff', fontSize: '1.05rem' }}>Santé & blessures (optionnel)</h3>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.78rem', marginBottom: '1rem' }}>
              Indiquez toute condition à prendre en compte (ex. spondylarthrite, blessure au genou, hernie…). L’IA adaptera vos exercices en conséquence. Champ facultatif.
            </p>
            <textarea
              value={form.health_note}
              onChange={(e) => setForm({ ...form, health_note: e.target.value })}
              rows={3}
              maxLength={500}
              className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none"
              style={inputStyle}
              placeholder="Ex : spondylarthrite ankylosante — éviter les impacts et les charges lourdes sur le rachis lombaire."
            />
            <div className="mt-4 flex items-start gap-3">
              <input type="checkbox" id="health_consent" checked={form.health_consent} onChange={(e) => setForm({ ...form, health_consent: e.target.checked })} className="w-4 h-4 mt-0.5" style={{ accentColor: GOLD }} />
              <label htmlFor="health_consent" className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                J’autorise l’utilisation de mes données de santé pour personnaliser mes programmes. <span style={{ color: 'rgba(255,255,255,0.35)' }}>(obligatoire si le champ ci-dessus est rempli)</span>
              </label>
            </div>
          </div>

          <button type="submit" disabled={saving} className="rx-btn-gold" style={{ width: '100%', justifyContent: 'center', opacity: saving ? 0.6 : 1 }}>
            <Save style={{ width: '16px', height: '16px' }} />
            {saving ? 'Enregistrement…' : 'Enregistrer mon profil'}
          </button>

          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem', textAlign: 'center', marginTop: '1rem' }}>
            Les conseils sport/nutrition générés ne remplacent pas un avis médical. Consultez un professionnel de santé, en particulier en cas de pathologie.
          </p>
        </form>
      </main>
    </div>
  );
}
