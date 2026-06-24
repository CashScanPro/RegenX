'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Dumbbell, TreePine, Check } from 'lucide-react';

const GOLD = '#C8922A';

type PlanType = 'salle' | 'exterieur';
type Level = 'debutant' | 'intermediaire' | 'avance';

const MODES: { value: PlanType; label: string; desc: string }[] = [
  { value: 'salle', label: 'Salle de muscu', desc: 'Programmes avec machines et charges libres' },
  { value: 'exterieur', label: 'Street Workout', desc: 'Programmes au poids du corps / calisthenics' },
];

const LEVELS: { value: Level; label: string }[] = [
  { value: 'debutant', label: 'Débutant' },
  { value: 'intermediaire', label: 'Intermédiaire' },
  { value: 'avance', label: 'Avancé' },
];

export default function WorkoutSelector({ initialPlanType, initialLevel }: { initialPlanType: PlanType; initialLevel: Level }) {
  const router = useRouter();
  const [planType, setPlanType] = useState<PlanType>(initialPlanType);
  const [level, setLevel] = useState<Level>(initialLevel);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');

  async function save(nextPlan: PlanType, nextLevel: Level) {
    setError('');
    try {
      const res = await fetch('/api/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planType: nextPlan, level: nextLevel }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || 'Erreur lors de l enregistrement');
      }
      startTransition(() => router.refresh());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur inconnue');
    }
  }

  function chooseMode(value: PlanType) {
    setPlanType(value);
    save(value, level);
  }

  function chooseLevel(value: Level) {
    setLevel(value);
    save(planType, value);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.5rem' }}>
      <div>
        <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.5)', marginBottom: '0.6rem' }}>Type d'entrainement</p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {MODES.map((m) => {
            const active = planType === m.value;
            const Icon = m.value === 'salle' ? Dumbbell : TreePine;
            return (
              <button key={m.value} onClick={() => chooseMode(m.value)} disabled={isPending} style={{ flex: '1 1 220px', textAlign: 'left', cursor: 'pointer', padding: '1rem', borderRadius: '12px', border: active ? '2px solid ' + GOLD : '1px solid rgba(255,255,255,0.12)', background: active ? 'rgba(200,146,42,0.12)' : 'rgba(255,255,255,0.03)', color: '#fff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                  <Icon style={{ width: '18px', height: '18px', color: active ? GOLD : 'rgba(255,255,255,0.6)' }} />
                  <span style={{ fontWeight: 700 }}>{m.label}</span>
                  {active && <Check style={{ width: '16px', height: '16px', color: GOLD, marginLeft: 'auto' }} />}
                </div>
                <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)' }}>{m.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.5)', marginBottom: '0.6rem' }}>Niveau</p>
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          {LEVELS.map((l) => {
            const active = level === l.value;
            return (
              <button key={l.value} onClick={() => chooseLevel(l.value)} disabled={isPending} style={{ cursor: 'pointer', padding: '0.6rem 1.2rem', borderRadius: '999px', border: active ? '2px solid ' + GOLD : '1px solid rgba(255,255,255,0.12)', background: active ? 'rgba(200,146,42,0.15)' : 'rgba(255,255,255,0.03)', color: active ? GOLD : 'rgba(255,255,255,0.7)', fontWeight: active ? 700 : 500 }}>
                {l.label}
              </button>
            );
          })}
        </div>
      </div>

      {error && <p style={{ color: '#ef4444', fontSize: '0.8rem' }}>{error}</p>}
    </div>
  );
}
